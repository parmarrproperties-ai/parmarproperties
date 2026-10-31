"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { siteBrandingSchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import { getSiteBranding, saveSiteBranding } from "@/lib/api/settings";
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
import { Field, FieldGrid } from "@/components/shared/field";
import { ErrorState, LoadingBlock, Spinner } from "@/components/shared/states";

type BrandingValues = z.input<typeof siteBrandingSchema>;
type BrandingOutput = z.output<typeof siteBrandingSchema>;

const emptyDefaults: BrandingValues = {
  brand_name: "PARMAR PROPERTIES",
  est_year: 1981,
  est_badge: "EST. 1981",
  brand_tagline: "Mumbai • Prime Residential Real Estate",
  contact_landline: "",
  contact_mobile: "",
  whatsapp_number: "",
  contact_email: "",
  advisory_email: "",
  office_building: "",
  office_street: "",
  office_city_pin: "",
  working_hours: "",
  firm_rera_number: "",
  official_website: "https://www.parmarproperties.in/",
  nav_cta_label: "TALK TO OUR ADVISORY",
  meta_title: "",
  meta_desc: "",
  social_links: { linkedin: "", instagram: "", x: "", youtube: "" },
};

export function SiteBrandingForm() {
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [missing, setMissing] = React.useState(false);

  const form = useForm<BrandingValues, unknown, BrandingOutput>({
    resolver: zodResolver(siteBrandingSchema),
    defaultValues: emptyDefaults,
  });

  const load = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const branding = await getSiteBranding();
      if (!branding) {
        setMissing(true);
        form.reset(emptyDefaults);
        return;
      }
      setMissing(false);
      form.reset({
        brand_name: branding.brand_name,
        est_year: branding.est_year,
        est_badge: branding.est_badge,
        brand_tagline: branding.brand_tagline,
        contact_landline: branding.contact_landline,
        contact_mobile: branding.contact_mobile ?? "",
        whatsapp_number: branding.whatsapp_number,
        contact_email: branding.contact_email,
        advisory_email: branding.advisory_email,
        office_building: branding.office_building,
        office_street: branding.office_street,
        office_city_pin: branding.office_city_pin,
        working_hours: branding.working_hours,
        firm_rera_number: branding.firm_rera_number,
        official_website: branding.official_website,
        nav_cta_label: branding.nav_cta_label,
        meta_title: branding.meta_title,
        meta_desc: branding.meta_desc,
        social_links: {
          linkedin: branding.social_links?.linkedin ?? "",
          instagram: branding.social_links?.instagram ?? "",
          x: branding.social_links?.x ?? "",
          youtube: branding.social_links?.youtube ?? "",
        },
      });
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [form]);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(values: BrandingOutput) {
    try {
      await saveSiteBranding(values);
      toast.success("Site branding saved");
      setMissing(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (loading) return <LoadingBlock label="Loading site branding…" />;
  if (loadError) return <ErrorState message={loadError} onRetry={load} />;

  const { errors, isSubmitting } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {missing ? (
        <p className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm">
          The site_branding row is missing. Apply migration 005 and seed, then
          save here to create the singleton values.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Brand identity</CardTitle>
          <CardDescription>
            Global firm identity from MASTER_BACKEND_SPEC section A
            (site_branding singleton).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGrid>
            <Field
              label="Brand name"
              htmlFor="brand_name"
              required
              error={errors.brand_name?.message}
            >
              <Input id="brand_name" {...form.register("brand_name")} />
            </Field>
            <Field
              label="Established year"
              htmlFor="est_year"
              required
              error={errors.est_year?.message}
            >
              <Input
                id="est_year"
                type="number"
                {...form.register("est_year")}
              />
            </Field>
            <Field
              label="Established badge"
              htmlFor="est_badge"
              required
              error={errors.est_badge?.message}
            >
              <Input id="est_badge" {...form.register("est_badge")} />
            </Field>
            <Field
              label="Navbar CTA label"
              htmlFor="nav_cta_label"
              required
              error={errors.nav_cta_label?.message}
            >
              <Input id="nav_cta_label" {...form.register("nav_cta_label")} />
            </Field>
          </FieldGrid>
          <Field
            label="Brand tagline"
            htmlFor="brand_tagline"
            required
            error={errors.brand_tagline?.message}
          >
            <Input id="brand_tagline" {...form.register("brand_tagline")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact &amp; office</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGrid>
            <Field
              label="Landline"
              htmlFor="contact_landline"
              required
              error={errors.contact_landline?.message}
            >
              <Input
                id="contact_landline"
                {...form.register("contact_landline")}
              />
            </Field>
            <Field
              label="Mobile"
              htmlFor="contact_mobile"
              error={errors.contact_mobile?.message}
            >
              <Input id="contact_mobile" {...form.register("contact_mobile")} />
            </Field>
            <Field
              label="WhatsApp (digits only)"
              htmlFor="whatsapp_number"
              required
              hint="10–15 digits for wa.me links."
              error={errors.whatsapp_number?.message}
            >
              <Input
                id="whatsapp_number"
                {...form.register("whatsapp_number")}
              />
            </Field>
            <Field
              label="Working hours"
              htmlFor="working_hours"
              required
              error={errors.working_hours?.message}
            >
              <Input id="working_hours" {...form.register("working_hours")} />
            </Field>
            <Field
              label="Contact email"
              htmlFor="contact_email"
              required
              error={errors.contact_email?.message}
            >
              <Input
                id="contact_email"
                type="email"
                {...form.register("contact_email")}
              />
            </Field>
            <Field
              label="Advisory email"
              htmlFor="advisory_email"
              required
              error={errors.advisory_email?.message}
            >
              <Input
                id="advisory_email"
                type="email"
                {...form.register("advisory_email")}
              />
            </Field>
          </FieldGrid>
          <FieldGrid columns={3}>
            <Field
              label="Office building"
              htmlFor="office_building"
              required
              error={errors.office_building?.message}
            >
              <Input
                id="office_building"
                {...form.register("office_building")}
              />
            </Field>
            <Field
              label="Office street"
              htmlFor="office_street"
              required
              error={errors.office_street?.message}
            >
              <Input id="office_street" {...form.register("office_street")} />
            </Field>
            <Field
              label="City / state / PIN"
              htmlFor="office_city_pin"
              required
              error={errors.office_city_pin?.message}
            >
              <Input
                id="office_city_pin"
                {...form.register("office_city_pin")}
              />
            </Field>
          </FieldGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance, web &amp; SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGrid>
            <Field
              label="Firm MahaRERA number"
              htmlFor="firm_rera_number"
              required
              error={errors.firm_rera_number?.message}
            >
              <Input
                id="firm_rera_number"
                {...form.register("firm_rera_number")}
              />
            </Field>
            <Field
              label="Official website"
              htmlFor="official_website"
              required
              error={errors.official_website?.message}
            >
              <Input
                id="official_website"
                {...form.register("official_website")}
              />
            </Field>
          </FieldGrid>
          <Field
            label="Global meta title"
            htmlFor="meta_title"
            required
            error={errors.meta_title?.message}
          >
            <Input id="meta_title" {...form.register("meta_title")} />
          </Field>
          <Field
            label="Global meta description"
            htmlFor="meta_desc"
            required
            error={errors.meta_desc?.message}
          >
            <Textarea
              id="meta_desc"
              rows={2}
              {...form.register("meta_desc")}
            />
          </Field>
          <FieldGrid>
            <Field label="LinkedIn" htmlFor="linkedin">
              <Input
                id="linkedin"
                {...form.register("social_links.linkedin")}
              />
            </Field>
            <Field label="Instagram" htmlFor="instagram">
              <Input
                id="instagram"
                {...form.register("social_links.instagram")}
              />
            </Field>
            <Field label="X" htmlFor="x">
              <Input id="x" {...form.register("social_links.x")} />
            </Field>
            <Field label="YouTube" htmlFor="youtube">
              <Input id="youtube" {...form.register("social_links.youtube")} />
            </Field>
          </FieldGrid>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : <Save />}
          Save branding
        </Button>
      </div>
    </form>
  );
}
