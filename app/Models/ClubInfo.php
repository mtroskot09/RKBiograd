<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Club contact details shown in the footer, on the contact page and in e-mails (one row, id "main"). */
class ClubInfo extends Model
{
    public const CREATED_AT = null;

    public $incrementing = false;

    protected $table = 'club_info';

    protected $keyType = 'string';

    protected $fillable = ['phone', 'email', 'address', 'office_hours'];

    /** Shown until an admin saves real details. */
    public const DEFAULTS = [
        'phone' => '+385 23 123 456',
        'email' => 'info@rkbiograd.hr',
        'address' => "Sportska dvorana Biograd\nBiograd na Moru, 23210\nHrvatska",
        'office_hours' => "Ponedjeljak - Petak: 16:00 - 21:00\nSubota: 09:00 - 14:00\nNedjelja: Zatvoreno",
    ];

    public static function current(): self
    {
        return once(fn () => static::find('main') ?? new static(self::DEFAULTS));
    }

    /** Address and office hours are stored one item per line. */
    public static function lines(?string $text): array
    {
        return array_values(array_filter(array_map('trim', explode("\n", (string) $text))));
    }

    /** Value for a tel: link, e.g. "+385 23 123 456" → "+38523123456" */
    public function phoneHref(): string
    {
        return 'tel:'.preg_replace('/[^\d+]/', '', $this->phone);
    }
}
