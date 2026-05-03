<?php

namespace App\Services\Storage;

use App\Models\SiteSetting;

class LocalStorage implements StorageInterface
{
    protected $basePath;
    protected $destPath;
    protected $accountLabel = 'Local';

    public function __construct()
    {
        $settings = SiteSetting::getSettings();
        $localPath = $settings->local_path ?: env('LOCAL_STORAGE_PATH', 'storage/app/videos-local');

        if (str_starts_with($localPath, '/')) {
            $this->basePath = $localPath;
        } else {
            $this->basePath = base_path($localPath);
        }
        $this->accountLabel = 'Local: ' . $this->basePath;

        if (!is_dir($this->basePath)) {
            mkdir($this->basePath, 0755, true);
        }
    }

    public function upload($localFile, $filename)
    {
        $localDest = $this->basePath . '/' . $filename;
        $idx = 1;
        $ext = pathinfo($filename, PATHINFO_EXTENSION);

        while (file_exists($localDest)) {
            $base = pathinfo($filename, PATHINFO_FILENAME);
            $filename = $base . "($idx)." . $ext;
            $localDest = $this->basePath . '/' . $filename;
            $idx++;
        }

        if (!copy($localFile, $localDest)) {
            throw new \Exception('Không lưu được file vào storage!');
        }

        $this->destPath = $localDest;
        return true;
    }

    public function getPath()
    {
        return $this->destPath;
    }

    public function getMessage()
    {
        return 'OK';
    }

    public function getAccountLabel()
    {
        return $this->accountLabel;
    }
}
