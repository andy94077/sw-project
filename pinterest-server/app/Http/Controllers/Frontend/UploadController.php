<?php
// This file needs to be deleted
namespace App\Http\Controllers\Frontend;

use App\Models\File;
use App\Models\Image;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{

  public function form()
  {
    // $image = Image::find(2);
    // $image->delete();

    return view('frontend.form');
  }

  public function formFile()
  {
    // delete function will delete from data in database and folder/file
    // $file = File::find(17);
    // $file->delete();
    return view('frontend.formfile');
  }

  public function upload(Request $request)
  {
    $img = $request->file('test');
    $image = new Image();
    $image->upload($img);
    $image->image_alt = "This is test";
    $image->save();
    return redirect()->route('temp.display', $image->id)->with("success", "Upload Successful");
  }

  public function uploadFile(Request $request)
  {

    $uploadFile = $request->file('test');

    $file = new File();

    $file->upload($uploadFile);

    $file->save();

    return redirect()->route('temp.download', $file->id)->with("success", "Upload Successful");
  }

  public function display($id)
  {
    $image = Image::find($id);
    dump($image->url);
    dump($image->path);
  }

  public function download($id)
  {
    $file = File::find($id);
    // dump($file->url);
    // dump($file->path);
    return Storage::download($file->url);
  }
}
