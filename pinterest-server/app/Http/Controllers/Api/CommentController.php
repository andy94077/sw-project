<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\User;
use App\Models\Post;
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
            if($request['user'] !== null && Post::find($request['post_id']) === null){
                return response()->json("Post is deleted", 404);
            }
            DB::beginTransaction();
            $comment = Comment::create(
                [
                    'post_id' => intval($request['post_id']),
                    'content' => $request['content'],
                    'user_id' => intval($request['user_id']),
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
        if($request['user'] && Post::find($comment->post_id) === null){
            return response()->json("Post is deleted", 404);
        }
        $comment->delete();
        return $this->sendResponse($comment, "success");
    }

    public function update(Request $request){
        $comment = Comment::find($request['id']);
        if($request['user'] && Post::find($comment->post_id) === null){
            return response()->json("Post is deleted", 404);
        }
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
        if($request['id'] !== null){
            $query = $query->where("id", $request['id']);
        }
        if($request['post_id'] !== null){
            $query = $query->where("post_id", $request['post_id']);
        }
        if($request['user_id']!== null){
            $query = $query->where("user_id", 'like', "%{$request['user_id']}%");
        }
        if($request['content']!== null){
            $query = $query->where("content", 'like', "%{$request['content']}%");
        }
        
        foreach (array('deleted_at', 'created_at', 'updated_at') as $col){
            if ($request[$col][0] !== null && $request[$col][1] !== null) {
                $query = $query->whereBetween($col, array(gmdate('Y.m.d H:i:s', strtotime($request[$col][0])), gmdate('Y.m.d H:i:s', strtotime($request[$col][1]))));
            } else if ($request[$col][0] !== null && $request[$col][1] === null) {
                $query = $query->where($col, '>=', gmdate('Y.m.d H:i:s', strtotime($request[$col][0])));
            } else if ($request[$col][0] === null && $request[$col][1] !== null) {
                $query = $query->where($col, '<=', gmdate('Y.m.d H:i:s', strtotime($request[$col][1])));
            }
        }

        $size = $query->count();
        $comments['data'] = $query->skip(($request['page']-1)*$request['size'])->take($request['size'])->get();
        $comments['total'] = $size;
        return response()->json($comments);
    }

    public function destroy($id){
        return $id;
    }

    public function getCommentInfo(){
        $res['valid'] = Comment::all()->count();
        $res['new'] = Comment::where('created_at', '>=', DB::raw('Now() - INTERVAL 8 HOUR - INTERVAL 1 HOUR'))->count();
        return response()->json($res);
    }

    public function getLatest(){
        $comments = Comment::orderBy('updated_at', 'desc')->take(8)->LeftJoin('users', 'users.id', '=', 'comments.user_id')->select('comments.*', 'users.name as username')->get();
        return response()->json($comments);
    }
}