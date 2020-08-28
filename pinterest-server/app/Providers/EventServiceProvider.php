<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        'App\Events\Announced' => [
            'App\Listeners\Announce',
        ],
        'App\Events\ChatSent' => [
            'App\Listeners\ChatSend',
        ],
        'App\Events\PostChanged' => [
            'App\Listeners\PostChange',
        ],
        'App\Events\CommentChanged' => [
            'App\Listeners\CommentChange',
        ],
        'App\Events\NotificationChanged' => [
            'App\Listeners\NotificationChange',
        ],
        'App\Events\LikeChanged' => [
            'App\Listeners\LikeChange',
        ],

    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
