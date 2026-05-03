<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'embed_hlsjs_config_json')) {
                $table->text('embed_hlsjs_config_json')->nullable()->after('embed_custom_js');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'embed_hlsjs_config_json')) {
                $table->dropColumn('embed_hlsjs_config_json');
            }
        });
    }
};
