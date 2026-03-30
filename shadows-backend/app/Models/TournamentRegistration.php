<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TournamentRegistration extends Model {
    protected $table = 'tournament_registrations';
    protected $fillable = ['tournament_id', 'user_id', 'team_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function participants()
{
    return $this->belongsToMany(User::class, 'tournament_registrations')
                ->withPivot('team_id')
                ->withTimestamps();
}
    public function tournament() {
        return $this->belongsTo(Tournament::class);
    }

    public function team() {
        return $this->belongsTo(Team::class);
    }
}
