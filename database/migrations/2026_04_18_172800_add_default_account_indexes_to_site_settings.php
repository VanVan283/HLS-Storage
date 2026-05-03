<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'r2_default_account_index')) {
                $table->integer('r2_default_account_index')->default(0)->after('r2_fallback_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'gdrive_default_account_index')) {
                $table->integer('gdrive_default_account_index')->default(0)->after('gdrive_fallback_enabled');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'r2_default_account_index')) {
                $table->dropColumn('r2_default_account_index');
            }
            if (Schema::hasColumn('site_settings', 'gdrive_default_account_index')) {
                $table->dropColumn('gdrive_default_account_index');
            }
        });
    }
};
