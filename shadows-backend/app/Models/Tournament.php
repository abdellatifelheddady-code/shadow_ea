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
    'type',
    'system_type', // <--- تأكد بلي هادي موجودة هنا
    'team_size',
    'image',
    'user_id',
    'is_approved',
     'is_registration_open'

];

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }



public function participants()
{
    return $this->belongsToMany(User::class, 'tournament_registrations')
                ->withPivot('team_id') // كنجيبو id ديال الفريق من الجدول الوسيط
                ->withTimestamps();
}
public function registrations() {
    return $this->hasMany(TournamentRegistration::class);
}

}
