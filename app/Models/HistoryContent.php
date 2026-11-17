<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Texts and highlight boxes of the history page (one row, id "main"). */
class HistoryContent extends Model
{
    public const CREATED_AT = null;

    public const MAX_STATS = 4;

    public $incrementing = false;

    protected $table = 'history_content';

    protected $keyType = 'string';

    protected $fillable = ['intro', 'mission', 'stats'];

    protected function casts(): array
    {
        return ['stats' => 'array'];
    }
}
