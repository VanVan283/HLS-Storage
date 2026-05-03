<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('site_settings', 'b2_bucket')) {
                $table->string('b2_bucket')->nullable()->after('r2_default_account_index');
            }
            if (!Schema::hasColumn('site_settings', 'b2_key')) {
                $table->string('b2_key')->nullable()->after('b2_bucket');
            }
            if (!Schema::hasColumn('site_settings', 'b2_secret')) {
                $table->string('b2_secret')->nullable()->after('b2_key');
            }
            if (!Schema::hasColumn('site_settings', 'b2_endpoint')) {
                $table->string('b2_endpoint')->nullable()->after('b2_secret');
            }
            if (!Schema::hasColumn('site_settings', 'b2_accounts_json')) {
                $table->longText('b2_accounts_json')->nullable()->after('b2_endpoint');
            }
            if (!Schema::hasColumn('site_settings', 'b2_multi_enabled')) {
                $table->boolean('b2_multi_enabled')->default(false)->after('b2_accounts_json');
            }
            if (!Schema::hasColumn('site_settings', 'b2_round_robin_enabled')) {
                $table->boolean('b2_round_robin_enabled')->default(true)->after('b2_multi_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'b2_fallback_enabled')) {
                $table->boolean('b2_fallback_enabled')->default(true)->after('b2_round_robin_enabled');
            }
            if (!Schema::hasColumn('site_settings', 'b2_default_account_index')) {
                $table->integer('b2_default_account_index')->default(0)->after('b2_fallback_enabled');
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            foreach ([
                'b2_bucket',
                'b2_key',
                'b2_secret',
                'b2_endpoint',
                'b2_accounts_json',
                'b2_multi_enabled',
                'b2_round_robin_enabled',
                'b2_fallback_enabled',
                'b2_default_account_index',
            ] as $col) {
                if (Schema::hasColumn('site_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
