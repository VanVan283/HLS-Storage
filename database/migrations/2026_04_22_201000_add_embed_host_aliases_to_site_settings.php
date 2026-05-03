<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'embed_host_aliases')) {
                $table->text('embed_host_aliases')->nullable()->after('embed_domain_whitelist');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'embed_host_aliases')) {
                $table->dropColumn('embed_host_aliases');
            }
        });
    }
};
