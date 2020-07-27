<?php

namespace App\Http\Controllers\Frontend;


use App\Models\Post;
// use App\Models\PostDraft;
// use App\Models\Label;
use Illuminate\Http\Request;

class PostController extends FrontendController
{

    //Post list
    public function posts(Request $request)
    {

        $posts = Post::where('status', '=', '1')
            ->where('publish_time', '<', now())
            ->orderBy('publish_time', 'desc')
            ->orderBy('id', 'desc')
            ->get();
        $post_top = $posts->shift();
        // dump(123);
        // $posts = $posts->paginate(config('site_settings.elements_per_page.post'));
        if ($request->get('lazyLoad') == 'true') {
            return view('frontend/articles_lazy')->with([
                'posts' => $posts
            ]);
        } else {

            return view('frontend/articles')->with([
                'post_top' => $post_top,
                // 'post_intro' => Introduction::where('type', '=', 'OV')->firstOrFail(),
                'posts' => $posts
            ]);
        }
    }

    //Post tag sort list
    public function tag(Request $request, $locale, $id = null)
    {

        $posts = Post::where('labels.id', '=', $id)
            ->where('posts.status', '=', '1')
            ->where('posts.publish_time', '<', now())
            ->join('post_label', 'posts.id', '=', 'post_label.post_id')
            ->join('labels', 'labels.id', '=', 'post_label.label_id')
            ->select('posts.*', 'labels.name')
            ->distinct()
            ->get();
        $post_top = $posts->shift();
        $posts = $posts->paginate(config('site_settings.elements_per_page.post'));
        if ($request->get('lazyLoad') == 'true') {
            return view('frontend/articles_lazy')->with([
                'posts' => $posts
            ]);
        } else {

            return view('frontend/tag')->with([
                'post_top' => $post_top,
                'posts' => $posts,
                'breadcrumb_title' => $post_top['name']
            ]);
        }
    }

    // Article View
    public function article($slug = null)
    {
        $currentArticle = Post::where('slug', '=', $slug)
            ->where('status', '=', '1')
            ->where('publish_time', '<', now())
            ->firstOrFail();
        if ($currentArticle) {
            // $seos = Label::where('labels.type', 1)
            //     ->join('post_label', 'labels.id', '=', 'post_label.label_id')
            //     ->join('posts', 'posts.id', '=', 'post_label.post_id')
            //     ->where('slug', '=', $slug)
            //     ->select('labels.id', 'labels.name')
            //     ->distinct()
            //     ->get();
            // $keywords = array();
            // foreach ($seos as $s) {
            //     $keywords[] = $s->getTranslation('name', $locale);
            // }

            // $tags = Label::where('labels.type', 0)
            //     ->join('post_label', 'labels.id', '=', 'post_label.label_id')
            //     ->join('posts', 'posts.id', '=', 'post_label.post_id')
            //     ->where('slug', '=', $slug)
            //     ->select('labels.id', 'labels.name')
            //     ->distinct()
            //     ->get();

            // $recoms = collect();
            // if ($tags->count() > 0) {
            //     foreach ($tags as $t) {
            //         $tags_id[] = $t->id;
            //     }
            //     $recoms = Post::where('posts.status', '=', '1')
            //         ->where('posts.id', '<>', $currentArticle->id)
            //         ->where('posts.publish_time', '<', now())
            //         ->whereIn('post_label.label_id', $tags_id)
            //         ->join('post_label', 'posts.id', '=', 'post_label.post_id')
            //         ->orderBy('publish_time', 'desc')
            //         ->orderBy('posts.id', 'desc')
            //         ->select('posts.*')
            //         ->distinct()
            //         ->take(3)
            //         ->get();
            // }

            //dd(DB::getQueryLog()); 
            return view('frontend/article')->with([
                // 'tags'  => $tags,
                // 'keywords'  => implode(',', $keywords),
                // 'recoms' => $recoms,
                'breadcrumb_title' => $currentArticle['title'],
                'currentObj' => $currentArticle
            ]);
        }
    }
}
