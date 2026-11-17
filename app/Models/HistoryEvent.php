<?php

namespace App\Models;

use App\Support\Croatian;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/** Timeline entry on the history page. */
class HistoryEvent extends Model
{
    use HasUuids;

    public const UPDATED_AT = null;

    protected $fillable = ['year', 'title', 'description', 'image_src'];

    protected static function booted(): void
    {
        static::saving(fn (self $event) => $event->sort_year = self::sortYearOf($event->year));
    }

    /** First year found in a free-text year ("2010./11." → 2010), used to order the timeline. */
    public static function sortYearOf(string $year): int
    {
        return preg_match('/\d{4}/', $year, $m) ? (int) $m[0] : 0;
    }

    /** Newest first; same start year ordered by its text, later first ("2010./11." before "2010."). */
    public static function timeline(): Collection
    {
        return static::all()
            ->sort(fn ($a, $b) => ($b->sort_year <=> $a->sort_year) ?: Croatian::compare($b->year, $a->year))
            ->values();
    }
}
