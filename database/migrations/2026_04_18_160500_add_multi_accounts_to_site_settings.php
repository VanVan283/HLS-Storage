<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'r2_accounts_json')) {
                $table->longText('r2_accounts_json')->nullable()->after('r2_endpoint');
            }
            if (!Schema::hasColumn('site_settings', 'gdrive_accounts_json')) {
                $table->longText('gdrive_accounts_json')->nullable()->after('gdrive_mode');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'r2_accounts_json')) {
                $table->dropColumn('r2_accounts_json');
            }
            if (Schema::hasColumn('site_settings', 'gdrive_accounts_json')) {
                $table->dropColumn('gdrive_accounts_json');
            }
        });
    }
};
