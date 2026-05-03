<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'ffmpeg_preset')) {
                $table->string('ffmpeg_preset', 40)->nullable()->after('embed_strict_mode');
            }
            if (!Schema::hasColumn('site_settings', 'ffmpeg_fps')) {
                $table->integer('ffmpeg_fps')->nullable()->after('ffmpeg_preset');
            }
            if (!Schema::hasColumn('site_settings', 'hls_segment_duration')) {
                $table->integer('hls_segment_duration')->nullable()->after('ffmpeg_fps');
            }
            if (!Schema::hasColumn('site_settings', 'ffmpeg_scale_pad_enabled')) {
                $table->boolean('ffmpeg_scale_pad_enabled')->default(true)->after('hls_segment_duration');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach (['ffmpeg_preset','ffmpeg_fps','hls_segment_duration','ffmpeg_scale_pad_enabled'] as $col) {
                if (Schema::hasColumn('site_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
