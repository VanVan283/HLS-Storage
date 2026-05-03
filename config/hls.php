<?php

return [
    'output_dir' => env('HLS_OUTPUT_DIR', 'storage/app/hls'),
    'segment_duration' => env('HLS_SEGMENT_DURATION', 6),
    'segment_extension' => env('HLS_SEGMENT_EXTENSION', 'chunk'),
];
