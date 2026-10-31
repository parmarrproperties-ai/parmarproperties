import { Suspense } from "react";
import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { LoadingBlock } from "@/components/shared/states";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-12">
      {/* The form reads the `redirect` search param, so it renders on the client. */}
      <Suspense fallback={<LoadingBlock label="Loading sign in…" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
