<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('organizer_ratings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained(); // اللاعب اللي قيم
        $table->foreignId('organizer_id')->constrained('users'); // المنظم اللي تقيم
        $table->foreignId('tournament_id')->constrained(); // في آينا بطولة وقع التقييم
        $table->integer('stars'); // من 1 لـ 5
        $table->text('comment')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizer_ratings');
    }
};
