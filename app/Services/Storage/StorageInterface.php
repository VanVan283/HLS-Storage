<?php

namespace App\Services\Storage;

interface StorageInterface
{
    public function upload($localFile, $filename);
    public function getPath();
    public function getMessage();
}
