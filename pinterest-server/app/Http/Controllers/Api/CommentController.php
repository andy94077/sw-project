<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\User;
use stdClass;
use Illuminate\Database\QueryException;

class CommentController extends BaseController{
    public function index()
    {
        $comments = Comment::all();
        return response()->json($comments, 200);
    }
    public function showByPost(Request $request){
        $comments = Comment::LeftJoin('users', 'users.id', '=', 'comments.user_id')
            ->where('post_id', $request['post'])
            ->select('comments.*', 'users.name as user_name')
            ->orderBy('updated_at', 'DESC')
            ->get();
        return response()->json($comments, 200);
    }
    public function upload(Request $request){
        try{
            DB::beginTransaction();
            $comment = Comment::create(
                [
                    'post_id' => $request['post_id'],
                    'content' => $request['content'],
                    'user_id' => $request['user_id'],
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]
            );
            DB::commit();
            return $this->sendResponse("", "success");
        }
        catch(QueryException $e){
            DB::rollBack();
            return $this->sendError($e);
        }
    }

    public function delete(Request $request){
        $comment = Comment::find($request['id']);
        $comment->delete();
        return $this->sendResponse($comment, "success");
    }

    public function update(Request $request){
        $comment = Comment::find($request['id']);
        $comment->content = $request['content'];
        $comment->save();
        return $this->sendResponse($comment, 'Comment was successfully updated');
    }

    public function recover(Request $request){
        $comment = Comment::withTrashed()->find($request['id']);
        $comment->restore();
        return $this->sendResponse($comment, 'Comment was successfully restored');
    }

    public function adminAll(Request $request){
        $query = Comment::withTrashed();
        if($request['post_id']){
            $query = $query->where("post_id", $request['post_id']);
        }
        if($request['user_id']){
            $query = $query->where("user_id", $request['user_id']);
        }
        $comments = $query->get();
        return $this->sendResponse($comments, 'Comment was successfully got');
    }
}