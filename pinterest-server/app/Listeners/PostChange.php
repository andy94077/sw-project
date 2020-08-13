<?php

namespace App\Listeners;

use App\Events\PostChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class PostChange
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  PostChanged  $event
     * @return void
     */
    public function handle(PostChanged $event)
    {
        //
    }
}
