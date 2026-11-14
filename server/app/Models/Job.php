<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Job extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'city_id',
        'title',
        'slug',
        'description',
        'responsibilities',
        'requirements',
        'benefits',
        'employment_type',
        'workplace_type',
        'experience_level',
        'salary_min',
        'salary_max',
        'salary_currency',
        'vacancies',
        'application_deadline',
        'status',
        'published_at',
    ];

    /**
     * Get the company that owns the job.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the city where the job is located.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
