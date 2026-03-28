<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TournamentController;
// routes/api.php

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// الـ Public Routes (بلا Login)
Route::get('/tournaments', [TournamentController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    // User Routes
    Route::get('/tournaments/{id}', [TournamentController::class, 'show']);
    Route::post('/tournaments', [TournamentController::class, 'store']);
    Route::post('/tournaments/{id}/join', [TournamentController::class, 'join']);
    Route::get('/joined-tournaments', [TournamentController::class, 'joinedTournaments']);
Route::get('/my-tournaments', [TournamentController::class, 'myTournaments']);
    // My Tournaments (لي كرييت أنا)
    Route::get('/my-tournaments', function () {
        return auth()->user()->tournaments; // تأكد من وجود العلاقة في Model User
    });

    // Admin Routes (خاص يكون المسار مطابق لشنو كاين في React)
    Route::prefix('admin')->group(function () {
        Route::get('/tournaments', [TournamentController::class, 'pending']);
        Route::post('/tournaments/{id}/approve', [TournamentController::class, 'approve']);
        Route::delete('/tournaments/{id}', [TournamentController::class, 'destroy']);
    });
});
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/all-tournaments', [TournamentController::class, 'allTournaments']);
    Route::delete('/tournaments/{id}', [TournamentController::class, 'destroy']);
    Route::post('/tournaments/{id}/approve', [TournamentController::class, 'approve']);
});
