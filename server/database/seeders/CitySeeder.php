<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        City::insert([

            // Bangladesh
            ['country_id' => 1, 'name' => 'Dhaka', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 1, 'name' => 'Chattogram', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 1, 'name' => 'Khulna', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 1, 'name' => 'Rajshahi', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 1, 'name' => 'Sylhet', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 1, 'name' => 'Barishal', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 1, 'name' => 'Rangpur', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 1, 'name' => 'Mymensingh', 'created_at' => now(), 'updated_at' => now()],

            // India
            ['country_id' => 2, 'name' => 'Delhi', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 2, 'name' => 'Mumbai', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 2, 'name' => 'Bengaluru', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 2, 'name' => 'Kolkata', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 2, 'name' => 'Hyderabad', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 2, 'name' => 'Chennai', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 2, 'name' => 'Pune', 'created_at' => now(), 'updated_at' => now()],

            // Pakistan
            ['country_id' => 3, 'name' => 'Karachi', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 3, 'name' => 'Lahore', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 3, 'name' => 'Islamabad', 'created_at' => now(), 'updated_at' => now()],

            // Nepal
            ['country_id' => 4, 'name' => 'Kathmandu', 'created_at' => now(), 'updated_at' => now()],

            // Sri Lanka
            ['country_id' => 5, 'name' => 'Colombo', 'created_at' => now(), 'updated_at' => now()],

            // United States
            ['country_id' => 6, 'name' => 'New York', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 6, 'name' => 'San Francisco', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 6, 'name' => 'Seattle', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 6, 'name' => 'Austin', 'created_at' => now(), 'updated_at' => now()],

            // Canada
            ['country_id' => 7, 'name' => 'Toronto', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 7, 'name' => 'Vancouver', 'created_at' => now(), 'updated_at' => now()],

            // United Kingdom
            ['country_id' => 8, 'name' => 'London', 'created_at' => now(), 'updated_at' => now()],
            ['country_id' => 8, 'name' => 'Manchester', 'created_at' => now(), 'updated_at' => now()],

            // Germany
            ['country_id' => 9, 'name' => 'Berlin', 'created_at' => now(), 'updated_at' => now()],

            // France
            ['country_id' => 10, 'name' => 'Paris', 'created_at' => now(), 'updated_at' => now()],

            // Australia
            ['country_id' => 11, 'name' => 'Sydney', 'created_at' => now(), 'updated_at' => now()],

            // Japan
            ['country_id' => 12, 'name' => 'Tokyo', 'created_at' => now(), 'updated_at' => now()],

            // Singapore
            ['country_id' => 13, 'name' => 'Singapore', 'created_at' => now(), 'updated_at' => now()],

            // United Arab Emirates
            ['country_id' => 14, 'name' => 'Dubai', 'created_at' => now(), 'updated_at' => now()],

            // Saudi Arabia
            ['country_id' => 15, 'name' => 'Riyadh', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
