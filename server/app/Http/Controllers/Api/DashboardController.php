<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\DashboardCandidateApplicationResource;
use App\Http\Resources\DashboardRecruiterApplicationResource;

class DashboardController extends Controller
{
    /**
     * Display dashboard data.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();

        if ($user->role === 'candidate') {
            return $this->candidateDashboard($user);
        }

        if ($user->role === 'recruiter') {
            return $this->recruiterDashboard($user);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized.',
        ], 403);
    }

    /**
     * Candidate dashboard.
     */
    private function candidateDashboard($user): JsonResponse
    {
        $candidate = $user->candidateProfile;

        if (! $candidate) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'role' => 'candidate',
                    'profile_completed' => false,
                    'saved_jobs' => 0,
                    'total_applications' => 0,
                    'pending_applications' => 0,
                    'recent_applications' => [],
                ],
            ]);
        }

        $recentApplications = Application::with([
            'job.company',
        ])
            ->where('candidate_id', $candidate->id)
            ->latest()
            ->take(5)
            ->get();
        return response()->json([
            'status' => 'success',
            'data' => [
                'role' => 'candidate',
                'profile_completed' => true,

                'saved_jobs' => $candidate->savedJobs()->count(),

                'total_applications' => Application::where(
                    'candidate_id',
                    $candidate->id
                )->count(),

                'pending_applications' => Application::where(
                    'candidate_id',
                    $candidate->id
                )
                    ->where('status', 'pending')
                    ->count(),

                'recent_applications' =>
                DashboardCandidateApplicationResource::collection($recentApplications),
            ],
        ]);
    }

    /**
     * Recruiter dashboard.
     */
    private function recruiterDashboard($user): JsonResponse
    {
        $recruiter = $user->recruiterProfile;

        if (! $recruiter || ! $recruiter->company) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'role' => 'recruiter',
                    'company_created' => false,
                    'total_jobs' => 0,
                    'published_jobs' => 0,
                    'closed_jobs' => 0,
                    'total_applications' => 0,
                    'recent_applications' => [],
                ],
            ]);
        }

        $company = $recruiter->company;

        $jobs = Job::where('company_id', $company->id);

        $recentApplications = Application::with([
            'candidate',
            'job',
        ])
            ->whereHas('job', function ($query) use ($company) {
                $query->where('company_id', $company->id);
            })
            ->latest()
            ->take(5)
            ->get();
        return response()->json([
            'status' => 'success',
            'data' => [
                'role' => 'recruiter',

                'company_created' => true,

                'total_jobs' => $jobs->count(),

                'published_jobs' => (clone $jobs)
                    ->where('status', 'published')
                    ->count(),

                'closed_jobs' => (clone $jobs)
                    ->where('status', 'closed')
                    ->count(),

                'total_applications' => Application::whereHas(
                    'job',
                    function ($query) use ($company) {
                        $query->where('company_id', $company->id);
                    }
                )->count(),

                'recent_applications' =>
                DashboardRecruiterApplicationResource::collection($recentApplications),
            ],
        ]);
    }
}
