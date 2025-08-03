<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RegistasiController extends Controller
{
    public function showRegisterForm()
    {
        return Inertia::render('Guest/Register');
    }
}
