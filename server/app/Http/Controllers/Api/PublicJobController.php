<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicJobResource;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicJobController extends Controller
{
    /**
     * Display a listing of published jobs.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Job::with([
            'company.industry',
            'company.city',
            'city',
        ])
            ->where('status', 'published');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('employment_type')) {
            $query->where('employment_type', $request->employment_type);
        }

        if ($request->filled('workplace_type')) {
            $query->where('workplace_type', $request->workplace_type);
        }

        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        switch ($request->get('sort', 'latest')) {
            case 'oldest':
                $query->oldest('published_at');
                break;

            case 'latest':
            default:
                $query->latest('published_at');
                break;
        }

        $jobs = $query
            ->paginate(10)
            ->withQueryString();

        return response()->json([
            'status' => 'success',
            'message' => 'Published jobs retrieved successfully.',
            'data' => PublicJobResource::collection($jobs),
            'meta' => [
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'per_page' => $jobs->perPage(),
                'total' => $jobs->total(),
            ],
        ]);
    }

    /**
     * Display the specified published job.
     */
    public function show(string $slug): JsonResponse
    {
        $job = Job::with([
            'company.industry',
            'company.city',
            'city',
        ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (! $job) {
            return response()->json([
                'status' => 'error',
                'message' => 'Job not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Job retrieved successfully.',
            'data' => new PublicJobResource($job),
        ]);
    }
}
