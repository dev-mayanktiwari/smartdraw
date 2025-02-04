import * as React from "react";
import { render } from "@react-email/components";
import AccountConfirmation from "../emails/AccountConfirmationEmail";
import EmailVerification from "../emails/EmailVerification";
import PasswordReset from "../emails/PasswordReset";
import PasswordChanged from "../emails/PasswordChanged";
import WelcomeEmail from "../emails/WelcomeEmailTSX";

export class HTMLEmailService {
  static getAccountConfirmationEmail(name: string) {
    return render(<AccountConfirmation name={name} />);
  }

  static getEmailVerificationEmail(name: string, token: string, code: string) {
    return render(<EmailVerification name={name} token={token} code={code} />);
  }

  static getPasswordResetEmail(name: string, token: string) {
    return render(<PasswordReset name={name} token={token} />);
  }

  static getPasswordChangedConfirmationEmail(name: string) {
    return render(<PasswordChanged name={name} />);
  }

  static getWelcomeEmail(name: string) {
    return render(<WelcomeEmail name={name} />);
  }
}
