<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TournamentResult extends Model
{
    protected $table = 'tournament_results';
    protected $fillable = ['tournament_id', 'user_id', 'rank_points', 'kill_points', 'total_points'];
public function user() { return $this->belongsTo(User::class); }
}
