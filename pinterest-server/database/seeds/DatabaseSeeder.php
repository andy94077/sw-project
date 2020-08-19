<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $this->call([
            UsersTableSeeder::class,
            ImagesTableSeeder::class,
            PostTableSeeder::class,
            CommentsTableSeeder::class,
            PermissionsTableSeeder::class,
            SuperUsersTableSeeder::class,
            NotificationsTableSeeder::class,
            LikeTableSeeder::class,
        ]);
    }
}
