"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { loginSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import { sendPasswordReset, signIn } from "@/lib/api/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/shared/field";
import { Spinner } from "@/components/shared/states";
import { SetupNotice } from "@/components/admin/setup-notice";

type LoginValues = z.input<typeof loginSchema>;
type LoginOutput = z.output<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configured = isSupabaseConfigured();

  const [showPassword, setShowPassword] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);

  const form = useForm<LoginValues, unknown, LoginOutput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (!configured) return <SetupNotice />;

  const redirectTo = searchParams.get("redirect") ?? "/admin/dashboard";

  async function onSubmit(values: LoginOutput) {
    try {
      await signIn(values.email, values.password);
      toast.success("Welcome back");
      // A full navigation lets the proxy re-read the fresh session cookie.
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(error);
      form.setError("password", { message });
      toast.error(message);
    }
  }

  async function handleReset() {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", {
        message: "Enter your email first, then request a reset link.",
      });
      return;
    }

    setResetting(true);
    try {
      await sendPasswordReset(email);
      toast.success("Password reset link sent", {
        description: `Check ${email} for the next step.`,
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setResetting(false);
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center gap-3 text-center">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building className="size-5" />
        </span>
        <CardTitle className="text-lg">Parmar Properties</CardTitle>
        <CardDescription>
          Sign in to manage listings and website content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field
            label="Email"
            htmlFor="email"
            error={form.formState.errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@parmarproperties.com"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
          </Field>

          <Field
            label="Password"
            htmlFor="password"
            error={form.formState.errors.password?.message}
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="pr-10"
                aria-invalid={Boolean(form.formState.errors.password)}
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </Field>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            Sign in
          </Button>

          <Button
            type="button"
            variant="link"
            className="w-full"
            disabled={resetting}
            onClick={handleReset}
          >
            Forgot your password?
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
