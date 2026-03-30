<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = [
            [
                'name' => 'Shadow Warriors',
                'captain_id' => 1,
            ],
            [
                'name' => 'Elite Gamers',
                'captain_id' => 2,
            ],
            [
                'name' => 'Pro Players',
                'captain_id' => 3,
            ],
            [
                'name' => 'Victory Squad',
                'captain_id' => 4,
            ],
            [
                'name' => 'Champion Team',
                'captain_id' => 5,
            ],
            [
                'name' => 'Battle Masters',
                'captain_id' => 6,
            ],
            [
                'name' => 'Game Legends',
                'captain_id' => 7,
            ],
            [
                'name' => 'Ultimate Force',
                'captain_id' => 8,
            ],
            [
                'name' => 'Skill Masters',
                'captain_id' => 9,
            ],
            [
                'name' => 'Top Players',
                'captain_id' => 10,
            ],
        ];

        foreach ($teams as $team) {
            Team::create($team);
        }
    }
}
