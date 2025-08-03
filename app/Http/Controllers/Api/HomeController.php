<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function Home(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'nama' => $user->nama,
            'email_verified' => $user->email_verified_at !== null,
            'email' => $user->email,
            'created_at' => $user->created_at,
        ]);
    }
}
