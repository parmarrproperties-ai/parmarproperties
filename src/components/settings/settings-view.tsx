"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import type { Profile } from "@/types";
import { businessSettingsSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import { useResource } from "@/lib/hooks/use-resource";
import { getBusinessSettings, saveBusinessSettings } from "@/lib/api/settings";
import {
  getCurrentProfile,
  updatePassword,
  updateProfileName,
} from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { Field, FieldGrid } from "@/components/shared/field";
import { ErrorState, LoadingBlock, Spinner } from "@/components/shared/states";
import { SiteBrandingForm } from "@/components/settings/site-branding-form";
import { ImageOptimizerCard } from "@/components/settings/image-optimizer-card";

type SettingsValues = z.input<typeof businessSettingsSchema>;
type SettingsOutput = z.output<typeof businessSettingsSchema>;

export function SettingsView() {
  const form = useForm<SettingsValues, unknown, SettingsOutput>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      business_name: "",
      phone: "",
      email: "",
      office_address: "",
      whatsapp: "",
      currency: "INR",
      social_links: {},
    },
  });

  const fetchSettings = React.useCallback(async () => {
    const [settings, currentProfile] = await Promise.all([
      getBusinessSettings(),
      getCurrentProfile(),
    ]);

    form.reset({
      business_name: settings.business_name,
      phone: settings.phone,
      email: settings.email,
      office_address: settings.office_address,
      whatsapp: settings.whatsapp,
      currency: settings.currency,
      social_links: {
        facebook: settings.social_links.facebook ?? "",
        instagram: settings.social_links.instagram ?? "",
        linkedin: settings.social_links.linkedin ?? "",
        twitter: settings.social_links.twitter ?? "",
      },
    });

    return currentProfile;
  }, [form]);

  const {
    data: profile,
    loading,
    error,
    reload,
  } = useResource<Profile | null>(fetchSettings, null);

  async function onSubmit(values: SettingsOutput) {
    try {
      await saveBusinessSettings(values);
      toast.success("Settings saved");
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    }
  }

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading) return <LoadingBlock label="Loading settings…" />;

  const { errors, isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Corporate branding, legacy business details, and your account."
      />

      <Tabs defaultValue="branding">
        <TabsList>
          <TabsTrigger value="branding">Site branding</TabsTrigger>
          <TabsTrigger value="business">Legacy business</TabsTrigger>
          <TabsTrigger value="social">Social links</TabsTrigger>
          <TabsTrigger value="account">Your account</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4">
          <SiteBrandingForm />
          <ImageOptimizerCard />
        </TabsContent>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business details</CardTitle>
                <CardDescription>
                  Shown in the website header, footer and contact sections.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGrid>
                  <Field
                    label="Business name"
                    htmlFor="business_name"
                    required
                    error={errors.business_name?.message}
                  >
                    <Input
                      id="business_name"
                      aria-invalid={Boolean(errors.business_name)}
                      {...form.register("business_name")}
                    />
                  </Field>
                  <Field
                    label="Currency"
                    htmlFor="currency"
                    hint="ISO code used to format prices, e.g. INR."
                    error={errors.currency?.message}
                  >
                    <Input id="currency" {...form.register("currency")} />
                  </Field>
                  <Field
                    label="Phone"
                    htmlFor="phone"
                    error={errors.phone?.message}
                  >
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      {...form.register("phone")}
                    />
                  </Field>
                  <Field
                    label="WhatsApp"
                    htmlFor="whatsapp"
                    hint="Number used for the chat button."
                    error={errors.whatsapp?.message}
                  >
                    <Input
                      id="whatsapp"
                      placeholder="+91 98765 43210"
                      {...form.register("whatsapp")}
                    />
                  </Field>
                  <Field
                    label="Email"
                    htmlFor="email"
                    error={errors.email?.message}
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="sales@parmarproperties.com"
                      aria-invalid={Boolean(errors.email)}
                      {...form.register("email")}
                    />
                  </Field>
                </FieldGrid>

                <Field
                  label="Office address"
                  htmlFor="office_address"
                  error={errors.office_address?.message}
                >
                  <Textarea
                    id="office_address"
                    rows={3}
                    placeholder="Street, area, city, PIN"
                    {...form.register("office_address")}
                  />
                </Field>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : <Save />}
                Save settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social links</CardTitle>
                <CardDescription>
                  Leave a field empty to hide that icon on the website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGrid>
                  <Field
                    label="Facebook"
                    htmlFor="facebook"
                    error={errors.social_links?.facebook?.message}
                  >
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/…"
                      {...form.register("social_links.facebook")}
                    />
                  </Field>
                  <Field
                    label="Instagram"
                    htmlFor="instagram"
                    error={errors.social_links?.instagram?.message}
                  >
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/…"
                      {...form.register("social_links.instagram")}
                    />
                  </Field>
                  <Field
                    label="LinkedIn"
                    htmlFor="linkedin"
                    error={errors.social_links?.linkedin?.message}
                  >
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/company/…"
                      {...form.register("social_links.linkedin")}
                    />
                  </Field>
                  <Field
                    label="X / Twitter"
                    htmlFor="twitter"
                    error={errors.social_links?.twitter?.message}
                  >
                    <Input
                      id="twitter"
                      placeholder="https://x.com/…"
                      {...form.register("social_links.twitter")}
                    />
                  </Field>
                </FieldGrid>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : <Save />}
                Save settings
              </Button>
            </div>
          </TabsContent>
        </form>

        <TabsContent value="account">
          {profile ? (
            <AccountSettings profile={profile} onUpdated={reload} />
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AccountSettings({
  profile,
  onUpdated,
}: {
  profile: Profile;
  onUpdated: () => void;
}) {
  const [fullName, setFullName] = React.useState(profile.full_name ?? "");
  const [savingName, setSavingName] = React.useState(false);

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [savingPassword, setSavingPassword] = React.useState(false);

  async function handleNameSave() {
    setSavingName(true);
    try {
      await updateProfileName(profile.id, fullName.trim());
      toast.success("Name updated");
      onUpdated();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingName(false);
    }
  }

  async function handlePasswordSave() {
    if (password.length < 6) {
      setPasswordError("Use at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("The two passwords do not match.");
      return;
    }

    setPasswordError(null);
    setSavingPassword(true);
    try {
      await updatePassword(password);
      setPassword("");
      setConfirmPassword("");
      toast.success("Password updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>
            Signed in as {profile.email}
            <Badge
              variant={profile.role === "super_admin" ? "default" : "secondary"}
              className="ml-2"
            >
              {profile.role === "super_admin" ? "Super admin" : "Admin"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Full name" htmlFor="full_name">
            <Input
              id="full_name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your name"
            />
          </Field>
          <div className="flex justify-end">
            <Button onClick={handleNameSave} disabled={savingName}>
              {savingName ? <Spinner /> : <Save />}
              Save name
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            You stay signed in on this device after changing it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGrid>
            <Field label="New password" htmlFor="new_password">
              <Input
                id="new_password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
            <Field
              label="Confirm password"
              htmlFor="confirm_password"
              error={passwordError ?? undefined}
            >
              <Input
                id="confirm_password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Field>
          </FieldGrid>
          <div className="flex justify-end">
            <Button
              onClick={handlePasswordSave}
              disabled={savingPassword || !password}
            >
              {savingPassword ? <Spinner /> : <Save />}
              Update password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
