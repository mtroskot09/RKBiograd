<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/** Weekly training time of a team (Admin → Raspored treninga). */
class TrainingSession extends Model
{
    use HasUuids;

    /** Index 0 = day_of_week 1 (Monday) … index 6 = day_of_week 7 (Sunday). */
    public const DAYS = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];

    public const UPDATED_AT = null;

    protected $fillable = ['team', 'day_of_week', 'start_time', 'end_time', 'location'];

    protected function casts(): array
    {
        return ['day_of_week' => 'integer'];
    }

    public function getDayNameAttribute(): string
    {
        return self::DAYS[$this->day_of_week - 1] ?? '';
    }

    /** Sorted by day and start time. */
    public static function forTeam(?string $team = null): Collection
    {
        return static::when($team, fn ($q) => $q->where('team', $team))
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
    }
}
