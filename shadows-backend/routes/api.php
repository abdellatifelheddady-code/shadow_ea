<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TournamentController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// هادو خاصهم يكونوا برا باش يقدر أي واحد يشوفهم بلا Login
Route::get('/tournaments', [TournamentController::class, 'index']);
Route::get('/tournaments/{id}', [TournamentController::class, 'show']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Authenticated Users)
|--------------------------------------------------------------------------
*/
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
    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */


// routes/api.php
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // هادي اللي كتجيب Pending


    // هادي اللي كتجيب الكل
    Route::get('/all-tournaments', [TournamentController::class, 'allTournaments']);

    // هادي ديال Approve
    Route::post('/tournaments/{id}/approve', [TournamentController::class, 'approve']);
Route::get('/pending-tournaments', [TournamentController::class, 'pending']);
    // هادي ديال Delete
    Route::delete('/tournaments/{id}', [TournamentController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->group(function () {
    // ... الـ routes اللي عندك ديجا ...

    // شات البطولة
    Route::get('/tournaments/{id}/messages', [TournamentController::class, 'getMessages']);
    Route::post('/tournaments/{id}/messages', [TournamentController::class, 'sendMessage']);
});
