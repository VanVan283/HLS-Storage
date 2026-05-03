<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Storage\StorageFactory;
use App\Services\Downloaders\FileDownloader;
use App\Services\Downloaders\GoogleDriveDownloader;
use App\Services\Downloaders\YtDlpDownloader;
use App\Services\HLS\HLSConverter;
use App\Services\VideoProcessor;
use App\Services\VideoImporter;

class StorageServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(StorageFactory::class);
        $this->app->singleton(FileDownloader::class);
        $this->app->singleton(GoogleDriveDownloader::class);
        $this->app->singleton(YtDlpDownloader::class);
        $this->app->singleton(HLSConverter::class);
        $this->app->singleton(VideoProcessor::class);
        $this->app->singleton(VideoImporter::class);
    }
}
