<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use App\Mail\VerifikasiEmail;

class RegistrasiController extends Controller
{
    /**
     * Handle registrasi user baru
     */
    public function Register(Request $request)
    {
        $request->validate([
            'nama'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'foto'     => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $fotoPath = $this->uploadFoto($request->file('foto'));

        $user = User::create([
            'nama'     => $request->nama,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'foto'     => $fotoPath,
        ]);

        $url = URL::temporarySignedRoute(
            'verify.email',
            now()->addMinutes(60),
            ['id' => $user->id]
        );

        Mail::to($user->email)->send(new VerifikasiEmail($url));

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan cek email untuk verifikasi.',
            'user'    => [
                'id'    => $user->id,
                'nama'  => $user->nama,
                'email' => $user->email,
                'foto'  => asset($user->foto),
            ]
        ], 201);
    }


    private function uploadFoto($file): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;

        $destinationPath = public_path('fileupload/foto');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        $file->move($destinationPath, $filename);

        return 'fileupload/foto/' . $filename;
    }

    private function deleteFoto(string $relativePath): bool
    {
        $fullPath = public_path($relativePath);
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        return false;
    }
}
