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
        $comments = DB::table('comments')
            ->join('users', 'users.id', '=', 'comments.user_id')
            ->select('comments.*', 'users.name as user_name')
            ->orderBy('id', 'ASC')
            ->get();
        return response()->json($comments, 200);
    }
    public function showByPost(Request $request){
        $comments = DB::table('comments')
            ->join('users', 'users.id', '=', 'comments.user_id')
            ->where('post_id', $request['post'])
            ->select('comments.*', 'users.name as user_name')
            ->orderBy('updated_at', 'DESC')
            ->get();
        return response()->json($comments, 200);
    }
    public function upload(Request $request){
        try{
            DB::beginTransaction();
            DB::table('comments')->insert(
                [
                    'content' => $request['content'],
                    'post_id' => $request['post_id'],
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
}