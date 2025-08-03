<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Book extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'title',
        'author',
        'description',
        'thumbnail',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($book) {
            if (empty($book->id)) {
                $prefix = 'BOOK-' . now()->format('Ymd');
                $random = strtoupper(Str::random(4));
                $book->id = $prefix . '-' . $random;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ratings()
    {
        return $this->hasMany(\App\Models\BookRating::class, 'book_id');
    }

}
