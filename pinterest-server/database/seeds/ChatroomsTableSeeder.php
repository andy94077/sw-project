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
            for ($j = $i + 11; $j <= $i + 12; $j++) {
                DB::table('chatrooms')->insert(
                    [
                        'user_id1' => $i + 1,
                        'user_id2' => $j + 1,
                        'room_id' => $i * 4 - 3 + 2 * ($j - $i - 11),
                        'last_message' => "",
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ]
                );
                DB::table('chatrooms')->insert(
                    [
                        'user_id1' => $j + 1,
                        'user_id2' => $i + 1,
                        'room_id' => $i * 4 - 3 + 2 * ($j - $i - 11),
                        'last_message' => "",
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ]
                );
            }
        }
    }
}
