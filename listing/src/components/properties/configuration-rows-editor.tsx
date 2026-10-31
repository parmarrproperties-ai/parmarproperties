"use client";

import * as React from "react";
import { Plus, Trash } from "lucide-react";

import type { PropertyConfigVariant } from "@/types";
import { VARIANT_CODES, getVariantLabel } from "@/lib/constants";
import type { ConfigurationDraftRowInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/shared/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ConfigurationDraftRow = {
  key: string;
  variant_code: PropertyConfigVariant;
  custom_type: string;
  title: string;
  area_range: string;
  price_indicator: string;
};

export function createEmptyConfigurationRow(): ConfigurationDraftRow {
  return {
    key:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `cfg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    variant_code: "1bhk",
    custom_type: "",
    title: "",
    area_range: "",
    price_indicator: "",
  };
}

/**
 * Maps an Add Property draft row onto property_configurations columns.
 * Admin-entered title is preserved; empty titles fall back to the type label.
 */
export function draftRowToConfigurationInput(
  row: ConfigurationDraftRow,
  displayOrder: number
) {
  const typeLabel =
    row.variant_code === "custom"
      ? row.custom_type.trim()
      : getVariantLabel(row.variant_code);
  const title = row.title.trim() || typeLabel;

  return {
    plan_type: "individual" as const,
    variant_code: row.variant_code,
    tab_label: typeLabel.slice(0, 30) || "Config",
    title: title.slice(0, 100),
    area_range: row.area_range.trim(),
    carpet_area: "",
    price_indicator: row.price_indicator.trim(),
    tower_zone: "",
    image_path: "",
    display_order: displayOrder,
  };
}

export function draftRowsToValidationInput(
  rows: ConfigurationDraftRow[]
): ConfigurationDraftRowInput[] {
  return rows.map((row) => ({
    variant_code: row.variant_code,
    custom_type: row.custom_type,
    title: row.title,
    area_range: row.area_range,
    price_indicator: row.price_indicator,
  }));
}

interface ConfigurationRowsEditorProps {
  rows: ConfigurationDraftRow[];
  onChange: (rows: ConfigurationDraftRow[]) => void;
  disabled?: boolean;
  errors?: Array<Partial<Record<keyof ConfigurationDraftRowInput, string>>>;
  listError?: string;
}

/**
 * Multi-row Configuration editor for the Add Property flow.
 * Persists via property_configurations after the property is created.
 */
export function ConfigurationRowsEditor({
  rows,
  onChange,
  disabled,
  errors,
  listError,
}: ConfigurationRowsEditorProps) {
  function updateRow(
    key: string,
    patch: Partial<Omit<ConfigurationDraftRow, "key">>
  ) {
    onChange(
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row))
    );
  }

  function removeRow(key: string) {
    if (rows.length <= 1) {
      onChange([createEmptyConfigurationRow()]);
      return;
    }
    onChange(rows.filter((row) => row.key !== key));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
        <CardDescription>
          Add one or more typologies for this property. Each row becomes a
          configuration matrix entry on the public detail page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {listError ? (
          <p className="text-sm text-destructive">{listError}</p>
        ) : null}

        <div className="space-y-3">
          {rows.map((row, index) => {
            const rowErrors = errors?.[index];
            const isOther = row.variant_code === "custom";

            return (
              <div
                key={row.key}
                className="rounded-lg border border-border p-3 sm:p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Configuration {index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={disabled || rows.length <= 1}
                    onClick={() => removeRow(row.key)}
                    aria-label={`Remove configuration ${index + 1}`}
                  >
                    <Trash />
                    Remove
                  </Button>
                </div>

                <div className="grid gap-3 lg:grid-cols-12">
                  <Field
                    label="BHK / Type"
                    required
                    error={rowErrors?.variant_code}
                    className="lg:col-span-3"
                  >
                    <Select
                      value={row.variant_code}
                      onValueChange={(value) =>
                        updateRow(row.key, {
                          variant_code: value as PropertyConfigVariant,
                          custom_type:
                            value === "custom" ? row.custom_type : "",
                        })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger aria-label={`BHK / Type ${index + 1}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {VARIANT_CODES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {isOther ? (
                    <Field
                      label="Custom type"
                      required
                      hint="Studio, Penthouse, Duplex, Villa…"
                      error={rowErrors?.custom_type}
                      className="lg:col-span-3"
                    >
                      <Input
                        value={row.custom_type}
                        placeholder="Penthouse"
                        disabled={disabled}
                        aria-label={`Custom type ${index + 1}`}
                        onChange={(event) =>
                          updateRow(row.key, {
                            custom_type: event.target.value,
                          })
                        }
                      />
                    </Field>
                  ) : null}

                  <Field
                    label="Configuration name"
                    hint="Admin-controlled display name."
                    error={rowErrors?.title}
                    className={isOther ? "lg:col-span-6" : "lg:col-span-3"}
                  >
                    <Input
                      value={row.title}
                      placeholder="2 BHK Sea View"
                      disabled={disabled}
                      aria-label={`Configuration name ${index + 1}`}
                      onChange={(event) =>
                        updateRow(row.key, { title: event.target.value })
                      }
                    />
                  </Field>

                  <Field
                    label="Area range (sq.ft)"
                    required
                    hint='e.g. "850 - 920" or "1820"'
                    error={rowErrors?.area_range}
                    className="lg:col-span-3"
                  >
                    <Input
                      value={row.area_range}
                      placeholder="850 - 920"
                      disabled={disabled}
                      aria-label={`Area range ${index + 1}`}
                      onChange={(event) =>
                        updateRow(row.key, {
                          area_range: event.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field
                    label="Price range"
                    required
                    hint='e.g. "₹2.5 - 2.8 Cr"'
                    error={rowErrors?.price_indicator}
                    className="lg:col-span-3"
                  >
                    <Input
                      value={row.price_indicator}
                      placeholder="₹2.5 - 2.8 Cr"
                      disabled={disabled}
                      aria-label={`Price range ${index + 1}`}
                      onChange={(event) =>
                        updateRow(row.key, {
                          price_indicator: event.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onChange([...rows, createEmptyConfigurationRow()])}
        >
          <Plus />
          Add Configuration
        </Button>
      </CardContent>
    </Card>
  );
}
