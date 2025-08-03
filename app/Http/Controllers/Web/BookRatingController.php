<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookRatingController extends Controller
{
    public function showLandingPage()
    {
        return Inertia::render('Guest/Book');
    }
}
