@extends('auth.layout.main')

@section('title', trans('home.home'))
@section('content')

@include('auth.partials._nav')

@include('auth.partials._message')

<div class="w-300 form-position">
    <form method="POST" role="form" action="{{ route('password.request') }}">
        @csrf

        <input type="hidden" name="token" value="{{ $token }}">
        <input type="hidden" name="email" value="{{ $email }}">

        <h1 class="form-title">Password Reset</h1>

        <p class="description-txt">Please enter your new password.</p>

        <div class="input-group">
            <input type="password" placeholder="New Password" class="input-control" name="password">
        </div>

        <div class="input-group mb-24">
            <input type="password" placeholder="Confirm Password" class="input-control" name="password_confirmation">
        </div>

        <div class="btn-group">
            <button type="submit" class="btn btn-blue">Change password</button>
        </div>
    </form>
</div>

@endsection
