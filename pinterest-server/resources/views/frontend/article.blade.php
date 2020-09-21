@extends('layouts.main')
@section('title', trans('blog.blog'))  
@section('content')
 
 <!-- essay -->
 <div class="container section-essay" data-aos="fade-up" data-aos-duration="800">
    <article>
        <h1>{{$currentObj['title']}}</h1>
        <p class="subtitle">Test subtitle this story will be especially useful for beginners, but all designers can keep these tips in mind, regardless of experience.</p>
        <img class="preview-banner" src="{{$currentObj->image->url['desktop']}}">
        {!!stripslashes($currentObj['body'])!!}
    </article>
</div>
 
 
@endsection
