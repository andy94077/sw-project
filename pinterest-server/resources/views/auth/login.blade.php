@extends('auth.layout.main')

@section('title', trans('home.home'))
@section('content')

@include('auth.partials._nav')

@include('auth.partials._message')

<div class="w-300 form-position">
    <form action="{{ route('login') }}" method="post">
        @csrf

        <h1 class="form-title">Log in</h1>

        <div class="input-group">
            <input type="text" placeholder="Username" class="input-control" name="name">
        </div>

        <div class="input-group mb-24">
            <input type="password" placeholder="Password" class="input-control" name="password">
        </div>

        <div class="float-wrap">
            <div class="checkbox float-l">
                <label class="checkbox-txt">
                    <input type="checkbox" name="remember"> Remember me
                </label>
            </div>
            <a href="password/reset" class="help-txt float-r">Forgot password?</a>
        </div>

        <div class="btn-group">
            <button type="submit" class="btn btn-blue">Log in</button>
        </div>
    </form>
</div>

@endsection
