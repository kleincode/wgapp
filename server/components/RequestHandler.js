/*  This module exports a function for registering request handlers utilizing parameter checks.
    handlerSourceFile ..   Path to JS module exporting handler props
    beforeHandler     ..   Handler to be executed before the actual handler (e.g. authorization)
    app               ..   Express instance for registering the generated handler
    provideToHandler  ..   Parameter object to be supplied to the handler source file
    */

module.exports = function registerRequestHandler(handlerName, beforeHandler, app, provideToHandler) {
  let handlerProps = require("../views/" + handlerName)(provideToHandler);
  // Check required fields
  if(!handlerProps.type || !["GET","POST"].includes(handlerProps.type))
    throw "Please set handler type to 'GET' or 'POST' in " + handlerSourceFile;
  if(!("handler" in handlerProps))
    throw "No handler found in " + handlerSourceFile;
  let handler = async (req, res) => {
    //Response shortcuts
    let success = (send) => {
      if(typeof send === "object") res.status(200).send({...send, success: true}).end();
      else res.status(200).send({message: send, success: true}).end();
    };
    let fail = (send) => {
      if(typeof send === "object") res.status(200).send({...send, success: false}).end();
      else res.status(200).send({message: send, success: false}).end();
    };
    let error = (send) => {
      if(typeof send === "object") res.status(500).send({...send, success: false}).end();
      else res.status(500).send({message: send, success: false}).end();
    };

    //Check params
    if(handlerProps.params) {
      for(let param in handlerProps.params) {
        if(req.query[param]) {
          // type conversion
          switch(handlerProps.params[param].type) {
            case "int": req.query[param] = parseInt(req.query[param]); break;
            case "float": req.query[param] = parseFloat(req.query[param]); break;
            case "boolean": req.query[param] = !!req.query[param]; break;
            case "json":
              try {
                req.query[param] = JSON.parse(req.query[param]);
              } catch(err) {
                res.status(400).send({message: `JSON for parameter '${param}' invalid`, success: false}).end();
                return;
              }
              break;
            default: break;
          }
          if(!req.query[param]) {
            res.status(400).send({message: `Invalid type for parameter '${param}' (expected ${handlerProps.params[param].type})`, success: false}).end();
            return;
          }
        } else if(handlerProps.params[param].required) {
          // required but not provided
          res.status(400).send({message: handlerProps.params[param].message || `Parameter '${param}' is required`, success: false}).end();
          return;
        } else if("default" in handlerProps.params[param]) {
          // default value
          req.query[param] = handlerProps.params[param].default;
        }
      }
    }

    //Check body
    if(handlerProps.body) {
      for(let elem in handlerProps.body) {
        if(req.body[elem]) {
          // type conversion
          switch(handlerProps.body[elem].type) {
            case "int": req.body[elem] = parseInt(req.body[elem]); break;
            case "float": req.body[elem] = parseFloat(req.body[elem]); break;
            case "boolean": req.body[elem] = !!req.body[elem]; break;
            case "object": if(typeof req.body[elem] !== "object") req.body[elem] = null; break;
            case "string": if(typeof req.body[elem] !== "string") req.body[elem] = null; break;
            default: break;
          }
          if(!req.body[elem]) {
            res.status(400).send({message: `Invalid type for parameter '${param}' (expected ${handlerProps.params[param].type})`, success: false}).end();
            return;
          }
        } else if(handlerProps.body[elem].required) {
          // required but not provided
          res.status(400).send({message: `Body element '${elem}' is required`, success: false}).end();
          return;
        } else if("default" in handlerProps.body[elem]) {
          // default value
          req.body[elem] = handlerProps.body[elem].default;
        }
      }
    }

    await handlerProps.handler(req, { success, fail, error });

  };
  if(handlerProps.type == "GET") app.get("/_/" + handlerName, beforeHandler, handler);
  else app.post("/_/" + handlerName, beforeHandler, handler);
};