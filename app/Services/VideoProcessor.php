<?php

namespace App\Services;

use App\Models\SiteSetting;

class VideoProcessor
{
    public function generateThumbnail($videoPath, $filename)
    {
        $safeBase = preg_replace('/[^A-Za-z0-9]/', '', pathinfo($filename, PATHINFO_FILENAME));
        $thumbDir = storage_path('app/thumbnails');

        if (!is_dir($thumbDir)) {
            mkdir($thumbDir, 0755, true);
        }

        $thumb = $thumbDir . '/' . $safeBase . '.jpg';

        $thumbWidth = 720;
        try {
            $settings = SiteSetting::getSettings();
            $cfg = json_decode((string)($settings->embed_hlsjs_config_json ?? ''), true);
            if (is_array($cfg) && !empty($cfg['thumbnailMaxWidth'])) {
                $thumbWidth = max(240, min(1920, (int)$cfg['thumbnailMaxWidth']));
            }
        } catch (\Throwable $e) {}

        $cmd = sprintf(
            'ffmpeg -y -ss 00:00:03.000 -i %s -vframes 1 -vf "scale=%d:-2:flags=lanczos" -q:v 8 -an %s 2>&1',
            escapeshellarg($videoPath),
            $thumbWidth,
            escapeshellarg($thumb)
        );

        shell_exec($cmd);

        return file_exists($thumb) ? 'thumbnails/' . $safeBase . '.jpg' : null;
    }

    public function getDuration($videoPath)
    {
        $cmd = sprintf(
            'ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 %s 2>&1',
            escapeshellarg($videoPath)
        );

        $duration = shell_exec($cmd);
        return round(floatval($duration), 2);
    }
}
