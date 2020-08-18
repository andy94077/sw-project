<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChatroomsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i <= 10; $i++) {
            for ($j = $i + 1; $j <= $i + 2; $j++) {
                DB::table('chatrooms')->insert(
                    [
                        'user_id1' => $i + 1,
                        'user_id2' => $j + 1,
                        'username1' => "user{$i}",
                        'username2' => "user{$j}",
                        'last_message' => "Hi!",
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ]
                );
            }
        }
    }
}
