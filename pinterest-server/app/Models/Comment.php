<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Events\CommentChanged;

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
    
    // Post events
    protected $dispatchesEvents = [
        'saved' => CommentChanged::class,
        'deleted' => CommentChanged::class,
        'restored' => CommentChanged::class,
    ];
}
