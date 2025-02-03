export const JobName = {
  SendWelcomeEmail: "send-welcome-email",
  SendVerificationEmail: "send-verification-email",
  SendPasswordResetEmail: "send-password-reset-email",
  SendPasswordChangeConfirmationEmail:
    "send-password-change-confirmation-email",
  SendInvitationEmail: "send-invitation-email",
};

export type TJobName = (typeof JobName)[keyof typeof JobName];
