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

    Route::get('/likes/sum', 'LikeController@sum');
    Route::apiResource('likes', 'LikeController');
    
    Route::get('/comments/latest', 'CommentController@getLatest');
    Route::get('/comments/info', 'CommentController@getCommentInfo');
    Route::post('/comment/recovery', 'CommentController@recover');
    Route::get('/comments', 'CommentController@index');
    Route::get('/comments/admin', 'CommentController@adminAll');
    Route::get('/comment/post', 'CommentController@showByPost');
    Route::post('/comment/upload', 'CommentController@upload')->middleware(['bucket']);
    Route::delete('/comment', 'CommentController@delete');
    Route::post('/comment/modification', 'CommentController@update')->middleware(['bucket']);;
    Route::apiResource('comments', 'CommentController');


    Route::get('/users/{:userID}/posts', 'PostController@index');

    Route::get('/my/orders/1/payments/3/verify', 'PostController@index');

    Route::get('/posts/latest', 'PostController@getLatest');
    Route::get('/posts/info', 'PostController@getPostInfo');
    Route::post('/post/recovery', 'PostController@recover');
    Route::get('/posts/admin', 'PostController@adminAll');
    Route::get('/post/id', 'PostController@getPictureFromId');
    Route::delete('/image', 'PostController@deleteImage');
    Route::delete('/post', 'PostController@delete');
    Route::post('/post/modification', 'PostController@update')->middleware(['bucket']);
    Route::post('/post/forcedelete', 'PostController@forcedelete')->name('post.forcedelete');
    Route::get('/post/picture', 'PostController@getPictureFromTag')->name('post.getPictureFromTag');
    Route::get('/post/user', 'PostController@getPictureFromUserId')->name('post.getPictureFromUserId');
    Route::apiResource('posts', 'PostController');

    Route::get('users/info', 'UserController@getUserInfo');
    Route::delete('/user/admin', 'UserController@adminDelete');
    Route::post('/user/admin', 'UserController@adminRecover');
    Route::get('/users/admin', 'UserController@adminAll');
    Route::post('/user/bucket', 'UserController@bucket');
    Route::delete('/user/bucket', 'UserController@unBucket');
    Route::post('/upload', 'PostController@uploadImage')->name('post.image_upload');
    Route::post('/user/register','UserController@register')->name('user.register');
    Route::post('/user/logIn','UserController@logIn')->name('user.logIn');
    Route::post('/user/count', 'UserController@count');
    Route::post('/user/authentication','UserController@authentication')->name('user.authentication');
    Route::post('/user/userExist','UserController@userExist')->name('user.userExist');

    Route::middleware('auth:api')->put('/user/password/reset', 'UserController@reset');
    Route::apiResource('users', 'UserController');

    Route::delete('/superUser/admin', 'SuperUserController@adminDelete');
    Route::post('/superUser/admin', 'SuperUserController@adminRecover');
    Route::get('/superUser/admin', 'SuperUserController@adminAll');
    Route::post('/superUser/register','SuperUserController@register')->name('superUser.register');
    Route::post('/superUser/logIn','SuperUserController@logIn')->name('superUser.logIn');
    Route::post('/superUser/authentication','SuperUserController@authentication')->name('superUser.authentication');
    Route::post('/superUser/userExist','SuperUserController@userExist')->name('superUser.userExist');
    Route::middleware('auth:api')->put('/superUser/password/reset', 'SuperUserController@reset');
    Route::apiResource('superUser', 'SuperUserController');
    // for upload images
    Route::post('/profile/uploadImage', 'PostController@uploadImage')->name('profile.uploadImage');
    Route::post('/profile/deleteImage', 'PostController@deleteImage')->name('profile.deleteImage');
    Route::post('/profile/uploadDesc', 'PostController@uploadDesc')->name('profile.uploadDesc');
    // for broadcasting
   Route::post('/broadcast/adPost', 'BroadcastController@adPost')->name('broadcast.adPost');
});
