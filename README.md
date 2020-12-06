# sw-project

A social website project inspired by `Pinterest` and `Instagram`.

## Dependencies

* Node.js 12.18.2
* Mysql 5.7
* redis-server
* PHP 7.4.8 
* php7.4-bcmath php7.4-bz2 php7.4-intl php7.4-gd php7.4-mbstring php7.4-mysql php7.4-zip php7.4-common php7.4-xml
* composer 1.10.9

## Install
Make sure you have installed all the dependencies above.
```bash
git clone https://github.com/andy94077/sw-project.git
cd sw-project
mysql -u root -e "create database laravel"
./install.sh
```

You have to change `MAIL_USERNAME`, `MAIL_PASSWORD`, and `MAIL_FROM_ADDRESS` in `pinterest-server/.env` to your email and password.

#### Optional

If you want to change the host address, edit these files below:

* Change `SERVER_URL` and `FRONTOFFICE_URL` in `src/constants.js`
* Set `SERVER_URL` to the same value in `src/constants.js` in `backoffice/src/constants.js`
* Set `authHost` to the value of `SERVER_URL` in `pinterest-server/laravel-echo-server.json`
* Set `APP_URL` to the value of `SERVER_URL` in `pinterest-server/.env`

## Run in the development mode

### Frontend
```bash
npm start
```

The server will be run at http://localhost:3000.

### Back Office
```bash
npm start
```

The server will be run at http://localhost:3001/backoffice.

### Backend
```bash
cd pinterest-server
php artisan serve --port=8000
```
The server will be run at http://localhost:8000.

### redis-server
```bash
redis-server
```

The server will be run at http://localhost:6379.

### laravel-echo-server
```bash
cd pinterest-server
npx laravel-echo-server start
```

The server will be run at http://localhost:6001.
