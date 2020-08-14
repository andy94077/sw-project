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
        'App\Events\AdPosted' => [
            'App\Listeners\AdPost',
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
