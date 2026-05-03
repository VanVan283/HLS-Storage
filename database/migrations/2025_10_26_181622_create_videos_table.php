<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            // $table->string('user_id');
            $table->string('title');
            $table->string('name');
            $table->text('path');
            $table->bigInteger('size')->default(0);
            $table->decimal('duration', 10, 2)->default(0);
            $table->string('thumbnail')->nullable();
            $table->boolean('converted')->default(false);
            $table->boolean('hls_enabled')->default(false);
            $table->text('hls_playlist')->nullable();
            $table->string('hls_type')->nullable();
            $table->text('webViewLink')->nullable();
            // $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index('created_at');
            // $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
