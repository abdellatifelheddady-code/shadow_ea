<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [
            [
                'name' => 'Admin Test',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+212600000001',
                'is_admin' => true,
            ],
            [
                'name' => 'User Test',
                'email' => 'user@example.com',
                'password' => Hash::make('user12345'),
                'phone' => '+212600000002',
                'is_admin' => false,
            ],
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+212600000003',
                'is_admin' => false,
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+212600000004',
                'is_admin' => false,
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+212600000005',
                'is_admin' => false,
            ],
            [
                'name' => 'Alice Brown',
                'email' => 'alice@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+212600000006',
                'is_admin' => false,
            ],
            [
                'name' => 'Charlie Wilson',
                'email' => 'charlie@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+212600000007',
                'is_admin' => false,
            ],
            [
                'name' => 'Diana Lee',
                'email' => 'diana@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+212600000008',
                'is_admin' => false,
            ],
            [
                'name' => 'Eve Davis',
                'email' => 'eve@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+212600000009',
                'is_admin' => false,
            ],
            [
                'name' => 'Frank Miller',
                'email' => 'frank@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+212600000010',
                'is_admin' => false,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
