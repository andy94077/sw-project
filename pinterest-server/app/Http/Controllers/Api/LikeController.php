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
        if($request['user_id'] === null || $request['post_id'] === null){
            return response()->json("user_id or post_id not found", 404);
        }
        $likes = Like::withTrashed()->where('user_id', $request['user_id'])->where('post_id', $request['post_id'])->get();
        if($likes->count() !== 0){
            $like = $likes[0];
            if($like->deleted_at !== null){
                $like->restore();
            }
        }
        else{
            $like = new Like();
            $like->user_id = $request['user_id'];
            $like->post_id = $request['post_id'];
            $like->save();
        }
        return response()->json($like);
    }

    public function destroy($id){
        $like = Like::find($id)->delete();
        return response()->json($like);
    }

    public function update($id){
        $like = Like::withTrashed()->find($id)->restore();
        return response()->json($like);
    }

    public function sum(Request $request){
        $res['sum'] = Like::where('post_id', $request['post_id'])->count();
        return response()->json($res);
    }
}
