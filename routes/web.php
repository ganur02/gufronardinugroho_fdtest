<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\{
    RegistasiController,
    VerifikasiEmailController,
    ResetPasswordController,
    LoginController,
    ProfileController,
    HomeController,
    UserController,
    BookController,
    BookRatingController
};

/*
|--------------------------------------------------------------------------
| Rute Web
|--------------------------------------------------------------------------
|
| Rute web untuk aplikasi kamu, menggunakan middleware "web".
|
*/

// Halaman utama (landing page)
Route::get('/', [BookRatingController::class, 'showLandingPage']);

// Registrasi
Route::get('/register', [RegistasiController::class, 'showRegisterForm']);

// Verifikasi email dengan tanda tangan (signed)
Route::get('/email/verify/{id}', [VerifikasiEmailController::class, 'Verify'])
    ->name('verify.email')
    ->middleware('signed');

// Lupa password
Route::get('/forgot-password', [ResetPasswordController::class, 'showForgotPasswordForm']);

// Reset password dengan tanda tangan (signed)
Route::get('/reset-password/{id}', [ResetPasswordController::class, 'showResetForm'])
    ->middleware('signed')
    ->name('reset.password.form');

Route::post('/reset-password/{id}', [ResetPasswordController::class, 'submitReset']);

// Login
Route::get('/login', [LoginController::class, 'showLoginForm']);

// Rute yang harus login (auth middleware)
Route::middleware(['verified.web'])->group(function () {
    Route::get('/home', [HomeController::class, 'showHomePage']);
    Route::get('/user', [UserController::class, 'showUserPage']);
    Route::get('/buku', [BookController::class, 'showBookPage']);
    Route::get('/profile', [ProfileController::class, 'showProfileForm']);
});
