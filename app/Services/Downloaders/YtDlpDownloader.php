<?php

namespace App\Services\Downloaders;

class YtDlpDownloader
{
    public function download($url)
    {
        $destFolder = storage_path('app/temp');

        if (!is_dir($destFolder)) {
            mkdir($destFolder, 0755, true);
        }

        $outputPattern = $destFolder . '/%(title)s.%(ext)s';
        $cmd = "yt-dlp --no-playlist -f best --restrict-filenames --output " .
            escapeshellarg($outputPattern) . " " . escapeshellarg($url) . " 2>&1";

        $before = scandir($destFolder);
        shell_exec($cmd);
        $after = scandir($destFolder);
        $newFiles = array_diff($after, $before);

        $file = '';
        $latestTime = 0;

        foreach ($newFiles as $f) {
            $path = $destFolder . '/' . $f;
            if (is_file($path) && filemtime($path) > $latestTime) {
                $file = $path;
                $latestTime = filemtime($path);
            }
        }

        return $file && filesize($file) > 100 * 1024 ? $file : false;
    }
}
