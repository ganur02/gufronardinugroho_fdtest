<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'nama',
        'email',
        'password',
        'foto',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->id)) {
                $date = now()->format('Ymd'); 
                $namaSlug = Str::slug($user->nama, ''); 
                $uuid = str_replace('-', '', Str::uuid()->toString()); 

                $user->id = $date . '-' . $namaSlug . '-' . $uuid;
            }

            if (!empty($user->nama)) {
                $user->nama = Str::title($user->nama);
            }
        });
    }
}
