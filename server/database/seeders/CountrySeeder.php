<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Country::insert([
            [
                'name' => 'Bangladesh',
                'iso2_code' => 'BD',
                'iso3_code' => 'BGD',
            ],
            [
                'name' => 'India',
                'iso2_code' => 'IN',
                'iso3_code' => 'IND',
            ],
            [
                'name' => 'Pakistan',
                'iso2_code' => 'PK',
                'iso3_code' => 'PAK',
            ],
            [
                'name' => 'Nepal',
                'iso2_code' => 'NP',
                'iso3_code' => 'NPL',
            ],
            [
                'name' => 'Sri Lanka',
                'iso2_code' => 'LK',
                'iso3_code' => 'LKA',
            ],
            [
                'name' => 'United States',
                'iso2_code' => 'US',
                'iso3_code' => 'USA',
            ],
            [
                'name' => 'Canada',
                'iso2_code' => 'CA',
                'iso3_code' => 'CAN',
            ],
            [
                'name' => 'United Kingdom',
                'iso2_code' => 'GB',
                'iso3_code' => 'GBR',
            ],
            [
                'name' => 'Germany',
                'iso2_code' => 'DE',
                'iso3_code' => 'DEU',
            ],
            [
                'name' => 'France',
                'iso2_code' => 'FR',
                'iso3_code' => 'FRA',
            ],
            [
                'name' => 'Australia',
                'iso2_code' => 'AU',
                'iso3_code' => 'AUS',
            ],
            [
                'name' => 'Japan',
                'iso2_code' => 'JP',
                'iso3_code' => 'JPN',
            ],
            [
                'name' => 'Singapore',
                'iso2_code' => 'SG',
                'iso3_code' => 'SGP',
            ],
            [
                'name' => 'United Arab Emirates',
                'iso2_code' => 'AE',
                'iso3_code' => 'ARE',
            ],
            [
                'name' => 'Saudi Arabia',
                'iso2_code' => 'SA',
                'iso3_code' => 'SAU',
            ],
        ]);
    }
}
