<?php

namespace App\Support;

use DateTimeInterface;

/** Croatian dates and alphabetical order. */
class Croatian
{
    private const MONTHS = [
        'siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja',
        'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenoga', 'prosinca',
    ];

    /** "5. listopada 2026." */
    public static function date(DateTimeInterface $date): string
    {
        return $date->format('j').'. '.self::MONTHS[$date->format('n') - 1].' '.$date->format('Y').'.';
    }

    /**
     * HRS publishes local Croatian time without a timezone ("2026-09-20T19:00:00"),
     * so the parts are read directly instead of being converted.
     */
    public static function matchDate(?string $startsAt): string
    {
        if (! preg_match('/^(\d{4})-(\d{2})-(\d{2})T/', (string) $startsAt, $m)) {
            return 'Datum nije poznat';
        }

        return (int) $m[3].'. '.self::MONTHS[(int) $m[2] - 1].' '.$m[1].'.';
    }

    /** "19:00", or null when HRS has no kick-off time yet (published as 00:00). */
    public static function matchTime(?string $startsAt): ?string
    {
        if (! preg_match('/T(\d{2}):(\d{2})/', (string) $startsAt, $m)) {
            return null;
        }
        $time = "{$m[1]}:{$m[2]}";

        return $time === '00:00' ? null : $time;
    }

    /** Alphabetical order with č, ć, đ, š, ž in their Croatian places (needs the intl extension). */
    public static function compare(string $a, string $b): int
    {
        static $collator;
        $collator ??= class_exists(\Collator::class) ? new \Collator('hr_HR') : false;

        return $collator ? $collator->compare($a, $b) : strcmp($a, $b);
    }
}
