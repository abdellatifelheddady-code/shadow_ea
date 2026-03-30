<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\TeamSeeder;
use Database\Seeders\TournamentRegistrationSeeder;
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

        // Seed tournaments (needs users).
        $this->call(TournamentSeeder::class);

        // Seed teams (needs users for captains).
        $this->call(TeamSeeder::class);

        // Seed registrations (needs tournaments, users, teams).
        $this->call(TournamentRegistrationSeeder::class);

        // Create one additional test user if needed.
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
