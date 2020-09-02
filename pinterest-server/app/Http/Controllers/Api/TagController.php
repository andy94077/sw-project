<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Tags;

class TagController extends BaseController
{
    public function index(Request $request)
    {
        $tags = Tags::orderBy('count', 'desc')
            ->skip(intval($request['start']))
            ->take(intval($request['number']))->get();

        if (count($tags) > 0) {
            return response()->json([
                "tags" => $tags,
                "start" => intval($request["start"]) + intval($request['number']),
            ], 200);
        } else {
            return response()->json([
                "tags" => $tags,
                "start" => false,
            ], 200);
        }
    }

    public function store(Request $request)
    {
        return response()->json(['name' => $request['name']]);
    }
}
