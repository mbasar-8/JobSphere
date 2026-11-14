<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Recruiter\StoreRecruiterProfileRequest;
use App\Http\Requests\Recruiter\UpdateRecruiterProfileRequest;
use App\Http\Resources\RecruiterProfileResource;
use App\Models\RecruiterProfile;
use Illuminate\Http\JsonResponse;

class RecruiterProfileController extends Controller
{
    /**
     * Store a newly created recruiter profile.
     */
    public function store(StoreRecruiterProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can create a recruiter profile.',
            ], 403);
        }

        if ($user->recruiterProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Recruiter profile already exists.',
            ], 409);
        }

        $recruiterProfile = RecruiterProfile::create([
            'user_id' => $user->id,
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'designation' => $request->designation,
            'profile_photo' => $request->profile_photo,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Recruiter profile created successfully.',
            'data' => new RecruiterProfileResource($recruiterProfile),
        ], 201);
    }

    /**
     * Display the authenticated recruiter's profile.
     */
    public function show(): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can view a recruiter profile.',
            ], 403);
        }

        $recruiterProfile = $user->recruiterProfile;

        if (! $recruiterProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Recruiter profile not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Recruiter profile retrieved successfully.',
            'data' => new RecruiterProfileResource($recruiterProfile),
        ]);
    }

    /**
     * Update the authenticated recruiter's profile.
     */
    public function update(UpdateRecruiterProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can update a recruiter profile.',
            ], 403);
        }

        $recruiterProfile = $user->recruiterProfile;

        if (! $recruiterProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Recruiter profile not found.',
            ], 404);
        }

        $recruiterProfile->update([
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'designation' => $request->designation,
            'profile_photo' => $request->profile_photo,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Recruiter profile updated successfully.',
            'data' => new RecruiterProfileResource($recruiterProfile->fresh()),
        ]);
    }
}
