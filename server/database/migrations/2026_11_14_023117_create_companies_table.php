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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();

            $table->foreignId('recruiter_id')
                ->unique()
                ->constrained('recruiter_profiles')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('industry_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('company_name', 180);

            $table->string('slug', 200)->unique();

            $table->string('logo', 255)->nullable();

            $table->string('website', 255)->nullable();

            $table->string('email', 255)->nullable();

            $table->string('phone', 30)->nullable();

            $table->text('description')->nullable();

            $table->foreignId('city_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->string('company_size', 30)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
