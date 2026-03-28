<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin Test',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'is_admin' => true,

        ]);

        User::create([
            'name' => 'User Test',
            'email' => 'user@example.com',
            'password' => Hash::make('user12345'),
                'is_admin' => false,

        ]);
    }
}
