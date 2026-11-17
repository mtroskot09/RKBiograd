<?php

namespace App\Http\Controllers;

use App\Mail\ContactConfirmation;
use App\Mail\ContactMessage;
use App\Models\ClubInfo;
use App\Models\PageBanner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;
use Throwable;

class ContactController extends Controller
{
    public function show(): View
    {
        return view('pages.contact', ['banner' => PageBanner::imageFor('contact')]);
    }

    public function send(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:100'],
            'message' => ['required', 'string', 'max:5000'],
            // Hidden field: people leave it empty, spam bots fill it in.
            'website' => ['prohibited'],
        ], [
            'website.prohibited' => 'Poruka nije poslana.',
        ]);

        $recipient = config('club.contact_recipient') ?: ClubInfo::current()->email;

        try {
            Mail::to($recipient)->send(new ContactMessage($data['name'], $data['email'], $data['message']));
            Mail::to($data['email'], $data['name'])->send(new ContactConfirmation($data['name'], $data['message']));
        } catch (Throwable $e) {
            report($e);

            return back()->withInput()->with('error', 'Poruka trenutno ne može biti poslana. Pokušajte ponovno ili nas nazovite.');
        }

        return redirect('/contact')->with('status', 'Poruka poslana! Javit ćemo vam se uskoro.');
    }
}
