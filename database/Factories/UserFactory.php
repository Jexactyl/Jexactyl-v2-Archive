<?php

namespace Database\Factories;

use Carbon\Carbon;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Str;
use Pterodactyl\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        static $password;

        return [
            'external_id' => null,
            'uuid' => Uuid::uuid4()->toString(),
            'username' => $this->faker->unique()->userName,
            'email' => Str::random(32) . '@example.com',
            'name_first' => $this->faker->firstName,
            'name_last' => $this->faker->lastName,
            'password' => $password ?: $password = bcrypt('password'),
            'language' => 'en',
            'root_admin' => false,
            'use_totp' => false,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'root_admin' => true,
            ];
        });
    }
}
