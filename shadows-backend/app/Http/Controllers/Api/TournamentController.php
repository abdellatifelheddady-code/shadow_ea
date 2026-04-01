<?php
// app/Http/Controllers/Api/TournamentController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use Illuminate\Http\Request;
use App\Models\TournamentRegistration;
use App\Models\Team;
use App\Models\User;
use App\Models\Message; // تأكد بلي درتي ليها Import لفوق

class TournamentController extends Controller
{
    // get all tournaments (with participants)
   public function index()
{
    $tournaments = Tournament::with('participants')
        ->where('is_approved', true) // مهم جداً باش ما يبانوش Pending للناس
        ->get();
    return response()->json($tournaments);
}

    // user join tournament
    public function join($id, Request $request) {
    $tournament = Tournament::findOrFail($id);
    $user = auth()->user();

    // تشيك واش مسجل ديجا
    if (TournamentRegistration::where('tournament_id', $id)->where('user_id', $user->id)->exists()) {
        return response()->json(['message' => 'Déjà inscrit'], 400);
    }

    if ($tournament->type === 'solo') {
        TournamentRegistration::create(['tournament_id' => $id, 'user_id' => $user->id]);
    } else {
        $request->validate(['team_name' => 'required|string']);
        $team = Team::create(['name' => $request->team_name, 'captain_id' => $user->id]);
        TournamentRegistration::create(['tournament_id' => $id, 'user_id' => $user->id, 'team_id' => $team->id]);
    }

    return response()->json(['message' => 'Inscription réussie']);
}

    // get tournaments joined by user
   public function store(Request $request) {
    $data = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'game' => 'required|string',
        'date' => 'required|date', // تأكد أن الـ Validation موجود
        'type' => 'required|in:solo,squad',
        'team_size' => 'required_if:type,squad|integer|min:2',
        'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $path = $request->file('image')->store('tournaments', 'public');

    $tournament = Tournament::create([
        'title' => $data['title'],
        'description' => $data['description'] ?? null,
        'image' => $path,
        'game' => $data['game'],
        'date' => $data['date'], // <--- هاد السطر هو اللي كان ناقصك
        'type' => $data['type'],
        'team_size' => $data['type'] === 'squad' ? $data['team_size'] : null,
        'user_id' => auth()->id(),
        'is_approved' => false,
    ]);

    return response()->json($tournament, 201);
}



public function approve($id)
{
    if (!auth()->user()->is_admin) {
        return response()->json(['message' => 'Forbidden'], 403);
    }
    $tournament = Tournament::findOrFail($id);
    $tournament->update(['is_approved' => true]);
    return response()->json(['message' => 'Tournament approved successfully']);
}
// app/Http/Controllers/Api/TournamentController.php

public function myTournaments(Request $request)
{
    // جلب البطولات التي أنشأها المستخدم الحالي فقط
    $user = $request->user();
    $tournaments = Tournament::where('user_id', $user->id)
                             ->orderBy('created_at', 'desc')
                             ->get();

    return response()->json($tournaments);
}
// app/Http/Controllers/Api/TournamentController.php

public function allTournaments() {
    // كيجيب كاع البطولات (المقبولة واللي مزال) باش الـ Admin يتحكم في كلشي
    if (!auth()->user()->is_admin) {
        return response()->json(['message' => 'Forbidden'], 403);
    }
    return Tournament::with('participants')->orderBy('is_approved', 'asc')->get();
}

public function destroy($id) {
    if (!auth()->user()->is_admin) {
        return response()->json(['message' => 'Forbidden'], 403);
    }
    $tournament = Tournament::findOrFail($id);
    $tournament->delete();
    return response()->json(['message' => 'Tournament deleted']);
}

