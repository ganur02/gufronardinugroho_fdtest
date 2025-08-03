<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookRating extends Model
{
    use HasFactory;

    protected $fillable = ['book_id', 'ip_address', 'rating'];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
