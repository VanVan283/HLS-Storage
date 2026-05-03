<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'admin_username')) {
                $table->string('admin_username', 120)->nullable()->after('license_last_check_at');
            }
            if (!Schema::hasColumn('site_settings', 'admin_password_hash')) {
                $table->text('admin_password_hash')->nullable()->after('admin_username');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach (['admin_password_hash', 'admin_username'] as $col) {
                if (Schema::hasColumn('site_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
