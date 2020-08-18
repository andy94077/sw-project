<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Events\LikeChanged;

class Like extends Model
{
    use SoftDeletes;
    protected $table = 'likes';
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'post_id', 'deleted_at'];

    protected static function boot()
    {
        parent::boot();
    }

    protected $dispatchesEvents = [
        'saved' => LikeChanged::class,
        'deleted' => LikeChanged::class,
        'restored' => LikeChanged::class,
    ];
}
