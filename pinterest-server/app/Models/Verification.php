<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Verification extends Model
{
    //
    use SoftDeletes;
    protected $fillable = ['user_id', 'code', 'block_time'];
    protected static function boot()
    {
        parent::boot();
    }
}
