<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'recruiter_id',
        'industry_id',
        'company_name',
        'slug',
        'logo',
        'website',
        'email',
        'phone',
        'description',
        'city_id',
        'company_size',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function recruiter(): BelongsTo
    {
        return $this->belongsTo(RecruiterProfile::class);
    }

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
