<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RecruiterProfileController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/companies/{slug}', [CompanyController::class, 'publicShow']);

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);

    Route::post('/resend-otp', [AuthController::class, 'resendOtp']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/user', [AuthController::class, 'user']);
    });
});

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Company Routes
    |--------------------------------------------------------------------------
    */

    Route::post('/company', [CompanyController::class, 'store']);

    Route::get('/company', [CompanyController::class, 'show']);

    Route::put('/company', [CompanyController::class, 'update']);


    /*
    |--------------------------------------------------------------------------
    | Recruiter Routes
    |--------------------------------------------------------------------------
    */

    Route::post('/recruiter-profile', [RecruiterProfileController::class, 'store']);

    Route::get('/recruiter-profile', [RecruiterProfileController::class, 'show']);

    Route::put('/recruiter-profile', [RecruiterProfileController::class, 'update']);
});
