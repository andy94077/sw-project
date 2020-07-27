@extends('auth.layout.main')

@section('title', trans('home.home'))
@section('content')

@include('auth.partials._nav')

@include('auth.partials._message')

<div class="w-300 form-position">
    <form action="{{ route('password.email') }}" method="post">
        @csrf

        <div class="container">
            <h1 class="form-title">Password Reset</h1>

            <p class="description-txt">Enter the email you use and we’ll send you instructions to reset your password</p>

            <div class="input-group mb-24">
                <input type="email" placeholder="Email" name="email" class="input-control">
            </div>

            <div class="btn-group">
                <button type="submit" class="btn btn-blue">Request password reset</button>
            </div>
        </div>
    </form>
</div>

@if (Session::get('status_pop') == '1')
    @include('auth.partials._popup')
@endif

@endsection
