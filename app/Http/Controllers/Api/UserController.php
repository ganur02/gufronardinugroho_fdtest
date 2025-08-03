<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function getUsers(Request $request)
    {
        $users = User::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('nama', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->filled('verified'), function ($query) use ($request) {
                $request->verified == '1'
                    ? $query->whereNotNull('email_verified_at')
                    : $query->whereNull('email_verified_at');
            })
            ->select('id', 'nama', 'email', 'email_verified_at')
            ->orderBy('nama')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }
}
