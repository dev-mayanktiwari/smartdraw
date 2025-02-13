"use client"; 

import React from "react";
import { useRouter } from "next/navigation";
// import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brush } from "lucide-react";
import { useForm } from "react-hook-form";
import type { TUserRegistrationInput } from "@repo/types";
import { UserRegisterInput } from "@repo/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

const Signup = () => {
  // const router = useRouter();
  const form = useForm<TUserRegistrationInput>({
    resolver: zodResolver(UserRegisterInput),
  });

  const handleChange = (data: TUserRegistrationInput) => {
    console.log(data);
  };

  //   const handleSubmit2 = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     try {
  //       // const response = await axios.post("/api/auth/signup", formData);
  //       // Handle successful signup
  //       // localStorage.setItem("token", response.data.token);
  //       router.push("/dashboard");
  //     } catch (error) {
  //       console.error("Signup failed:", error);
  //     }
  //   };

  const handleGoogleSignup = () => {
    // Implement Google signup logic
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Brush className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Sign in
            </a>
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleChange)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Choose a username"
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
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
                        placeholder="Create a password"
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
              Create Account
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
              onClick={handleGoogleSignup}
              className="w-full bg-white hover:bg-gray-100 text-gray-900"
            >
              <Image
                className="h-5 w-5 mr-2"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google Logo"
                width={20}
                height={20}
              />
              Sign up with Google
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
