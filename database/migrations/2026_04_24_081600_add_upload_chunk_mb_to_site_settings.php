<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('site_settings', 'upload_chunk_mb')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->unsignedSmallInteger('upload_chunk_mb')->nullable()->after('upload_api_base');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('site_settings', 'upload_chunk_mb')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->dropColumn('upload_chunk_mb');
            });
        }
    }
};
