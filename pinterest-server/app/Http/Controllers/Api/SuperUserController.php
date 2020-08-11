<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\SuperRegisterController;
use Illuminate\Support\Facades\Validator;
use App\Models\SuperUser;
use App\Models\Image;

class SuperUserController extends BaseController
{
    public function logIn(Request $request)
    {
        if (Auth::guard("super_users")->attempt(['email' => $request['email'], 'password' => $request['password']], true)) {
            return response()->json([
                'name' => Auth::guard("super_users")->user()->name,
                'Message' => "Login success!",
                'token' => Auth::guard("super_users")->user()->remember_token,
                'isLogin' => true
            ], 200);
        } else {
            return response()->json(['Message' => "Login fails!", 'isLogin' => false], 200);
        }
    }

    public function register(Request $request)
    {
        $isValid = SuperRegisterController::validator($request);
        $errorMes = $isValid->messages();
        $errorMesContent = $isValid->messages()->messages();
        $isContentInvalid = array('name' => $errorMes->has('name'), 'email' => $errorMes->has('email'), 'password' => $errorMes->has('password'));

        if ($isValid->fails()) {
            return response()->json([
                'Message' => "Sign up fails!",
                'isSignUp' => false,
                'name' => array('valid' => !$isContentInvalid['name'], 'msg' => $errorMesContent['name'][0] ?? ""),
                'email' => array('valid' => !$isContentInvalid['email'], 'msg' => $errorMesContent['email'][0] ?? ""),
                'password' => array('valid' => !$isContentInvalid['password'], 'msg' => $errorMesContent['password'][0] ?? "")
            ], 200);
        } else {
            $user = SuperRegisterController::create($request);
            return response()->json(['Message' => "Sign up seccess!", 'isSignUp' => true], 200);
        }
    }

    public function logOut()
    {
        if (Auth::guard("super_users")->logout()) {
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
        $userInfo = SuperUser::where('remember_token', $userToken)->first();
        if ($userInfo === null) {
            return response()->json(['isValid' => false], 200);
        } else {
            return response()->json([
                'username' => $userInfo->name,
                'user_id' => $userInfo->id,
                'isValid' => true
            ], 200);
        }
    }

    public function userExist(Request $request)
    {
        $userInfo = SuperUser::where('name', $request['name'])->first();
        if ($userInfo === null) {
            return response()->json(['isValid' => false], 200);
        } else {
            return response()->json([
                'name' => $userInfo->name,
                'id' => $userInfo->id,
                'isValid' => true
            ], 200);
        }
    }

    public function adminAll(Request $request)
    {
        $query = SuperUser::withTrashed();
        if ($request['id']) {
            $query = $query->where('id', 'like', "%{$request['id']}%");
        }
        if ($request['name']) {
            $query = $query->where('name', 'like', "%{$request['name']}%");
        }
        if ($request['email']) {
            $query = $query->where('email', 'like', "%{$request['email']}%");
        }

        if ($request['deleted_at'][0] !== null && $request['deleted_at'][1] !== null) {
            $query = $query->whereBetween('deleted_at', $request['deleted_at']);
        } else if ($request['deleted_at'][0] !== null && $request['deleted_at'][1] === null) {
            $query = $query->where('deleted_at', '>=', $request['deleted_at'][0]);
        } else if ($request['deleted_at'][0] === null && $request['deleted_at'][1] !== null) {
            $query = $query->where('deleted_at', '<=', $request['deleted_at'][1]);
        }

        if ($request['created_at'][0] !== null && $request['created_at'][1] !== null) {
            $query = $query->whereBetween('created_at', $request['created_at']);
        } else if ($request['created_at'][0] !== null && $request['created_at'][1] === null) {
            $query = $query->where('created_at', '>=', $request['created_at'][0]);
        } else if ($request['created_at'][0] === null && $request['created_at'][1] !== null) {
            $query = $query->where('created_at', '<=', $request['created_at'][1]);
        }

        if ($request['updated_at'][0] !== null && $request['updated_at'][1] !== null) {
            $query = $query->whereBetween('updated_at', $request['updated_at']);
        } else if ($request['updated_at'][0] !== null && $request['updated_at'][1] === null) {
            $query = $query->where('updated_at', '>=', $request['updated_at'][0]);
        } else if ($request['updated_at'][0] === null && $request['updated_at'][1] !== null) {
            $query = $query->where('updated_at', '<=', $request['updated_at'][1]);
        }

        $size = $query->count();
        $users['data'] = $query->skip(($request['page'] - 1) * $request['size'])->take($request['size'])->get();
        $users['total'] = $size;
        return response()->json($users, 200);
    }

    public function adminDelete(Request $request)
    {
        $user = SuperUser::find($request['id']);
        $user->delete();
        return $this->sendResponse($user, "success");
    }

    public function adminRecover(Request $request)
    {
        $user = SuperUser::withTrashed()->find($request['id']);
        $user->restore();
        return $this->sendResponse($user, "success");
    }
}
