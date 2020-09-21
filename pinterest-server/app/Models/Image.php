<?php

namespace App\Models;

use App\Libraries\DefaultImage;
use App\Uploaders\ImageUploader;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class Image extends Model
{
    protected $table = 'images';
    protected $primaryKey = 'id';
    protected static $directory = 'image';
    public $url = [];
    public $path = [];

    protected static function boot()
    {
        parent::boot();
        $dir = self::$directory;
        static::deleting(function ($model) use ($dir) {
            ImageUploader::destroy($dir, $model->id);
        });

        static::retrieved(function ($model) use ($dir) {
            $versions = config('uploader.image.versions');
            $versions['original'] = [0, 0];
            foreach ($versions as $version => $size) {
                $path = public_path() . '/' . config('uploader.image.upload_dir') . '/' . $dir . '/' . $model->id . '/' . $version . '/' . $model->image_name;
                if (file_exists($path)) {
                    $model->url[$version] = '/' . config('uploader.image.upload_dir') . '/' . $dir . '/' . $model->id . '/' . $version . '/' . $model->image_name;
                    $model->path[$version] = $path;
                } else {
                    $model->url[$version] = '/img/' . config('uploader.image.default_image');
                    $model->path[$version] = public_path() . '/img' . config('uploader.image.default_image');
                }
            }
        });

        static::saved(function ($model) use ($dir) {
            $versions = config('uploader.image.versions');
            $versions['original'] = [0, 0];
            foreach ($versions as $version => $size) {
                $path = public_path() . '/' . config('uploader.image.upload_dir') . '/' . $dir . '/' . $model->id . '/' . $version . '/' . $model->image_name;
                if (file_exists($path)) {
                    $model->url[$version] = '/' . config('uploader.image.upload_dir') . '/' . $dir . '/' . $model->id . '/' . $version . '/' . $model->image_name;
                    $model->path[$version] = $path;
                } else {
                    $model->url[$version] = '/img/' . config('uploader.image.default_image');
                    $model->path[$version] = public_path() . '/img' . config('uploader.image.default_image');
                }
            }
        });
    }

    /**
     * @param UploadedFile $file
     * @return bool
     */
    public function upload(UploadedFile $file)
    {
        $data = DB::select("show table status like '" . $this->table . "'");
        $id = $data[0]->Auto_increment;
        $this->image_name = $file->getClientOriginalName();
        return ImageUploader::upload($file, self::$directory, (string) $id);
    }

    public static function find($key)
    {
        $obj = self::where('id', $key)->limit(1);
        $img = null;
        if ($obj->count() == 0) {
            $img = self::getDefault();
        } else {
            $img = $obj->first();
        }
        return $img;
    }

    /**
     * @return DefaultImage
     */
    public static function getDefault()
    {
        return new DefaultImage();
    }
}
