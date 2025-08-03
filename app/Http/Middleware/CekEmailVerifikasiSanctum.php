<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CekEmailVerifikasiSanctum
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && is_null($user->email_verified_at)) {
            return response()->json([
                'message' => 'Email Anda belum diverifikasi.',
            ], 403);
        }

        return $next($request);
    }
}
