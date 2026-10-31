"use client";

import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import type { SiteBranding } from "@/types";
import type { masterPropertySchema } from "@/lib/validations";
import { getErrorMessage } from "@/lib/utils";
import { getSiteBranding } from "@/lib/api/settings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/shared/field";

type PropertyValues = z.input<typeof masterPropertySchema>;
type PropertyOutput = z.output<typeof masterPropertySchema>;

/**
 * Developer Overview on the public Property Detail page is property-specific.
 * Firm-wide brand facts (RERA, office, website) live in `site_branding` and are
 * shown read-only here so they are never duplicated onto the property row.
 */
export function CompanyOverviewSection({
  form,
}: {
  form: UseFormReturn<PropertyValues, unknown, PropertyOutput>;
}) {
  const [branding, setBranding] = React.useState<SiteBranding | null>(null);
  const [brandingError, setBrandingError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getSiteBranding()
      .then(setBranding)
      .catch((error) => setBrandingError(getErrorMessage(error)));
  }, []);

  const { errors } = form.formState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Overview</CardTitle>
        <CardDescription>
          Property-specific developer copy for the Detail page&apos;s Developer
          Overview. Global firm details stay in site branding — they are not
          stored on each property.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field
          label="Developer name"
          htmlFor="developer_name"
          hint="Optional label for the developer of this residence."
          error={errors.developer_name?.message}
        >
          <Input
            id="developer_name"
            placeholder="e.g. Verified Tier-1 Developer"
            aria-invalid={Boolean(errors.developer_name)}
            {...form.register("developer_name")}
          />
        </Field>

        <Field
          label="Developer overview"
          htmlFor="developer_description"
          hint="Narrative shown under Developer Overview on the public Detail page."
          error={errors.developer_description?.message}
        >
          <Textarea
            id="developer_description"
            rows={6}
            placeholder="Crafted by one of Mumbai's most reputed architectural conglomerates…"
            aria-invalid={Boolean(errors.developer_description)}
            {...form.register("developer_description")}
          />
        </Field>

        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
          <p className="text-sm font-medium">Global firm branding</p>
          <p className="text-xs text-muted-foreground">
            Read from the site_branding singleton. These values are shared across
            the whole site and are not stored on this property.
          </p>
          {brandingError ? (
            <p className="text-sm text-destructive">{brandingError}</p>
          ) : branding ? (
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Brand
                </dt>
                <dd className="mt-0.5">{branding.brand_name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Established
                </dt>
                <dd className="mt-0.5">
                  {branding.est_badge || branding.est_year}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Firm MahaRERA
                </dt>
                <dd className="mt-0.5">{branding.firm_rera_number}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Website
                </dt>
                <dd className="mt-0.5 break-all">
                  {branding.official_website}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Office
                </dt>
                <dd className="mt-0.5">
                  {[
                    branding.office_building,
                    branding.office_street,
                    branding.office_city_pin,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Contact
                </dt>
                <dd className="mt-0.5">
                  {branding.contact_landline}
                  {branding.contact_email ? ` · ${branding.contact_email}` : ""}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              Loading global branding…
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
