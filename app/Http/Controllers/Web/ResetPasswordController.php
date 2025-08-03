<?php

namespace App\Http\Controllers\Web;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ResetPasswordController extends Controller
{
    public function showForgotPasswordForm()
    {
        return Inertia::render('Guest/ForgotPassword');
    }

    // -------------------------------------------------------------------------
    public function showResetForm(Request $request, $id)
    {
        return view('reset-password', ['id' => $id]);
    }

    public function submitReset(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|confirmed|min:6',
        ]);

        $user = User::findOrFail($id);
        $user->password = Hash::make($request->password);
        $user->save();

        return redirect('/login');
    }
}
