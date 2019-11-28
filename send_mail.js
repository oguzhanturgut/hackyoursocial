const nodeMailer = require('nodemailer');
const config = require('config');

exports.sendEmail = emailData => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp-pulse.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER || config.get('email'),
      pass: process.env.MAIL_PASS || config.get('emailPw')
    }
  });
  return transporter
    .sendMail(emailData)
    .then(info => console.log(`Message sent: ${info.response}`))
    .catch(err => console.log(`Problem sending email: ${err}`));
};

// ----------------
