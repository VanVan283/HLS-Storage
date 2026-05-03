<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'embed_custom_html')) {
                $table->longText('embed_custom_html')->nullable()->after('embed_vmap_url');
            }
            if (!Schema::hasColumn('site_settings', 'embed_custom_css')) {
                $table->longText('embed_custom_css')->nullable()->after('embed_custom_html');
            }
            if (!Schema::hasColumn('site_settings', 'embed_custom_js')) {
                $table->longText('embed_custom_js')->nullable()->after('embed_custom_css');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'embed_custom_js')) {
                $table->dropColumn('embed_custom_js');
            }
            if (Schema::hasColumn('site_settings', 'embed_custom_css')) {
                $table->dropColumn('embed_custom_css');
            }
            if (Schema::hasColumn('site_settings', 'embed_custom_html')) {
                $table->dropColumn('embed_custom_html');
            }
        });
    }
};
