<?php

namespace App\Http\Requests\Job;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobRequest extends FormRequest
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
            'city_id' => [
                'nullable',
                'exists:cities,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
            ],

            'responsibilities' => [
                'nullable',
                'string',
            ],

            'requirements' => [
                'nullable',
                'string',
            ],

            'benefits' => [
                'nullable',
                'string',
            ],

            'employment_type' => [
                'required',
                Rule::in([
                    'full-time',
                    'part-time',
                    'contract',
                    'internship',
                    'temporary',
                    'freelance',
                ]),
            ],

            'workplace_type' => [
                'required',
                Rule::in([
                    'onsite',
                    'remote',
                    'hybrid',
                ]),
            ],

            'experience_level' => [
                'nullable',
                Rule::in([
                    'entry',
                    'mid',
                    'senior',
                ]),
            ],

            'salary_min' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'salary_max' => [
                'nullable',
                'integer',
                'gte:salary_min',
            ],

            'salary_currency' => [
                'nullable',
                'string',
                'max:10',
            ],

            'vacancies' => [
                'nullable',
                'integer',
                'min:1',
            ],

            'application_deadline' => [
                'nullable',
                'date',
                'after:today',
            ],
        ];
    }
}
