<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Post;
// use App\Models\PostDraft;
// use App\Models\Label;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Image;
use stdClass;

class UserController extends BaseController
{

    public function register(Request $request)
    {
        $isValid = RegisterController::validator($request);
        // var_dump($isValid->messages());
        if($isValid -> fails()){
            //do something ...
            //var_dump($isValid -> failed());
            //return response()->json(['Message' => "Sign up fails !"], 200);
            return "Sign up fails !";
        }
        else{
            // return "Sign up success !";
            $user = RegisterController::create($request);
            //return response()->json(['Message' => "Sign up seccess !"], 200);
            return "Sign up success !";
        }
    }
}
