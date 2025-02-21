"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import DashboardSkeleton from "@/components/Skeletone";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // If authentication status is not determined yet, show nothing (or a loader)
  if (isAuthenticated() === null || isAuthenticated() === undefined) {
    return <DashboardSkeleton />; // Optional: Show a spinner or skeleton loader
  }

  // Redirect before rendering anything
  if (requireAuth && !isAuthenticated()) {
    router.replace("/login");
    return null;
  }

  if (!requireAuth && isAuthenticated()) {
    router.replace("/dashboard");
    return null;
  }

  // Render children only when authentication status is appropriate
  return <>{children}</>;
};

export default ProtectedRoute;
