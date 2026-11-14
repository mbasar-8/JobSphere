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
            'id' => $this->id,

            'candidate_id' => $this->candidate_id,

            'job_id' => $this->job_id,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}
