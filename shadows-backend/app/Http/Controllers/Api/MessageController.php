<?php

// app/Http/Controllers/Api/MessageController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\TournamentRegistration;
use Illuminate\Http\Request;

class MessageController extends Controller
{
   // MessageController.php

public function index($tournamentId)
{
    try {
        // تأكد واش المستخدم داخل أصلا
        if (!auth('sanctum')->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $userId = auth('sanctum')->id();

        // تأكد واش مسجل فـ البطولة
        $isRegistered = TournamentRegistration::where('tournament_id', $tournamentId)
            ->where('user_id', $userId)
            ->exists();

        if (!$isRegistered) {
            return response()->json(['message' => 'Not registered in this tournament'], 403);
        }

        $messages = Message::where('tournament_id', $tournamentId)
            ->with('user:id,name')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function store(Request $request, $tournamentId)
    {
        try {
            $user = auth()->user();

            $request->validate([
                'content' => 'nullable|string',
                'image' => 'nullable|image|max:2048'
            ]);

            $path = null;
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('chat', 'public');
            }

            $message = Message::create([
                'tournament_id' => $tournamentId,
                'user_id' => $user->id,
               'content' => $request->input('content'),,
                'image' => $path
            ]);

            return response()->json($message->load('user:id,name'));

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
