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
    Schema::create('tournament_results', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tournament_id')->constrained()->onDelete('cascade');
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // اللاعب أو القائد
        $table->integer('rank_points')->default(0);
        $table->integer('kill_points')->default(0);
        // التوتال غنحسبوه فـ الكود ولا نديروه Computed Column
        $table->integer('total_points')->default(0);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tournament_results');
    }
};
