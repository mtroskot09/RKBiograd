<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * General club e-mail in the RK Biograd template (crest, club colours, contact footer).
 * Use it for any message the club sends, e.g.:
 *
 *   Mail::to($email)->send(new ClubMail(
 *       subjectLine: 'Upisi u mlađe selekcije',
 *       heading: 'Upisi su otvoreni!',
 *       paragraphs: ['Pozivamo sve dječake i djevojčice …', 'Treninzi su …'],
 *       buttonText: 'Raspored treninga',
 *       buttonUrl: url('/u13'),
 *   ));
 */
class ClubMail extends Mailable
{
    use Queueable, SerializesModels;

    /** @param  string[]  $paragraphs  plain text, one paragraph each (line breaks are kept) */
    public function __construct(
        public string $subjectLine,
        public string $heading,
        public array $paragraphs,
        public ?string $buttonText = null,
        public ?string $buttonUrl = null,
        public ?string $preheader = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->subjectLine);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.club');
    }
}
