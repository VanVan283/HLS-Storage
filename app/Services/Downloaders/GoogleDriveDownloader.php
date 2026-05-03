<?php

namespace App\Services\Downloaders;

class GoogleDriveDownloader extends FileDownloader
{
    public function isGoogleDriveUrl($url)
    {
        return preg_match('~drive\.google\.com/file/d/([a-zA-Z0-9_-]+)~', $url) ||
            preg_match('~id=([a-zA-Z0-9_-]+)~', $url);
    }

    public function extractFileId($url)
    {
        if (preg_match('~drive\.google\.com/file/d/([a-zA-Z0-9_-]+)~', $url, $m)) {
            return $m[1];
        }
        if (preg_match('~id=([a-zA-Z0-9_-]+)~', $url, $m)) {
            return $m[1];
        }
        return null;
    }

    public function download($url)
    {
        $fileId = $this->extractFileId($url);
        if (!$fileId) {
            throw new \Exception('Không xác định được file ID Google Drive!');
        }

        $filename = "video_drive_" . date('YmdHis') . ".mp4";
        $tmpFile = sys_get_temp_dir() . '/import_' . uniqid() . '_' . $filename;

        if (!$this->downloadGoogleDriveFile($fileId, $tmpFile)) {
            @unlink($tmpFile);
            throw new \Exception('Không thể tải file từ Google Drive!');
        }

        return $tmpFile;
    }

    private function downloadGoogleDriveFile($fileId, $dest)
    {
        $userAgent = $this->userAgents[array_rand($this->userAgents)];
        $cookieFile = tempnam(sys_get_temp_dir(), 'cookie');
        $url = "https://drive.google.com/uc?export=download&id=$fileId";

        $ch = curl_init($url);
        $fp = fopen($dest, "w");

        curl_setopt_array($ch, [
            CURLOPT_FILE => $fp,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT => $userAgent,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_COOKIEJAR => $cookieFile,
            CURLOPT_COOKIEFILE => $cookieFile,
            CURLOPT_HEADER => 0,
            CURLOPT_TIMEOUT => 600,
        ]);

        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        fclose($fp);
        curl_close($ch);


        // print_r($httpCode);

        // Xử lý xác nhận cho các tệp lớn
        if ($httpCode == 200 && strpos($contentType, 'text/html') !== false) {
            $html = file_get_contents($dest);
            if (preg_match('/confirm=([0-9A-Za-z_]+)&amp;id=/', $html, $m) || preg_match("/name=\"confirm\" value=\"([0-9A-Za-z_]+)\"/", $html, $m)) {
                preg_match("/name=\"uuid\" value=\"(.*?)\"/", $html, $uuid_match);
                $confirm = $m[1];
                $uuid = $uuid_match[1];
                // $downloadUrl = "https://drive.google.com/uc?export=download&confirm=$confirm&id=$fileId";
                // $downloadUrl = "https://drive.google.com/uc?export=download&confirm=$confirm&id=$fileId";
                $downloadUrl = "https://drive.usercontent.google.com/download?id=$fileId&export=download&confirm=$confirm&uuid=$uuid";



                $ch = curl_init($downloadUrl);
                $fp = fopen($dest, "w");
                curl_setopt($ch, CURLOPT_FILE, $fp);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
                curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
                curl_exec($ch);
                fclose($fp);
                curl_close($ch);

                // print_r($downloadUrl);
            } else {
                print_r($html);
            }
        }

        @unlink($cookieFile);
        return file_exists($dest) && filesize($dest) > 100 * 1024;
    }
}
