<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Pagination : how many element per page
    |--------------------------------------------------------------------------
    */

    'elements_per_page' => [
        'post' => 9,
        'relate_post' => 3
    ],
    'mailto' => [
        'address' => env('MAIL_TO_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_TO_NAME', 'Example'),
    ],
    'ga_url' => env('GA_URL', 'https://www.google.com'),
    'ga_code' => env('GA_CODE', '')

];
