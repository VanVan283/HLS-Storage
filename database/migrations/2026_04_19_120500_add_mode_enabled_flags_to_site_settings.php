<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'ftp_mode_enabled')) {
                $table->boolean('ftp_mode_enabled')->default(true)->after('ftp_default_account_index');
            }
            if (!Schema::hasColumn('site_settings', 'r2_mode_enabled')) {
                $table->boolean('r2_mode_enabled')->default(true)->after('r2_default_account_index');
            }
            if (!Schema::hasColumn('site_settings', 'b2_mode_enabled')) {
                $table->boolean('b2_mode_enabled')->default(true)->after('b2_default_account_index');
            }
            if (!Schema::hasColumn('site_settings', 'gdrive_mode_enabled')) {
                $table->boolean('gdrive_mode_enabled')->default(true)->after('gdrive_default_account_index');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach (['ftp_mode_enabled','r2_mode_enabled','b2_mode_enabled','gdrive_mode_enabled'] as $col) {
                if (Schema::hasColumn('site_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
