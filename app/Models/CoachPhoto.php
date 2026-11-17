<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Photo per coach (HRS person), shared by all teams the person is assigned to. */
class CoachPhoto extends Model
{
    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'hrs_person_id';

    protected $fillable = ['hrs_person_id', 'photo_url'];
}
