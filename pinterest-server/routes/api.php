<?php

use App\Http\Controllers\Api\IntroductionController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::namespace('Api')->prefix('v1')->group(function () {
    Route::get('/poststatus/{status}', 'PostController@showByStatus')->name('post.showByStatus');
    Route::patch('/post/status', 'PostController@updateStatus')->name('post.updateStatus');
    Route::get('/post/deleted', 'PostController@deleted')->name('post.deleted');
    Route::post('/post/restore', 'PostController@restore')->name('post.restore');
    Route::patch('/post/delete', 'PostController@delete')->name('post.delete');
    Route::post('/post/forcedelete', 'PostController@forcedelete')->name('post.forcedelete');
    // Route::get('/post/labels', 'PostController@getPostLabel')->name('post.getPostLabel');
    Route::patch('/post/publish/{id}', 'PostController@publish')->name('post.publish');
    Route::get('/get/picture', 'PostController@getPictureFromTag')->name('post.getPicture');
    Route::apiResource('post', 'PostController');

    Route::post('/upload', 'PostController@uploadImage')->name('post.image_upload');

    Route::middleware('auth:api')->put('/user/password/reset', 'UserController@reset');
    Route::apiResource('user', 'UserController');

    // for upload images
    Route::post('/profile/uploadImage', 'PostController@uploadImage')->name('profile.uploadImage');
    Route::post('/profile/deleteImage', 'PostController@deleteImage')->name('profile.deleteImage');
});
