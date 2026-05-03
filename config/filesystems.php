<?php

return [
    'default' => env('STORAGE_DRIVER', 'local'),

    'disks' => [
        'r2' => [
            'driver' => 's3',
            'key' => env('R2_KEY'),
            'secret' => env('R2_SECRET'),
            'endpoint' => env('R2_ENDPOINT'),
            'region' => 'auto',
            'bucket' => env('R2_BUCKET'),
            'use_path_style_endpoint' => true,
        ],
    ],
];
