<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicJobResource extends JsonResource
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

            'title' => $this->title,

            'slug' => $this->slug,

            'company' => $this->company
                ? [
                    'id' => $this->company->id,
                    'company_name' => $this->company->company_name,
                    'slug' => $this->company->slug,
                    'logo' => $this->company->logo,
                ]
                : null,

            'city' => $this->city
                ? [
                    'id' => $this->city->id,
                    'name' => $this->city->name,
                ]
                : null,

            'employment_type' => $this->employment_type,

            'workplace_type' => $this->workplace_type,

            'experience_level' => $this->experience_level,

            'salary_min' => $this->salary_min,

            'salary_max' => $this->salary_max,

            'salary_currency' => $this->salary_currency,

            'vacancies' => $this->vacancies,
            'description' => $this->description,

            'requirements' => $this->requirements,

            'application_deadline' => $this->application_deadline,

            'published_at' => $this->published_at,
        ];
    }
}
