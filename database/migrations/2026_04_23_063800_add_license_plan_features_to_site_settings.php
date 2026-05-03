<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'license_plan')) {
                $table->string('license_plan', 40)->nullable()->after('license_status');
            }
            if (!Schema::hasColumn('site_settings', 'license_features_json')) {
                $table->longText('license_features_json')->nullable()->after('license_plan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'license_features_json')) {
                $table->dropColumn('license_features_json');
            }
            if (Schema::hasColumn('site_settings', 'license_plan')) {
                $table->dropColumn('license_plan');
            }
        });
    }
};
