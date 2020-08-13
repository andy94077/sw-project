<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Like extends Model
{
    use SoftDeletes;
    protected $table = 'likes';
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'post_id'];

    protected static function boot()
    {
        parent::boot();
    }
}
