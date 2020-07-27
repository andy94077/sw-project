<?php

namespace App\Libraries;

class DefaultImage
{
    public $image_alt = 'This is an image';
    public $image_name;
    public $url = [];
    public $path = [];
    public $created_at;
    public $updated_at;

    public function __construct()
    {
        $this->image_name = config('uploader.image.default_image');
        $versions = config('uploader.image.versions');
        $versions['original'] = [0, 0];
        $this->created_at = date('Y-m-d H:i:s');
        $this->updated_at = date("Y-m-d H:i:s");
        foreach ($versions as $version => $size) {
            $this->url[$version] = '/img/' . $this->image_name;
            $this->path[$version] = public_path() . '/img/' . $this->image_name;
        }
    }
}
