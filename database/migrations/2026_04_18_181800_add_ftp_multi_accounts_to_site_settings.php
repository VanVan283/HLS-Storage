<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'ftp_accounts_json')) {
                $table->longText('ftp_accounts_json')->nullable()->after('ftp_path');
            }
            if (!Schema::hasColumn('site_settings', 'ftp_multi_enabled')) {
                $table->boolean('ftp_multi_enabled')->default(false)->after('ftp_accounts_json');
            }
            if (!Schema::hasColumn('site_settings', 'ftp_round_robin_enabled')) {
                $table->boolean('ftp_round_robin_enabled')->default(true)->after('ftp_multi_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'ftp_fallback_enabled')) {
                $table->boolean('ftp_fallback_enabled')->default(true)->after('ftp_round_robin_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'ftp_default_account_index')) {
                $table->integer('ftp_default_account_index')->default(0)->after('ftp_fallback_enabled');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach ([
                'ftp_accounts_json',
                'ftp_multi_enabled',
                'ftp_round_robin_enabled',
                'ftp_fallback_enabled',
                'ftp_default_account_index',
            ] as $col) {
                if (Schema::hasColumn('site_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
