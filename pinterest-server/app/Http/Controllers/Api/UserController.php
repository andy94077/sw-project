<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Verification;
use App\Http\Controllers\Auth\RegisterController;
use App\Models\User;
use App\Models\Post;
use App\Models\Follow;
use App\Models\Comment;
use DateTime;
use DateInterval;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\test;

class UserController extends BaseController
{
    public function index(Request $request)
    {
        $userInfo = User::where('id', intval($request['user_id']))->first();
        return response()->json([
            'name' => $userInfo->name,
            'avatar_url' => $userInfo->avatar_url,
            'online_time' => $userInfo->online_time,
        ], 200);
    }

    public function logIn(Request $request)
    {
        if (Auth::attempt(['email' => $request['email'], 'password' => $request['password']], true)) {
            return response()->json([
                'name' => Auth::user()->name,
                'Message' => "Login success!",
                'token' => Auth::user()->hasVerifiedEmail() ? Auth::user()->remember_token : "",
                'isLogin' => true,
                'api_token' => Auth::user()->api_token,
                'verified' => Auth::user()->hasVerifiedEmail(),
                'user_id' => Auth::user()->id,
            ], 200);
        } else {
            return response()->json(['Message' => "Login fails!", 'isLogin' => false], 200);
        }
    }

    public function register(Request $request)
    {
        $isValid = RegisterController::validator($request);
        $errorMes = $isValid->messages();
        $errorMesContent = $isValid->messages()->messages();
        $isContentInvalid = array('name' => $errorMes->has('name'), 'email' => $errorMes->has('email'), 'password' => $errorMes->has('password'));
        if ($isValid->fails()) {
            return response()->json(['Message' => "Sign up fails!", 'isSignUp' => false, "isContentInvalid" => $isContentInvalid, "errorMesContent" => $errorMesContent], 200);
        } else {
            $user = RegisterController::create($request);
            $user->generateCode();
            $user->sendEmailVerificationNotification();
            if (Auth::attempt(['email' => $request['email'], 'password' => $request['password']], true)) {
                return response()->json([
                    'name' => Auth::user()->name,
                    'Message' => "Sign up success!",
                    'isSignUp' => true,
                    'isLogin' => true,
                    'user_id' => $user->id,
                ], 200);
            } else {
                return response()->json(['Message' => "Sign up success but Login fails!", 'isSignUp' => false, 'isLogin' => false], 200);
            }
        }
    }

    public function logOut()
    {
        if (Auth::logout()) {
            return response()->json(['Message' => "Logout success!", 'isLogout' => true], 200);
        } else {
            return response()->json(['Message' => "Please try again!", 'isLogout' => false], 200);
        }
    }

    public function authentication(Request $request)
    {
        $userToken = $request['accessToken'];
        if ($userToken === null || $userToken === '') {
            return response()->json(['isValid' => false], 200);
        }
        $userInfo = User::where('remember_token', $userToken)->first();
        if ($userInfo === null) {
            return response()->json(['isValid' => false], 200);
        } else {
            return response()->json([
                'username' => $userInfo->name,
                'user_id' => $userInfo->id,
                'isValid' => true,
                'verified' => $userInfo->hasVerifiedEmail(),
                'avatar_url' => $userInfo->avatar_url,
                'bucket_time' => $userInfo->bucket_time,
                'api_token' => $userInfo->api_token,
                'followers' => $userInfo->followers,
                'followings' => $userInfo->followings,
                'point' => $userInfo->point,
            ], 200);
        }
    }

    public function userExist(Request $request)
    {
        $userInfo = User::where('name', $request['name'])->first();
        if ($userInfo === null) {
            return response()->json(['isValid' => false], 200);
        } else {
            return response()->json([
                'name' => $userInfo->name,
                'id' => $userInfo->id,
                'avatar_url' => $userInfo->avatar_url,
                'isValid' => true
            ], 200);
        }
    }

    public function count(Request $request)
    {
        if ($request['id'] != null) {
            $user = User::find($request['id']);
            $user->online_time = Carbon::now();
            $user->save();
            return response()->json($user, 200);
        }
        return response()->json("Id not found", 404);
    }

    public function bucket(Request $request)
    {
        if ($request['id']) {
            $user = User::withTrashed()->find($request['id']);
            if ($user === null)
                return response()->json('user not found', 404);
            $date = new DateTime(null);
            $h = ($request['hour']) ? $request['hour'] : 0;
            $d = ($request['day']) ? $request['day'] : 0;
            $y = ($request['year']) ? $request['year'] : 0;
            $m = ($request['month']) ? $request['month'] : 0;
            $date->add(new DateInterval("P{$y}Y{$m}M{$d}DT{$h}H0M0S"));
            $user->bucket_time = $date->format('Y-m-d\TH:i:s');
            $user->save();
            return response()->json($user, 200);
        }
        return $this->sendError("id not found", 404);
    }

