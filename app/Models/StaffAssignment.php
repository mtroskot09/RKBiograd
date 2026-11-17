<?php

namespace App\Models;

use App\Support\Croatian;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;

/**
 * Coaching staff per team, set by an admin. People are picked from the team officials listed on
 * HRS match sheets (hrs_person_id); the name is copied so pages work even when HRS is down.
 */
class StaffAssignment extends Model
{
    use HasUuids;

    /** Roles an admin can give to a coach, in the order they are shown on team pages. */
    public const ROLES = ['Glavni trener', 'Pomoćni trener', 'Trener vratara', 'Kondicijski trener'];

    public const UPDATED_AT = null;

    protected $fillable = ['team', 'hrs_person_id', 'first_name', 'last_name', 'role'];

    protected function casts(): array
    {
        return ['hrs_person_id' => 'integer'];
    }

    public function photo(): BelongsTo
    {
        return $this->belongsTo(CoachPhoto::class, 'hrs_person_id', 'hrs_person_id');
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo?->photo_url;
    }

    public function getInitialsAttribute(): string
    {
        return mb_substr($this->first_name, 0, 1).mb_substr($this->last_name, 0, 1);
    }

    /** Staff sorted by role, then by name. */
    public static function sorted(?string $team = null): Collection
    {
        $roleOrder = array_flip(self::ROLES);

        return static::with('photo')
            ->when($team, fn ($q) => $q->where('team', $team))
            ->get()
            ->sort(fn ($a, $b) => (($roleOrder[$a->role] ?? 99) <=> ($roleOrder[$b->role] ?? 99))
                ?: Croatian::compare($a->last_name, $b->last_name)
                ?: Croatian::compare($a->first_name, $b->first_name))
            ->values();
    }
}
