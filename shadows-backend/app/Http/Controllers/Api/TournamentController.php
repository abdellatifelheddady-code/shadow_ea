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
use App\Models\TournamentResult;

use App\Models\OrganizerRating;
use Illuminate\Support\Facades\DB;
class TournamentController extends Controller
{
    // get all tournaments (with participants)
   public function index()
{
    $tournaments = Tournament::with('participants')
        ->where('is_approved', true)
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
        'date' => 'required|date',
        'type' => 'required|in:solo,squad',
        'system_type' => 'required|in:chat_only,points', // <--- زيادة الـ Validation
        'team_size' => 'required_if:type,squad|integer|min:2',
        'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $path = $request->file('image')->store('tournaments', 'public');

    $tournament = Tournament::create([
        'title' => $data['title'],
        'description' => $data['description'] ?? null,
        'image' => $path,
        'game' => $data['game'],
        'date' => $data['date'],
        'type' => $data['type'],
        'system_type' => $data['system_type'],
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

    // 1. التعديل المهم: تشيك واش التسجيل مزال مفتوح
    if (!$tournament->is_registration_open) {
        return response()->json(['message' => 'Registration is currently closed for this tournament!'], 403);
    }

    // 2. تشيك واش المستخدم ديجا مسجل
    $alreadyJoined = TournamentRegistration::where('tournament_id', $id)
                        ->where('user_id', $user->id)
                        ->exists();
    if ($alreadyJoined) {
        return response()->json(['message' => 'You are already registered in this tournament!'], 400);
    }

    if ($tournament->type === 'solo') {
        TournamentRegistration::create([
            'tournament_id' => $id,
            'user_id' => $user->id,
            'team_id' => null
        ]);
        return response()->json(['message' => 'Joined successfully as Solo!']);
    } else {
        // 3. الـ Squad Logic
        $request->validate([
            'team_name' => 'required|string|max:255',
            'teammates' => 'required|array|min:'.($tournament->team_size - 1),
            'teammates.*' => 'email|exists:users,email'
        ]);

        // تحسين: تشيك واش الكابتن دخل راسو فـ teammates
        if (in_array($user->email, $request->teammates)) {
            return response()->json(['message' => 'You are already included as captain. Please add only your teammates.'], 422);
        }

        // تشيك واش سمية الفريق مستعملة فهاد البطولة
        $isNameTakenInTournament = TournamentRegistration::where('tournament_id', $id)
            ->whereHas('team', function($query) use ($request) {
                $query->where('name', $request->team_name);
            })->exists();

        if ($isNameTakenInTournament) {
            return response()->json(['message' => 'This team name is already taken in THIS tournament.'], 422);
        }

        // 4. إنشاء الفريق
        $team = Team::create([
            'name' => $request->team_name,
            'captain_id' => $user->id
        ]);

        // 5. إضافة الكابتن
        TournamentRegistration::create([
            'tournament_id' => $id,
            'user_id' => $user->id,
            'team_id' => $team->id
        ]);

        // 6. إضافة الصحاب (مع التأكد بلي ما مسجلينش ديجا)
        foreach ($request->teammates as $email) {
            $member = User::where('email', $email)->first();

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
        // 1. جلب البطولة مع المشاركين ومع المنظم (creator) والبادج ديالو
        $tournament = Tournament::with(['participants', 'creator' => function($query) {
            $query->select('id', 'name', 'organizer_badge');
        }])->findOrFail($id);

        // 2. تعديل بيانات المشاركين باش نزيدو ليهم team_name يدوياً
        $tournament->participants->transform(function ($participant) {
            $teamId = $participant->pivot->team_id;

            if ($teamId) {
                $team = Team::find($teamId);
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
public function getLeaderboard($id) {
    $results = TournamentResult::where('tournament_id', $id)
        ->with('user:id,name')
        ->orderBy('total_points', 'desc')
        ->get();
    return response()->json($results);
}

// إدخال النقط (خاص بـ Organizer)
// app/Http/Controllers/Api/TournamentController.php

public function updatePoints(Request $request, $id) {
    $tournament = Tournament::findOrFail($id);

    // التأكد من الصلاحية
    if (auth()->id() !== $tournament->user_id) {
        return response()->json(['message' => 'Only the organizer can update points!'], 403);
    }

    $request->validate([
        'user_id' => 'required|exists:users,id', // هادا كيبقى المعرف الرئيسي (الكابتن أو اللاعب)
        'rank_points' => 'required|integer',
        'kill_points' => 'required|integer',
    ]);

    // البحث عن السجل الحالي أو إنشاء واحد جديد
    $result = TournamentResult::firstOrNew(
        ['tournament_id' => $id, 'user_id' => $request->user_id]
    );

    // إضافة النقط الجديدة على النقط القديمة (Accumulative)
    $result->rank_points += $request->rank_points;
    $result->kill_points += $request->kill_points;
    $result->total_points = $result->rank_points + $result->kill_points;

    $result->save();

    return response()->json(['message' => 'Points added successfully!', 'data' => $result]);
}
public function toggleRegistration($id)
{
    try {
        $tournament = Tournament::find($id);

        if (!$tournament) {
            return response()->json(['message' => 'Tournament not found'], 404);
        }

        // تأكد بلي المستخدم مسجل دخول (Authenticated)
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // تشيك واش هو المنظم
        if (auth()->id() !== (int)$tournament->user_id) {
            return response()->json(['message' => 'Unauthorized. You are not the organizer.'], 403);
        }

        $tournament->is_registration_open = !$tournament->is_registration_open;
        $tournament->save();

        return response()->json([
            'is_registration_open' => (bool)$tournament->is_registration_open
        ]);
    } catch (\Exception $e) {
        // هاد السطر غيقوليك بالضبط فين كاين المشكل فـ الـ Logs
        \Log::error("Registration Toggle Error: " . $e->getMessage());
        return response()->json(['message' => 'Server Error: ' . $e->getMessage()], 500);
    }
}


public function finishTournament($id) {
    $tournament = Tournament::findOrFail($id);

    // تشيك واش اللي باغي يسدها هو اللي كرياها
    if (auth()->id() !== $tournament->user_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $tournament->status = 'finished';
    $tournament->save();

    return response()->json(['message' => 'Tournament finished! Ratings are now open.']);
}

// 2. دالة تسجيل التقييم وتحديث البادج
public function rateOrganizer(Request $request, $id) {
    $tournament = Tournament::findOrFail($id);

    // تشيك واش البطولة سلات فعلاً
    if ($tournament->status !== 'finished') {
        return response()->json(['message' => 'You can only rate after the tournament ends.'], 400);
    }

    $request->validate([
        'stars' => 'required|integer|min:1|max:5',
        'comment' => 'nullable|string|max:500'
    ]);

    // التأكد بلي اللاعب ما كيقيمش راسو وبلي مسجل فالبطولة (اختياري ولكن أحسن)

    // تسجيل التقييم
    OrganizerRating::updateOrCreate(
        ['user_id' => auth()->id(), 'tournament_id' => $id], // باش ما يعاودش يقيم نفس البطولة
        [
            'organizer_id' => $tournament->user_id,
            'stars' => $request->stars,
            'comment' => $request->comment
        ]
    );

    // تحديث البادج ديال المنظم تلقائياً
    $this->calculateOrganizerBadge($tournament->user_id);

    return response()->json(['message' => 'Rating submitted successfully!']);
}

// 3. المنطق ديال حساب البادج (Private Function)
private function calculateOrganizerBadge($organizerId) {
    // كنجيبو معدل النجوم ديال هاد المنظم فكاع البطولات
    $average = OrganizerRating::where('organizer_id', $organizerId)->avg('stars');

    // كنجيبو عدد البطولات لي "سلاهم" بنجاح
    $finishedCount = Tournament::where('user_id', $organizerId)->where('status', 'finished')->count();

    $user = User::find($organizerId);

    // Logic ديال البادجات (تقدر تبدلو كيف بغيتي)
    if ($finishedCount >= 10 && $average >= 4.5) {
        $user->organizer_badge = 'Elite Organizer';
    } elseif ($finishedCount >= 5 && $average >= 3.5) {
        $user->organizer_badge = 'Pro Organizer';
    } elseif ($finishedCount >= 1) {
        $user->organizer_badge = 'Basic Organizer';
    } else {
        $user->organizer_badge = 'Rookie';
    }

    $user->save();
}
}
