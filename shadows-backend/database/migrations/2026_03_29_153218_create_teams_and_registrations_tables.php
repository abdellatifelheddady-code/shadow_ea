<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() {
    Schema::create('teams', function (Blueprint $table) {
        $table->id();
        $table->string('name')->unique();
        $table->foreignId('captain_id')->constrained('users')->onDelete('cascade');
        $table->timestamps();
    });

    Schema::create('tournament_registrations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tournament_id')->constrained()->onDelete('cascade');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('team_id')->nullable()->constrained()->onDelete('set null');
        $table->timestamps();
        $table->unique(['tournament_id', 'user_id']); // ممنوع التسجيل مرتين
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
