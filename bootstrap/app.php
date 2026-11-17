<?php

use App\Http\Middleware\EnsureAdmin;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        // Render pings this to know the app is up.
        health: '/healthz',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Behind Render's (or any) HTTPS proxy: needed for secure cookies and correct redirect URLs.
        $middleware->trustProxies(at: '*');
        $middleware->alias(['admin' => EnsureAdmin::class]);
        $middleware->redirectGuestsTo('/api/login');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
