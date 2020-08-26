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
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

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

    public function store(Request $request)
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
            $user->syncRoles($request['roles']);
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
                'roles' => $userInfo->getRoleNames(),
                'permissions' => ($userInfo->hasRole('admin') ?
                    Permission::where('guard_name', 'super_users')->pluck('name') :
                    $userInfo->getAllPermissions()->pluck('name')),
                'api_token' => $userInfo->api_token,
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

    public function index(Request $request)
    {
        $query = SuperUser::withTrashed()->with('roles');
        if ($request['id']) {
            $query = $query->where('id', 'like', "%{$request['id']}%");
        }
        if ($request['name']) {
            $query = $query->where('name', 'like', "%{$request['name']}%");
        }
        if ($request['email']) {
            $query = $query->where('email', 'like', "%{$request['email']}%");
        }

        if ($request['roles']) {
            foreach ($request['roles'] as $role) {
                $query = $query->role($role);
            }
        }

        foreach (array('deleted_at', 'created_at', 'updated_at') as $col) {
            if ($request[$col][0] !== null && $request[$col][1] !== null) {
                $query = $query->whereBetween($col, array(gmdate('Y.m.d H:i:s', strtotime($request[$col][0])), gmdate('Y.m.d H:i:s', strtotime($request[$col][1]))));
            } else if ($request[$col][0] !== null && $request[$col][1] === null) {
                $query = $query->where($col, '>=', gmdate('Y.m.d H:i:s', strtotime($request[$col][0])));
            } else if ($request[$col][0] === null && $request[$col][1] !== null) {
                $query = $query->where($col, '<=', gmdate('Y.m.d H:i:s', strtotime($request[$col][1])));
            }
        }

        $size = $query->count();
        $users['data'] = $query->skip(($request['page'] - 1) * $request['size'])->take($request['size'])->get();
        $users['total'] = $size;
        return response()->json($users, 200);
    }

    public function destroy($id)
    {
        $user = SuperUser::find($id);
        if ($user === null)
            return response()->json('user not found', 404);
        $user->delete();
        return response()->json('success');
    }

    // recover user
    public function update($id)
    {
        $user = SuperUser::withTrashed()->find($id);
        if ($user === null)
            return response()->json('user not found', 404);
        $user->restore();
        return response()->json('success');
    }

    public function getAllRoles()
    {
        $roles = Role::where('guard_name', 'super_users')->orderBy('name')->pluck('name');
        return response()->json($roles);
    }

    public function ChangeRoles(Request $request)
    {
        $user = SuperUser::find($request['id']);
        $user->syncRoles($request['roles']);
        return response()->json('success');
    }
}
