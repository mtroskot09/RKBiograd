<?php

namespace App\Providers;

use App\Services\Hrs\HrsClient;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // One per request, so a feed file is read from the cache only once.
        $this->app->scoped(HrsClient::class);
    }

    public function boot(): void
    {
        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }
    }
}
