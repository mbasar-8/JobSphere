<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardRecruiterApplicationResource extends JsonResource
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

            'status' => $this->status,

            'applied_at' => $this->applied_at,

            'candidate' => [
                'id' => $this->candidate->id,

                'full_name' => $this->candidate->full_name,

                'headline' => $this->candidate->headline,

                'profile_photo' => $this->candidate->profile_photo,
            ],

            'job' => [
                'id' => $this->job->id,

                'title' => $this->job->title,

                'slug' => $this->job->slug,
            ],
        ];
    }
}
