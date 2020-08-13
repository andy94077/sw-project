<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Like;

class LikeController extends BaseController
{
    public function index(Request $request){
        if($request['user_id'] != null && $request['post_id'] != null){
            $likes = Like::where('user_id', $request['user_id'])->where('post_id', $request['post_id'])->get();
        }
        else if($request['user_id'] != null){
            $likes = Like::where('user_id', $request['user_id'])->get();
        }
        else if($request['post_id'] != null){
            $likes = Like::where('post_id', $request['post_id'])->get();
        }
        else{
            $likes = Like::all();
        }
        return response()->json($likes);
    }

    public function show($id){
        $likes = Like::find($id);
        return response()->json($likes);
    }

    public function store(Request $request){
        if($request['user_id'] != null || $request['post_id'] != null){
            return response()->json("user_id or post_id not found", 404);
        }
        $like = Like::withTrashed()->where('user_id', $request['user_id'])->where('post_id', $request['post_id'])->get();
        if($like !== null){
            if($like->trashed()){
                $like->restore();
            }
        }
        else{
            $like = new Like();
            $like->user_id = $request['user_id'];
            $like->post_id = $request['post_id'];
        }
        return response()->json($like);
    }

    public function destory($id){
        $like = Like::find($id)->delete();
        return response()->json($like);
    }

    public function update($id){
        $like = Like::withTrashed()->find($id)->restore();
        return response()->json($like);
    }
}
