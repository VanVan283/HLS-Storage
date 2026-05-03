<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'ttb_accounts_json')) {
                $table->longText('ttb_accounts_json')->nullable()->after('gdrive_mode_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'ttb_multi_enabled')) {
                $table->boolean('ttb_multi_enabled')->default(false)->after('ttb_accounts_json');
            }
            if (!Schema::hasColumn('site_settings', 'ttb_round_robin_enabled')) {
                $table->boolean('ttb_round_robin_enabled')->default(true)->after('ttb_multi_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'ttb_fallback_enabled')) {
                $table->boolean('ttb_fallback_enabled')->default(true)->after('ttb_round_robin_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'ttb_default_account_index')) {
                $table->integer('ttb_default_account_index')->default(0)->after('ttb_fallback_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'ttb_mode_enabled')) {
                $table->boolean('ttb_mode_enabled')->default(false)->after('ttb_default_account_index');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach ([
                'ttb_accounts_json',
                'ttb_multi_enabled',
                'ttb_round_robin_enabled',
                'ttb_fallback_enabled',
                'ttb_default_account_index',
                'ttb_mode_enabled',
            ] as $col) {
                if (Schema::hasColumn('site_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
