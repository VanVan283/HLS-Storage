<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'license_key')) {
                $table->string('license_key', 191)->nullable()->after('embed_player_type');
            }
            if (!Schema::hasColumn('site_settings', 'license_status')) {
                $table->string('license_status', 40)->default('trial')->after('license_key');
            }
            if (!Schema::hasColumn('site_settings', 'license_bound_domain')) {
                $table->string('license_bound_domain', 191)->nullable()->after('license_status');
            }
            if (!Schema::hasColumn('site_settings', 'license_last_check_at')) {
                $table->dateTime('license_last_check_at')->nullable()->after('license_bound_domain');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach (['license_last_check_at','license_bound_domain','license_status','license_key'] as $col) {
                if (Schema::hasColumn('site_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
