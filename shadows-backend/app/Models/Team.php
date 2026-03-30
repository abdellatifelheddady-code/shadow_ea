<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model {
    protected $table = 'teams';
    protected $fillable = ['name', 'captain_id'];

    public function captain() {
        return $this->belongsTo(User::class, 'captain_id');
    }

    public function registrations() {
        return $this->hasMany(TournamentRegistration::class);
    }
}
