import * as React from "react";
import { Button, Heading, Text } from "@react-email/components";
import { Layout } from "../components/Layout";
import { h1, text, button, link } from "../styles/shared";
import { URLS } from "./variables";

interface PasswordResetProps {
  name: string;
  token: string;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({
  name,
  token,
}) => {
  const resetLink = `${String(URLS.FRONTEND_URL)}/reset-password?token=${token}`;

  return (
    <Layout previewText={`Reset Your Smartdraw Password, ${name}`}>
      <Heading style={h1}>Reset Your Password</Heading>
      <Text style={text}>Hi {name},</Text>
      <Text style={text}>
        We received a request to reset your Smartdraw password. If you didn't
        make this request, you can safely ignore this email.
      </Text>
      <Text style={text}>
        To set a new password and regain access to your creative projects, click
        the button below:
      </Text>
      <Button
        style={{
          ...button,
          padding: "12px 20px",
        }}
        href={resetLink}
      >
        Reset Password
      </Button>
      <Text style={text}>Or copy and paste this link into your browser:</Text>
      <Text style={link}>{resetLink}</Text>
      <Text style={text}>
        This link will expire in 1 hour for security reasons. If you need any
        assistance, please don't hesitate to contact our support team.
      </Text>
    </Layout>
  );
};

export default PasswordReset;
