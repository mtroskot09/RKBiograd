<?php

namespace App\Services\Hrs;

use RuntimeException;

/** The HRS feed could not be reached or read, and there is no cached copy to fall back to. */
class HrsUnavailableException extends RuntimeException
{
    public function __construct(string $message)
    {
        parent::__construct("HRS feed: {$message}");
    }
}
