<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardCandidateApplicationResource extends JsonResource
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

            'job' => [
                'id' => $this->job->id,

                'title' => $this->job->title,

                'slug' => $this->job->slug,

                'company' => [
                    'id' => $this->job->company->id,

                    'company_name' => $this->job->company->company_name,

                    'logo' => $this->job->company->logo,
                ],
            ],
        ];
    }
}
