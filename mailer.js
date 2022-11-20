require('dotenv').config();
"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(data) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: 'davc93@gmail.com', // generated ethereal user
      pass: process.env.gmailApikey, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"web site 👻" <davc93@gmail.com>', // sender address
    to: "davc93@gmail.com", // list of receivers
    subject: "Pago ✔", // Subject line
    text: `pago realizado con los siguiente datos${JSON.stringify(data)}`, // plain text body
    html: `
    <h3>Pago realizado con los siguiente datos</h3>
    <span>${JSON.stringify(data)}</span>
    
    `, // html body
  });
  return info
}

module.exports = {
    sendEmail
}