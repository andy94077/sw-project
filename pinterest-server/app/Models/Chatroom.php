<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chatroom extends Model
{
    protected $table = 'chatrooms';
    protected $primaryKey = 'id';
    protected $fillable = ['user_id1', 'user_id2', 'username1', 'username2', 'last_message'];

     protected static function boot()
    {
        parent::boot();
    }
}
