import dotenv from "dotenv";
import { HTMLEmailService } from "@repo/email-templates";
import transporter from "../config/nodemailerConfig";
dotenv.config();

export const sendEmailVerificationMailNodemailer = async (
  email: string,
  name: string,
  token: string,
  code: string
) => {
  const html = await HTMLEmailService.getEmailVerificationEmail(
    name,
    token,
    code
  );
  return transporter.sendMail({
    from: `SMARTDRAW <process.env.EMAIL_USER>`,
    to: email,
    subject: `You\'re Almost There! Verify Your Email to Get Started 🎨`,
    html,
  });
};
