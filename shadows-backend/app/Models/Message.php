<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    protected $fillable = ['tournament_id', 'user_id', 'content', 'image'];

    public function user()
    {
        // هادي مهمة باش نقدرو نعرفو شكون صيفط الميساج
        return $this->belongsTo(User::class);
    }

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }
}
