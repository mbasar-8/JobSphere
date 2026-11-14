<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'industry_id' => [
                'required',
                'integer',
                Rule::exists('industries', 'id'),
            ],

            'company_name' => [
                'required',
                'string',
                'max:180',
            ],



            'logo' => [
                'nullable',
                'string',
                'max:255',
            ],

            'website' => [
                'nullable',
                'url',
                'max:255',
            ],

            'email' => [
                'nullable',
                'email:rfc,dns',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'city_id' => [
                'nullable',
                'integer',
                Rule::exists('cities', 'id'),
            ],

            'company_size' => [
                'nullable',
                'string',
                'max:30',
            ],
        ];
    }
}
