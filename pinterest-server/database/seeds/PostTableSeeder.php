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
                    'user_id' => $i,
                    //'post_id'=>$i,
                    'url'=>"images/{$i}.jpg",
                    'content'=>"This is no.{$i} post",
                    //'status'=>1,
                    'tag'=>'cat',
                    'publish_time' => date('Y-m-d H:i:s'),
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')

                ]
            );
        }
    }
}
