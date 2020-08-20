<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BaseController;
use App\Models\Follow;
use App\Models\User;

class FollowController extends BaseController
{
    public function index(Request $request){
        if($request['follower_id'] != null && $request['target_id'] != null){
            $followers = Follow::where('follower_id', $request['follower_id'])->where('target_id', $request['target_id'])->get();
        }
        else if($request['follower_id'] != null){
            $followers = Follow::where('follower_id', $request['follower_id'])->get();
        }
        else if($request['target_id'] != null){
            $followers = Follow::where('target_id', $request['target_id'])->get();
        }
        else{
            $followers = Follow::all();
        }
        return response()->json($followers);
    }

    public function show($id){
        $follows = Follow::find($id);
        return response()->json($follows);
    }

    public function store(Request $request){
        if($request['follower_id'] === null || $request['target_id'] === null){
            return response()->json("follower_id or target_id not found", 404);
        }
        $follows = Follow::withTrashed()->where('follower_id', $request['follower_id'])->where('target_id', $request['target_id'])->get();
        if($follows->count() !== 0){
            $follows = $follows[0];
            if($follows->deleted_at !== null){
                $follows->restore();
            }
        }
        else{
            $follows = new Follow();
            $follows->follower_id = $request['follower_id'];
            $follows->target_id = $request['target_id'];
            $follows->save();
        }
        $follower = User::find($request['follower_id']);
        $follower->followings ++;
        $follower->save();
        $target = User::find($request['target_id']);
        $target->followers ++;
        $target->save();
        return response()->json($follows);
    }

    public function destroy($id){
        $follow = Follow::find($id);
        $follower = User::find($follow->follower_id);
        $follower->followings --;
        $follower->save();
        $target = User::find($follow->target_id);
        $target->followers --;
        $target->save();
        $follow->delete();
        return response()->json($follow);
    }

    public function destroyByUser(Request $request){
        $follow = Follow::where('follower_id', $request['follower_id'])->where('target_id', $request['target_id']);
        return destroy($follow->id);
    }

    public function update($id){
        $follow = Follow::withTrashed()->find($id);
        $follower = User::find($request['follower_id']);
        $follower->followings ++;
        $follower->save();
        $target = User::find($request['target_id']);
        $target->followers ++;
        $target->save();
        $follow->restore();
        return response()->json($follow);
    }

    public function updateByUser(Request $request){
        $follow = Follow::withTrashed()->where('follower_id', $request['follower_id'])->where('target_id', $request['target_id']);
        return update($follow->id);
    }

    public function getFollowInfo(Request $request){
        $res['followers'] = Follow::where('target_id', $request['user_id'])->count();
        $res['followings'] = Follow::where('follower_id', $request['user_id'])->count();
        return response()->json($res);
    }

    public function getFollowing(Request $request){
        $user = User::where('name', $request['name'])->first();
        $user_id = $user->id;
        $followings = Follow::LeftJoin('users', 'users.id', '=', 'follows.follower_id')->where('target_id', $user_id)->select('users.name as username', 'users.avatar_url as avatar_url')->get();
        return response()->json($followings);
    }

    public function getFollower(Request $request){
        $user = User::where('name', $request['name'])->first();
        $user_id = $user->id;
        $followings = Follow::LeftJoin('users', 'users.id', '=', 'follows.target_id')->where('follower_id', $user_id)->select('users.name as username', 'users.avatar_url as avatar_url')->get();
        return response()->json($followings);
    }

    public function getFollowingAdmin(Request $request){
        echo "hi";
        $followings = Follow::withTrashed()->LeftJoin('users', 'users.id', '=', 'follows.follower_id')->where('target_id', $request['user_id'])->select('users.*')->get();
        return response()->json($followings);
    }

    public function getFollowerAdmin(Request $request){
        $followings = Follow::withTrashed()->LeftJoin('users', 'users.id', '=', 'follows.target_id')->where('follower_id', $request['user_id'])->select('users.*')->get();
        return response()->json($followings);
    }
}
