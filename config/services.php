<?php

// Public address of the site; Google redirects back to <public url>/api/callback.
// An empty PUBLIC_URL (left blank in the Render dashboard) falls back to Render's address.
$publicUrl = rtrim(env('PUBLIC_URL') ?: env('RENDER_EXTERNAL_URL') ?: env('APP_URL', 'http://localhost:8000'), '/');

return [
    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => $publicUrl.'/api/callback',
    ],
];
