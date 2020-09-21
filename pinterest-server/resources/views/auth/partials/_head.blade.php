<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<!-- CSRF Token -->
<meta name="csrf-token" content="{{ csrf_token() }}">

<title>@yield('title') | {{__('home.funpodium')}}</title>
<link rel="icon" href="{{ asset('icon/favicon.ico') }}" type="image/x-icon" />
<link rel="shortcut icon" href="{{ asset('icon/favicon.ico') }}" type="image/x-icon"/>

<!-- <link rel="dns-prefetch" href="//fonts.gstatic.com"> -->
<link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

{{-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"> --}}
<!-- Styles -->
<link href="{{ asset('css/reset.css') }}" rel="stylesheet" type="text/css" >
<link href="{{ asset('css/theme.css') }}" rel="stylesheet" type="text/css" >
<link href="{{ asset('css/style.css') }}" rel="stylesheet" type="text/css" >
<link href="{{ asset('css/queries.css') }}" rel="stylesheet" type="text/css" >
<link href="{{ asset('css/custom.css') }}" rel="stylesheet" type="text/css" >
<link href="{{ asset('css/auth.css') }}" rel="stylesheet" type="text/css" >
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css?family=Noto+Sans+TC:300,400,500,700|Roboto:300,400,500,700&display=swap" rel="stylesheet">
<script src="https://kit.fontawesome.com/f6f2104aed.js" crossorigin="anonymous"></script>
<!-- Scripts -->
