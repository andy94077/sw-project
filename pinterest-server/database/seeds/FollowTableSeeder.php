<?php

use Illuminate\Database\Seeder;
use App\Models\Follow;

class FollowTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for($i = 2; $i <= 40; $i ++){
            for($j = 40; $j > $i; $j --){
                $like = new Follow();
                $like->target_id = $i;
                $like->follower_id = $j;
                $like->save();
            }
        }
        //
    }
}