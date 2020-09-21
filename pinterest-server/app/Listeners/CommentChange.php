<?php

namespace App\Listeners;

use App\Events\CommentChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CommentChange
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
     * @param  CommentChanged  $event
     * @return void
     */
    public function handle(CommentChanged $event)
    {
        //
    }
}
