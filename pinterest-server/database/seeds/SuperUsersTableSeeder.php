<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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
            'avatar_url' => "/img/avatar.jpeg",
            'created_at' => date("Y-m-d H:i:s"),
        ]);
    }
}
