import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "@react-email/components";
import { Logo } from "./Logo";

interface LayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ previewText, children }) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Logo />
          </Section>
          {children}
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#F3F4F6",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const logoContainer = {
  marginTop: "32px",
};
