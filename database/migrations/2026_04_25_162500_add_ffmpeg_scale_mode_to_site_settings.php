<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('site_settings', 'ffmpeg_scale_mode')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->string('ffmpeg_scale_mode', 12)->default('pad')->after('ffmpeg_scale_pad_enabled');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('site_settings', 'ffmpeg_scale_mode')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->dropColumn('ffmpeg_scale_mode');
            });
        }
    }
};
