<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\StoreApplicationRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\JsonResponse;

class ApplicationController extends Controller
{
    /**
     * Store a newly created application.
     */
    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can apply for jobs.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please complete your candidate profile first.',
            ], 404);
        }

        $job = Job::find($request->job_id);

        if (! $job) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job not found.',
            ], 404);
        }

        if ($job->status !== 'published') {
            return response()->json([
                'status' => 'error',
                'message' => 'This job is not accepting applications.',
            ], 422);
        }

        $alreadyApplied = Application::where('job_id', $job->id)
            ->where('candidate_id', $candidateProfile->id)
            ->exists();

        if ($alreadyApplied) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already applied for this job.',
            ], 422);
        }

        $application = Application::create([
            'job_id' => $job->id,
            'candidate_id' => $candidateProfile->id,
            'cover_letter' => $request->cover_letter,
            'resume' => $request->resume,
            'status' => 'pending',
            'applied_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Application submitted successfully.',
            'data' => new ApplicationResource($application),
        ], 201);
    }




    /**
     * Display a listing of the candidate's applications.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can view applications.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate profile not found.',
            ], 404);
        }

        $applications = $candidateProfile->applications()
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Applications retrieved successfully.',
            'data' => ApplicationResource::collection($applications),
        ]);
    }

    /**
     * Display the specified application.
     */
    public function show(Application $application): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can view applications.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate profile not found.',
            ], 404);
        }

        if ($application->candidate_id !== $candidateProfile->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to view this application.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Application retrieved successfully.',
            'data' => new ApplicationResource($application),
        ]);
    }

    /**
     * Withdraw the specified application.
     */
    public function withdraw(Application $application): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can withdraw applications.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate profile not found.',
            ], 404);
        }

        if ($application->candidate_id !== $candidateProfile->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to withdraw this application.',
            ], 403);
        }

        if ($application->status === 'withdrawn') {
            return response()->json([
                'status' => 'error',
                'message' => 'Application is already withdrawn.',
            ], 422);
        }

        $application->update([
            'status' => 'withdrawn',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Application withdrawn successfully.',
            'data' => new ApplicationResource($application->fresh()),
        ]);
    }
}
