<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasUuids;

    public const CATEGORIES = ['Novosti', 'Prva ekipa', 'U15', 'U13'];

    public const UPDATED_AT = null;

    protected $fillable = ['title', 'excerpt', 'content', 'category', 'image_src', 'published_at'];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }
}
