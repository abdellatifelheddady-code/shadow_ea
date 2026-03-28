<?php
// app/Http/Controllers/Api/TournamentController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use Illuminate\Http\Request;

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
    public function join($id, Request $request)
    {
        $user = $request->user(); // auth user

        $tournament = Tournament::findOrFail($id);

        if ($tournament->participants->contains($user->id)) {
            return response()->json(['message' => 'Already joined'], 400);
        }

        $tournament->participants()->attach($user->id);

        return response()->json(['message' => 'Joined successfully']);
    }

    // get tournaments joined by user
    public function joinedTournaments(Request $request)
    {
        $user = $request->user();
        $tournaments = $user->joinedTournaments()->with('participants')->get();
        return response()->json($tournaments);
    }
    public function store(Request $request)
{
    $user = $request->user();

    $data = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'game' => 'required|string|max:255',
        'date' => 'required|date',
    ]);

    $tournament = Tournament::create([
        'title' => $data['title'],
        'description' => $data['description'] ?? null,
        'game' => $data['game'],
        'date' => $data['date'],
        'user_id' => $user->id,
        'is_approved' => false, // must be approved by admin
    ]);

    return response()->json($tournament, 201);
}
public function show($id) {
    return Tournament::with('participants')->findOrFail($id);
}
public function pending()
{
    // كنأكدو بلي غير الـ Admin اللي كيشوفهم
    if (!auth()->user()->is_admin) {
        return response()->json(['message' => 'Forbidden'], 403);
    }
    $tournaments = Tournament::where('is_approved', false)->get();
    return response()->json($tournaments);
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
}
