<?php

namespace App\Services\Downloaders;

class FileDownloader
{
    protected $userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    ];

    public function sanitizeFileName($filename)
    {
        $name = pathinfo($filename, PATHINFO_FILENAME);
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $name = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name);
        $name = preg_replace('/[^A-Za-z0-9]/', '', $name);

        if (!$name) {
            $name = time();
        }

        return $name . '.' . $ext;
    }

    public function downloadFile($url)
    {
        $allowed = ['mp4', 'mkv', 'mov', 'avi', 'webm', 'flv', 'wmv', 'ts', 'mp3', 'wav', 'aac', 'ogg'];
        $ext = strtolower(pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION));

        if (!in_array($ext, $allowed)) {
            throw new \Exception('Định dạng file không hỗ trợ!');
        }

        $safeFilename = $this->sanitizeFileName(basename($url));
        $tmpFile = sys_get_temp_dir() . '/import_' . uniqid() . '_' . $safeFilename;

        $userAgent = $this->userAgents[array_rand($this->userAgents)];
        $ch = curl_init($url);
        $fp = fopen($tmpFile, 'w');

        curl_setopt_array($ch, [
            CURLOPT_FILE => $fp,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 600,
            CURLOPT_CONNECTTIMEOUT => 15,
            CURLOPT_USERAGENT => $userAgent,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
        ]);

        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        fclose($fp);

        if (!$result || $httpCode < 200 || $httpCode >= 400) {
            @unlink($tmpFile);
            throw new \Exception('Lỗi tải file!');
        }

        if (!file_exists($tmpFile) || filesize($tmpFile) < 100 * 1024) {
            @unlink($tmpFile);
            throw new \Exception('File quá nhỏ hoặc tải thất bại!');
        }

        return $tmpFile;
    }

    public function downloadM3U8($url)
    {
        $tmpFile = sys_get_temp_dir() . '/import_' . uniqid() . '.mp4';

        $cmd = "ffmpeg -y -hide_banner -loglevel error -i " . escapeshellarg($url) .
            " -c copy " . escapeshellarg($tmpFile) . " 2>&1";

        shell_exec($cmd);

        if (!file_exists($tmpFile) || filesize($tmpFile) < 100 * 1024) {
            @unlink($tmpFile);
            throw new \Exception('Không thể tải file từ link m3u8!');
        }

        return $tmpFile;
    }
}
