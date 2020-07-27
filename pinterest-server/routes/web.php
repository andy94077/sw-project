<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


// Route::group([
//     'prefix' => '{locale}',
//     'where' => ['locale' => 'en|zh-tw'],
//     'middleware' => 'setLocale'
// ], function () {
Route::get('/', 'Frontend\PostController@posts')->name('frontend.home');
Route::get('/posts', 'Frontend\PostController@posts')->name('frontend.posts');
Route::get('/article/{id}', 'Frontend\PostController@article')->name('frontend.article');
//Route::get('/article/preview/{id}', 'Frontend\BlogController@articlePreview')->name('frontend.article_preview')->middleware('auth');
// Route::get('/article/tag/{id}', 'Frontend\PostController@tag')->name('frontend.tag');
// });

//backend
Route::get('/backend', function () {
    return view('welcome');
})->middleware('auth');


//For experiment only
Route::get('/uploadtest', 'Frontend\UploadController@form')->name('temp.form');
Route::get('/uploaddisplay/{id}', 'Frontend\UploadController@display')->name('temp.display');
Route::post('/upload', 'Frontend\UploadController@upload')->name('temp.upload');

//Upload file for carreer things
Route::get('/uploadtestfile', 'Frontend\UploadController@formFile')->name('temp.formfile');
Route::get('/uploadtestfile/{id}', 'Frontend\UploadController@download')->name('temp.download');
Route::post('/uploadfile', 'Frontend\UploadController@uploadFile')->name('temp.uploadfile');

Route::get('login', 'Auth\LoginController@showLoginForm');
Route::post('login', 'Auth\LoginController@login')->name('login');
Route::get('logout', 'Auth\LoginController@logout');

Route::get('password/reset', 'Auth\ForgotPasswordController@showLinkRequestForm');
Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail')->name('password.email');

Route::get('password/reset/{token}', 'Auth\ResetPasswordController@showResetForm')->name('password.reset');
Route::post('password/reset', 'Auth\ResetPasswordController@reset')->name('password.request');

// for qa test
Route::get('/500', function () {
    abort(500);
});
