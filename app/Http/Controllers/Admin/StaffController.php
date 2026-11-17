<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CoachPhoto;
use App\Models\StaffAssignment;
use App\Services\Hrs\HrsService;
use App\Services\Hrs\HrsUnavailableException;
use App\Support\ImageStore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

/**
 * Coaching staff. HRS lists team officials per match but gives no job titles, so an admin picks
 * people from this season's match sheets and assigns each to a team with a role.
 */
class StaffController extends Controller
{
    public function index(HrsService $hrs): View
    {
        try {
            $officials = $hrs->officials();
        } catch (HrsUnavailableException) {
            $officials = null;
        }

        return view('admin.staff', [
            'staff' => StaffAssignment::sorted()->groupBy('team'),
            'officials' => $officials,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'team' => ['required', Rule::in(HrsService::TEAMS)],
            'hrs_person_id' => ['required', 'integer', 'min:1'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'role' => ['required', Rule::in(StaffAssignment::ROLES)],
        ]);

        if (StaffAssignment::where('team', $data['team'])->where('hrs_person_id', $data['hrs_person_id'])->exists()) {
            return back()->with('error', 'Ova osoba je već u stožeru te ekipe.');
        }
        StaffAssignment::create($data);

        return back()->with('status', 'Trener je dodan');
    }

    public function update(Request $request, StaffAssignment $staff): RedirectResponse
    {
        $data = $request->validate([
            'team' => ['required', Rule::in(HrsService::TEAMS)],
            'role' => ['required', Rule::in(StaffAssignment::ROLES)],
        ]);

        $taken = StaffAssignment::where('team', $data['team'])
            ->where('hrs_person_id', $staff->hrs_person_id)
            ->whereKeyNot($staff->id)
            ->exists();
        if ($taken) {
            return back()->with('error', 'Ova osoba je već u stožeru te ekipe.');
        }
        $staff->update($data);

        return back()->with('status', 'Promjene su spremljene');
    }

    public function destroy(StaffAssignment $staff): RedirectResponse
    {
        $staff->delete();

        return back()->with('status', 'Trener je uklonjen');
    }

    /** One photo per coach, used on every team they are assigned to. */
    public function photo(Request $request, int $personId): RedirectResponse
    {
        $request->validate(['photo' => ['nullable', ...ImageStore::RULES]]);
        $previous = CoachPhoto::find($personId);

        if ($request->hasFile('photo')) {
            CoachPhoto::updateOrCreate(['hrs_person_id' => $personId], ['photo_url' => ImageStore::store($request->file('photo'))]);
        } else {
            $previous?->delete();
        }
        ImageStore::delete($previous?->photo_url);

        return back()->with('status', $request->hasFile('photo') ? 'Fotografija je spremljena' : 'Fotografija je uklonjena');
    }
}
