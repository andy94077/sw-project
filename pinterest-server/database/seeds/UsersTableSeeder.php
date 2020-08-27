<?php

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert(
            [
                'name' => "admin",
                'email' => "admin@funpodium.net",
                'password' => Hash::make("admin"),
                'avatar_url' => "/img/avatar.jpeg",
                'created_at' => date("Y-m-d H:i:s"),
                'api_token' => hash('sha256', 'admin'),
                'intro' => '<p>hi</p>',
            ]
        );
        for ($i = 1; $i <= 100; $i++) {
            DB::table('users')->insert(
                [
                    'name' => "user{$i}",
                    'email' => "cms{$i}@funpodium.net",
                    'password' => Hash::make("user{$i}"),
                    'avatar_url' => "/img/avatar".($i%5).".jpeg",
                    'created_at' => date("Y-m-d H:i:s"),
                    'api_token' => hash('sha256', Str::random(80)),
                    'intro' => "<p>Hi I am user${i}</p>",
                    'followers' => max(40 - $i, 0), // cooperate with FollowTableSeeder
                    'followings' => $i < 40 ? $i - 1 : 0,
                ]
            );
        }

        if (env('APP_ENV') == 'stage') {
            DB::table('users')->insert([
                'name' => 'xxx',
                'email' => 'xxx@funpodium.net',
                'password' => Hash::make('asdf1234'),
                'roles' => '1',
                'created_at' => date("Y-m-d H:i:s"),
                'user_id' => '2',
                // 'api_token' => Str::random(80),
            ]);
        }
    }
}
