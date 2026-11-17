<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

/**
 * Without GOOGLE_CLIENT_ID (local development only) login is disabled and every visitor of the
 * admin panel is signed in as a local admin. Never allowed in production.
 */
class LocalAdmin
{
    public const EMAIL = 'admin@localhost';

    public static function enabled(): bool
    {
        return ! config('services.google.client_id') && ! app()->isProduction();
    }

    public static function signIn(): void
    {
        $user = User::updateOrCreate(
            ['id' => 'local-dev-admin'],
            ['email' => self::EMAIL, 'first_name' => 'Local', 'last_name' => 'Admin'],
        );
        Auth::login($user);
    }

    public static function isAdmin(?User $user): bool
    {
        return $user !== null && (self::enabled() ? $user->email === self::EMAIL || $user->isAdmin() : $user->isAdmin());
    }
}
