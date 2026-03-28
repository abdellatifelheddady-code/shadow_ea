<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin', // مهم
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function tournaments()
{
    return $this->hasMany(Tournament::class);
}

public function joinedTournaments()
{
    return $this->belongsToMany(Tournament::class, 'tournament_user');
}

}
