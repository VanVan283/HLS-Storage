<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'r2_multi_enabled')) {
                $table->boolean('r2_multi_enabled')->default(false)->after('r2_accounts_json');
            }
            if (!Schema::hasColumn('site_settings', 'r2_round_robin_enabled')) {
                $table->boolean('r2_round_robin_enabled')->default(true)->after('r2_multi_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'r2_fallback_enabled')) {
                $table->boolean('r2_fallback_enabled')->default(true)->after('r2_round_robin_enabled');
            }

            if (!Schema::hasColumn('site_settings', 'gdrive_multi_enabled')) {
                $table->boolean('gdrive_multi_enabled')->default(false)->after('gdrive_accounts_json');
            }
            if (!Schema::hasColumn('site_settings', 'gdrive_round_robin_enabled')) {
                $table->boolean('gdrive_round_robin_enabled')->default(true)->after('gdrive_multi_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'gdrive_fallback_enabled')) {
                $table->boolean('gdrive_fallback_enabled')->default(true)->after('gdrive_round_robin_enabled');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach ([
                'r2_multi_enabled',
                'r2_round_robin_enabled',
                'r2_fallback_enabled',
                'gdrive_multi_enabled',
                'gdrive_round_robin_enabled',
                'gdrive_fallback_enabled',
            ] as $col) {
                if (Schema::hasColumn('site_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
