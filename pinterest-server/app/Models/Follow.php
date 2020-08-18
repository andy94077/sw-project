<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Follow extends Model
{
    use SoftDeletes;
    protected $table = 'follows';
    public $timestamps = true;
    protected $primaryKey = 'id';
    protected $fillable = ['follower_id', 'target_id', 'deleted_at'];

    protected static function boot()
    {
        parent::boot();
    }
}
