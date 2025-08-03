<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CekEmailVerifikasi
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();

            if (is_null($user->email_verified_at)) {
                Auth::logout();
                return redirect('/login')->withErrors([
                    'email' => 'Akun Anda belum diverifikasi. Silakan cek email Anda untuk verifikasi.'
                ]);
            }

            return $next($request);
        }

        return redirect('/login');
    }
}
