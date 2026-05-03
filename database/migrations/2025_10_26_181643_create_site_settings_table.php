<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('storage_mode')->default('local');
            $table->string('local_path')->default('storage/app/videos');
            $table->string('ftp_hostname')->nullable();
            $table->integer('ftp_port')->default(21);
            $table->string('ftp_user')->nullable();
            $table->string('ftp_pass')->nullable();
            $table->string('ftp_path')->nullable();
            $table->string('r2_bucket')->nullable();
            $table->string('r2_key')->nullable();
            $table->string('r2_secret')->nullable();
            $table->string('r2_endpoint')->nullable();
            $table->text('gdrive_client_id')->nullable();
            $table->text('gdrive_client_secret')->nullable();
            $table->text('gdrive_redirect_uri')->nullable();
            $table->string('gdrive_shared_drive_id')->nullable();
            $table->string('gdrive_mode')->default('mydrive');
            $table->timestamps();
        });

        // Insert default settings
        DB::table('site_settings')->insert([
            'id' => 1,
            'storage_mode' => 'local',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
