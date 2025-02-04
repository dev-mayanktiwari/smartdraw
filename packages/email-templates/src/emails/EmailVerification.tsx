import * as React from "react";
import { Button, Heading, Text } from "@react-email/components";
import { Layout } from "../components/Layout";
import { h1, text, button, link } from "../styles/shared";
import dotenv from "dotenv";
dotenv.config();

interface EmailVerificationProps {
  name: string;
  token: string;
  code: string;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  name,
  token,
  code,
}) => {
  const verificationLink = `${String(process.env.FRONTEND_URL)}/verify?token=${token}&code=${code}`;

  return (
    <Layout previewText={`Verify Your Smartdraw Account, ${name}`}>
      <Heading style={h1}>Verify Your Email</Heading>
      <Text style={text}>Hi {name},</Text>
      <Text style={text}>
        Thanks for signing up for Smartdraw! To start creating amazing diagrams
        with AI, please verify your email address:
      </Text>
      <Button
        style={{
          ...button,
          padding: "12px 20px",
        }}
        href={verificationLink}
      >
        Verify Email
      </Button>
      <Text style={text}>Or copy and paste this link into your browser:</Text>
      <Text style={link}>{verificationLink}</Text>
      <Text style={text}>
        This link will expire in 24 hours. If you didn't create a Smartdraw
        account, you can safely ignore this email.
      </Text>
    </Layout>
  );
};

export default EmailVerification;
