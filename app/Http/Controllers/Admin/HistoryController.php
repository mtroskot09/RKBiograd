<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HistoryContent;
use App\Models\HistoryEvent;
use App\Models\HistoryPhoto;
use App\Support\HistorySeed;
use App\Support\ImageStore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/** History page: texts and highlight boxes, timeline, photo gallery. */
class HistoryController extends Controller
{
    public function index(Request $request): View
    {
        return view('admin.history', [
            'content' => HistorySeed::ensureSeeded(),
            'events' => HistoryEvent::timeline(),
            'photos' => HistoryPhoto::oldest()->get(),
            'editing' => $request->query('edit') ? HistoryEvent::find($request->query('edit')) : null,
        ]);
    }

    public function updateContent(Request $request): RedirectResponse
    {
        // Empty highlight rows (both fields blank) are dropped; half-filled ones are an error.
        $stats = array_values(array_filter(
            $request->input('stats', []),
            fn ($s) => trim($s['value'] ?? '') !== '' || trim($s['label'] ?? '') !== '',
        ));
        $request->merge(['stats' => $stats]);

        $data = $request->validate([
            'intro' => ['nullable', 'string', 'max:2000'],
            'mission' => ['nullable', 'string', 'max:4000'],
            'stats' => ['array', 'max:'.HistoryContent::MAX_STATS],
            'stats.*.value' => ['required', 'string', 'max:20'],
            'stats.*.label' => ['required', 'string', 'max:60'],
        ], [
            'stats.*.value.required' => 'Ispunite ili uklonite prazne istaknute podatke',
            'stats.*.label.required' => 'Ispunite ili uklonite prazne istaknute podatke',
        ]);

        HistorySeed::ensureSeeded()->update([
            'intro' => trim($data['intro'] ?? ''),
            'mission' => trim($data['mission'] ?? ''),
            'stats' => array_map(fn ($s) => ['value' => trim($s['value']), 'label' => trim($s['label'])], $stats),
        ]);

        return back()->with('status', 'Tekstovi su spremljeni');
    }

    public function storeEvent(Request $request): RedirectResponse
    {
        HistorySeed::ensureSeeded(); // so a first manual entry is not followed by the seed
        $event = new HistoryEvent($this->validatedEvent($request));
        if ($request->hasFile('image')) {
            $event->image_src = ImageStore::store($request->file('image'));
        }
        $event->save();

        return redirect()->route('admin.history')->with('status', 'Događaj je dodan');
    }

    public function updateEvent(Request $request, HistoryEvent $event): RedirectResponse
    {
        $previousImage = $event->image_src;
        $event->fill($this->validatedEvent($request));
        if ($request->hasFile('image')) {
            $event->image_src = ImageStore::store($request->file('image'));
        } elseif ($request->boolean('remove_image')) {
            $event->image_src = null;
        }
        $event->save();
        ImageStore::replaced($previousImage, $event->image_src);

        return redirect()->route('admin.history')->with('status', 'Događaj je spremljen');
    }

    public function destroyEvent(HistoryEvent $event): RedirectResponse
    {
        $event->delete();
        ImageStore::delete($event->image_src);

        return back()->with('status', 'Događaj je obrisan');
    }

    /** Several gallery photos can be uploaded at once. */
    public function storePhotos(Request $request): RedirectResponse
    {
        $request->validate([
            'photos' => ['required', 'array', 'max:20'],
            'photos.*' => ImageStore::RULES,
        ]);
        foreach ($request->file('photos') as $file) {
            HistoryPhoto::create(['image_src' => ImageStore::store($file), 'caption' => '']);
        }

        return back()->with('status', 'Fotografije su dodane');
    }

    public function updatePhoto(Request $request, HistoryPhoto $photo): RedirectResponse
    {
        $data = $request->validate(['caption' => ['nullable', 'string', 'max:200']]);
        $photo->update(['caption' => trim($data['caption'] ?? '')]);

        return back()->with('status', 'Opis je spremljen');
    }

    public function destroyPhoto(HistoryPhoto $photo): RedirectResponse
    {
        $photo->delete();
        ImageStore::delete($photo->image_src);

        return back()->with('status', 'Fotografija je obrisana');
    }

    private function validatedEvent(Request $request): array
    {
        $data = $request->validate([
            'year' => ['required', 'string', 'max:30'],
            'title' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', ...ImageStore::RULES],
        ], [
            'year.required' => 'Godina i naslov su obavezni',
            'title.required' => 'Godina i naslov su obavezni',
        ]);
        $data['description'] = trim($data['description'] ?? '');
        unset($data['image']);

        return $data;
    }
}
