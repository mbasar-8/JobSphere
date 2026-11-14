<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCandidateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'full_name' => [
                'required',
                'string',
                'max:150',
            ],

            'profile_photo' => [
                'nullable',
                'string',
                'max:255',
            ],

            'headline' => [
                'nullable',
                'string',
                'max:255',
            ],

            'about' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'gender' => [
                'nullable',
                Rule::in(['male', 'female', 'other']),
            ],

            'date_of_birth' => [
                'nullable',
                'date',
                'before:today',
            ],

            'city_id' => [
                'nullable',
                'exists:cities,id',
            ],

            'linkedin_url' => [
                'nullable',
                'url',
                'max:255',
            ],

            'github_url' => [
                'nullable',
                'url',
                'max:255',
            ],

            'portfolio_url' => [
                'nullable',
                'url',
                'max:255',
            ],
        ];
    }
}
