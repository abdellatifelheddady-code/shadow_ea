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
        // Seed users via dedicated seeder.
        $this->call(UserSeeder::class);

        // Seed tournaments (needs users).
        $this->call(TournamentSeeder::class);
    }
}
