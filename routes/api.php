<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    RegistrasiController,
    ResetPasswordController,
    LoginController,
    ProfileController,
    HomeController,
    UserController,
    BookController,
    BookRatingController
};

// Rute publik
Route::post('/register', [RegistrasiController::class, 'Register']);
Route::post('/forgot-password', [ResetPasswordController::class, 'sendResetLink']);
Route::post('/login', [LoginController::class, 'Login']);
Route::get('/buku/publik', [BookRatingController::class, 'listBukuPublik']);
Route::post('/buku/{bookId}/rate', [BookRatingController::class, 'rateBuku']);

// Rute dengan autentikasi
Route::middleware(['auth:sanctum', 'verified.api'])->prefix('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'Logout']);
    Route::get('/home', [HomeController::class, 'Home']);
    Route::get('/users', [UserController::class, 'getUsers']);
    
    Route::get('/buku', [BookController::class, 'indexBuku']);
    Route::post('/buku', [BookController::class, 'storeBuku']);
    Route::get('/buku/{id}', [BookController::class, 'showBuku']);
    Route::put('/buku/{id}', [BookController::class, 'updateBuku']);
    Route::delete('/buku/{id}', [BookController::class, 'destroyBuku']);
    
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::post('/profile/update', [ProfileController::class, 'updateProfile']);
    Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
});
