<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TournamentController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/tournaments', [TournamentController::class, 'index']);
Route::get('/tournaments/{id}', [TournamentController::class, 'show']);



Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    Route::post('/tournaments', [TournamentController::class, 'store']);
    Route::post('/tournaments/{id}/register', [TournamentController::class, 'register']);


    Route::get('/my-tournaments', [TournamentController::class, 'myTournaments']);
    Route::get('/joined-tournaments', [TournamentController::class, 'joinedTournaments']);


    Route::get('/users/search', [TournamentController::class, 'searchUser']);

});



Route::middleware('auth:sanctum')->prefix('admin')->group(function () {



    Route::get('/all-tournaments', [TournamentController::class, 'allTournaments']);

    Route::post('/tournaments/{id}/approve', [TournamentController::class, 'approve']);
Route::get('/pending-tournaments', [TournamentController::class, 'pending']);
    Route::delete('/tournaments/{id}', [TournamentController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/tournaments/{id}/messages', [TournamentController::class, 'getMessages']);
    Route::post('/tournaments/{id}/messages', [TournamentController::class, 'sendMessage']);

});
Route::get('/tournaments/{id}/leaderboard', [TournamentController::class, 'getLeaderboard']);
Route::post('/tournaments/{id}/points', [TournamentController::class, 'updatePoints']);
Route::middleware('auth:sanctum')->post('/tournaments/{id}/toggle-registration', [TournamentController::class, 'toggleRegistration']);
