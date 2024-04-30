import nodeMailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.to,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export const sendSendGridEmail = async ({
  to,
  subject,
  templateId,
  data,
  text
}) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const template = await ejs.renderFile(
      path.join(__dirname, "../templates/" + templateId + ".ejs"),
      data,
      { async: true }
    );
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_EMAIL,
        name: "Mohd Shadab",
      },
      subject,
      text,
      html: template,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
    return new Error("Email could not be sent");
  }
};

export default sendEmail;
