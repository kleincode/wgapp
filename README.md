# WGApp
![Client](https://github.com/kleincode/wgapp/workflows/Build%20client/badge.svg)

Work in Progress.

## Project setup
```
cd server
npm install
cd ../client
npm install
```

### Setup back-end
In the server/.env file, specify the following properties:
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

# Folder to compiled client assets (this is the default client build folder)
PUBLIC_FOLDER='../client/dist'

PUSH_PUBLIC_KEY=(public key for push notifications)
PUSH_PRIVATE_KEY=(private key for push notifications)
```

### Run back-end
```
cd server
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
### Run for production
For use in production, build the client and copy the generated files to server/public. The server will make all files in public folder statically available.