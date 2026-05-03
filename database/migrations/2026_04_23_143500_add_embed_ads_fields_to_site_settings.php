<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'embed_vast_url')) {
                $table->text('embed_vast_url')->nullable()->after('embed_player_type');
            }
            if (!Schema::hasColumn('site_settings', 'embed_vmap_url')) {
                $table->text('embed_vmap_url')->nullable()->after('embed_vast_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'embed_vmap_url')) {
                $table->dropColumn('embed_vmap_url');
            }
            if (Schema::hasColumn('site_settings', 'embed_vast_url')) {
                $table->dropColumn('embed_vast_url');
            }
        });
    }
};
