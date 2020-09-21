<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChatroomsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('chatrooms')->insert(
            [
                'user_id1' => 2,
                'user_id2' => 3,
                'room_id' => 1,
                'last_message' => "Hi 75 !",
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        );
        DB::table('chatrooms')->insert(
            [
                'user_id1' => 3,
                'user_id2' => 2,
                'room_id' => 1,
                'last_message' => "Hi 75 !",
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        );
        Schema::create('chat_1', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('from');
            $table->unsignedBigInteger('to');
            $table->string('type');
            $table->string('message');
            $table->timestamps();
        });
        for ($i = 1; $i <= 75; $i++) {
            DB::table('chat_1')->insert(
                [
                    'from' => 2 + $i % 2,
                    'to' => 3 - $i % 2,
                    'type' => "text",
                    'message' => "Hi " . $i . " !",
                    'created_at' => date_sub(date_create(date('Y-m-d H:i:s')), date_interval_create_from_date_string(floor((76 - $i) / 20) . " day " . (76 - $i) . " minutes")),
                    'updated_at' => date_sub(date_create(date('Y-m-d H:i:s')), date_interval_create_from_date_string(floor((76 - $i) / 20) . " day " . (76 - $i) . " minutes"))
                ]
            );
        }
    }
}
