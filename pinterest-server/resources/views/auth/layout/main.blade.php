<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @include('auth.partials._head')
    </head>
    <body>
        @yield('content')
    </body>
</html>