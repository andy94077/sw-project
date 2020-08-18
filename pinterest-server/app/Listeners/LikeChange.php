<?php

namespace App\Listeners;

use App\Events\LikeChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LikeChange
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
     * @param  LikeChanged  $event
     * @return void
     */
    public function handle(LikeChanged $event)
    {
        //
    }
}
