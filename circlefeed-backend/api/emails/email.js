const config = require('../../environment/environment');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.ADMIN_EMAIL,
    pass: config.ADMIN_PASS
  }
});

const sendWelcomeEmail =  (email, name) => {

    const mailOptions = {
        from: `${config.AppName} <kamran-circle@gmail.com>`,
        to: `${email}`,
        subject: 'Thanks For joining Circle',
        text: `Welcome ${name} to Circle, We Will help you connect your contacts and share your stories`,
        html : `<h3>Welcome ${name}  to Circle, We Will help you connect your contacts and share your stories</h3>` 
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
   
    // {
    //     to: email,
    //     from: 'info@circle.com',
    //     subject: 'Thanks For joining Circle',
    //     text: `Welcome ${name} to Circle, We Will help you connect your contacts and share your stories`,
    //     html : `<h3>Welcome ${name}  to Circle, We Will help you connect your contacts and share your stories</h3>` 
    // }

 }

 const sendResetPasswordEmail = (email, token)=> {
    const mailOptions = {
      from: `${config.AppName} <kamran-circle@gmail.com>`,
      to: `${email}`,
      subject: `Reset Password Request for ${config.AppName} App`,
      html : `
        <p>  You requested for password reset </p>
        <p> Click <a target="_blank" href="${config.CLIENT_APP_URL}/reset/${token}"> here </a> to reset your password </p>
      ` 
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

 }

module.exports = { sendWelcomeEmail,sendResetPasswordEmail }
