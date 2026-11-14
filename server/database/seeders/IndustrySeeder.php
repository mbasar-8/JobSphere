<?php

namespace Database\Seeders;

use App\Models\Industry;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $industries = [
            'Software Development',
            'Information Technology',
            'Artificial Intelligence',
            'Cybersecurity',
            'Finance',
            'Banking',
            'Insurance',
            'Healthcare',
            'Pharmaceuticals',
            'Education',
            'E-commerce',
            'Telecommunications',
            'Manufacturing',
            'Construction',
            'Real Estate',
            'Marketing & Advertising',
            'Retail',
            'Logistics & Supply Chain',
            'Hospitality & Tourism',
            'Government',
        ];

        $data = [];

        foreach ($industries as $industry) {
            $data[] = [
                'name' => $industry,
                'slug' => Str::slug($industry),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Industry::insert($data);
    }
}
