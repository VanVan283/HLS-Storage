<?php

namespace App\Services\Storage;

use App\Models\SiteSetting;

class StorageFactory
{
    public function create($forceMode = null)
    {
        $settings = SiteSetting::getSettings();
        $storageMode = $forceMode ?: ($settings->storage_mode ?? 'local');

        if (in_array($storageMode, ['local','ftp','r2','b2','gdrive','ttb'], true)) {
            $flag = $storageMode . '_mode_enabled';
            if ((bool)($settings->{$flag} ?? true) === false) {
                throw new \Exception('Mode ' . strtoupper($storageMode) . ' đang tắt');
            }
        }

        switch ($storageMode) {
            case 'ftp':
                return new FTPStorage();
            case 'r2':
                return new R2Storage();
            case 'gdrive':
                return new GoogleDriveStorage();
            case 'b2':
                return new B2Storage();
            case 'ttb':
                return new TikTokBusinessStorage();
            default:
                return new LocalStorage();
        }
    }
}
