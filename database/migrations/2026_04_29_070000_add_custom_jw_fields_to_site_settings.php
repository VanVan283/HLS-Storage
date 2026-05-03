<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCustomJwFieldsToSiteSettings extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'embed_jw_library_url')) {
                $table->text('embed_jw_library_url')->nullable()->after('embed_custom_js');
            }
            if (!Schema::hasColumn('site_settings', 'embed_jw_plugin_urls')) {
                $table->text('embed_jw_plugin_urls')->nullable()->after('embed_jw_library_url');
            }
            if (!Schema::hasColumn('site_settings', 'embed_jw_setup_json')) {
                $table->text('embed_jw_setup_json')->nullable()->after('embed_jw_plugin_urls');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach (['embed_jw_library_url','embed_jw_plugin_urls','embed_jw_setup_json'] as $c) {
                if (Schema::hasColumn('site_settings', $c)) {
                    $table->dropColumn($c);
                }
            }
        });
    }
}
