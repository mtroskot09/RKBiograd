<?php

return [
    // Nothing is queued: e-mails are sent while the request runs.
    'default' => env('QUEUE_CONNECTION', 'sync'),
];
