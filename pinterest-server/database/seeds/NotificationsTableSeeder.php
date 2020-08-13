<?php

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class NotificationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i <= 3; $i++) {
            DB::table('notifications')->insert(
                [
                    'group' => "public",
                    'header' => "Announcement {$i}",
                    'secondary' => "Sender {$i}",
                    'content' => "This is announcement {$i}.",
                    'created_at' => date("Y-m-d H:i:s"),
                ]
            );
        }
        
        for ($i = 1; $i <= 10; $i++) {
            DB::table('notifications')->insert(
                [
                    'group' => "personal",
                    'user_id' => $i,
                    'header' => "Message {$i}",
                    'secondary' => "Sender {$i}",
                    'content' => "This is message {$i}.",
                    'created_at' => date("Y-m-d H:i:s"),
                ]
            );
        }
    }
}
