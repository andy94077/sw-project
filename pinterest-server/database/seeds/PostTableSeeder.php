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
        for ($i = 1; $i <= 200; $i++) {
            DB::table('posts')->insert(
                [
                    'user_id' => 1,
                    'banner_id' => 0,
                    'slug' => 'ava1_' . $i,
                    'title' => '體育Avalongame ' . $i,
                    'body' => "<div id='lipsum'>
                                <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id justo lorem. Ut posuere rhoncus tellus non volutpat. Vivamus eget metus at mi gravida fermentum at ac sapien. Duis a mauris justo. Nunc lectus justo, venenatis eu dolor sed, tempor blandit lectus. In ut magna mauris. Aliquam at mi id augue dignissim bibendum. Curabitur id faucibus erat. Morbi suscipit, nulla a sagittis lacinia, quam tellus hendrerit enim, quis iaculis ipsum augue rhoncus metus. Nunc porttitor luctus pretium. Maecenas sapien turpis, tristique non libero a, vehicula pellentesque massa. Vivamus faucibus tortor a dapibus volutpat. Morbi vel ipsum feugiat turpis fermentum cursus a et orci. Vivamus nec dolor lorem.
                                </p>
                                 <div><img src='https://loremflickr.com/920/600'></div>
                                <p>
                                Morbi molestie ullamcorper erat, vitae facilisis leo scelerisque malesuada. Proin semper nisi urna, quis molestie lorem condimentum a. Vestibulum lobortis lectus ut ullamcorper finibus. Nam sed rhoncus quam, vel placerat nisl. Sed laoreet dolor purus, ut iaculis nunc blandit sed. Sed lacinia, arcu id laoreet ornare, nibh justo dictum arcu, in finibus risus lacus vitae nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum tincidunt, urna nec fermentum lacinia, lorem sapien ultrices diam, eu dapibus odio lorem non mauris. Fusce lacinia imperdiet velit, et maximus velit venenatis ut. Nulla fringilla urna at nisi tincidunt, ut dictum nisl fringilla. Nam porttitor nisi in leo egestas egestas. Suspendisse in nisi nec nibh porttitor sagittis ac vitae felis. Etiam eu tortor pellentesque, pulvinar elit quis, cursus tortor. Quisque tristique metus eros, ac maximus nibh lobortis a.
                                </p>
                                 <div><img src='https://loremflickr.com/600/600'></div>
                                <p>
                                Donec tristique eros at ante lacinia euismod. Ut imperdiet metus elit, eget porttitor lorem fringilla gravida. Suspendisse in neque ut sapien auctor cursus a nec orci. Maecenas sagittis semper venenatis. Nulla metus justo, hendrerit ac accumsan ac, fringilla vitae dui. Etiam in ante tempus lacus fringilla imperdiet ut in lorem. Aenean viverra neque et ante interdum, et tempus libero imperdiet. Proin et tincidunt erat. Phasellus fringilla accumsan vestibulum. Duis eget mi vel ante consectetur aliquam sed vel ipsum. Morbi eu efficitur magna. Morbi ornare fringilla lacinia. Quisque id consequat nibh, ac interdum sem.
                                </p>
                                <div><img src='https://loremflickr.com/600/240'></div>
                                <div><img src='https://loremflickr.com/1080/720'></div>
                                <p>
                                Pellentesque feugiat dapibus finibus. Proin non tortor at diam posuere convallis. Donec consectetur semper nisi, non dapibus velit dapibus ut. Curabitur feugiat luctus augue. Integer eget lectus ullamcorper, elementum dolor ac, malesuada justo. Morbi efficitur non libero eu elementum. Sed rhoncus efficitur dui sit amet sagittis. Nulla accumsan dignissim lectus ut dapibus. Cras maximus lacus vel euismod sollicitudin.
                                </p>
                                <div><img src='https://loremflickr.com/200/700'></div>
                                <p>
                                Integer fermentum tincidunt elit. Donec dolor quam, varius at nunc in, efficitur finibus mauris. Ut porta et urna non bibendum. Morbi cursus vitae risus ut tincidunt. Praesent at mattis metus, non viverra sem. Sed semper gravida quam, suscipit sagittis leo. Suspendisse id euismod nibh.
                                </p></div>",
                    'status' => Arr::random(['0', '1', '2']),
                    'publish_time' => date('Y-m-d H:i:s'),
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')

                ]
            );
        }
    }
}
