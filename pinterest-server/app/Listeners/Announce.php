<?php

namespace App\Listeners;

use App\Events\Announced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class Announce
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
     * @param  Announced  $event
     * @return void
     */
    public function handle(Announced $event)
    {
        //
    }
}
