import * as React from "react";
import { Button, Heading, Text } from "@react-email/components";
import { Layout } from "../components/Layout";
import { h1, text, button } from "../styles/shared";
import dotenv from "dotenv";
dotenv.config();

interface PasswordChangedProps {
  name: string;
}

export const PasswordChanged: React.FC<PasswordChangedProps> = ({ name }) => {
  return (
    <Layout previewText={`Your Smartdraw Password Has Been Changed, ${name}`}>
      <Heading style={h1}>Password Successfully Changed</Heading>
      <Text style={text}>Hello {name},</Text>
      <Text style={text}>
        This email confirms that your Smartdraw password has been successfully
        changed. Your account is now secured with the new password.
      </Text>
      <Text style={text}>
        If you made this change, no further action is required. You can now log
        in to your account with your new password.
      </Text>
      <Text style={text}>
        If you didn't change your password, please secure your account
        immediately:
      </Text>
      <Button
        style={{
          ...button,
          padding: "12px 20px",
        }}
        href={`${String(process.env.APP_URL)}/account/security`}
      >
        Secure My Account
      </Button>
      <Text style={text}>
        For additional security tips or if you need any assistance, please visit
        our Help Center or contact our support team.
      </Text>
      <Text style={text}>
        Thank you for helping us keep your Smartdraw account secure. We look
        forward to seeing your next creative project!
      </Text>
    </Layout>
  );
};

export default PasswordChanged;
