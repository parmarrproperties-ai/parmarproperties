// ============================================================
// src/components/ProtectedRoute.tsx
// Wraps admin routes — redirects to /admin/login if no session.
// ============================================================

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSession } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [status, setStatus] = useState<"loading" | "auth" | "unauth">("loading");

  useEffect(() => {
    getSession().then((session) => {
      setStatus(session ? "auth" : "unauth");
    });
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauth") {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
