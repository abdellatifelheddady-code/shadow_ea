<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\TournamentSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Seed users via dedicated seeder.
        $this->call(UserSeeder::class);

        // Create one additional test user for tournaments and run tournament seeder.
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        if ($user) {
            $this->call(TournamentSeeder::class);
        }
    }
}
