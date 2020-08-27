<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Mail;
use App\Mail\test;
use App\Models\Verification;
use DateTime;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'avatar_url', 'api_token', 'followers', 'followings'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'api_token'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token, $this->name));
    }

    public function users()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'id');
    }

    public function getBucketTimeAttribute($value){
        if($value != null)
            return (new DateTime($value))->format('c');
        return null;
    }

    public function getOnlineTimeAttribute($value){
        if($value != null)
            return (new DateTime($value))->format('c');
        return null;
    }

    public function generateCode(){
        $verification = new Verification();
        $verification->user_id = $this->id;
        $verification->code = Str::random(10);
        $verification->save();
    }

    public function sendEmailVerificationNotification(){
        $verification = Verification::where('user_id', $this->id)->first();
        Mail::to($this->email)->send(new test($verification ->code));
    }
}
