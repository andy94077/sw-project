<?php

namespace App\Listeners;

use App\Events\UserChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UserChange
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
     * @param  UserChanged  $event
     * @return void
     */
    public function handle(UserChanged $event)
    {
        //
    }
}
