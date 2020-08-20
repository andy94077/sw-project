<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // admin is granted all permissions in app/Http/Providers/AuthServiceProvider.php
        Role::create(['guard_name' => 'super_users', 'name' => 'admin']);
        $blocker = Role::create(['guard_name' => 'super_users', 'name' => 'blocker']);
        $user_manager = Role::create(['guard_name' => 'super_users', 'name' => 'user_manager']);
        $post_manager = Role::create(['guard_name' => 'super_users', 'name' => 'post_manager']);
        $BO_manager = Role::create(['guard_name' => 'super_users', 'name' => 'BO_manager']);
        $spokesman = Role::create(['guard_name' => 'super_users', 'name' => 'spokesman']);

        $bucket = Permission::create(['guard_name' => 'super_users', 'name' => 'bucket']);
        $unbucket = Permission::create(['guard_name' => 'super_users', 'name' => 'unbucket']);
        $delete_user = Permission::create(['guard_name' => 'super_users', 'name' => 'delete_user']);
        $recover_user = Permission::create(['guard_name' => 'super_users', 'name' => 'recover_user']);
        
        $delete_post = Permission::create(['guard_name' => 'super_users', 'name' => 'delete_post']);
        $recover_post = Permission::create(['guard_name' => 'super_users', 'name' => 'recover_post']);
        
        $delete_BO_user = Permission::create(['guard_name' => 'super_users', 'name' => 'delete_BO_user']);
        $recover_BO_user = Permission::create(['guard_name' => 'super_users', 'name' => 'recover_BO_user']);
        $view_BO_user = Permission::create(['guard_name' => 'super_users', 'name' => 'view_BO_user']);
        $register_BO_user = Permission::create(['guard_name' => 'super_users', 'name' => 'register_BO_user']);

        $make_announcement = Permission::create(['guard_name' => 'super_users', 'name' => 'make_announcement']);

        $blocker->syncPermissions([$bucket, $unbucket]);
        $user_manager->syncPermissions([$bucket, $unbucket, $delete_user, $recover_user]);
        $post_manager->syncPermissions([$delete_post, $recover_post]);
        $BO_manager->syncPermissions([$delete_BO_user, $recover_BO_user, $view_BO_user, $register_BO_user]);
        $spokesman->syncPermissions([$make_announcement]);
    }
}
