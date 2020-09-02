<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $animals = array("Cat", "Dog", "Wolf", "Lion", "Tiger", "Bear", "Panda", "Monkey", "Giraffe", "Dolphin");
        $counts = array(7, 5, 0, 0, 0, 0, 0, 0, 0, 0);

        for ($i = 1; $i <= 10; $i++) {
            DB::table('tags')->insert(
                [
                    'id' => $i,
                    'name' => $animals[$i - 1],
                    'count' => $counts[$i - 1],
                ]
            );
        }
    }
}
