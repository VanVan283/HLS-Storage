<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            if (!Schema::hasColumn('videos', 'storage_mode')) {
                $table->string('storage_mode', 30)->nullable()->after('path');
            }
            if (!Schema::hasColumn('videos', 'storage_account')) {
                $table->string('storage_account', 191)->nullable()->after('storage_mode');
            }
            if (!Schema::hasColumn('videos', 'uploaded_files_count')) {
                $table->integer('uploaded_files_count')->default(1)->after('storage_account');
            }
        });
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            foreach (['storage_mode','storage_account','uploaded_files_count'] as $col) {
                if (Schema::hasColumn('videos', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
