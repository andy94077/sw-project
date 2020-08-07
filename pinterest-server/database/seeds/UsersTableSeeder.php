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
        for ($i = 1; $i <= 100; $i++) {
            DB::table('users')->insert(
                [
                    'name' => "user{$i}",
                    'email' => "cms{$i}@funpodium.net",
                    'password' => Hash::make("user{$i}"),
                    'avatar_url' => "/img/avatar.jpeg",
                    'created_at' => date("Y-m-d H:i:s"),
                    //'user_id' => $i,
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
