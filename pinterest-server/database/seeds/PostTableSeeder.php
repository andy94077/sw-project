<?php

use Illuminate\Support\Arr;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 1; $i <= 12; $i++) {
            DB::table('posts')->insert(
                [
                    'url' => '/uploads/image/' . $i . '/original/' . $i . '.jpg',
                    'user_id' => $i % 4 + 2,
                    'username' => 'user' . ($i % 4 + 1),
                    'content' => '<h>hello world</h>',
                    'tag' => $i >= 8 ? 'dog' : 'cat',
                    //'like' => $i + 1,
                    'publish_time' => date('Y-m-d H:i:s'),
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')

                ]
            );
        }
    }
}
