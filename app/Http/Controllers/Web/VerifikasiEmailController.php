<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class VerifikasiEmailController extends Controller
{
    public function Verify(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->email_verified_at) {
            return redirect('/login');
        }

        $user->email_verified_at = now();
        $user->save();

        return redirect('/login');
    }
}
