<?php

namespace App\Listeners;

use App\Events\NotificationChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotificationChange
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
     * @param  NotificationChanged  $event
     * @return void
     */
    public function handle(NotificationChanged $event)
    {
        //
    }
}
