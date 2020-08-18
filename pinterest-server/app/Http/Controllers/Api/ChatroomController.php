<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Chatroom;

class ChatroomController extends BaseController
{
    protected function swap(&$x, &$y) {
    // Warning: works correctly with numbers ONLY!
        if($x > $y) $x ^= $y ^= $x ^= $y;
    }

    public function store(Request $request){
        $user_id1 = intval($request['user_id1']);
        $user_id2 = intval($request['user_id2']);
        $this->swap($user_id1, $user_id2);
        
        $room = Chatroom::where('user_id1', $user_id1)->where('user_id2', $user_id2)->get();
        if(count($room) === 0){
            $this->create($request);
            $room = new Chatroom();
        }else{
            $room = $room[0];
        }
        $room->user_id1 = $user_id1;
        $room->user_id2 = $user_id2;
        $room->username1 = $request['username1'];
        $room->username2 = $request['username2'];
        $room->last_message = $request['last_message'];
        $room->save();
        return response()->json($room);
    }
    
    public function create(Request $request){
        $user_id1 = intval($request['user_id1']);
        $user_id2 = intval($request['user_id2']);
        $this->swap($user_id1, $user_id2);

        Schema::create('chat_' . $user_id1 . '_' . $user_id2, function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('from');
            $table->unsignedBigInteger('to');
            $table->string('message');
            $table->timestamps();
        });

        return response()->json(['table' => 'chat_' . $user_id1 . '_' . $user_id2]);
    }
}
