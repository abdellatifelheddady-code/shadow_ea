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
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
             $table->string('title');
        $table->text('description');
        $table->string('game');
         $table->enum('type', ['solo', 'squad']);
          $table->enum('system_type', ['chat_only', 'points'])->default('chat_only');
        $table->date('date');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->boolean('is_approved')->default(false);

        $table->string('image')->nullable();

        $table->integer('team_size')->nullable();
        $table->boolean('is_registration_open')->default(true);
        $table->string('status')->default('open');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tournaments');
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn('is_registration_open');
        });
    }
};
