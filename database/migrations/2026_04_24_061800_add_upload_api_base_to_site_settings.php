<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUploadApiBaseToSiteSettings extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'upload_api_base')) {
                $table->string('upload_api_base', 255)->nullable()->after('storage_mode');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'upload_api_base')) {
                $table->dropColumn('upload_api_base');
            }
        });
    }
}
