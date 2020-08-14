<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SuperUsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('super_users')->insert([
            'name' => "admin",
            'email' => "admin@funpodium.net",
            'password' => Hash::make("admin"),
            'created_at' => date("Y-m-d H:i:s"),
            'api_token' => hash('sha256', Str::random(80)),
        ]);
        for ($i = 1; $i <= 5; $i++) {
            DB::table('super_users')->insert([
                'name' => "user" . $i,
                'email' => "user" . $i . "@funpodium.net",
                'password' => Hash::make("user" . $i . "user" . $i),
                'created_at' => date("Y-m-d H:i:s"),
                'api_token' => hash('sha256', Str::random(80)),
            ]);
        }
    }
}
