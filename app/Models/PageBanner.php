<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Custom top image of a page (Admin → Naslovne slike). */
class PageBanner extends Model
{
    public const CREATED_AT = null;

    public $incrementing = false;

    protected $primaryKey = 'page';

    protected $keyType = 'string';

    protected $fillable = ['page', 'image_src'];

    /**
     * Pages with a changeable top image. A null default means the page shows the dark-blue
     * banner with the crest until an image is set.
     */
    public const PAGES = [
        'home' => ['label' => 'Početna', 'path' => '/', 'default' => '/images/hero-match.png'],
        'first-team' => ['label' => 'Prva ekipa', 'path' => '/first-team', 'default' => '/images/team-celebration.png'],
        'u15' => ['label' => 'U15', 'path' => '/u15', 'default' => '/images/youth-training.png'],
        'u13' => ['label' => 'U13', 'path' => '/u13', 'default' => '/images/youth-training.png'],
        'news' => ['label' => 'Vijesti', 'path' => '/news', 'default' => null],
        'history' => ['label' => 'Povijest', 'path' => '/history', 'default' => null],
        'contact' => ['label' => 'Kontakt', 'path' => '/contact', 'default' => null],
    ];

    /** Top image of a page: the admin's custom image, otherwise the page's default (or none). */
    public static function imageFor(string $page): ?string
    {
        return static::find($page)?->image_src ?? self::PAGES[$page]['default'] ?? null;
    }
}
