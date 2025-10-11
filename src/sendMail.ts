import nodemailer from 'nodemailer';
import config from "./config";

const emailConfig = config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  // port: 587,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: emailConfig.EMAIL_USER,
    pass: emailConfig.EMAIL_PASS,
  },
});
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(to: string, subject: string, html: string) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Phinmon <${emailConfig.EMAIL_USER}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

export default sendMail;
