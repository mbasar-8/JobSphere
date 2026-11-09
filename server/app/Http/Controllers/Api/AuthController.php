<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Models\User;
use App\Models\Otp;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Auth\LoginRequest;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = DB::transaction(function () use ($request) {

            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'status' => 'pending',
            ]);

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
            'message' => 'Registration successful.',
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

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->status === 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Email already verified.',
            ], 422);
        }

        $otp = $user->otps()
            ->where('purpose', 'email_verification')
            ->latest()
            ->first();

        if (!$otp) {
            return response()->json([
                'status' => 'error',
                'message' => 'OTP not found.',
            ], 404);
        }

        // Expiry check
        if ($otp->expires_at->isPast()) {
            $otp->delete();

            return response()->json([
                'status' => 'error',
                'message' => 'OTP has expired.',
            ], 422);
        }

        // Attempt limit
        if ($otp->attempts >= 5) {
            $otp->delete();

            return response()->json([
                'status' => 'error',
                'message' => 'Maximum OTP attempts exceeded.',
            ], 429);
        }

        // Verify OTP
        if (!Hash::check($request->otp, $otp->otp_hash)) {
            $otp->increment('attempts');

            return response()->json([
                'status' => 'error',
                'message' => 'Invalid OTP.',
            ], 422);
        }

        // Activate user
        $user->update([
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Delete OTP
        $otp->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Email verified successfully.',
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials.',
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Please verify your email first.',
            ], 403);
        }

        if (! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials.',
            ], 401);
        }

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
        $requestUser = auth()->user();

        $requestUser->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout successful.',
        ]);
    }

    public function user(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
