import * as React from "react";
import { Button, Heading, Text } from "@react-email/components";
import { Layout } from "../components/Layout";
import { h1, text, button, list } from "../styles/shared";
import { URLS } from "./variables";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => {
  return (
    <Layout previewText={`Welcome to Smartdraw, ${name}!`}>
      <Heading style={h1}>Welcome to Smartdraw, {name}!</Heading>
      <Text style={text}>
        We're excited to have you on board. Smartdraw is your new go-to app for
        creating amazing diagrams and illustrations with the power of AI.
      </Text>
      <Text style={text}>Here's what you can do with Smartdraw:</Text>
      <ul style={list}>
        <li>Create stunning diagrams with intuitive tools</li>
        <li>Use AI to enhance your drawings and suggest improvements</li>
        <li>Collaborate with your team in real-time</li>
        <li>Export your creations in various formats</li>
      </ul>
      <Button
        style={{
          ...button,
          padding: "12px 20px",
        }}
        href={String(URLS.APP_URL)}
      >
        Start Creating Now
      </Button>
      <Text style={text}>
        If you have any questions, our support team is always here to help. Just
        reply to this email!
      </Text>
      <Text style={text}>
        Happy drawing!
        <br />
        The Smartdraw Team
      </Text>
    </Layout>
  );
};

export default WelcomeEmail;
