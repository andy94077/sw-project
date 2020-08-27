<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;

class ChatBoxController extends BaseController
{
    protected function swap(&$x, &$y)
    {
        // Warning: works correctly with numbers ONLY!
        if ($x > $y) {
            $x ^= $y ^= $x ^= $y;
        }
    }

    public function index(Request $request)
    {
        $user_id1 = intval($request['user_id1']);
        $user_id2 = intval($request['user_id2']);
        $this->swap($user_id1, $user_id2);
        $boxes = DB::table('laravel.chat_' . $user_id1 . '_' . $user_id2);
        
        $boxes = $boxes->orderBy('updated_at', 'asc')
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
        $user_id1 = $from = intval($request['user_id1']);
        $user_id2 = $to = intval($request['user_id2']);
        $this->swap($user_id1, $user_id2);
        
        DB::insert(
            'INSERT INTO laravel.chat_' . $user_id1 . '_' . $user_id2 . ' (`from`, `to`, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
            [$from, $to, $request['last_message'], date('Y-m-d H:i:s'), date('Y-m-d H:i:s')]
        );
        
        return response()->json(['message' => $request['last_message']]);
    }
}
