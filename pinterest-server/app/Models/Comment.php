<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use SoftDeletes;
    protected $table = 'comments';
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'post_id', 'content'];

    protected static function boot()
    {
        parent::boot();
    }
}
