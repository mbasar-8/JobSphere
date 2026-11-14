<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateProfileResource extends JsonResource
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

            'user_id' => $this->user_id,

            'full_name' => $this->full_name,

            'profile_photo' => $this->profile_photo,

            'headline' => $this->headline,

            'about' => $this->about,

            'phone' => $this->phone,

            'gender' => $this->gender,

            'date_of_birth' => $this->date_of_birth,

            'city_id' => $this->city_id,

            'linkedin_url' => $this->linkedin_url,

            'github_url' => $this->github_url,

            'portfolio_url' => $this->portfolio_url,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}
