// Imports and configuration
require("dotenv").config();
const Express = require("express");
const app = Express();
const cookieParser = require("cookie-parser");
const BodyParser = require("body-parser");
const Path = require("path");
const FS = require("fs");
const port = process.env.PORT || 3001;
const Database = require("./components/MySQLDatabase");
const registerRequestHandler = require("./components/RequestHandler");

// Database config
const db = new Database({
    logSql: true,
    logErrors: true
}).connect({
    host: process.env.MYSQL_HOST || "localhost",
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 10,
    debug: false
});

// Express middleware
app.use(cookieParser());
app.use(BodyParser.json());
app.use(Express.static(Path.join(__dirname, process.env.PUBLIC_FOLDER || "public")));

// Start express server
app.listen(port, () => console.log(`Listening on port ${port}`));

// Register handlers
const handlersPath = Path.join(__dirname, "handlers");
FS.readdirSync(handlersPath).forEach(file => 
    registerRequestHandler(handlersPath, file.substring(0, file.lastIndexOf(".")), app, { db })
);

// Default: Provide index.html from build files
app.get("/*", (req, res)  => res.sendFile(Path.join(__dirname, process.env.PUBLIC_FOLDER || "public", "index.html")));

// Mail service
const mailer = require("./components/Mailer");

// Push notifications
const webpush = require('web-push');
webpush.setVapidDetails('mailto:dev@kleinco.de', process.env.PUSH_PUBLIC_KEY, process.env.PUSH_PRIVATE_KEY);

require("./components/PushScheduler").registerJobs(db);
require("./components/LogCleanup").initTimer(db);