const nodemailer = require('nodemailer');

async function sendEmail(mailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

let mailOptions = {
  from: process.env.MAIL_USERNAME,
  to: process.env.MAIL_USERNAME,
  subject: '',
  text: ``,
};

module.exports = { sendEmail, mailOptions };
