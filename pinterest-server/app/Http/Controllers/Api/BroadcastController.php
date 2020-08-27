<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Events\Announced;
use App\Events\ChatSent;

class BroadcastController extends BaseController
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->input('data');
        event(new Announced($data)); // trigger
        return response()->json("Event announced!", 200);
    }
    
    public function chating(Request $request)
    {
        $data = $request->input('data');
        event(new ChatSent($data)); // trigger
        return response()->json("Message sent!", 200);
    }
}
