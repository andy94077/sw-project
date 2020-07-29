#!/usr/bin/env bash

cd pinterest-server
composer dump-autoload
php artisan migrate:reset
php artisan migrate:refresh --seed
cd public
rm -rf uploads
unzip -q ../../demo/uploads.zip -d .