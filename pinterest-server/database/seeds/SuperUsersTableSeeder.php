<?php

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\SuperUser;

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
        $admin = SuperUser::find(1);
        $admin->assignRole('admin');

        for ($i = 1; $i <= 5; $i++) {
            DB::table('super_users')->insert([
                'name' => "user" . $i,
                'email' => "user" . $i . "@funpodium.net",
                'password' => Hash::make("user" . $i . "user" . $i),
                'created_at' => date("Y-m-d H:i:s"),
                'api_token' => hash('sha256', Str::random(80)),
            ]);
        }
        $user1 = SuperUser::find(2);
        $user1->assignRole('blocker');

        $user2 = SuperUser::find(3);
        $user2->assignRole('user_manager');

        $user3 = SuperUser::find(4);
        $user3->assignRole('post_manager');

        $user4 = SuperUser::find(5);
        $user4->assignRole('BO_manager');

        $user5 = SuperUser::find(6);
        $user5->assignRole('spokesman');
    }
}
