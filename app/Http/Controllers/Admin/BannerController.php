<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageBanner;
use App\Support\ImageStore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/** Top images (banner / hero) per page. */
class BannerController extends Controller
{
    public function index(): View
    {
        return view('admin.banners', ['custom' => PageBanner::pluck('image_src', 'page')]);
    }

    /** Uploads a new image, or with no file goes back to the page's default image. */
    public function update(Request $request, string $page): RedirectResponse
    {
        abort_unless(array_key_exists($page, PageBanner::PAGES), 404);
        $request->validate(['image' => ['nullable', ...ImageStore::RULES]]);

        $previous = PageBanner::find($page);
        if ($request->hasFile('image')) {
            PageBanner::updateOrCreate(['page' => $page], ['image_src' => ImageStore::store($request->file('image'))]);
        } else {
            $previous?->delete();
        }
        ImageStore::delete($previous?->image_src);

        return back()->with('status', $request->hasFile('image') ? 'Slika je promijenjena' : 'Vraćena je zadana slika');
    }
}
