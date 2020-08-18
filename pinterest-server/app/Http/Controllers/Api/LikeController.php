<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Post;

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
        $post = Post::find($request['post_id']);
        $post->like ++;
        $post->save();
        return response()->json($like);
    }

    public function destroy($id){
        $like = Like::find($id);
        $post = Post::find($like->post_id);
        $post->like --;
        $post->save();
        $like->delete();
        return response()->json($like);
    }

    public function update($id){
        $like = Like::withTrashed()->find($id);
        $post = Post::find($like->post_id);
        $post->like ++;
        $post->save();
        $like->restore();
        return response()->json($like);
    }

    public function sum(Request $request){
        $query = Like::where('likes.post_id', $request['post_id']);
        $res['sum'] = $query->count();
        $res['likers'] = $query->orderBy('updated_at', 'DESC')->take(3)->LeftJoin('users', 'users.id', '=', 'likes.user_id')->select('users.name as username', 'likes.updated_at as updated_at')->get();
        return response()->json($res);
    }

    public function getLatest(){
        $likes = Like::orderBy('updated_at', 'DESC')->take(8)->LeftJoin('users', 'users.id', '=', 'likes.user_id')->select('users.name as username', 'likes.*')->get();
        return response()->json($likes);
    }
}
