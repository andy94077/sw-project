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
               ->orderBy('id', 'desc')->get();
        return response()->json($notes);
    }
}
