<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('videos', 'storage_account')) return;
        DB::statement("ALTER TABLE videos MODIFY storage_account TEXT NULL");
    }

    public function down(): void
    {
        if (!Schema::hasColumn('videos', 'storage_account')) return;
        DB::statement("ALTER TABLE videos MODIFY storage_account VARCHAR(191) NULL");
    }
};