         public function register($id, Request $request) {
    $tournament = Tournament::findOrFail($id);
    $user = auth()->user();

    // تشيك واش ديجا مسجل
    $alreadyJoined = TournamentRegistration::where('tournament_id', $id)
                        ->where('user_id', $user->id)
                        ->exists();
    if ($alreadyJoined) {
        return response()->json(['message' => 'You are already registered!'], 400);
    }

    if ($tournament->type === 'solo') {
        TournamentRegistration::create([
            'tournament_id' => $id,
            'user_id' => $user->id,
            'team_id' => null
        ]);
        return response()->json(['message' => 'Joined successfully as Solo!']);
    } else {
        // الـ Squad Logic
        $request->validate([
            'team_name' => 'required|string|unique:teams,name',
            'teammates' => 'required|array|min:'.($tournament->team_size - 1),
            'teammates.*' => 'email|exists:users,email'
        ]);

        // 1. إنشاء الفريق
        $team = Team::create([
            'name' => $request->team_name,
            'captain_id' => $user->id
        ]);

        // 2. إضافة الكابتن
        TournamentRegistration::create([
            'tournament_id' => $id,
            'user_id' => $user->id,
            'team_id' => $team->id
        ]);

        // 3. إضافة الصحاب
        foreach ($request->teammates as $email) {
            $member = User::where('email', $email)->first();
            // تشيك واش هاد الصديق ديجا مسجل فالبطولة مع فريق آخر
            $isMemberBusy = TournamentRegistration::where('tournament_id', $id)
                            ->where('user_id', $member->id)
                            ->exists();

            if(!$isMemberBusy) {
                TournamentRegistration::create([
                    'tournament_id' => $id,
                    'user_id' => $member->id,
                    'team_id' => $team->id
                ]);
            }
        }

        return response()->json(['message' => 'Squad registered successfully!']);
    }
}
    public function searchUser(Request $request) {
        $email = $request->query('email');
        $user = User::where('email', $email)->select('id', 'name', 'email')->first();

        if (!$user) return response()->json(['message' => 'User not found'], 404);
        return response()->json($user);
    }
    public function joinedTournaments(Request $request) {
    // 1. جلب المستخدم الحالي
    $user = $request->user();

    // 2. جلب البطولات اللي مسجل فيها هاد المستخدم من جدول الـ pivot
    // جرب هاد الطريقة المباشرة باش نتفادو مشاكل العلاقات فـ الموديل
    $tournaments = \DB::table('tournaments')
        ->join('tournament_registrations', 'tournaments.id', '=', 'tournament_registrations.tournament_id')
        ->where('tournament_registrations.user_id', $user->id)
        ->select('tournaments.*')
        ->get();

    return response()->json($tournaments);
}
public function show($id)
{
    try {
        // 1. جلب البطولة مع المشاركين
        $tournament = Tournament::with('participants')->findOrFail($id);

        // 2. تعديل بيانات المشاركين باش نزيدو ليهم team_name يدوياً
        $tournament->participants->transform(function ($participant) {
            // كنشوفو واش كاين team_id ف الجدول الوسيط (pivot)
            $teamId = $participant->pivot->team_id;

            if ($teamId) {
                // كنجيبو اسم الفريق من جدول teams
                $team = \App\Models\Team::find($teamId);
                $participant->team_name = $team ? $team->name : "Solo Player";
            } else {
                $participant->team_name = "Solo Player";
            }
            return $participant;
        });

        // 3. التحقق من حالة التسجيل للمستخدم الحالي
        $isJoined = false;
        if (auth('sanctum')->check()) {
            $isJoined = $tournament->participants->contains('id', auth('sanctum')->id());
        }

        return response()->json([
            'tournament' => $tournament,
            'is_joined' => $isJoined
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
public function pending()
{
    try {
        // تأكد أن السمية هي 'is_approved' وأن القيمة هي 0
        $tournaments = Tournament::where('is_approved', 0)
                                 ->orderBy('created_at', 'desc')
                                 ->get();
        return response()->json($tournaments);
    } catch (\Exception $e) {
        // هادي غاتوريك الخطأ الحقيقي فـ Network Tab
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

// جلب الرسائل

public function getMessages($id) {
    $messages = Message::where('tournament_id', $id)
        ->with('user:id,name') // مهم باش تبان سمية اللي صيفط
        ->orderBy('created_at', 'asc')
        ->get();

    return response()->json($messages);
}

// 2. صيفط ميساج (نص أو صورة سكرين شوت)
public function sendMessage(Request $request, $id) {
    $request->validate([
        'content' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
    ]);

    $imagePath = null;
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('chat_images', 'public');
    }

    $message = Message::create([
        'tournament_id' => $id,
        'user_id' => auth()->id(),
        'content' => $request->input('content'),
        'image' => $imagePath
    ]);

    return response()->json($message->load('user:id,name'), 201);
}
}
