<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Http\Resources\JobResource;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class JobController extends Controller
{
    /**
     * Store a newly created job.
     */
    public function store(StoreJobRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can create jobs.',
            ], 403);
        }

        $recruiterProfile = $user->recruiterProfile;

        if (! $recruiterProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please complete your recruiter profile first.',
            ], 404);
        }

        $company = $recruiterProfile->company;

        if (! $company) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please create a company before posting a job.',
            ], 404);
        }

        $slug = Str::slug($request->title)
            . '-' . strtolower(Str::random(6));

        $job = Job::create([
            'company_id' => $company->id,
            'city_id' => $request->city_id,
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
            'responsibilities' => $request->responsibilities,
            'requirements' => $request->requirements,
            'benefits' => $request->benefits,
            'employment_type' => $request->employment_type,
            'workplace_type' => $request->workplace_type,
            'experience_level' => $request->experience_level,
            'salary_min' => $request->salary_min,
            'salary_max' => $request->salary_max,
            'salary_currency' => $request->salary_currency ?? 'BDT',
            'vacancies' => $request->vacancies ?? 1,
            'application_deadline' => $request->application_deadline,
            'status' => 'draft',
            'published_at' => null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Job created successfully.',
            'data' => new JobResource($job),
        ], 201);
    }

    /**
     * Display a listing of the recruiter's jobs.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can view jobs.',
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

        $jobs = $company->jobs()->latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Jobs retrieved successfully.',
            'data' => JobResource::collection($jobs),
        ]);
    }

    /**
     * Display the specified job.
     */
    public function show(Job $job): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can view jobs.',
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

        if ($job->company_id !== $company->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to view this job.',
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Job retrieved successfully.',
            'data' => new JobResource($job),
        ]);
    }

    /**
     * Update the specified job.
     */
    public function update(UpdateJobRequest $request, Job $job): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can update jobs.',
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

        if ($job->company_id !== $company->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to update this job.',
            ], 403);
        }

        $slug = $job->slug;

        if ($job->title !== $request->title) {
            $slug = Str::slug($request->title) . '-' . strtolower(Str::random(6));
        }

        $job->update([
            'city_id' => $request->city_id,
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
            'responsibilities' => $request->responsibilities,
            'requirements' => $request->requirements,
            'benefits' => $request->benefits,
            'employment_type' => $request->employment_type,
            'workplace_type' => $request->workplace_type,
            'experience_level' => $request->experience_level,
            'salary_min' => $request->salary_min,
            'salary_max' => $request->salary_max,
            'salary_currency' => $request->salary_currency ?? 'BDT',
            'vacancies' => $request->vacancies ?? 1,
            'application_deadline' => $request->application_deadline,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Job updated successfully.',
            'data' => new JobResource($job->fresh()),
        ]);
    }

    /**
     * Close the specified job.
     */
    public function close(Job $job): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can close jobs.',
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

        if ($job->company_id !== $company->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to close this job.',
            ], 403);
        }

        if ($job->status === 'closed') {
            return response()->json([
                'status' => 'error',
                'message' => 'Job is already closed.',
            ], 422);
        }

        $job->update([
            'status' => 'closed',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Job closed successfully.',
            'data' => new JobResource($job->fresh()),
        ]);
    }
}
