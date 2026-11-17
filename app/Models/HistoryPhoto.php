<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/** Photo in the gallery at the bottom of the history page. */
class HistoryPhoto extends Model
{
    use HasUuids;

    public const UPDATED_AT = null;

    protected $fillable = ['image_src', 'caption'];
}
