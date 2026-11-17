<?php

namespace App\Http\Middleware;

use App\Support\LocalAdmin;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admin pages: checked on every request, so removing someone from ADMIN_EMAILS takes effect at once.
 */
class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (LocalAdmin::enabled() && ! Auth::check()) {
            LocalAdmin::signIn();
        }

        if (! Auth::check()) {
            return redirect()->guest('/api/login');
        }

        if (! LocalAdmin::isAdmin(Auth::user())) {
            Auth::logout();

            return redirect('/pristup-odbijen');
        }

        return $next($request);
    }
}
