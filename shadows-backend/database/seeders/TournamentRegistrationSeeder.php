<?php

namespace Database\Seeders;

use App\Models\TournamentRegistration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TournamentRegistrationSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $registrations = [
            // Individual registrations
            [
                'tournament_id' => 1,
                'user_id' => 1,
                'team_id' => null,
            ],
            [
                'tournament_id' => 1,
                'user_id' => 2,
                'team_id' => null,
            ],
            [
                'tournament_id' => 2,
                'user_id' => 3,
                'team_id' => null,
            ],
            [
                'tournament_id' => 2,
                'user_id' => 4,
                'team_id' => null,
            ],
            // Team registrations
            [
                'tournament_id' => 3,
                'user_id' => 5,
                'team_id' => 1,
            ],
            [
                'tournament_id' => 3,
                'user_id' => 6,
                'team_id' => 1,
            ],
            [
                'tournament_id' => 4,
                'user_id' => 7,
                'team_id' => 2,
            ],
            [
                'tournament_id' => 4,
                'user_id' => 8,
                'team_id' => 2,
            ],
            [
                'tournament_id' => 5,
                'user_id' => 9,
                'team_id' => 3,
            ],
            [
                'tournament_id' => 5,
                'user_id' => 10,
                'team_id' => 3,
            ],
        ];

        foreach ($registrations as $registration) {
            TournamentRegistration::create($registration);
        }
    }
}
