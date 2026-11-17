<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** Message from the contact form, sent to the club. "Reply" goes straight to the visitor. */
class ContactMessage extends Mailable
{
    use Queueable, SerializesModels;

    // Not "$message": mail views use that name for the message being sent.
    public function __construct(
        public string $senderName,
        public string $senderEmail,
        public string $text,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Poruka s web stranice: {$this->senderName}",
            replyTo: [new Address($this->senderEmail, $this->senderName)],
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contact-message');
    }
}
