<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $fillable = ['group', 'user_id', 'header', 'secondary', 'content'];

    protected static function boot()
    {
        parent::boot();
    }
}
