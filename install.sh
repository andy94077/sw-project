#!/usr/bin/env bash

## copy files
cp demo/backoffice/constants.js backoffice/src
cp demo/constants.js src
cp demo/pinterest-server/.env pinterest-server
cp demo/pinterest-server/laravel-echo-server.json pinterest-server

## install packages for frontend
npm install
cd backoffice
npm install
cd ..

## install packages for backend
cd pinterest-server
composer install
cd ..
./pull.sh
