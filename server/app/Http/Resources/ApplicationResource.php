<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
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

            'job_id' => $this->job_id,

            'candidate_id' => $this->candidate_id,

            'cover_letter' => $this->cover_letter,

            'resume' => $this->resume,

            'status' => $this->status,

            'applied_at' => $this->applied_at,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}
