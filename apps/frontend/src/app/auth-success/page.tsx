"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const AuthSuccessHandler = () => {
  const router = useRouter();
  const { setUser, setTokens } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");

    const userDataStr = params.get("userData");

    const source = params.get("source") || "login";

    if (accessToken && userDataStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataStr));
        console.log(userData);
        console.log(accessToken);
        setUser(userData);
        setTokens({ accessToken });
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to parse user data", error);
        router.push(`/${source}?error=invalid_data`);
      }
    } else {
      router.push(`/${source}?error=missing_data`);
    }
  }, [router, setUser, setTokens]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Redirecting you...
        </h1>
        <p className="text-gray-600">
          Please wait while we set up your session
        </p>
      </div>
    </div>
  );
};

export default AuthSuccessHandler;
