"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PenTool, Users, Settings } from "lucide-react";

import ProtectedRoute from "@/provider/protectedRouter";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            Welcome to SMARTDRAW
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <PenTool className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-white">
                  New Drawing
                </h2>
              </div>
              <p className="text-gray-400 mb-4">
                Start a new drawing project with AI assistance
              </p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Create New
              </Button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-white">
                  Collaborate
                </h2>
              </div>
              <p className="text-gray-400 mb-4">
                Join or create a collaborative session
              </p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Join Session
              </Button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-white">Settings</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Configure your drawing preferences
              </p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Open Settings
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Recent Projects
            </h2>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400">
                No recent projects found. Start by creating a new drawing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
