<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Post extends Model
{
    //status 1 = published
    //status 0 = draft 
    use SoftDeletes;
    public $timestamps = true;
    protected $table = 'posts';
    protected $primaryKey = 'id';
    protected $fillable = ['url', 'user_id', 'username', 'content', 'tag', 'publish_time'];
    public $image;

    protected static function boot()
    {
        parent::boot();
        static::retrieved(function ($model) {
            $model->image = Image::find($model->banner_id);
        });
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    // public function tags()
    // {
    //     return $this->belongsToMany('App\Models\Label', 'post_label', 'post_id', 'label_id')->where('type', '0')->withTimestamps();
    // }

    // public function seos()
    // {
    //     return $this->belongsToMany('App\Models\Label', 'post_label', 'post_id', 'label_id')->where('type', '1')->withTimestamps();
    // }

    // public function labels()
    // {
    //     return $this->belongsToMany('App\Models\Label', 'post_label', 'post_id', 'label_id')->withTimestamps();
    // }
}
