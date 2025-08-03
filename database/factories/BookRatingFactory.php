<?php

namespace Database\Factories;

use App\Models\BookRating;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookRatingFactory extends Factory
{
    protected $model = BookRating::class;

    public function definition(): array
    {
        return [
            'book_id' => \App\Models\Book::factory(),
            'user_id' => \App\Models\User::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
        ];
    }
}
