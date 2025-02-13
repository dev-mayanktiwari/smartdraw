import { useAuth } from "../hooks/useAuth";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated() ? children : null;
};

export default ProtectedRoute;
