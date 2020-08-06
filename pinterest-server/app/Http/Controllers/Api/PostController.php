<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Post;
// use App\Models\PostDraft;
// use App\Models\Label;
use App\Models\User;
use App\Models\Image;
use stdClass;

// for delete images
function removeDirectory($path)
{

    $files = glob($path . '/*');
    foreach ($files as $file) {
        is_dir($file) ? removeDirectory($file) : unlink($file);
    }
    rmdir($path);

    return;
}

class PostController extends BaseController
{
    public function index()
    {
        $post = DB::table('posts')->join('users', 'users.id', '=', 'posts.user_id')->select('posts.*', 'users.name as user_name')->orderBy('updated_at', 'DESC')->get();
        return response()->json($post, 200);
    }

    public function show($post)
    {
        $draft = Post::withTrashed()->where('id', $post)->first();
        $response = json_decode($draft, true);

        $user = User::find($response['user_id']);
        $response['user_name'] = ($user !== null) ? $user->name : 'Deleted User';
        $post = Post::withTrashed()->find($post);
        return response()->json($response, 200);
    }

    public function getPictureFromTag(Request $request)
    {
        if ($request->has('tag'))
            $posts = Post::where("tag", $request['tag'])->select("id", "url")->limit($request['number'])->get();
        else
            $posts = Post::select("id", "url")->limit($request['number'])->get();
        return response()->json(["imageListWithId" => $posts]);
    }

    public function getPictureFromUserId(Request $request)
    {
        if ($request->has('number'))
            $posts = Post::where('user_id', $request['user_id'])->select("id", "url")->limit($request['number'])->get();
        else
            $posts = Post::where('user_id', $request['user_id'])->select("id", "url")->get();
        return response()->json(["imageListWithId" => $posts]);
    }

    public function getPictureFromId(Request $request)
    {
        try{
            $posts = Post::find($request['id'])->leftJoin('users', 'users.id', '=', 'posts.user_id')->select('posts.*', "users.name as user_name")->get();
            return response()->json($posts, 200);
        }
        catch(QueryException $e){
            return $this->sendError($e);
        }
    }

    public function uploadImage(Request $request)
    {
        $image = new Image();
        $image->upload($request->file('imageupload'));
        $image->image_alt = "image";
        $image->save();
        return response()->json(['url' => $image->url['original'], 'id' => $image->id], 200);
    }

    public function deleteImage(Request $request)
    {
        $imageURL = dirname(substr($request['canceledURL'], 1), 2);
        removeDirectory($imageURL);
        return response()->json(['url' => $imageURL], 200);
    }

    public function uploadDesc(Request $request)
    {
        $post = new Post();
        $post->url = $request['url'];
        $post->user_id = $request['user_id'];
        $post->username = $request['username'];
        $post->content = $request['content'];
        $post->tag = $request['tag'];
        $post->save();
        return response()->json(['id' => $post->id], 200);
    }

    public function delete(Request $request){
        $post = Post::find($request['id']);
        $post->delete();
        return $this->sendResponse($post, "success");
    }

    public function update(Request $request){
        $post = Post::find($request['id']);
        $post->content = $request['content'];
        $post->save();
        return $this->sendResponse($post, 'Post was successfully updated');
    }

    public function recover(Request $request){
        $post = Post::withTrashed()->find($request['id']);
        $post->restore();
        return $this->sendResponse($post, 'Post was successfully restored');
    }

    public function adminAll(Request $request){
        $query = Post::withTrashed();
        if($request['id']){
            $query = $query->where('id', 'like', "%{$request['id']}%");
        }
        if($request['tag']){
            $query = $query->where('tag', 'like', "%{$request['tag']}%");
        }
        if($request['user_id']){
            $query = $query->where('user_id', 'like', "%{$request['user_id']}%");
        }
        if($request['content']){
            $query = $query->where('content', 'like', "%{$request['content']}%");
        }
        if($request['user_name']){
             $query = $query->where('user_name', 'like', "%{$request['user_name']}%");
        }
        if($request['deleted_at']){
             $query = $query->where('deleted_at', 'like', "%{$request['deleted_at']}%");
        }
        if($request['created_at']){
             $query = $query->where('created_at', 'like', "%{$request['created_at']}%");
        }
        if($request['updated_at']){
             $query = $query->where('updated_at', 'like', "%{$request['updated_at']}%");
        }
        $size = $query->count();
        $posts['data'] = $query->skip(($request['page']-1)*$request['size'])->take($request['size'])->get();
        $posts['total'] = $size;
        return response()->json($posts);
    }

}
