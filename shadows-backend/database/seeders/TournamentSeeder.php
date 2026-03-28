<?php

namespace Database\Seeders;

use App\Models\Tournament;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TournamentSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tournaments = [
            [
                'title' => 'Spring Showdown',
                'description' => 'A competitive spring tournament for all skill levels.',
                'game' => 'Valorant',
                'date' => now()->addWeeks(2)->toDateString(),
                'user_id' => 1,
                'is_approved' => true,
            ],
            [
                'title' => 'Summer Smash',
                'description' => 'A casual meetup with a knockout bracket.',
                'game' => 'Super Smash Bros',
                'date' => now()->addWeeks(6)->toDateString(),
                'user_id' => 1,
                'is_approved' => false,
            ],
            [
                'title' => 'Autumn Arena',
                'description' => 'Team-based tournament for strategy fans.',
                'game' => 'League of Legends',
                'date' => now()->addMonths(3)->toDateString(),
                'user_id' => 1,
                'is_approved' => false,
            ],
            [
                'title' => 'Winter Warriors',
                'description' => 'Epic battles in the cold season.',
                'game' => 'Call of Duty',
                'date' => now()->addMonths(4)->toDateString(),
                'user_id' => 2,
                'is_approved' => true,
            ],
            [
                'title' => 'Cyber Clash',
                'description' => 'Digital warfare tournament.',
                'game' => 'Counter-Strike',
                'date' => now()->addWeeks(8)->toDateString(),
                'user_id' => 1,
                'is_approved' => false,
            ],
            [
                'title' => 'Racing Rivals',
                'description' => 'High-speed racing competition.',
                'game' => 'FIFA',
                'date' => now()->addWeeks(10)->toDateString(),
                'user_id' => 2,
                'is_approved' => true,
            ],
            [
                'title' => 'Battle Royale Bash',
                'description' => 'Last player standing event.',
                'game' => 'Fortnite',
                'date' => now()->addMonths(2)->toDateString(),
                'user_id' => 1,
                'is_approved' => false,
            ],
            [
                'title' => 'Strategy Masters',
                'description' => 'Tactical minds compete.',
                'game' => 'Dota 2',
                'date' => now()->addWeeks(12)->toDateString(),
                'user_id' => 2,
                'is_approved' => true,
            ],
            [
                'title' => 'Puzzle Party',
                'description' => 'Brain-teasing challenges.',
                'game' => 'Among Us',
                'date' => now()->addMonths(5)->toDateString(),
                'user_id' => 1,
                'is_approved' => false,
            ],
            [
                'title' => 'Ultimate Showdown',
                'description' => 'The ultimate gaming event.',
                'game' => 'Overwatch',
                'date' => now()->addWeeks(14)->toDateString(),
                'user_id' => 2,
                'is_approved' => true,
            ],
        ];

        foreach ($tournaments as $tournament) {
            Tournament::create($tournament);
        }
    }
}
