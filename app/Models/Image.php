<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/** Uploaded image, served at /api/images/{id} (see App\Support\ImageStore). */
class Image extends Model
{
    use HasUuids;

    public const UPDATED_AT = null;

    protected $fillable = ['content_type', 'data'];

    /** Raw bytes; Postgres returns bytea columns as a stream. */
    public function bytes(): string
    {
        return is_resource($this->data) ? stream_get_contents($this->data) : (string) $this->data;
    }
}
