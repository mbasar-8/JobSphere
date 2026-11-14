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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('city_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->string('title', 255);

            $table->string('slug', 255)
                ->unique();

            $table->longText('description');

            $table->longText('responsibilities')
                ->nullable();

            $table->longText('requirements')
                ->nullable();

            $table->longText('benefits')
                ->nullable();

            $table->string('employment_type', 30);

            $table->string('workplace_type', 20);

            $table->string('experience_level', 30)
                ->nullable();

            $table->unsignedInteger('salary_min')
                ->nullable();

            $table->unsignedInteger('salary_max')
                ->nullable();

            $table->string('salary_currency', 10)
                ->default('BDT');

            $table->unsignedInteger('vacancies')
                ->default(1);

            $table->date('application_deadline')
                ->nullable();

            $table->string('status', 20)
                ->default('draft');

            $table->timestamp('published_at')
                ->nullable();

            $table->timestamps();

            $table->index('company_id');
            $table->index('city_id');
            $table->index('status');
            $table->index('employment_type');
            $table->index('workplace_type');
            $table->index('application_deadline');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
