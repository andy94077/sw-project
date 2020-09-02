<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateChatroomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chatrooms', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id1');
            $table->unsignedBigInteger('user_id2');
            $table->unsignedBigInteger('room_id')->nullable();
            $table->string('last_message')->nullable();
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
        Schema::dropIfExists('chatrooms');
        $queries = DB::select("SELECT CONCAT('DROP TABLE IF EXISTS ', TABLE_NAME, ';') AS 'query' 
                               FROM information_schema.TABLES 
                               WHERE TABLE_SCHEMA = 'laravel' AND TABLE_NAME LIKE 'chat_%';");
        foreach ($queries as $query) {
            DB::statement($query->query);
        }
    }
}
