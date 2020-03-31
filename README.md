# WGApp
![Client](https://github.com/kleincode/wgapp/workflows/Build%20client/badge.svg)

Work in Progress.

## Project setup
```
npm install
cd client
npm install
```

### Setup back-end
In the .env file, specify the following properties:
```
PORT=3001

MYSQL_HOST=
MYSQL_PORT=3306
MYSQL_DB=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_CONNECTION_LIMIT=10

AUTH_TOKEN_SECRET=(random token)
AUTH_SALT_ROUNDS=10

AES_HOUSEHOLD_PASSPHRASE=(random token)
```

### Run back-end
```
node server.js
```

### Run front-end
```
cd client
npm run serve
```

### Build front-end
```
cd client
npm run build
```
