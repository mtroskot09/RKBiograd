<?php

return [
    // HRS feed files are cached here (see App\Services\Hrs\HrsClient).
    'default' => env('CACHE_STORE', 'file'),
];
