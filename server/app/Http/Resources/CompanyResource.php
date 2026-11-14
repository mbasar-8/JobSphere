<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
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
            'company_name' => $this->company_name,
            'slug' => $this->slug,
            'logo' => $this->logo,
            'website' => $this->website,
            'email' => $this->email,
            'phone' => $this->phone,
            'description' => $this->description,
            'company_size' => $this->company_size,

            'industry' => [
                'id' => $this->industry?->id,
                'name' => $this->industry?->name,
            ],

            'city' => $this->city
                ? [
                    'id' => $this->city->id,
                    'name' => $this->city->name,
                ]
                : null,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
