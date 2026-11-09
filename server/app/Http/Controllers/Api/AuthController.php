<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = DB::transaction(function () use ($request) {

            $user = User::create([
                'email' => $request->email,
                'password' => $request->password,
                'role' => $request->role,
                'status' => 'pending_verification',
            ]);

            // Remove previous email verification OTPs
            Otp::where('user_id', $user->id)
                ->where('purpose', 'email_verification')
                ->delete();

            $otp = random_int(100000, 999999);

            Otp::create([
                'user_id' => $user->id,
                'purpose' => 'email_verification',
                'otp_hash' => Hash::make($otp),
                'expires_at' => now()->addMinutes(10),
                'attempts' => 0,
            ]);

            return [
                'user' => $user,
                'otp' => $otp,
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Registration successful. Please verify your email using the OTP.',
            'data' => [
                'user' => [
                    'id' => $result['user']->id,
                    'email' => $result['user']->email,
                    'role' => $result['user']->role,
                    'status' => $result['user']->status,
                ],

                // Development only
                'otp' => $result['otp'],
            ],
        ], 201);
    }

    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->status === 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Email is already verified.',
            ], 422);
        }

        $otp = $user->otps()
            ->where('purpose', 'email_verification')
            ->latest('id')
            ->first();

        if (! $otp) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP not found.',
            ], 404);
        }

        if ($otp->expires_at->isPast()) {

            $otp->delete();

            return response()->json([
                'status' => 'error',
                'message' => 'OTP has expired. Please request a new OTP.',
            ], 422);
        }

        if ($otp->attempts >= 5) {

            $otp->delete();

            return response()->json([
                'status' => 'error',
                'message' => 'Maximum OTP attempts exceeded. Please request a new OTP.',
            ], 429);
        }

        if (! Hash::check($request->otp, $otp->otp_hash)) {

            $otp->increment('attempts');

            return response()->json([
                'status' => 'error',
                'message' => 'Invalid OTP.',
            ], 422);
        }

        DB::transaction(function () use ($user, $otp) {

            $user->update([
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            $otp->delete();
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Email verified successfully.',
        ]);
    }

    public function resendOtp(ResendOtpRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->status === 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Email is already verified.',
            ], 422);
        }

        $otp = DB::transaction(function () use ($user) {

            // Delete previous OTPs
            Otp::where('user_id', $user->id)
                ->where('purpose', 'email_verification')
                ->delete();

            $newOtp = random_int(100000, 999999);

            Otp::create([
                'user_id' => $user->id,
                'purpose' => 'email_verification',
                'otp_hash' => Hash::make($newOtp),
                'expires_at' => now()->addMinutes(10),
                'attempts' => 0,
            ]);

            return $newOtp;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'A new OTP has been sent successfully.',
            'data' => [

                // Development only
                'otp' => $otp,
            ],
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Please verify your email before logging in.',
            ], 403);
        }

        if (! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password.',
            ], 401);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                ],
            ],
        ]);
    }

    public function logout(): JsonResponse
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout successful.',
        ]);
    }

    public function user(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'status' => 'success',
            'message' => 'Authenticated user retrieved successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
            ],
        ]);
    }
}
