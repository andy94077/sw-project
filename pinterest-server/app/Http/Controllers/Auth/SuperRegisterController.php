<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SuperUser;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SuperRegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/backend';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest:super_users');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public static function validator(Request $data)
    { 
        //echo $data->toArray()["email"];
        return Validator::make($data->all(),
            [
                'name' => ['required', 'string', 'max:64', 'unique:super_users', 'alpha_num'],
                'email' => ['required', 'string', 'email', 'max:64', 'unique:super_users'],
                'password' => [ 'required', 'string', 'min:8', 'max:255', 'regex:/^[A-Za-z0-9]+$/'],
            ],
            [  
                'name.required' => 'Username can\'t be empty',
                'name.unique' => 'This username is already registered',
                'name.max' => 'Username must be less than 64 character',
                'name.alpha_num' => 'Username must only contain number or alpha',
                'email.required' => 'Email can\'t be empty',
                'email.email' => 'The email must be a valid email address.',
                'email.unique' => 'This email is already registered',
                'email.max' => 'Email must be less than 64 character',
                'password.required' => 'Password  can\'t be empty',
                'password.regex' => 'Password must only contain number or alpha',
                'password.unique' => 'This password is already registered',
                'password.min' => 'Password must be at least 8 character',
                'password.max' => 'Password must be less than 255 character',
            ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    public static function create(Request $data)
    {
        return SuperUser::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'avatar_url' => "/img/avatar.jpeg",
        ]);
    }
    /**
     * New user information into database
     */
}
