<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSuperUsersTable extends Migration
{
    /**
     * Run the migrations.
     *  permission: [0]: bucket user,       [1]: unbucket user,     [2]: delete user,   [3]: recover user, 
     *              [4]: delete post,       [5]: recover post,
     *              [6]: delete BO user,    [7]: recover BO user,   [8]: view BO user,  [9]: register BO user,
     * @return void
     */
    public function up()
    {
        Schema::create('super_users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->comment('username for login purpose');
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->string('api_token')->nullable()->default(null);
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
        Schema::dropIfExists('super_users');
    }
}
