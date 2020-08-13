<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Events\AdPosted;

class BroadcastController extends BaseController
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function adPost(Request $request)
    {
        $data = $request->input('data');
        event(new AdPosted($data)); // trigger
        return response()->json("Ad Posted!", 200);
    }
}
