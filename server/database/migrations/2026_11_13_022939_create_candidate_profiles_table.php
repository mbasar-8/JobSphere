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
        Schema::create('candidate_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('full_name', 150);

            $table->string('profile_photo', 255)->nullable();

            $table->string('headline', 180)->nullable();

            $table->text('about')->nullable();

            $table->string('phone', 30)->nullable();

            $table->string('gender', 20)->nullable();

            $table->date('date_of_birth')->nullable();

            $table->foreignId('city_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->string('linkedin_url', 255)->nullable();

            $table->string('github_url', 255)->nullable();

            $table->string('portfolio_url', 255)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_profiles');
    }
};
