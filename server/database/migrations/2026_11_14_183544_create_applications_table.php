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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('job_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('candidate_id')
                ->constrained('candidate_profiles')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->text('cover_letter')->nullable();

            $table->string('resume', 255)->nullable();

            $table->string('status', 30)->default('pending');

            $table->timestamp('applied_at');

            $table->timestamps();

            $table->unique(['job_id', 'candidate_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
