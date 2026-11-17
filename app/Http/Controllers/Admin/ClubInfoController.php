<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClubInfo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ClubInfoController extends Controller
{
    public function edit(): View
    {
        return view('admin.club-info', ['info' => ClubInfo::current()]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:100'],
            'address' => ['nullable', 'string', 'max:200'],
            // One line per row, e.g. "Ponedjeljak - Petak: 16:00 - 21:00"
            'office_hours' => ['nullable', 'string', 'max:500'],
        ]);

        $info = ClubInfo::firstOrNew(['id' => 'main']);
        $info->id = 'main';
        $info->fill(array_map(fn ($v) => trim((string) $v), $data))->save();

        return back()->with('status', 'Kontakt podaci su spremljeni');
    }
}
