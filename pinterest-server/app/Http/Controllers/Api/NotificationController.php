<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends BaseController
{
    public function index(Request $request)
    {
        $notes = Notification::where('group', 'public')
            ->orWhere('user_id', $request['user_id'])
            ->orderBy('id', 'desc')
            ->skip($request['start'])
            ->take(intval($request['number']))->get();

        if (count($notes) > 0) {
            return response()->json([
                "message" => $notes,
                "start" => intval($request["start"]) + intval($request['number']),
            ], 200);
        } else {
            return response()->json([
                "message" => $notes,
                "start" => false,
            ], 200);
        }
    }

    public function store(Request $request)
    {
        $note = new Notification();
        $note->group = $request['group'];
        if ($request['group'] === "personal") {
            $note->user_id = $request['user_id'];
        }
        $note->header = $request['header'];
        $note->secondary = $request['secondary'];
        $note->content = $request['content'];
        $note->save();
        return response()->json($note);
    }
}
