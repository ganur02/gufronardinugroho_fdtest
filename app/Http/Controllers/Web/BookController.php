<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function showBookPage()
    {
        return Inertia::render('Auth/Book');
    }
}
