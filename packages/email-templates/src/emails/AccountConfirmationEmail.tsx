import * as React from "react";
import { Button, Heading, Text } from "@react-email/components";
import { Layout } from "../components/Layout";
import { h1, text, button, list } from "../styles/shared";
import { URLS } from "./variables";

interface AccountConfirmationProps {
  name: string;
}

export const AccountConfirmation: React.FC<AccountConfirmationProps> = ({
  name,
}) => {
  return (
    <Layout previewText={`Your Smartdraw Account is Ready, ${name}!`}>
      <Heading style={h1}>Your Account is Confirmed!</Heading>
      <Text style={text}>
        Great news, {name}! Your Smartdraw account is now fully activated.
      </Text>
      <Text style={text}>
        You're all set to start creating amazing diagrams and illustrations with
        AI-powered tools. Here's what you can do next:
      </Text>
      <ul style={list}>
        <li>Explore our intuitive drawing tools</li>
        <li>Try out AI-assisted diagram creation</li>
        <li>Collaborate with your team on shared projects</li>
        <li>Check out our tutorials to get started quickly</li>
      </ul>
      <Button
        style={{
          ...button,
          padding: "12px 20px",
          maxWidth: "80%",
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
          display: "block",
        }}
        href={URLS.APP_URL!}
      >
        Start Creating
      </Button>
      <Text style={text}>
        If you need any help getting started, our support team is just an email
        away. We're excited to see what you'll create with Smartdraw!
      </Text>
    </Layout>
  );
};

export default AccountConfirmation;
