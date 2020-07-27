<?php

namespace App\Uploaders;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

class ImageUploader
{

  private static $uploadDir;
  private static $dir;

  /**
   *
   * @param UploadedFile $file
   * @param string $modelDirectory
   * @param string $id
   * @return bool
   */

  public static function upload(UploadedFile $file, String $modelDirectory, String $id)
  {
    self::$uploadDir = config('uploader.image.upload_dir');
    self::$dir = public_path() . '/' . self::$uploadDir . '/' . $modelDirectory . '/' . $id;
    $dir = self::$dir . '/original';
    if (!file_exists($dir)) {
      mkdir($dir, 0755, true);
    }
    $file->move($dir, $file->getClientOriginalName());
    self::makeVersions($file->getClientOriginalName());
    return true;
  }

  /**
   *
   * @param string $modelDirectory
   * @param string $id
   * @return bool
   */

  public static function destroy(String $modelDirectory, String $id)
  {
    self::$uploadDir = config('uploader.image.upload_dir');
    $dir = public_path() . '/' . self::$uploadDir . '/' . $modelDirectory . '/' . $id . '/';
    if (file_exists($dir)) {
      return File::deleteDirectory($dir);
    } else {
      return false;
    }
  }

  private static function makeVersions(String $fileName)
  {
    $versions = config('uploader.image.versions');
    foreach ($versions as $version => $sizes) {
      $dir = self::$dir . '/' . $version;
      if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
      }
      $img = self::$dir . '/original/' . $fileName;
      $image = Image::make($img);
      $image->fit($sizes[0], $sizes[1])->save($dir . '/' . $fileName);
    }
    return true;
  }
}
