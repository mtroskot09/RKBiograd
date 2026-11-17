<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\LocalAdmin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

/**
 * Admin login with Google. The Google redirect URI is <PUBLIC_URL>/api/callback
 * (the same as in the earlier Node version, so the Google Cloud settings stay as they are).
 */
class GoogleController extends Controller
{
    // Shown when someone logs in with an account that is not on the admin list (or the login fails).
    private const ACCESS_DENIED_PATH = '/pristup-odbijen';

    public function redirect(): RedirectResponse
    {
        if (LocalAdmin::enabled()) {
            LocalAdmin::signIn();

            return redirect('/admin');
        }
        abort_unless(config('services.google.client_id'), 503, 'GOOGLE_CLIENT_ID must be set in production (admin login)');

        return Socialite::driver('google')->with(['prompt' => 'select_account'])->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        try {
            $google = Socialite::driver('google')->user();
        } catch (Throwable $e) {
            logger()->warning('Admin login failed: '.$e->getMessage());

            return redirect(self::ACCESS_DENIED_PATH);
        }

        $email = strtolower(trim((string) $google->getEmail()));
        $verified = ($google->user['email_verified'] ?? false) === true;
        if (! $verified || ! in_array($email, config('club.admin_emails'), true)) {
            logger()->warning('Admin login refused for '.($email ?: 'an account without email'));

            return redirect(self::ACCESS_DENIED_PATH);
        }

        $user = User::updateOrCreate(['id' => 'google:'.$google->getId()], [
            'email' => $email,
            'first_name' => $google->user['given_name'] ?? null,
            'last_name' => $google->user['family_name'] ?? null,
            'profile_image_url' => $google->getAvatar(),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended('/admin');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
