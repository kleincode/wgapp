const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  pool: process.env.MAIL_USE_POOL !== false, // true by default
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT || 465, // 465 (TLS port) by default
  secure: process.env.MAIL_USE_TLS !== false, // use TLS by default
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

transporter.verify(err => {
  if(err) {
    console.log("E-mail service could not be initialized:", err);
  } else {
    console.log("E-mail service ready");
  }
});

module.exports = transporter;