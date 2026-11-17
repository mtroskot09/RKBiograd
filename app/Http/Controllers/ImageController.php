<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Response;

class ImageController extends Controller
{
    public function show(string $id): Response
    {
        $image = Image::findOrFail($id);

        // Image ids are never reused, so the response can be cached forever.
        return response($image->bytes(), 200, [
            'Content-Type' => $image->content_type,
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}
