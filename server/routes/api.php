<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RecruiterProfileController;
use App\Http\Controllers\Api\CandidateProfileController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\SavedJobController;
use App\Http\Controllers\Api\RecruiterApplicationController;

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


    /*
    |--------------------------------------------------------------------------
    | Candidate Routes
    |--------------------------------------------------------------------------
    */

    Route::post('/candidate-profile', [CandidateProfileController::class, 'store']);

    Route::get('/candidate-profile', [CandidateProfileController::class, 'show']);

    Route::put('/candidate-profile', [CandidateProfileController::class, 'update']);


    /*
    |--------------------------------------------------------------------------
    | Job Routes
    |--------------------------------------------------------------------------
    */

    Route::get('/jobs', [JobController::class, 'index']);
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/jobs/{job}', [JobController::class, 'show']);
    Route::put('/jobs/{job}', [JobController::class, 'update']);
    Route::patch('/jobs/{job}/publish', [JobController::class, 'publish']);
    Route::patch('/jobs/{job}/close', [JobController::class, 'close']);


    /*
    |--------------------------------------------------------------------------
    | Application Routes
    |--------------------------------------------------------------------------
    */

    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/{application}', [ApplicationController::class, 'show']);
    Route::patch('/applications/{application}/withdraw', [ApplicationController::class, 'withdraw']);

    /*
    |--------------------------------------------------------------------------
    | Saved Job Routes
    |--------------------------------------------------------------------------
    */

    Route::post('/saved-jobs/{job}', [SavedJobController::class, 'store']);
    Route::get('/saved-jobs', [SavedJobController::class, 'index']);
    Route::delete('/saved-jobs/{job}', [SavedJobController::class, 'destroy']);
    Route::get('/saved-jobs/check/{job}', [SavedJobController::class, 'check']);


    /*
    |--------------------------------------------------------------------------
    | Recruiter Application Manage Routes
    |--------------------------------------------------------------------------
    */

    Route::get('/recruiter/applications', [RecruiterApplicationController::class, 'index']);

    Route::get('/recruiter/applications/{application}', [RecruiterApplicationController::class, 'show']);

    Route::patch('/recruiter/applications/{application}/status', [RecruiterApplicationController::class, 'updateStatus']);
});
