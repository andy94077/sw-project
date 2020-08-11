<?php

namespace App\Listeners;

use App\Events\AdPosted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AdPost
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
     * @param  AdPosted  $event
     * @return void
     */
    public function handle(AdPosted $event)
    {
        //
    }
}
