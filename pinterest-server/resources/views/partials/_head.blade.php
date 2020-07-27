<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<!-- CSRF Token -->
<!-- <meta name="csrf-token" content="{{ csrf_token() }}"> -->
<meta name="keywords" content="@yield('meta_keywords',__('home.funpodium'))">
<meta name="description" content="@yield('meta_description',__('home.funpodium'))">
<meta name="google-site-verification" content="xClzXllhtdZv0Ls3_cnOFcfDMWrjslc3NC_JNUII4Fw" />
<!--  facebook OG meta -->
<meta property="og:title" content="@yield('meta_keywords',__('home.funpodium'))">
<meta property="og:type" content="website">
<meta property="og:description" content="@yield('meta_description',__('home.funpodium'))">
<meta property="og:site_name" content="{{__('home.funpodium')}}">
<meta property="og:locale" content="{{app()->getLocale()}}">
{{-- <meta property="og:url" content="{{ route('frontend.home',app()->getLocale()) }}"> --}}
<meta property="og:image" content="{{ asset('icon/favicon.ico') }}">

<title>@yield('title') | {{__('home.funpodium')}}</title>
<link rel="icon" href="{{ asset('icon/favicon.ico') }}" type="image/x-icon" />
<link rel="shortcut icon" href="{{ asset('icon/favicon.ico') }}" type="image/x-icon"/>
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

<!-- <link rel="dns-prefetch" href="//fonts.gstatic.com"> -->
<link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

{{-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"> --}}
<!-- Styles -->
<link href="{{ asset('css/reset.css') }}" rel="stylesheet" type="text/css" >
<link href="{{ asset('css/theme.css') }}" rel="stylesheet" type="text/css" >
<link href="{{ asset('css/style.css') }}" rel="stylesheet" type="text/css" >
<link href="{{ asset('css/ckeditor.css') }}" rel="stylesheet" type="text/css" >
<link href="{{ asset('css/queries.css') }}" rel="stylesheet" type="text/css" >
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css?family=Noto+Sans+TC:300,400,500,700|Roboto:300,400,500,700&display=swap" rel="stylesheet">
<script src="https://kit.fontawesome.com/f6f2104aed.js" crossorigin="anonymous"></script>
<!-- Scripts -->
@include('partials._javascript')
