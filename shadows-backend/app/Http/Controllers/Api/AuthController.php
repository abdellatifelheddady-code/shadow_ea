<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // Login method
    public function login(Request $request)
    {
        try {
            // Validation
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            // Check if user exists
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Check password
            if (!Hash::check($request->password, $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Create token (Sanctum)
            $token = $user->createToken('token')->plainTextToken;

            // Return user data + token
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin, // column الجديد
                ],
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            // Catch any unexpected error
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function register(Request $request) {
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required|string', 
        'password' => 'required|string|confirmed|min:6',
    ]);

    $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'phone' => $data['phone'],
        'password' => Hash::make($data['password']),
        'is_admin' => false,
    ]);

    return response()->json(['user' => $user, 'token' => $user->createToken('token')->plainTextToken], 201);
}
}
