require("dotenv").config();

const express = require("express");
const app = express();

jwt = require("jsonwebtoken");
jwt_secret = process.env.AUTH_TOKEN_SECRET || "[%N[ED0pGs&3QApB";
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const port = process.env.PORT || 3001;

bcrypt = require("bcryptjs");
auth_salt_rounds = parseInt(process.env.AUTH_SALT_ROUNDS) || 10;

const mysql = require("mysql");
mysql_conn = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 10,
    debug: false
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client_build")));

app.listen(port, () => console.log(`Listening on port ${port}`));

function checkAuthorized(req, res, next) {
    let token = undefined;
    if(token == undefined && (req.body) && (req.body.wgali)) token = req.body.wgali;
    if(token == undefined && (req.query) && (req.query.wgali)) token = req.query.wgali;
    if(token == undefined && (req.headers) && (req.headers["x-access-token"])) token = req.headers["x-access-token"];
    if(token == undefined && (req.cookies) && (req.cookies.wgali)) token = req.cookies.wgali;
    if(!token) {
        res.status(401).send({success: false, message: "Unauthorized: no token provided", redirect: "/login"});
    } else {
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if(err) {
                res.status(401).send({success: false, message: "Unauthorized: invalid token", redirect: "/login"});
            } else {
                req.user = decoded;
                next();
            }
        });
    }
}

app.get("/_/backend_test", (req, res) => {
    res.send({message: "Backend working."});
});

app.post("/_/register", require("./server/register"));
app.post("/_/login", require("./server/login"));

app.get("/_/user", checkAuthorized, (req, res) => {
    if(req.user.email) res.status(200).send({success: true, message: "Authorized", email: req.user.email, firstname: req.user.firstname, lastname: req.user.lastname});
    else res.status(500).send({success: false, message: "Internal Server Error: No email given, even though authorization was successful."});
});

//on create household: passphrase = FLOOR(100000 + RAND()*900000)

app.post("/_/createhousehold", checkAuthorized, require("./server/createhousehold"));
app.post("/_/addhousehold", checkAuthorized, require("./server/addhousehold"));
app.get("/_/fetchfinances", checkAuthorized, require("./server/fetchfinances"));
app.get("/_/fetchusers", checkAuthorized, require("./server/fetchusers"));
app.post("/_/addexpense", checkAuthorized, require("./server/addexpense"));
app.post("/_/editexpense", checkAuthorized, require("./server/editexpense"));
app.post("/_/delexpense", checkAuthorized, require("./server/delexpense"));
app.post("/_/addtask", checkAuthorized, require("./server/addtask"));
app.get("/_/fetchtasks", checkAuthorized, require("./server/fetchtasks"));

//Provide static build files (for production)
app.get("/", (req, res)  => res.sendFile(path.join(__dirname, "build", "index.html")));