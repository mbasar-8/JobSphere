<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'company_id' => $this->company_id,

            'city_id' => $this->city_id,

            'title' => $this->title,

            'slug' => $this->slug,

            'description' => $this->description,

            'responsibilities' => $this->responsibilities,

            'requirements' => $this->requirements,

            'benefits' => $this->benefits,

            'employment_type' => $this->employment_type,

            'workplace_type' => $this->workplace_type,

            'experience_level' => $this->experience_level,

            'salary_min' => $this->salary_min,

            'salary_max' => $this->salary_max,

            'salary_currency' => $this->salary_currency,

            'vacancies' => $this->vacancies,

            'application_deadline' => $this->application_deadline,

            'status' => $this->status,

            'published_at' => $this->published_at,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}
