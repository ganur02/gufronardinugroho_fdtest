<?php

namespace Tests\Unit;

use App\Models\Book;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LaravelApiUnitTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_password_is_hashed_properly()
    {
        $user = User::factory()->create([
            'password' => bcrypt('secret123')
        ]);

        $this->assertTrue(Hash::check('secret123', $user->password));
    }

    /** @test */
    public function can_create_book_instance_correctly()
    {
        $book = Book::factory()->create();

        $this->assertDatabaseHas('books', [
            'title' => $book->title,
            'author' => $book->author,
        ]);
    }

    /** @test */
    public function can_update_book_fields()
    {
        $book = Book::factory()->create();

        $book->update([
            'title' => 'Updated Title',
            'description' => 'Updated Description',
        ]);

        $this->assertEquals('Updated Title', $book->fresh()->title);
        $this->assertEquals('Updated Description', $book->fresh()->description);
    }

    /** @test */
    public function can_delete_book()
    {
        $book = Book::factory()->create();

        $book->delete();

        $this->assertDatabaseMissing('books', [
            'id' => $book->id,
        ]);
    }

    /** @test */
    public function user_can_be_authenticated_with_correct_credentials()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $this->assertTrue(
            auth()->attempt(['email' => 'user@example.com', 'password' => 'secret123'])
        );
    }

    /** @test */
    public function authentication_fails_with_wrong_password()
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $this->assertFalse(
            auth()->attempt(['email' => 'user@example.com', 'password' => 'wrongpass'])
        );
    }
}
