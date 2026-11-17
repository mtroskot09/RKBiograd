<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ClubMail;
use App\Models\Post;
use App\Services\Hrs\HrsService;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(HrsService $hrs): View
    {
        return view('admin.dashboard', [
            'postCount' => Post::count(),
            'hrsTeams' => $hrs->teams(),
        ]);
    }

    /** The club e-mail template with sample text, as it arrives in an inbox. */
    public function emailPreview(): ClubMail
    {
        return new ClubMail(
            subjectLine: 'Upisi u mlađe selekcije – RK Biograd',
            heading: 'Upisi su otvoreni!',
            paragraphs: [
                'Pozivamo sve dječake i djevojčice koji vole rukomet da nam se pridruže u mlađim selekcijama RK Biograd.',
                "Treninzi se održavaju u Sportskoj dvorani Biograd.\nPrvi trening je besplatan – dovoljno je doći u sportskoj opremi.",
                'Vidimo se na terenu!',
            ],
            buttonText: 'Raspored treninga',
            buttonUrl: url('/u13'),
            preheader: 'Pridruži se mlađim selekcijama RK Biograd.',
        );
    }
}
