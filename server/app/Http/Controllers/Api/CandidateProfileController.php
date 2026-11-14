<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\StoreCandidateProfileRequest;
use App\Http\Requests\Candidate\UpdateCandidateProfileRequest;
use App\Http\Resources\CandidateProfileResource;
use App\Models\CandidateProfile;
use Illuminate\Http\JsonResponse;

class CandidateProfileController extends Controller
{
    /**
     * Store a newly created candidate profile.
     */
    public function store(StoreCandidateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can create a candidate profile.',
            ], 403);
        }

        if ($user->candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate profile already exists.',
            ], 409);
        }

        $candidateProfile = CandidateProfile::create([
            'user_id' => $user->id,
            'full_name' => $request->full_name,
            'profile_photo' => $request->profile_photo,
            'headline' => $request->headline,
            'about' => $request->about,
            'phone' => $request->phone,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'city_id' => $request->city_id,
            'linkedin_url' => $request->linkedin_url,
            'github_url' => $request->github_url,
            'portfolio_url' => $request->portfolio_url,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Candidate profile created successfully.',
            'data' => new CandidateProfileResource($candidateProfile),
        ], 201);
    }

    /**
     * Display the authenticated candidate's profile.
     */
    public function show(): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can view a candidate profile.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate profile not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Candidate profile retrieved successfully.',
            'data' => new CandidateProfileResource($candidateProfile),
        ]);
    }

    /**
     * Update the authenticated candidate's profile.
     */
    public function update(UpdateCandidateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can update a candidate profile.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate profile not found.',
            ], 404);
        }

        $candidateProfile->update([
            'full_name' => $request->full_name,
            'profile_photo' => $request->profile_photo,
            'headline' => $request->headline,
            'about' => $request->about,
            'phone' => $request->phone,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_birth,
            'city_id' => $request->city_id,
            'linkedin_url' => $request->linkedin_url,
            'github_url' => $request->github_url,
            'portfolio_url' => $request->portfolio_url,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Candidate profile updated successfully.',
            'data' => new CandidateProfileResource($candidateProfile->fresh()),
        ]);
    }
}
