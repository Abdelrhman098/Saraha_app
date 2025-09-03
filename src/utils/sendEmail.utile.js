import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";

export const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: '"Sarahah App" <boodytarek203@gmail.com>',
    to: to,
    subject: subject,
    text: text,
  });
  console.log("Message sent: %s", info.messageId);

  return info;
};

export const emitter = new EventEmitter();
emitter.once("sendEmail", (args) => {
  sendEmail(args);
});
