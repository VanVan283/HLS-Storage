<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'title',
        'name',
        'path',
        'storage_mode',
        'storage_account',
        'category',
        'uploaded_files_count',
        'original_storage_json',
        'size',
        'duration',
        'thumbnail',
        'converted',
        'hls_enabled',
        'hls_playlist',
        'hls_type',
        'webViewLink',
        'user_id'
    ];

    protected $casts = [
        'size' => 'integer',
        'duration' => 'float',
        'converted' => 'boolean',
        'hls_enabled' => 'boolean',
        'uploaded_files_count' => 'integer',
        'original_storage_json' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFormattedSizeAttribute()
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getFormattedDurationAttribute()
    {
        $seconds = $this->duration;
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $secs = $seconds % 60;

        return sprintf('%02d:%02d:%02d', $hours, $minutes, $secs);
    }
}
