<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'embed_watermark_rules_json')) {
                $table->longText('embed_watermark_rules_json')->nullable()->after('embed_strict_mode');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'embed_watermark_rules_json')) {
                $table->dropColumn('embed_watermark_rules_json');
            }
        });
    }
};
