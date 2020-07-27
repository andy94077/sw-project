@extends('layouts.main')
@section('title', trans('home.blog'))
@section('content') 
{{-- @include('partials._nav')   --}}

<!-- blog main section -->
<div class="container wave-bottom">
    <section>
        <h4 class="mt-60 mb--85">{{__('blog.subtitle')}}</h4>
        <div class="row">
            <div class="col-5 mt-100">
                <h1><span class="highlight">{{__('blog.title')}}</span></h1>
            </div>
            <div class="col-2"></div>
            <div class="col-5">
            <div id="lottie-blog"></div>
            </div>
        </div>
    </section>
</div>

<script src="{{ asset('js/lotties.js')}}"></script>
@include('partials._article_list')  
@endsection
    