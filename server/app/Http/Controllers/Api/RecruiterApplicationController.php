<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\UpdateApplicationStatusRequest;
use use App\Http\Resources\RecruiterApplicationResource;
use App\Models\Application;
use Illuminate\Http\JsonResponse;

class RecruiterApplicationController extends Controller
{
    /**
     * Display all applications for the recruiter's jobs.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can view applications.',
            ], 403);
        }

        $recruiterProfile = $user->recruiterProfile;

        if (! $recruiterProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Recruiter profile not found.',
            ], 404);
        }

        $company = $recruiterProfile->company;

        if (! $company) {
            return response()->json([
                'status' => 'error',
                'message' => 'Company not found.',
            ], 404);
        }

        $applications = Application::with([
    'candidate.city',
    'job.company',
    'job.city',
])
            ->whereHas('job', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Applications retrieved successfully.',
            'data' => RecruiterApplicationResource::collection($applications),
        ]);
    }

    /**
     * Display a specific application.
     */
    public function show(Application $application): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can view applications.',
            ], 403);
        }

        $recruiterProfile = $user->recruiterProfile;

        if (! $recruiterProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Recruiter profile not found.',
            ], 404);
        }

        $company = $recruiterProfile->company;

        if (! $company) {
            return response()->json([
                'status' => 'error',
                'message' => 'Company not found.',
            ], 404);
        }

        if ($application->job->company_id !== $company->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to view this application.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Application retrieved successfully.',
            'data' => new RecruiterApplicationResource($application),
        ]);
    }

    /**
     * Update application status.
     */
    public function updateStatus(
        UpdateApplicationStatusRequest $request,
        Application $application
    ): JsonResponse {
        $user = auth()->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can update application status.',
            ], 403);
        }

        $recruiterProfile = $user->recruiterProfile;

        if (! $recruiterProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Recruiter profile not found.',
            ], 404);
        }

        $company = $recruiterProfile->company;

        if (! $company) {
            return response()->json([
                'status' => 'error',
                'message' => 'Company not found.',
            ], 404);
        }

        if ($application->job->company_id !== $company->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to update this application.',
            ], 403);
        }

        if (in_array($application->status, ['hired', 'rejected', 'withdrawn'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'This application can no longer be updated.',
            ], 422);
        }

        $application->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Application status updated successfully.',
            'data' => new RecruiterApplicationResource($application->fresh()),
        ]);
    }
}
