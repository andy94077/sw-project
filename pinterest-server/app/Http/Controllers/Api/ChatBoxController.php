<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;

class ChatBoxController extends BaseController
{
    public function index(Request $request)
    {
        $room_id = intval($request['room_id']);
        $boxes = DB::table('laravel.chat_' .  $room_id);

        $boxes = $boxes->orderBy('updated_at', 'desc')
            ->skip(intval($request['start']))
            ->take(intval($request['number']))->get();

        if (count($boxes) > 0) {
            return response()->json([
                "message" => $boxes,
                "start" => intval($request["start"]) + intval($request['number']),
            ], 200);
        } else {
            return response()->json([
                "message" => $boxes,
                "start" => false,
            ], 200);
        }
    }

    public function store(Request $request)
    {
        $room_id = intval($request['room_id']);
        $from = intval($request['from']);
        $to = intval($request['to']);

        DB::insert(
            'INSERT INTO laravel.chat_' . $room_id . ' (`from`, `to`, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
            [$from, $to, $request['last_message'], date('Y-m-d H:i:s'), date('Y-m-d H:i:s')]
        );

        return response()->json(['message' => $request['last_message']]);
    }
}
