<?php

use Illuminate\Database\Seeder;
use App\Models\Like;

class LikeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for($i = 1; $i <= 12; $i ++){
            for($j = 0; $j <= $i; $j ++){
                $like = new Like();
                $like->post_id = $i;
                $like->user_id = $i + $j;
                $like->save();
            }
        }
        //
    }
}
