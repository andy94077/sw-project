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
        // $response['image_url'] = Image::find($response['banner_id'])->url;
        // $response['image_alt'] = Image::find($response['banner_id'])->image_alt;

        $post = Post::withTrashed()->find($post);
        // foreach ($post->tags()->get() as $t) {
        //     $en = $t->getTranslation('name', 'en');
        //     $zhtw = $t->getTranslation('name', 'zh-tw');
        //     $response['tags'][] = $en . "/" . $zhtw;
        // }
        // foreach ($post->seos()->get() as $s) {
        //     $en = $s->getTranslation('name', 'en');
        //     $zhtw = $s->getTranslation('name', 'zh-tw');
        //     $response['seos'][] = $en . "/" . $zhtw;
        // }
        return response()->json($response, 200);
    }

    public function showByStatus($status)
    {
        if ($status == 99) {
            $posts = Post::leftJoin('users', 'users.id', '=', 'posts.user_id')->select('posts.*', 'users.name as user_name')->orderBy("posts.updated_at", "DESC")->get();
            //->join('posts_draft', 'posts_draft.post_id', '=', 'posts.id')->select('posts.id', 'posts.status', 'posts_draft.title', 'posts_draft.updated_at', 'posts.updated_at as post_updated_at', 'users.name as user_name')->orderBy("posts_draft.updated_at", "DESC")->get();
        } else {
            $posts = Post::where("status", $status)->leftJoin('users', 'users.id', '=', 'posts.user_id')->select('posts.*', 'users.name as user_name')->orderBy("posts.updated_at", "DESC")->get();
        }

        foreach ($posts as $post) {
            $post->user_name = ($post->user_name !== null) ? $post->user_name : 'Deleted User';
            if ($post->status == "1") {
                if ($post->updated_at != $post->post_updated_at) {
                    $post->status = "0";
                }
            }
        }

        return $posts;
    }

    // public function getTagList()
    // {
    //     $tags = Label::where('type', 0)->select('name')->get();
    //     foreach ($tags as $t) {
    //         $response[] = $t->name['en'] . "/" . $t->name['zh-tw'];
    //     }
    //     return response()->json($response, 200);
    // }

    // public function getSeoList()
    // {
    //     $seos = Label::where('type', 1)->select('name')->get();
    //     foreach ($seos as $s) {
    //         $response[] = $s->name['en'] . "/" . $s->name['zh-tw'];
    //     }
    //     return response()->json($seos, 200);
    // }
    // public function getPostLabel()
    // {
    //     $tagsData = Label::where('type', 0)->select('name')->get();
    //     $seosData = Label::where('type', 1)->select('name')->get();
    //     $response = [];
    //     foreach ($tagsData as $tag) {
    //         $en = $tag->getTranslation('name', 'en');
    //         $zhtw = $tag->getTranslation('name', 'zh-tw');
    //         $response['tags'][] = $en . "/" . $zhtw;
    //     }
    //     foreach ($seosData as $seo) {
    //         $en = $seo->getTranslation('name', 'en');
    //         $zhtw = $seo->getTranslation('name', 'zh-tw');
    //         $response['seos'][] = $en . "/" . $zhtw;
    //     }

    //     return response()->json($response, 200);
    // }

    public function updateStatus(Request $request)
    {
        // dump($request);
        $posts = Post::whereIn("id", (array) $request['id'])->get();
        if (count($posts)) {
            if ($request->query('user_id') == '') {
                return $this->sendError('User ID was not detected, please re-Login');
            }
            foreach ($posts as $post) {
                $post->user_id = $request->query('user_id');
                $post->status = $request['status'];
                $post->save();
            }
            $msg = count($posts) > 1 ? "Posts' status were succesfully updated" : "Post's status was successfully updated";
        } else {
            $msg = "Can't find those posts. ";
        }

        return $this->sendResponse('', $msg);
    }

    public function deleted()
    {
        $posts =  Post::onlyTrashed()->leftJoin('users', 'users.id', '=', 'posts.user_id')->select('posts.id', 'posts.status', 'posts.title', 'posts.updated_at', 'users.name as user_name')->orderBy('updated_at', 'DESC')->get();

        foreach ($posts as $post) {
            $post->user_name = ($post->user_name !== null) ? $post->user_name : 'Deleted User';
        }

        return response()->json($posts, 201);
    }


    // public function generateLabelPair($label)
    // {
    //     $pair = explode("/", $label);
    //     $labelPair['en'] = $pair[0];
    //     if (count($pair) > 1) {
    //         $labelPair['zh-tw'] = $pair[1];
    //     } else {
    //         $labelPair['zh-tw'] = $labelPair['en'];
    //     }
    //     return $labelPair;
    // }

    // public function labelFirstOrCreate($type, $name)
    // {
    //     $pair = $this->generateLabelPair($name);
    //     $label = Label::whereRaw("json_extract(name,'$.en') = ?", [$pair['en']])
    //         ->whereRaw("json_extract(name,'$." . '"zh-tw"' . "') = ?", [$pair['zh-tw']])
    //         ->where('type', $type)
    //         ->first();
    //     if ($label == null) {
    //         $label = new Label();
    //         $label->type = $type;
    //         $label->name = $pair;
    //         $label->save();
    //     }
    //     return $label;
    // }
    /**
     * STORE
     * create a new article in posts with no content, fill the post_label with seo and tags, status = draft
     * put the content inside post draft, refer the post id to post draft
     */
    public function store(Request $request)
    {
        try {
            // $title = json_decode($request['title'], true);
            // $subtitle = json_decode($request['subtitle'], true);
            // $body = json_decode($request['body'], true);

            DB::beginTransaction();
            $draft = new Post;
            $draft->user_id = $request['user_id'];
            $draft->status = "0";
            // $post->save();

            // if ($request['tags']) {
            //     $tags = json_decode($request['tags'], true);
            //     foreach ($tags as $t) {
            //         $tag = $this->labelFirstOrCreate('0', $t);
            //         $post->labels()->attach($tag->id);
            //     }
            // }

            // if ($request['seos']) {
            //     $seos = json_decode($request['seos'], true);
            //     foreach ($seos as $s) {
            //         $seo = $this->labelFirstOrCreate('1', $s);
            //         $post->labels()->attach($seo->id);
            //     }
            // }

            if ($request->file('banner')) {
                $img = new Image();
                $img->upload($request->file('banner'));
                $img->image_alt = $request['image_alt'] ? $request['image_alt'] : "banner" . time();
                $img->save();
            }
            // $draft = new PostDraft;
            // $draft->author = $request['author'];
            // $draft->post_id = $post->id;
            // $draft->user_id = $request['user_id'];
            // $draft->banner_id = $img->id;
            // $draft->setTranslations('title', $title);
            // $draft->setTranslations('subtitle', $subtitle);
            // $draft->setTranslations('body', $body);
            // $draft->publish_time = $request['publish_time'];
            // $draft->save();
            // $draft = new Post;
            // $draft->id = $post->id;
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
            $posts = Post::where("tag", $request['tag'])->select("url", "user_id")->limit($request['number'])->get();
        else
            $posts = Post::select("url", "user_id")->limit($request['number'])->get();

        // var_dump($posts);
        return response()->json(["imageListWithId" => $posts]);
    }

    public function getPictureFromId($id){
        $posts = Post::leftJoin('users', 'users.id', '=', 'posts.user_id')->where('posts.id', $id)->select('posts.*', "users.name as user_name")->get();
        return response()->json($posts, 200);
    }

    public function restore(Request $request)
    {
        $posts = Post::onlyTrashed()->whereIn("id", (array) $request['id'])->get();
        if ($request->query('user_id') == "") {
            return $this->sendError("User ID was not detected, please re-Login");
        }
        foreach ($posts as $post) {
            $post->user_id = $request->query('user_id');
            if ($post->status == "1") {
                $post->status = 0;
            }
            $post->save();
            $post->restore();
        }
        return $this->sendResponse('', 'Post was successfully restored');
    }

    public function update(Request $request)
    {
        try {
            DB::beginTransaction();
            $draft = Post::find($request['id']);
            if ($request->query('user_id') == "") {
                return $this->sendError("User ID was not detected, please re-Login");
            }
            $draft->user_id = $request->query('user_id');
            if ($request['title']) {
                $draft->title = $request['title'];
                unset($request['title']);
            }
            if ($request['subtitle']) {
                $draft->subtitle = $request['subtitle'];
                unset($request['subtitle']);
            }
            if ($request['body']) {
                $draft->body = $request['body'];
                unset($request['body']);
            }
            $draft->save();
            $draft->update($request->all());

            // $arrTags = [];
            // $arrSeos = [];

            // if ($request['tags']) {
            //     $tags = json_decode($request['tags'], true);
            //     foreach ($tags as $t) {
            //         $tagId = $this->labelFirstOrCreate('0', $t)->id;
            //         $arrTags[] = $tagId;
            //     }
            // }
            // if ($request['seos']) {
            //     $seos = json_decode($request['seos'], true);
            //     foreach ($seos as $s) {
            //         $seoId = $this->labelFirstOrCreate('1', $s)->id;
            //         $arrSeos[] = $seoId;
            //     }
            // }
            // $arrays = array_merge($arrTags, $arrSeos);
            // $post->labels()->sync($arrays);

            if ($request['banner'] != "") {
                $img = new Image();
                $img->upload($request->file('banner'));
                $img->image_alt = $request['image_alt'];

                /**
                 * delete old image
                 * now have to check if draft's old image = published image. if yes, then dont delete. if no, can delete.
                 */
                // if ($draft->banner_id != $post->banner_id) {
                //     $oldImg = Image::find($draft->banner_id);
                //     if (get_class($oldImg) != "App\Libraries\DefaultImage") {
                //         $oldImg->delete();
                //     }
                // }

                $img->save();
                $draft->banner_id = $img->id;
                $draft->save();
            } else {
                if ($request['image_alt']) {
                    $img = Image::find($draft->banner_id);
                    $img->image_alt = $request['image_alt'];
                    $img->save();
                }
            }

            DB::commit();

            return $this->sendResponse($draft->toArray(), 'Post was successfully updated!');
        } catch (\PDOException $e) {
            DB::rollBack();
            return $this->sendError('Post was unsuccessfully updated!', $e);
        }
    }

    public function publish(Request $request, $id)
    {
        $param = $request->all();
        // $draft = PostDraft::find($id);
        // $draft->touch();
        // $post = Post::find($draft->post_id);
        // $post->user_id = $param['user_id'];
        // $post->banner_id = $draft->banner_id;
        // $post->slug = $draft->slug;
        // $post->title = $draft->title;
        // $post->subtitle = $draft->subtitle;
        // $post->body = $draft->body;
        // $post->status = 1;
        // $post->author = $draft->author;
        // $post->publish_time = $draft->publish_time;
        // $post->updated_at = $draft->updated_at;
        // $post->save();

        $now = date("Y-m-d H:i:s");
        $post = Post::find($id);
        $post->status = 1;
        $post->publish_time = $now;
        $post->updated_at = $now;
        $post->save();
        return $this->sendResponse($post, 'success');
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
        Post::create([
            "url" => $request['url'],
            "user_id" => $request['user_id'],
            "username" => $request['username'],
            "content" => $request['content'],
            "tag" => $request['tag'],
        ]);
        $imageId = basename(dirname($request['url'], 2));
        return response()->json(['id' => $imageId], 200);
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

    /**
     * soft delete posts, ids are sent by param
     */
    public function delete(Request $request)
    {
        $posts = Post::whereIn("id", (array) $request['id'])->get();
        if ($request->query('user_id') == "") {
            return $this->sendError("User ID was not detected, please re-Login");
        }
        foreach ($posts as $post) {
            $post->user_id = $request->query('user_id');
            $post->save();
            $post->delete();
        }
        $msg = count($posts) > 1 ? "Posts were succesfully deleted and moved to Trash page" : "Post was successfully deleted and moved to Trash page";
        return $this->sendResponse($posts->toArray(), $msg);
    }

    /**
     * Remove the specified resource from storage permanently .
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function forcedelete(Request $request)
    {
        try {
            $posts = Post::onlyTrashed()->whereIn("id", (array) $request['id'])->get();
            if (count($posts)) {
                DB::beginTransaction();
                foreach ($posts as $post) {
                    // $draft = PostDraft::where("post_id", $post->id)->first();
                    // $post->tags()->detach();
                    // $post->seos()->detach();
                    $img = Image::find($post->banner_id);
                    if (get_class($img) != "App\Libraries\DefaultImage") {
                        $img->delete();
                    }
                    // if ($post->banner_id != $draft->banner_id) {
                    //     $img = Image::find($draft->banner_id);
                    //     if (get_class($img) != "App\Libraries\DefaultImage") {
                    //         $img->delete();
                    //     }
                    // }
                    // $draft->forcedelete();
                    $post->forcedelete();
                }
                DB::commit();
            } else {
                return $this->sendResponse('', 'Can\'t delete these posts.');
            }
        } catch (\PDOException $e) {
            DB::rollBack();
        }
        return $this->sendResponse('', 'Post deleted permanently.');
    }
}
