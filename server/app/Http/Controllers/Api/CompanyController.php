<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreCompanyRequest;
use App\Http\Requests\Company\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;


class CompanyController extends Controller
{
    /**
     * Store a newly created company.
     */
    public function store(StoreCompanyRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can create a company.',
            ], 403);
        }

        $recruiterProfile = $user->recruiterProfile;

        if (! $recruiterProfile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please complete your recruiter profile first.',
            ], 422);
        }

        if ($recruiterProfile->company) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already created a company.',
            ], 409);
        }

        $company = Company::create([
            'recruiter_id' => $recruiterProfile->id,
            'industry_id' => $request->industry_id,
            'company_name' => $request->company_name,
            'slug' => Str::slug($request->company_name),
            'logo' => $request->logo,
            'website' => $request->website,
            'email' => $request->email,
            'phone' => $request->phone,
            'description' => $request->description,
            'city_id' => $request->city_id,
            'company_size' => $request->company_size,
        ]);

        $company->load([
            'industry',
            'city',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Company created successfully.',
            'data' => new CompanyResource($company),
        ], 201);
    }

    /**
     * Display the authenticated recruiter's company.
     */
    public function show(): JsonResponse
    {
        $user = request()->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can access this resource.',
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

        $company->load([
            'industry',
            'city',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Company retrieved successfully.',
            'data' => new CompanyResource($company),
        ]);
    }

    /**
     * Update the authenticated recruiter's company.
     */
    public function update(UpdateCompanyRequest $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'recruiter') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only recruiters can update a company.',
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

        $company->update([
            'industry_id' => $request->industry_id,
            'company_name' => $request->company_name,
            'slug' => Str::slug($request->company_name),
            'logo' => $request->logo,
            'website' => $request->website,
            'email' => $request->email,
            'phone' => $request->phone,
            'description' => $request->description,
            'city_id' => $request->city_id,
            'company_size' => $request->company_size,
        ]);

        $company->load([
            'industry',
            'city',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Company updated successfully.',
            'data' => new CompanyResource($company),
        ]);
    }

    public function publicShow(string $slug): JsonResponse
    {
        $company = Company::with([
            'industry',
            'city',
        ])->where('slug', $slug)->first();

        if (! $company) {
            return response()->json([
                'status' => 'error',
                'message' => 'Company not found.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Company retrieved successfully.',
            'data' => new CompanyResource($company),
        ]);
    }
}
