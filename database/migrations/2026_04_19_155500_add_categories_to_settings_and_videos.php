<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'categories_json')) {
                $table->text('categories_json')->nullable()->after('delete_sync_storage');
            }
        });

        Schema::table('videos', function (Blueprint $table) {
            if (!Schema::hasColumn('videos', 'category')) {
                $table->string('category')->nullable()->after('storage_account');
                $table->index('category');
            }
        });
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            if (Schema::hasColumn('videos', 'category')) {
                $table->dropIndex(['category']);
                $table->dropColumn('category');
            }
        });

        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'categories_json')) {
                $table->dropColumn('categories_json');
            }
        });
    }
};
