<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SavedJobResource;
use App\Models\Job;
use App\Models\SavedJob;
use Illuminate\Http\JsonResponse;

class SavedJobController extends Controller
{
    /**
     * Save a job.
     */
    public function store(Job $job): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can save jobs.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please complete your candidate profile first.',
            ], 404);
        }

        if ($job->status !== 'published') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only published jobs can be saved.',
            ], 422);
        }

        $alreadySaved = SavedJob::where('candidate_id', $candidateProfile->id)
            ->where('job_id', $job->id)
            ->exists();

        if ($alreadySaved) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job is already saved.',
            ], 422);
        }

        $savedJob = SavedJob::create([
            'candidate_id' => $candidateProfile->id,
            'job_id' => $job->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Job saved successfully.',
            'data' => new SavedJobResource($savedJob),
        ], 201);
    }
    /**
     * Display the candidate's saved jobs.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can view saved jobs.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate profile not found.',
            ], 404);
        }

        $savedJobs = $candidateProfile->savedJobs()
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Saved jobs retrieved successfully.',
            'data' => SavedJobResource::collection($savedJobs),
        ]);
    }

    /**
     * Remove a saved job.
     */
    public function destroy(Job $job): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can remove saved jobs.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate profile not found.',
            ], 404);
        }

        $savedJob = SavedJob::where('candidate_id', $candidateProfile->id)
            ->where('job_id', $job->id)
            ->first();

        if (! $savedJob) {
            return response()->json([
                'status' => 'error',
                'message' => 'Saved job not found.',
            ], 404);
        }

        $savedJob->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Saved job removed successfully.',
        ]);
    }

    /**
     * Check if a job is saved.
     */
    public function check(Job $job): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'candidate') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only candidates can check saved jobs.',
            ], 403);
        }

        $candidateProfile = $user->candidateProfile;

        if (! $candidateProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Candidate profile not found.',
            ], 404);
        }

        $isSaved = SavedJob::where('candidate_id', $candidateProfile->id)
            ->where('job_id', $job->id)
            ->exists();

        return response()->json([
            'status' => 'success',
            'data' => [
                'saved' => $isSaved,
            ],
        ]);
    }
}
