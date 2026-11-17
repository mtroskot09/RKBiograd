<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Admin who signed in with Google. The id is "google:<sub>" (or "local-dev-admin" locally).
 */
class User extends Authenticatable
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'email', 'first_name', 'last_name', 'profile_image_url'];

    // Admins never use "remember me"; the table has no remember_token column.
    protected $rememberTokenName = '';

    public function isAdmin(): bool
    {
        return in_array(strtolower((string) $this->email), config('club.admin_emails'), true);
    }

    public function getNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}
