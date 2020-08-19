<?php

namespace App\Http\Middleware;

use App\Models\SuperUser;
use Closure;

class AuthorizeBOMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $guard)
    {
        // echo $request->bearerToken();
        $user = SuperUser::where('api_token', $request->bearerToken())->first();
        // echo $users->count() . ' ' . $guard;
        // echo 'user ' . $users[0]->permissions;
        // echo SuperUser::role('BO_manager')->get();
        // echo $users[0]->can($guard);
        if ($user === null || !$user->can($guard))
            return response()->json('Permission denied.', 403);
        return $next($request);
    }
}
