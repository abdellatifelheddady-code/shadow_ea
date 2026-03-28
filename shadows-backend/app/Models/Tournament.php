<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Tournament extends Model
{
     use HasFactory;
    protected $table = 'tournaments';
    protected $fillable = [
        'title',
        'description',
        'game',
        'date',
        'user_id',
        'is_approved'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

   public function participants()
{
    return $this->belongsToMany(User::class, 'tournament_user');
}

}
