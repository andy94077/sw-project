<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BaseController;
use App\Models\Follow;
use App\Models\User;

class FollowController extends BaseController
{
    public function index(Request $request)
    {
        if ($request['follower_id'] != null && $request['target_id'] != null) {
            $followers = Follow::where('follower_id', $request['follower_id'])->where('target_id', $request['target_id'])->get();
        } else if ($request['follower_id'] != null) {
            $followers = Follow::where('follower_id', $request['follower_id'])->get();
        } else if ($request['target_id'] != null) {
            $followers = Follow::where('target_id', $request['target_id'])->get();
        } else {
            $followers = Follow::all();
        }
        return response()->json($followers);
    }

    public function show($id)
    {
        $follows = Follow::find($id);
        return response()->json($follows);
    }

    public function store(Request $request)
    {
        if ($request['follower_id'] === null || $request['target_id'] === null) {
            return response()->json("follower_id or target_id not found", 404);
        }
        $follows = Follow::withTrashed()->where('follower_id', $request['follower_id'])->where('target_id', $request['target_id'])->get();
        if ($follows->count() !== 0) {
            $follows = $follows[0];
            if ($follows->deleted_at !== null) {
                $follows->restore();
            }
        } else {
            $follows = new Follow();
            $follows->follower_id = $request['follower_id'];
            $follows->target_id = $request['target_id'];
            $follows->save();
        }
        $follower = User::find($request['follower_id']);
        $follower->followings++;
        $follower->save();
        $target = User::find($request['target_id']);
        $target->followers++;
        $target->save();
        return response()->json($follows);
    }

    public function destroy($id)
    {
        $follow = Follow::find($id);
        $follower = User::find($follow->follower_id);
        $follower->followings--;
        $follower->save();

        $target = User::find($follow->target_id);
        $target->followers--;
        $target->save();

        $follow->delete();
        return response()->json($follow);
    }

    public function destroyByUser(Request $request)
    {
        $follow = Follow::where('follower_id', $request['follower_id'])->where('target_id', $request['target_id']);
        return $this->destroy($follow->id);
    }

    public function update($id)
    {
        $follow = Follow::withTrashed()->find($id);
        $follower = User::find($follow->follower_id);
        $follower->followings++;
        $follower->save();
        $target = User::find($follow->target_id);
        $target->followers++;
        $target->save();
        $follow->restore();
        return response()->json($follow);
    }

    public function updateByUser(Request $request)
    {
        $follow = Follow::withTrashed()->where('follower_id', $request['follower_id'])->where('target_id', $request['target_id']);
        return $this->update($follow->id);
    }

    public function getFollowInfo(Request $request)
    {
        $user = User::find($request['user_id']);
        return response()->json(['followers' => $user->followers, 'followings' => $user->followings]);
    }

    public function getFollower(Request $request)
    {
        $user = User::where('name', $request['name'])->first();
        $user_id = $user->id;
        $slex = Follow::LeftJoin('users', 'users.id', '=', 'follows.follower_id')->where('target_id', $user_id)->select('users.id as id', 'users.name as username', 'users.avatar_url as avatar_url');
        $followers = $slex->skip(($request['nextId']) * 10)->take(10)->orderBy('users.id')->get();

        $viewer_followings = Follow::where('follower_id', $request['viewer_id'])->select('follows.target_id as target_id')
            ->orderBy('target_id')->get();
        $i = 0;
        $j = 0;
        while ($i < count($followers) && $j < count($viewer_followings)) {
            if ($followers[$i]->id === $viewer_followings[$j]->target_id) {
                $followers[$i]['isFollow'] = true;
                $i++;
                $j++;
            } else if ($followers[$i]->id < $viewer_followings[$j]->target_id) {
                $followers[$i]['isFollow'] = false;
                $i++;
            } else {
                $j++;
            }
        }
        while ($i < count($followers)) {
            $followers[$i]['isFollow'] = false;
            $i++;
        }

        if (count($followers) > 0) {
            return response()->json(["message" => $followers, 'nextId' => $request['nextId'] + 1], 200);
        } else {
            return response()->json(["message" => $followers, 'nextId' => false], 200);
        }
    }

    public function getFollowing(Request $request)
    {
        $user = User::where('name', $request['name'])->first();
        $user_id = $user->id;
        $slex = Follow::LeftJoin('users', 'users.id', '=', 'follows.target_id')->where('follower_id', $user_id)->select('users.id as id', 'users.name as username', 'users.avatar_url as avatar_url');
        $followings = $slex->skip(($request['nextId']) * 10)->take(10)->get();

        if ($user_id === intval($request['viewer_id'])) {
            foreach ($followings as $following) {
                $following['isFollow'] = true;
            }
        } else {
            $mutual = DB::table('follows')->select(DB::raw('target_id , users.name, count(target_id) as same_follow'))
                ->LeftJoin('users', 'users.id', '=', 'follows.target_id')
                ->where(function ($query) use ($user_id, $request) {
                    $query->where('follower_id', $user_id)->orWhere('follower_id', $request['viewer_id']);
                })
                ->where('follows.deleted_at', null)
                ->groupBy('target_id')->having('same_follow', 2)->orderBy('target_id')->get();

            $i = 0;
            $j = 0;
            while ($i < count($followings) && $j < count($mutual)) {
                if ($followings[$i]->id === $mutual[$j]->target_id) {
                    $followings[$i]['isFollow'] = true;
                    $i++;
                    $j++;
                } else if ($followings[$i]->id < $mutual[$j]->target_id) {
                    $followings[$i]['isFollow'] = false;
                    $i++;
                } else {
                    $j++;
                }
            }
            while ($i < count($followings)) {
                $followings[$i]['isFollow'] = false;
                $i++;
            }
        }
        if (count($followings) > 0) {
            return response()->json(["message" => $followings, 'nextId' => $request['nextId'] + 1], 200);
        } else {
            return response()->json(["message" => $followings, 'nextId' => false], 200);
        }
    }

    public function getFollowingAdmin(Request $request)
    {
        $followings = Follow::withTrashed()->LeftJoin('users', 'users.id', '=', 'follows.follower_id')->where('target_id', $request['user_id'])->select('users.*')->get();
        return response()->json($followings);
    }

    public function getFollowerAdmin(Request $request)
    {
        $followings = Follow::withTrashed()->LeftJoin('users', 'users.id', '=', 'follows.target_id')->where('follower_id', $request['user_id'])->select('users.*')->get();
        return response()->json($followings);
    }
}
