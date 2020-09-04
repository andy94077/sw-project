<?php

namespace App\Listeners;

use App\Events\ChatRead;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ChatIsRead
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
     * @param  ChatRead  $event
     * @return void
     */
    public function handle(ChatRead $event)
    {
        //
    }
}
