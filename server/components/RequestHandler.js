const path = require("path");
const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.AUTH_TOKEN_SECRET || "[%N[ED0pGs&3QApB";
const Helpers = require("../components/Helpers");

async function checkAuthorized(req, res, next) {
  let token = req.headers["x-access-token"];
  if(!!token) {
    JWT.verify(token, JWT_SECRET, (err, decoded) => {
      if(err) {
          res.status(401).send({success: false, message: "Unauthorized: invalid token.", redirect: "/login"});
      } else {
          req.uid = decoded.uid;
          next();
      }
  });
  } else {
    res.status(401).send({success: false, message: "Unauthorized: Please log in.", redirect: "/login"});
  }
}

/*  This module exports a function for registering request handlers utilizing parameter checks.
    handlerSourceFile ..   Path to JS module exporting handler props
    app               ..   Express instance for registering the generated handler
    provideToHandler  ..   Parameter object to be supplied to the handler source file
    */
module.exports = function registerRequestHandler(handlerPath, handlerName, app, provideToHandler) {
  let handlerProps = require(path.join(handlerPath, handlerName))(provideToHandler);
  // Check required fields
  if (!handlerProps.type || !["GET", "POST"].includes(handlerProps.type))
    throw "Please set handler type to 'GET' or 'POST' in " + handlerSourceFile;
  if (!("handler" in handlerProps))
    throw "No handler found in " + handlerSourceFile;
  let handler = async (req, res) => {
    //Response shortcuts
    let success = (send) => {
      if (typeof send === "object") res.status(200).send({ ...send, success: true }).end();
      else res.status(200).send({ message: send, success: true }).end();
    };
    let fail = (send, cat) => {
      Helpers.pushLog(provideToHandler, 3, cat, handlerName, send, req);
      if (typeof send === "object") res.status(200).send({ ...send, success: false }).end();
      else res.status(200).send({ message: send, success: false }).end();
    };
    let error = (send, cat, log) => {
      Helpers.pushLog(provideToHandler, 0, cat, handlerName, send, log, req);
      if (typeof send === "object") res.status(500).send({ ...send, success: false }).end();
      else res.status(500).send({ message: send, success: false }).end();
    };

    //Check params
    if (handlerProps.params) {
      for (let param in handlerProps.params) {
        if (param in req.query) {
          // type conversion
          let conv;
          switch (handlerProps.params[param].type) {
            case "int":
              conv = parseInt(req.query[param]);
              req.query[param] = isNaN(conv) ? null : conv;
              break;
            case "float":
              conv = parseFloat(req.query[param]);
              req.query[param] = isNaN(conv) ? null : conv;
              break;
            case "boolean": req.query[param] = !!req.query[param]; break;
            case "json":
              try {
                req.query[param] = JSON.parse(req.query[param]);
              } catch (err) {
                res.status(400).send({ message: `JSON for parameter '${param}' invalid`, success: false }).end();
                return;
              }
              break;
            default: break;
          }
          if (req.query[param] === null) {
            res.status(400).send({ message: `Invalid type for parameter '${param}' (expected ${handlerProps.params[param].type})`, success: false }).end();
            return;
          } else if (typeof req.query[param] === "number" && handlerProps.params[param].unsigned && req.query[param] < 0) {
            res.status(400).send({ message: `Parameter '${param}' out of range (expected unsigned ${handlerProps.params[param].type})`, success: false }).end();
            return;
          } else if (typeof req.query[param] === "string" && typeof handlerProps.params[param].maxlength === "number" && req.query[param].length > handlerProps.params[param].maxlength) {
            res.status(400).send({ message: `Parameter '${elem}' too long (${req.query[param].length} characters)`, success: false }).end();
            return;
          }
        } else if (handlerProps.params[param].required) {
          // required but not provided
          res.status(400).send({ message: handlerProps.params[param].message || `Parameter '${param}' is required`, success: false }).end();
          return;
        } else if ("default" in handlerProps.params[param]) {
          // default value
          req.query[param] = handlerProps.params[param].default;
        }
      }
    }

    //Check body
    if (handlerProps.body) {
      for (let elem in handlerProps.body) {
        if (elem in req.body) {
          // type conversion
          let conv;
          switch (handlerProps.body[elem].type) {
            case "int":
              conv = parseInt(req.body[elem]);
              req.body[elem] = isNaN(conv) ? null : conv;
              break;
            case "float":
              conv = parseFloat(req.body[elem]);
              req.body[elem] = isNaN(conv) ? null : conv;
              break;
            case "boolean": req.body[elem] = !!req.body[elem]; break;
            case "object": if (typeof req.body[elem] !== "object") req.body[elem] = null; break;
            case "string": if (typeof req.body[elem] !== "string") req.body[elem] = null; break;
            default: break;
          }
          if (req.body[elem] === null) {
            res.status(400).send({ message: `Invalid type for parameter '${elem}' (expected ${handlerProps.body[elem].type})`, success: false }).end();
            return;
          } else if (typeof req.body[elem] === "number" && handlerProps.body[elem].unsigned && req.body[elem] < 0) {
            res.status(400).send({ message: `Parameter '${elem}' out of range (expected unsigned ${handlerProps.body[elem].type})`, success: false }).end();
            return;
          } else if (typeof req.body[elem] === "string" && typeof handlerProps.body[elem].maxlength === "number" && req.body[elem].length > handlerProps.body[elem].maxlength) {
            res.status(400).send({ message: `Parameter '${elem}' too long (${req.body[elem].length} characters)`, success: false }).end();
            return;
          }
        } else if (handlerProps.body[elem].required) {
          // required but not provided
          res.status(400).send({ message: `Body element '${elem}' is required`, success: false }).end();
          return;
        } else if ("default" in handlerProps.body[elem]) {
          // default value
          req.body[elem] = handlerProps.body[elem].default;
        }
      }
    }

    try {
      await handlerProps.handler(req, { success, fail, error, res });
    } catch (err) {
      Helpers.pushLog({db}, 0, 0, "Server", `FATAL: AN UNHANDLED SERVER EXCEPTION OCCURED (${handlerName})`, req);
      error("Internal server exception", 0, err);
    }

  };
  if(handlerProps.public === true) {
    if (handlerProps.type == "GET") app.get("/_/" + handlerName, handler);
    else app.post("/_/" + handlerName, handler);
  } else {
    if (handlerProps.type == "GET") app.get("/_/" + handlerName, checkAuthorized, handler);
    else app.post("/_/" + handlerName, checkAuthorized, handler);
  }
};