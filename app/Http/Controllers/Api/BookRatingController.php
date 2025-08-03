<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\BookRating;

class BookRatingController extends Controller
{
    public function rateBuku(Request $request, $bookId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5'
        ]);

        $book = Book::findOrFail($bookId);
        $ip = $request->ip();

        $rating = BookRating::updateOrCreate(
            [
                'book_id' => $book->id,
                'ip_address' => $ip
            ],
            [
                'rating' => $request->rating
            ]
        );

        return response()->json([
            'pesan' => 'Rating berhasil disimpan.',
            'rating' => $rating
        ]);
    }

    public function listBukuPublik(Request $request)
    {
        $query = Book::withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->with('user:id,nama,foto')
            ->latest();

        if ($request->has('author')) {
            $query->where('author', 'like', '%' . $request->author . '%');
        }

        if ($request->has('date')) {
            $query->whereDate('created_at', $request->date);
        }

        if ($request->has('min_rating')) {
            $query->having('ratings_avg_rating', '>=', $request->min_rating);
        }

        $books = $query->paginate(10);

        $books->getCollection()->transform(function ($b) {
            return [
                'id' => $b->id,
                'title' => $b->title,
                'author' => $b->author,
                'description' => $b->description,
                'thumbnail' => asset($b->thumbnail),
                'user' => [
                    'id' => $b->user->id,
                    'nama' => $b->user->nama,
                    'foto' => asset($b->user->foto),
                ],
                'jumlah_rating' => $b->ratings_count,
                'rata_rata_rating' => round($b->ratings_avg_rating, 2),
                'dibuat' => $b->created_at->format('Y-m-d'),
            ];
        });

        return response()->json($books);
    }

}
