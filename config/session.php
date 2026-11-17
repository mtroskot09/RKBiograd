<?php

return [
    'driver' => env('SESSION_DRIVER', 'database'),

    // Admins stay signed in for a week.
    'lifetime' => (int) env('SESSION_LIFETIME', 60 * 24 * 7),

    // Not "sessions": that table belongs to the old Node app and may still exist in the database.
    'table' => env('SESSION_TABLE', 'web_sessions'),

    'secure' => env('SESSION_SECURE_COOKIE', env('APP_ENV') === 'production'),

    // "lax" so the cookie is sent when Google redirects back after login.
    'same_site' => 'lax',
];
