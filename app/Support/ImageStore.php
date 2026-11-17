<?php

namespace App\Support;

use App\Models\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Uploaded images are kept in the database (the host has no persistent disk) and served at
 * /api/images/{id}. Pages store that URL; replaced or deleted images are removed again.
 */
class ImageStore
{
    public const URL_PREFIX = '/api/images/';

    /** Validation rules for an uploaded image (max 5 MB). */
    public const RULES = ['image', 'mimes:jpeg,png,webp,gif', 'max:5120'];

    public static function store(UploadedFile $file): string
    {
        $id = (string) Str::uuid();
        $bytes = $file->get();
        $contentType = $file->getMimeType();

        if (DB::getDriverName() === 'pgsql') {
            // PDO sends bound strings as text, which cannot hold every byte of an image;
            // base64 survives the trip and Postgres turns it back into bytea.
            DB::insert(
                "insert into images (id, content_type, data, created_at) values (?, ?, decode(?, 'base64'), now())",
                [$id, $contentType, base64_encode($bytes)],
            );
        } else {
            Image::forceCreate(['id' => $id, 'content_type' => $contentType, 'data' => $bytes]);
        }

        return self::URL_PREFIX.$id;
    }

    /** Removes an uploaded image by its URL. Other URLs (built-in images) are ignored. */
    public static function delete(?string $url): void
    {
        if ($url && str_starts_with($url, self::URL_PREFIX)) {
            Image::whereKey(substr($url, strlen(self::URL_PREFIX)))->delete();
        }
    }

    /** Deletes the old image when a page or record got a different one. */
    public static function replaced(?string $old, ?string $new): void
    {
        if ($old !== $new) {
            self::delete($old);
        }
    }
}