    public function unBucket(Request $request)
    {
        if ($request['id']) {
            $user = User::withTrashed()->find($request['id']);
            if ($user === null)
                return response()->json('user not found', 404);
            $user->bucket_time = null;
            $user->save();
            return response()->json($user, 200);
        }
        return $this->sendError("id not found", 404);
    }

    public function adminAll(Request $request)
    {
        $query = User::withTrashed();
        if ($request['id'] !== null) {
            $query = $query->where('id', 'like', "%{$request['id']}%");
        }
        if ($request['name'] !== null) {
            $query = $query->where('name', 'like', "%{$request['name']}%");
        }
        if ($request['email'] !== null) {
            $query = $query->where('email', 'like', "%{$request['email']}%");
        }

        foreach (array('online_time', 'bucket_time', 'deleted_at', 'created_at', 'updated_at') as $col) {
            if ($request[$col][0] !== null && $request[$col][1] !== null) {
                $query = $query->whereBetween($col, array(gmdate('Y.m.d H:i:s', strtotime($request[$col][0])), gmdate('Y.m.d H:i:s', strtotime($request[$col][1]))));
            } elseif ($request[$col][0] !== null && $request[$col][1] === null) {
                $query = $query->where($col, '>=', gmdate('Y.m.d H:i:s', strtotime($request[$col][0])));
            } elseif ($request[$col][0] === null && $request[$col][1] !== null) {
                $query = $query->where($col, '<=', gmdate('Y.m.d H:i:s', strtotime($request[$col][1])));
            }
        }

        $size = $query->count();
        $users['data'] = $query->skip(($request['page'] - 1) * $request['size'])->take($request['size'])->get();
        $users['total'] = $size;

        return response()->json($users, 200);
    }

    public function adminDelete(Request $request)
    {
        $user = User::find($request['id']);
        if ($user === null)
            return response()->json('user not found', 404);
        $user->delete();
        return $this->sendResponse($user, "success");
    }

    public function adminRecover(Request $request)
    {
        $user = User::withTrashed()->find($request['id']);
        if ($user === null)
            return response()->json('user not found', 404);
        $user->restore();
        return $this->sendResponse($user, "success");
    }

    public function getUserInfo()
    {
        $res['online'] = User::where('online_time', '>=', Carbon::parse('-10 minutes'))->count();
        $res['valid'] = User::all()->count();
        $res['new'] = User::where('created_at', '>=', Carbon::parse('-1 days'))->count();
        return response()->json($res);
    }

    public function uploadUserAvatar(Request $request)
    {
        if ($request["imgBase64"] === "" || $request["imgBase64"] === null) {
            return response()->json(["message" => "no file"], 404);
        } else {
            $user = User::where('name', $request['name'])->first();
            $flag = true;
            for ($i = 0; $i < 5; $i++) {
                if ($user->avatar_url === "/img/avatar" . $i . ".jpeg") {
                    $flag = false;
                }
            }
            if ($flag === true) {
                unlink(substr($user->avatar_url, 1));
            }

            $output_file = "img/" . $request["name"] . "Avatar" . ((new DateTime())->format('Y-m-d--H:i:s')) . ".jpeg";
            $ifp = fopen($output_file, 'wb');
            $data = explode(',', $request["imgBase64"]);
            fwrite($ifp, base64_decode($data[1]));
            fclose($ifp);

            $user = User::where('name', $request['name'])->first();
            $user->avatar_url = "/" . $output_file;
            $user->save();
            return response()->json($output_file);
        }
    }

    public function getUserAvatar(Request $request)
    {
        $user = User::where('name', $request['name'])->first();
        $img_location = $user->avatar_url;
        return response()->json($img_location);
    }

    public function setIntro(Request $request)
    {
        $user = User::find($request['user_id']);
        $user->intro = $request['intro'];
        $user->save();
        return response()->json($user);
    }

    public function getIntro(Request $request)
    {
        $user = User::where('name', $request['name'])->first();
        $res['intro'] = $user->intro;
        return response()->json($res);
    }

    public function mail()
    {
        Mail::to('b07902011@ntu.edu.tw')->send(new test('Hello'));
        if (count(Mail::failures()) > 0) {
            return "failed";
        }
        return "send mail";
    }

    public function verify(Request $request)
    {
        $user = User::find($request['user_id']);
        $verification = Verification::where('user_id', $user->id)->first();
        $verification->save();
        $code = $verification->code;
        if ($code === $request['code']) {
            //$user->email_verified_at =  now();
            $user->markEmailAsVerified();
            $user->save();
            return response()->json(['token' => $user->remember_token]);
        }
        return response()->json('failed', 403);
    }

    public function getVerifyTime($id)
    {
        $verification = Verification::where('user_id', $id)->first();
        return response()->json(['time' => $verification->block_time]);
    }

    public function resend(Request $request, $id)
    {
        $user = User::find($id);
        $verification = Verification::where('user_id', $id)->first();
        $verification->block_time = $request['time'];
        $verification->code = Str::random(10);
        $verification->save();
        $user->sendEmailVerificationNotification();
        return response()->json(['Message' => 'success']);
    }
}
