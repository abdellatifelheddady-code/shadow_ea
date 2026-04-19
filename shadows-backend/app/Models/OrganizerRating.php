<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrganizerRating extends Model
{
    protected $fillable = ['user_id', 'organizer_id', 'tournament_id', 'stars', 'comment'];

public function organizer() {
    return $this->belongsTo(User::class, 'organizer_id');
}

public function tournament() {
    return $this->belongsTo(Tournament::class);
}
}
