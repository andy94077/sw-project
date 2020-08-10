<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use DateTime;

class BucketMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = User::find($request['user_id']);
        $now = new DateTime("now");
        echo $user;
        if($user->bucket_time && $now < new DateTime($user['bucket_time']))
            return response()->json("In Bucket", 403);
        return $next($request);
    }
}
