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

    // public function showByStatus($status)
    // {
    //     if ($status == 99) {
    //         $posts = Post::leftJoin('users', 'users.id', '=', 'posts.user_id')->select('posts.*', 'users.name as user_name')->orderBy("posts.updated_at", "DESC")->get();
    //     } else {
    //         $posts = Post::where("status", $status)->leftJoin('users', 'users.id', '=', 'posts.user_id')->select('posts.*', 'users.name as user_name')->orderBy("posts.updated_at", "DESC")->get();
    //     }

    //     foreach ($posts as $post) {
    //         $post->user_name = ($post->user_name !== null) ? $post->user_name : 'Deleted User';
    //         if ($post->status == "1") {
    //             if ($post->updated_at != $post->post_updated_at) {
    //                 $post->status = "0";
    //             }
    //         }
    //     }

    //     return $posts;
    // }

    // public function updateStatus(Request $request)
    // {
    //     // dump($request);
    //     $posts = Post::whereIn("id", (array) $request['id'])->get();
    //     if (count($posts)) {
    //         if ($request->query('user_id') == '') {
    //             return $this->sendError('User ID was not detected, please re-Login');
    //         }
    //         foreach ($posts as $post) {
    //             $post->user_id = $request->query('user_id');
    //             $post->status = $request['status'];
    //             $post->save();
    //         }
    //         $msg = count($posts) > 1 ? "Posts' status were succesfully updated" : "Post's status was successfully updated";
    //     } else {
    //         $msg = "Can't find those posts. ";
    //     }

    //     return $this->sendResponse('', $msg);
    // }

    // public function deleted()
    // {
    //     $posts =  Post::onlyTrashed()->leftJoin('users', 'users.id', '=', 'posts.user_id')->select('posts.id', 'posts.status', 'posts.title', 'posts.updated_at', 'users.name as user_name')->orderBy('updated_at', 'DESC')->get();

    //     foreach ($posts as $post) {
    //         $post->user_name = ($post->user_name !== null) ? $post->user_name : 'Deleted User';
    //     }

    //     return response()->json($posts, 201);
    // }

    public function store(Request $request)
    {
        try {

            DB::beginTransaction();
            $draft = new Post;
            $draft->user_id = $request['user_id'];
            $draft->status = "0";

            if ($request->file('banner')) {
                $img = new Image();
                $img->upload($request->file('banner'));
                $img->image_alt = $request['image_alt'] ? $request['image_alt'] : "banner" . time();
                $img->save();
            }
            $draft->user_id = $request['user_id'];
            if (isset($img)) $draft->banner_id = $img->id;
            $draft->title = $request['title'];
            $draft->subtitle = $request['subtitle'];
            $draft->body = $request['body'];
            $draft->slug = $request['slug'];
            $draft->publish_time = $request['publish_time'];
            $draft->save();
            DB::commit();

            return $this->sendResponse($draft->toArray(), 'Post was successfully created!');
        } catch (\PDOException $e) {
            DB::rollBack();
            return $this->sendError('Post creation was failed!', $e);
        }
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
            $posts = Post::leftJoin('users', 'users.id', '=', 'posts.user_id')->where('posts.id', $request['id'])->select('posts.*', "users.name as user_name")->get();
            return response()->json($posts, 200);
        }
        catch(QueryException $e){
            return $this->sendError($e);
        }
    }

    // public function restore(Request $request)
    // {
    //     $posts = Post::onlyTrashed()->whereIn("id", (array) $request['id'])->get();
    //     if ($request->query('user_id') == "") {
    //         return $this->sendError("User ID was not detected, please re-Login");
    //     }
    //     foreach ($posts as $post) {
    //         $post->user_id = $request->query('user_id');
    //         if ($post->status == "1") {
    //             $post->status = 0;
    //         }
    //         $post->save();
    //         $post->restore();
    //     }
    //     return $this->sendResponse('', 'Post was successfully restored');
    // }

    // public function update(Request $request)
    // {
    //     try {
    //         DB::beginTransaction();
    //         $draft = Post::find($request['id']);
    //         if ($request->query('user_id') == "") {
    //             return $this->sendError("User ID was not detected, please re-Login");
    //         }
    //         $draft->user_id = $request->query('user_id');
    //         if ($request['title']) {
    //             $draft->title = $request['title'];
    //             unset($request['title']);
    //         }
    //         if ($request['subtitle']) {
    //             $draft->subtitle = $request['subtitle'];
    //             unset($request['subtitle']);
    //         }
    //         if ($request['body']) {
    //             $draft->body = $request['body'];
    //             unset($request['body']);
    //         }
    //         $draft->save();
    //         $draft->update($request->all());

        
    //         if ($request['banner'] != "") {
    //             $img = new Image();
    //             $img->upload($request->file('banner'));
    //             $img->image_alt = $request['image_alt'];
    //             $img->save();
    //             $draft->banner_id = $img->id;
    //             $draft->save();
    //         } else {
    //             if ($request['image_alt']) {
    //                 $img = Image::find($draft->banner_id);
    //                 $img->image_alt = $request['image_alt'];
    //                 $img->save();
    //             }
    //         }

    //         DB::commit();

    //         return $this->sendResponse($draft->toArray(), 'Post was successfully updated!');
    //     } catch (\PDOException $e) {
    //         DB::rollBack();
    //         return $this->sendError('Post was unsuccessfully updated!', $e);
    //     }
    // }

    // public function publish(Request $request, $id)
    // {
    //     $param = $request->all();

    //     $now = date("Y-m-d H:i:s");
    //     $post = Post::find($id);
    //     $post->status = 1;
    //     $post->publish_time = $now;
    //     $post->updated_at = $now;
    //     $post->save();
    //     return $this->sendResponse($post, 'success');
    // }

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

    public function destroy(Request $request, $post)
    {
        $post = Post::find($post);
        if ($request->query('user_id') == "") {
            return $this->sendError("User ID was not detected, please re-Login");
        }
        $post->user_id = $request->query("user_id");
        $post->save();
        $post->delete();
        return $this->sendResponse($post->toArray(), 'Post was deleted.');
    }

    // /**
    //  * soft delete posts, ids are sent by param
    //  */
    // public function delete(Request $request)
    // {
    //     $posts = Post::whereIn("id", (array) $request['id'])->get();
    //     if ($request->query('user_id') == "") {
    //         return $this->sendError("User ID was not detected, please re-Login");
    //     }
    //     foreach ($posts as $post) {
    //         $post->user_id = $request->query('user_id');
    //         $post->save();
    //         $post->delete();
    //     }
    //     $msg = count($posts) > 1 ? "Posts were succesfully deleted and moved to Trash page" : "Post was successfully deleted and moved to Trash page";
    //     return $this->sendResponse($posts->toArray(), $msg);
    // }

    // /**
    //  * Remove the specified resource from storage permanently .
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function forcedelete(Request $request)
    // {
    //     try {
    //         $posts = Post::onlyTrashed()->whereIn("id", (array) $request['id'])->get();
    //         if (count($posts)) {
    //             DB::beginTransaction();
    //             foreach ($posts as $post) {
    //                 $img = Image::find($post->banner_id);
    //                 if (get_class($img) != "App\Libraries\DefaultImage") {
    //                     $img->delete();
    //                 }
    //                 $post->forcedelete();
    //             }
    //             DB::commit();
    //         } else {
    //             return $this->sendResponse('', 'Can\'t delete these posts.');
    //         }
    //     } catch (\PDOException $e) {
    //         DB::rollBack();
    //     }
    //     return $this->sendResponse('', 'Post deleted permanently.');
    // }
}
