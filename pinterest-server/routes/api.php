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
    Route::get('/follows/followers/admin', 'FollowController@getFollowerAdmin');
    Route::get('/follows/followers', 'FollowController@getFollower');
    Route::get('/follows/followings/admin', 'FollowController@getFollowingAdmin');
    Route::get('/follows/followings', 'FollowController@getFollowing');
    Route::get('/follows/info', 'FollowController@getFollowInfo');
    Route::delete('/follows/user', 'FollowController@destroyByUser');
    Route::apiResource('follows', 'FollowController');

    Route::get('/likes/latest', 'LikeController@getLatest');
    Route::get('/likes/sum', 'LikeController@sum');
    Route::apiResource('likes', 'LikeController');

    Route::get('/comments/latest', 'CommentController@getLatest');
    Route::get('/comments/info', 'CommentController@getCommentInfo');
    Route::post('/comment/recovery', 'CommentController@recover');
    Route::get('/comments/admin', 'CommentController@adminAll');
    Route::post('/comment/upload', 'CommentController@upload')->middleware(['bucket']);
    Route::post('/comments/{id}', 'CommentController@update')->middleware(['bucket']);
    ;
    Route::apiResource('comments', 'CommentController');


    Route::get('/users/{:userID}/posts', 'PostController@index');

    Route::get('/my/orders/1/payments/3/verify', 'PostController@index');

    Route::get('/posts/latest', 'PostController@getLatest');
    Route::get('/posts/info', 'PostController@getPostInfo');
    Route::post('/post/recovery', 'PostController@recover')->middleware('BO_can:recover_post');
    Route::get('/posts/admin', 'PostController@adminAll');
    Route::delete('/image', 'PostController@deleteImage');
    Route::delete('/post', 'PostController@delete')->middleware('BO_can:delete_post');
    Route::post('/post/modification', 'PostController@update')->middleware(['bucket']);
    Route::post('/post/forcedelete', 'PostController@forcedelete')->name('post.forcedelete');
    Route::apiResource('posts', 'PostController');

    Route::post('users/intro', 'UserController@setIntro');
    Route::get('users/intro', 'UserController@getIntro');
    Route::get('users/info', 'UserController@getUserInfo');
    Route::delete('/user/admin', 'UserController@adminDelete')->middleware('BO_can:delete_user');
    Route::post('/user/admin', 'UserController@adminRecover')->middleware('BO_can:recover_user');
    Route::get('/users/admin', 'UserController@adminAll');
    Route::post('/user/bucket', 'UserController@bucket')->middleware('BO_can:bucket');
    Route::delete('/user/bucket', 'UserController@unBucket')->middleware('BO_can:unbucket');
    Route::post('/upload', 'PostController@uploadImage')->name('post.image_upload');
    Route::post('/user/register', 'UserController@register')->name('user.register');
    Route::post('/user/logIn', 'UserController@logIn')->name('user.logIn');
    Route::post('/user/count', 'UserController@count');
    Route::post('/user/authentication', 'UserController@authentication')->name('user.authentication');
    Route::post('/user/userExist', 'UserController@userExist')->name('user.userExist');
    Route::post('/user/uploadUserAvatar', 'UserController@uploadUserAvatar')->name('user.uploadUserAvatar');
    Route::post('/user/getUserAvatar', 'UserController@getUserAvatar')->name('user.getUserAvatar');

    Route::middleware('auth:api')->put('/user/password/reset', 'UserController@reset');
    Route::apiResource('users', 'UserController');

    Route::get('/superUser/allRoles', 'SuperUserController@getAllRoles')->middleware('BO_can:view_BO_user');
    Route::post('/superUser/roles', 'SuperUserController@changeRoles')->middleware('BO_can:change_BO_user_role');
    Route::post('/superUser/logIn', 'SuperUserController@logIn')->name('superUser.logIn');
    Route::post('/superUser/authentication', 'SuperUserController@authentication')->name('superUser.authentication');
    Route::post('/superUser/userExist', 'SuperUserController@userExist')->name('superUser.userExist');

    Route::apiResource('superUser', 'SuperUserController')->only(['index'])->middleware('BO_can:view_BO_user');
    Route::apiResource('superUser', 'SuperUserController')->only(['store'])->middleware('BO_can:register_BO_user');
    Route::Resource('superUser', 'SuperUserController')->only(['update'])->middleware('BO_can:recover_BO_user');
    Route::Resource('superUser', 'SuperUserController')->only(['destroy'])->middleware('BO_can:delete_BO_user');

    // for upload images
    Route::post('/profile/uploadImage', 'PostController@uploadImage')->name('profile.uploadImage')->middleware(['bucket']);
    Route::post('/profile/deleteImage', 'PostController@deleteImage')->name('profile.deleteImage');
    Route::post('/profile/uploadDesc', 'PostController@uploadDesc')->name('profile.uploadDesc')->middleware(['bucket']);
    // for broadcasting
    Route::apiResource('broadcast', 'BroadcastController')->middleware('BO_can:make_announcement');
    Route::post('broadcast/chatting', 'BroadcastController@chatting')->name('broadcast.chatting');
    Route::apiResource('notifications', 'NotificationController');
    Route::resource('chatroom', 'ChatroomController');
    Route::resource('chatbox', 'ChatBoxController');
});
