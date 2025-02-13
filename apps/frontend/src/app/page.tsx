import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brush, PenTool, Users, Sparkles } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brush className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">SMARTDRAW</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-white hover:text-blue-400"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
          Collaborative Drawing Made{" "}
          <span className="text-blue-500">Smart</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Create, collaborate, and innovate with AI-powered drawing tools.
          Transform your ideas into reality with SMARTDRAW.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link href="/signup">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg">
              Get Started Free
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white/10 px-8 py-6 text-lg"
          >
            Watch Demo
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-blue-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <PenTool className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Smart Drawing Tools
            </h3>
            <p className="text-gray-400">
              Advanced drawing tools powered by AI to enhance your creativity.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Real-time Collaboration
            </h3>
            <p className="text-gray-400">
              Work together with your team in real-time, anywhere in the world.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              AI Assistant
            </h3>
            <p className="text-gray-400">
              Get intelligent suggestions and improvements for your drawings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
