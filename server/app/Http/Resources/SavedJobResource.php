<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SavedJobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->job->id,

            'title' => $this->job->title,

            'slug' => $this->job->slug,

            'employment_type' => $this->job->employment_type,

            'workplace_type' => $this->job->workplace_type,

            'experience_level' => $this->job->experience_level,

            'company' => [
                'id' => $this->job->company->id,
                'company_name' => $this->job->company->company_name,
                'slug' => $this->job->company->slug,
                'logo' => $this->job->company->logo,
            ],

            'city' => $this->job->city
                ? [
                    'id' => $this->job->city->id,
                    'name' => $this->job->city->name,
                ]
                : null,

            'saved_at' => $this->created_at,
        ];
    }
}
