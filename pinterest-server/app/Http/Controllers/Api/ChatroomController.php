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
    public function index(Request $request)
    {
        $user_id = intval($request['user_id']);
        $room = Chatroom::where('user_id1', $user_id)
            ->orderBy('updated_at', 'desc')
            ->skip(intval($request['start']))
            ->take(intval($request['number']))->get();

        foreach ($room as &$user) {
            $request->merge([
                'user_id' => $user['user_id2'],
            ]);
            $userInfo = app()->call('App\Http\Controllers\Api\UserController@index', [$request]);
            $user['username'] = $userInfo->original['name'];
            $user['avatar_url'] = $userInfo->original['avatar_url'];
            $user['online_time'] = $userInfo->original['online_time'];
        }

        if (count($room) > 0) {
            return response()->json([
                "message" => $room,
                "start" => intval($request["start"]) + intval($request['number']),
            ], 200);
        } else {
            return response()->json([
                "message" => $room,
                "start" => false,
            ], 200);
        }
    }

    public function getInfoByUser(Request $request)
    {
        $user_id1 = intval($request['user_id1']);
        $user_id2 = intval($request['user_id2']);

        // Get the time when the other side read
        $room = Chatroom::where('user_id1', $user_id2)
            ->where('user_id2', $user_id1)->get();

        if (count($room) > 0) {
            // Get the last message I have read
            $_room = Chatroom::where('user_id1', $user_id1)
                ->where('user_id2', $user_id2)->first();
            $unread = DB::table('laravel.chat_' .  $_room->room_id)
                ->orderBy('created_at', 'asc')
                ->where('created_at', '>', $_room->last_read)
                ->where('from', $user_id2)
                ->first();
            if ($unread !== null) $unread = $unread->id;
            $newest = DB::table('laravel.chat_' .  $_room->room_id)
                ->orderBy('created_at', 'desc')
                ->first()->id;
            return response()->json(["room_id" => $room[0]->room_id, "last_read" => $room[0]->last_read, "unread" => $unread, "newest" => $newest]);
        } else {
            return response()->json(["room_id" => 0, "last_read" => null, "unread" => null, "newest" => null]);
        }
    }

    public function create($id)
    {
        Schema::create('chat_' . $id, function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('from');
            $table->unsignedBigInteger('to');
            $table->string('message');
            $table->timestamps();
        });

        return response()->json(['table' => 'chat_' . $id]);
    }

    protected function update(Request $request)
    {
        $user_id1 = intval($request['user_id1']);
        $user_id2 = intval($request['user_id2']);

        $room = Chatroom::where('user_id1', $user_id1)->where('user_id2', $user_id2)->get();
        if (count($room) === 0) {
            $room = new Chatroom();
            $room->user_id1 = $user_id1;
            $room->user_id2 = $user_id2;
            $room->save();

            $tmp = Chatroom::where('user_id1', $user_id2)->where('user_id2', $user_id1)->get();
            if (count($tmp) === 0) {
                $room->room_id = $room->id;
            } else {
                $room->room_id = $tmp[0]->id;
            }

            if ($user_id1 <= $user_id2) {
                $this->create($room->room_id);
            }
        } else {
            $room = $room[0];
        }
        $room->last_message = $request['last_message'];
        $room->save();

        return response()->json(["room_id" => $room->room_id]);
    }

    public function store(Request $request)
    {
        $this->update($request);
        if ($request['user_id1'] !== $request['user_id2']) {
            // Swap
            $request->merge([
                'user_id1' => $request['user_id2'],
                'user_id2' => $request['user_id1'],
            ]);
            $response = $this->update($request);
        }

        return response()->json(["room_id" => $response->original["room_id"]]);
    }

    public function read(Request $request)
    {
        $user_id1 = intval($request['user_id1']);
        $user_id2 = intval($request['user_id2']);

        $room = Chatroom::where('user_id1', $user_id1)->where('user_id2', $user_id2)->first();

        $room->last_read = date('Y-m-d H:i:s');
        $room->save();

        return response()->json($room);
    }
}
