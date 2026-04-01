<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\TournamentResult;
use Illuminate\Http\Request;

class ResultController extends Controller {
    // 1. جلب الترتيب (Leaderboard)
    public function leaderboard($tournamentId) {
        return TournamentResult::where('tournament_id', $tournamentId)
            ->selectRaw('user_id, SUM(total_points) as final_score')
            ->groupBy('user_id')
            ->orderBy('final_score', 'desc')
            ->with('user:id,name')
            ->get();
    }

    // 2. إدخال النقط (خاص بصاحب المسابقة)
    public function store(Request $request, $tournamentId) {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'rank_points' => 'required|integer',
            'kill_points' => 'required|integer',
        ]);

        $result = TournamentResult::create([
            'tournament_id' => $tournamentId,
            'user_id' => $data['user_id'],
            'rank_points' => $data['rank_points'],
            'kill_points' => $data['kill_points'],
            'total_points' => $data['rank_points'] + $data['kill_points'],
        ]);

        return response()->json($result);
    }
}
