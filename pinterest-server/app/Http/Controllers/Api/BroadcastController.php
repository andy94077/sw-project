<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Events\Announced;
use App\Events\ChatSent;
use App\Events\ChatRead;

class BroadcastController extends BaseController
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request['data'];
        event(new Announced($data)); // trigger
        return response()->json("Event announced!", 200);
    }

    public function chatting(Request $request)
    {
        $room_id = $request['room_id'];
        $message = $request['message'];
        $from = $request['from'];
        event(new ChatSent($room_id, $message, $from)); // trigger
        return response()->json("Message sent!", 200);
    }

    public function chatread(Request $request)
    {
        $room_id = $request['room_id'];
        event(new ChatRead($room_id)); // trigger
        return response()->json("Message read!", 200);
    }
}
