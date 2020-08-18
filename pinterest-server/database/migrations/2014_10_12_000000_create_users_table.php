<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->comment('username for login purpose');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('avatar_url');
            $date = new DateTime(null);
            $table->timestampTz('online_time')->nullable()->default($date->format('Y-m-d\TH:i:s'));
            $table->timestampTz('bucket_time')->nullable()->default(null);
            $table->rememberToken();
            $table->string('api_token')->nullable()->default(null);
            $table->string('intro')->nullable()->default("<h>hi</hi>");
            $table->unsignedBigInteger('followers')->default(0);
            $table->unsignedBigInteger('followings')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
