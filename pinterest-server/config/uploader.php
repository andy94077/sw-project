<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Upload images setting
    |-------------------------------------------------------------------------- 
    */
    'image' => [
        'upload_dir' => 'uploads', // upload basepath : /public/uploads
        'default_image' => 'demo.jpg',
        'versions' => [
            'desktop' => [1200, 600],
            'thumb' => [305, 168],
            'mobile' => [690, 380]
        ]
    ],
    /*
    |--------------------------------------------------------------------------
    | Upload files setting
    |-------------------------------------------------------------------------- 
    */
    'file' => [
        'upload_dir' => 'uploads',  // upload basepath : /storage/app/uploads 
        'resume' => [
            'format' => ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
            'size' => '2097152',
            'length' => '1'
        ],

    ],
    'attachment' => [
        'upload_dir' => 'upload_temp',  // upload basepath : /storage/app/uploads 
        'format' => ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
        'size' => '2097152',
    ]
];
