<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends BaseController
{
    public function index(Request $request){
        $notes = Notification::where('group', 'public')
               ->orWhere('user_id', $request['user_id'])
               ->orderBy('id', 'desc')->take(10)->get();
        return response()->json($notes);
    }
    
    public function store(Request $request){
        $note = new Notification();
        $note->group = $request['group'];
        if($request['group'] === "personal"){
            $notes->user_id = $request['user_id'];
        }
        $note->header = $request['header'];
        $note->secondary = $request['secondary'];
        $note->content = $request['content'];
        $note->save();
        return response()->json($note);
    }
}
