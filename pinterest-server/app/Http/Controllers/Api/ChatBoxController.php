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
        $room = DB::table('laravel.chat_' .  $room_id);

        $boxes = $room->orderBy('created_at', 'desc')
            ->skip(intval($request['start']))
            ->take(intval($request['number']))->get();

        $boxesLen = count($boxes);
        $last = $room->orderBy('created_at', 'desc')
            ->skip(intval($request['start']) + $boxesLen)
            ->first();
        if ($last !== null) $last = substr($last->created_at, 0, 10);

        $boxes = $boxes->map(function ($box, $key) use ($last, $boxesLen, $boxes) {
            $boxTime = substr($box->created_at, 0, 10);
            if ($key === $boxesLen - 1) {
                if ($boxTime !== $last) {
                    $box->first = true;
                }
            } else {
                $lastBoxTime = substr($boxes[$key + 1]->created_at, 0, 10);
                if ($boxTime !== $lastBoxTime) {
                    $box->first = true;
                }
            }
            return $box;
        });


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
