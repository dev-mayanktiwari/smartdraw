"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorMessage = searchParams.get("message") || "Something went wrong.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 text-center">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-lg">
        <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Oops! An Error Occurred.
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{errorMessage}</p>

        <div className="mt-6 flex gap-4 justify-center">
          <Button
            onClick={() => router.refresh()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
