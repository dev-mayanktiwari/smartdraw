"use client"

import { Button } from "@/components/ui/button";
import { Brush, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { verifyEmailAPI } from "@/lib/apiClient";
import { useEffect, useState } from "react";

const EmailVerification = () => {
  const searchParams = useSearchParams();
  const navigate = useRouter().push;
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const code = searchParams.get("code") || "";
      const token = searchParams.get("token") || "";

      if (!code || !token) {
        setVerificationStatus("error");
        setErrorMessage("Invalid verification link");
        return;
      }

      try {
        await verifyEmailAPI(code, token);
        setVerificationStatus("success");
      } catch (error: any) {
        setVerificationStatus("error");
        setErrorMessage(
          error.response?.data?.message || "Email verification failed"
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              Verifying your email
            </h2>
            <p className="text-gray-400">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-400 mb-6">
              Your email has been successfully verified.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Continue to Login
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-400 mb-2">{errorMessage}</p>
            <p className="text-gray-400 mb-6">
              Please try again or contact support if the problem persists.
            </p>
            <div className="space-x-4">
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Back to Sign Up
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Brush className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">SMARTDRAW</h1>
        </div>

        <div className="mt-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default EmailVerification;
