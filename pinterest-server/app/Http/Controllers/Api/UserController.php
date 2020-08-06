<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Post;
use Auth;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Image;
use stdClass;
use DateTime;
use DateInterval;

class UserController extends BaseController
{

    public function logIn(Request $request)
    {
        if(Auth::attempt(['email' => $request['email'], 'password' => $request['password']], true)){
            return response()->json(['name' => Auth::user()->name, 'Message' => "Login success!", 'token' => Auth::user()->remember_token, 'isLogin' => true], 200);
        }
        else {
            return response()->json(['Message' => "Login fails!",'isLogin' => false], 200);
        }
    }

    public function register(Request $request)
    {
        $isValid = RegisterController::validator($request);
        $errorMes = $isValid->messages();
        $errorMesContent = $isValid->messages()->messages();
        $isContentInvalid = array('name' => $errorMes->has('name'), 'email' => $errorMes->has('email'), 'password' => $errorMes->has('password'));
        if($isValid -> fails()){
            return response()->json(['Message' => "Sign up fails!",'isSignUp' => false, "isContentInvalid" => $isContentInvalid, "errorMesContent" => $errorMesContent], 200);
        }
        else{
            $user = RegisterController::create($request);
            if(Auth::attempt(['email' => $request['email'], 'password' => $request['password']], true)){
                return response()->json(['name' => Auth::user()->name, 'Message' => "Sign up seccess!",'isSignUp' => true, 'isLogin' => true, 'token' => Auth::user()->remember_token], 200);
            }
            else {
                return response()->json(['Message' => "Sign up seccess but Login fails!",'isSignUp' => false, 'isLogin' => false], 200);
            }
        }
    }

    public function logOut()
    {
        if(Auth::logout()){
            return response()->json(['Message' => "Logout success!",'isLogout' => true], 200);
        }
        else{
            return response()->json(['Message' => "Please try again!",'isLogout' => false], 200);
        }
    }

    public function authentication(Request $request)
    {
        $userToken = $request['accessToken'];
        if($userToken === null || $userToken === ''){
            return response()->json(['isValid' => false], 200);
        }
        $userInfo = User::where('remember_token', $userToken)->first();
        if($userInfo === null){
            return response()->json(['isValid' => false], 200);
        }
        else{
            return response()->json([
                'username' => $userInfo->name,
                'user_id' => $userInfo->id,
                'isValid' => true
            ], 200);
        }
    }
    
    public function userExist(Request $request)
    {
        $userInfo = User::where('name', $request['name'])->first();
        if($userInfo === null){
            return response()->json(['isValid' => false], 200);
        }
        else{
            return response()->json([
                'name' => $userInfo->name,
                'id' => $userInfo->id,
                'avatar_url' => $userInfo->avatar_url,
                'isValid' => true
            ], 200);
        }
    }

    public function count(Request $request){
        $user = User::find($request['id']);
        $user->online_time = date("Y-m-d H:i:s");
        $user->save();
        return response()->json("", 200);
    }

    public function bucket(Request $request){
        if($request['id']){
            $user = User::find($request['id']);
            $date = new DateTime(date("Y-m-d H:i:s"));
            $h = ($request['hour'])?$request['hour']:0;
            $d = ($request['day'])?$request['day']:0;
            $y = ($request['year'])?$request['year']:0;
            $m = ($request['month'])?$request['month']:0;
            $date->add(new DateInterval("P{$y}Y{$m}M{$d}DT{$h}H0M0S"));
            $user->bucket_time = $date->format('Y-m-d H:i:s');
            $user->save();
            return response()->json( $user, 200);
        }
        return $this->sendError("id not found", 404);
    }

    public function unBucket(Request $request){
        if($request['id']){
            $user = User::find($request['id']);
            $user->bucket_time = null;
            $user->save();
            return response()->json( $user, 200);
        }
        return $this->sendError("id not found", 404);
    }

    public function adminAll(Request $request){
        $users = User::withTrashed()->get();
        return $this->sendResponse($users, 'Users was successfully got');
    }

    public function adminDelete(Request $request){
        $user = User::find($request['id']);
        $user->delete();
        return $this->sendResponse($user, "success");
    }

    public function adminRecover(Request $request){
        $user = User::withTrashed()->find($request['id']);
        $user->restore();
        return $this->sendResponse($user, "success");
    }
}
