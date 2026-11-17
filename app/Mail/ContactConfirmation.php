<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** Sent to the visitor after the contact form: "we got your message", with a copy of it. */
class ContactConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $senderName,
        public string $text,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Hvala na poruci – RK Biograd');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contact-confirmation');
    }
}
