<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BookController extends Controller
{
    public function indexBuku()
    {
        $books = Book::with('ratings')
            ->where('user_id', Auth::id())
            ->get()
            ->map(function ($buku) {
                return [
                    'id' => $buku->id,
                    'title' => $buku->title,
                    'author' => $buku->author,
                    'description' => $buku->description,
                    'thumbnail' => $buku->thumbnail,
                    'tanggal' => $buku->tanggal,
                    'average_rating' => round($buku->ratings->avg('rating'), 2) ?? 0
                ];
            });

        return response()->json([
            'buku' => $books
        ]);
    }

    public function storeBuku(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'author' => 'required|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['title', 'author', 'description']);
        $data['user_id'] = Auth::id();
        $data['tanggal'] = now()->toDateString();

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $this->uploadBukuCover($request->file('thumbnail'));
        }

        $buku = new Book($data);
        $buku->save();

        return response()->json([
            'pesan' => 'Buku berhasil ditambahkan.',
            'buku' => $buku
        ], 201);
    }

    public function showBuku($id)
    {
        $buku = Book::with('ratings')
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return response()->json([
            'buku' => [
                'id' => $buku->id,
                'title' => $buku->title,
                'author' => $buku->author,
                'description' => $buku->description,
                'thumbnail' => $buku->thumbnail,
                'tanggal' => $buku->tanggal,
                'average_rating' => round($buku->ratings->avg('rating'), 2) ?? 0
            ]
        ]);
    }

    public function updateBuku(Request $request, $id)
    {
        $buku = Book::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $request->validate([
            'title' => 'sometimes|required|string',
            'author' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['title', 'author', 'description']);

        if ($request->hasFile('thumbnail')) {
            if ($buku->thumbnail) {
                $this->deleteBukuCover($buku->thumbnail);
            }
            $data['thumbnail'] = $this->uploadBukuCover($request->file('thumbnail'));
        }

        $buku->update($data);

        return response()->json([
            'pesan' => 'Buku berhasil diperbarui.',
            'buku' => $buku
        ]);
    }

    public function destroyBuku($id)
    {
        $buku = Book::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        if ($buku->thumbnail) {
            $this->deleteBukuCover($buku->thumbnail);
        }

        $buku->delete();

        return response()->json([
            'pesan' => 'Buku berhasil dihapus.'
        ]);
    }

    private function uploadBukuCover($file): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;
        $destination = public_path('fileupload/buku');

        if (!file_exists($destination)) {
            mkdir($destination, 0755, true);
        }

        $file->move($destination, $filename);

        return 'fileupload/buku/' . $filename;
    }

    private function deleteBukuCover(string $relativePath): bool
    {
        $fullPath = public_path($relativePath);
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        return false;
    }
}
