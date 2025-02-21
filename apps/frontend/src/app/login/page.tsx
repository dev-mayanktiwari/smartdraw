"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brush } from "lucide-react";
import { useForm } from "react-hook-form";
import type { TUserLoginInput } from "@repo/types";
import { UserLoginInput } from "@repo/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ENDPOINTS } from "@/lib/endpoints";
import getErrorMessage from "@/utils/getErrorMessage";

const Login = () => {
  const router = useRouter();
  const form = useForm<TUserLoginInput>({
    resolver: zodResolver(UserLoginInput),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // GOOGLE LOGIN ERROR HANDLING
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      toast({
        title: "Error",
        description: getErrorMessage(error, "signup"),
        variant: "destructive",
        duration: 5000,
      });
    }
  }, []);

  const onSubmit = async (data: TUserLoginInput) => {
    try {
      const { login } = useAuth();
      await login(data);
      form.reset();
      toast({
        title: "Login successful",
        description: "You have successfully logged in to your account.",
        variant: "default",
        duration: 5000,
      });
      router.push("/dashboard");
    } catch (error: any) {
      form.reset();
      const errorMessage =
        error.response.data.message || "Something went wrong.";
      form.setError("root", {
        message: errorMessage,
      });
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = window.location.href =
      ENDPOINTS.GOOGLE_LOGIN + "?source=login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Brush className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Email or Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your email or username"
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Sign in
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-100 text-gray-900"
            >
              <Image
                className="h-5 w-5 mr-2"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google Logo"
                width={20}
                height={20}
              />
              Sign in with Google
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
