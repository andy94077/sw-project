<?php

namespace App\Http\Controllers\Frontend;

use Exception;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class FrontendController extends Controller
{

  public function __construct()
  {
    // Fetch the Site Settings object
    // move to ViewComposerService
  }

  public function home(Request $request)
  {

    $posts = Post::where('status', '=', '1')
      ->where('publish_time', '<', now())
      ->orderBy('publish_time', 'desc')
      ->orderBy('id', 'desc')
      ->get();
    $post_top = $posts->shift();
    $posts = $posts->paginate(config('site_settings.elements_per_page.post'));
    if ($request->get('lazyLoad') == 'true') {
      return view('frontend/articles_lazy')->with([
        'posts' => $posts
      ]);
    } else {

      return view('frontend/home')->with([
        'post_top' => $post_top,
        // 'post_intro' => Introduction::where('type', '=', 'OV')->firstOrFail(),
        'posts' => $posts
      ]);
    }
  }

  protected function checkCaptcha(Request $request)
  {
    $endpoint = config('site_settings.geetest_endpoint') . '/secondVerify';
    $client = new \GuzzleHttp\Client(['headers' => ['Origin' => $request->getScheme() . '://' . $request->getHttpHost()]]);
    $body = [];
    $success = false;
    $body['challenge'] = $request->get('challenge');
    $body['seccode'] = $request->get('seccode');
    $body['type'] = $request->get('type');
    $body['userId'] = $request->get('userId');
    $body['validate'] = $request->get('validate');
    try {
      $response = $client->post($endpoint, ['form_params' => $body]);
      $data = json_decode($response->getBody());
      if ($data->status == 'success') {
        $success = true;
      }
    } catch (Exception $e) {
      $success = false;
    }
    return $success;
  }
}
