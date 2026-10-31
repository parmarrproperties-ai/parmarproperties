"use client";

import * as React from "react";
import { Plus, Save, Trash } from "lucide-react";
import { toast } from "sonner";

import type { PriceBreakdownInput } from "@/lib/validations";
import { formatCurrency, getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/shared/states";

interface Row {
  key: string;
  label: string;
  amount: string;
}

export interface PriceBreakdownEditorRow {
  id: string;
  label: string;
  amount: number;
}

function toRows(breakdowns: PriceBreakdownEditorRow[]): Row[] {
  return breakdowns.map((row) => ({
    key: row.id,
    label: row.label,
    amount: String(row.amount),
  }));
}

function newRow(): Row {
  const key =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return { key, label: "", amount: "" };
}

/**
 * Editable cost-sheet UI. Persistence is injected so the same editor can save
 * either legacy `price_breakdowns` or master
 * `property_configuration_price_breakdowns`.
 */
export function PriceBreakdownEditor({
  breakdowns,
  currency,
  onSave,
  onSaved,
  title = "Cost sheet",
  emptyHint = "No cost lines yet. Add base price, floor rise, GST and other charges so buyers see the full picture.",
  saveLabel = "Save cost sheet",
}: {
  breakdowns: PriceBreakdownEditorRow[];
  currency: string;
  onSave: (rows: PriceBreakdownInput[]) => Promise<void>;
  onSaved: () => void;
  title?: string;
  emptyHint?: string;
  saveLabel?: string;
}) {
  const [rows, setRows] = React.useState<Row[]>(() => toRows(breakdowns));
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [loadedFrom, setLoadedFrom] = React.useState(breakdowns);
  if (loadedFrom !== breakdowns) {
    setLoadedFrom(breakdowns);
    setRows(toRows(breakdowns));
  }

  const total = rows.reduce((sum, row) => {
    const value = Number(row.amount);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  function update(key: string, patch: Partial<Row>) {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row))
    );
  }

  function moveRow(from: number, to: number) {
    if (to < 0 || to >= rows.length) return;
    setRows((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  async function handleSave() {
    const filled = rows.filter((row) => row.label.trim() !== "");

    if (filled.some((row) => !Number.isFinite(Number(row.amount)))) {
      setError("Every amount must be a number.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await onSave(
        filled.map((row, index) => ({
          label: row.label.trim(),
          amount: Number(row.amount || 0),
          display_order: index,
        }))
      );
      toast.success("Price breakdown saved");
      onSaved();
    } catch (caught) {
      toast.error(getErrorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setRows((current) => [...current, newRow()])}
        >
          <Plus />
          Add line
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{emptyHint}</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row, index) => (
            <div key={row.key} className="flex items-center gap-2">
              <div className="flex shrink-0 flex-col gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move line up"
                  disabled={index === 0}
                  onClick={() => moveRow(index, index - 1)}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move line down"
                  disabled={index === rows.length - 1}
                  onClick={() => moveRow(index, index + 1)}
                >
                  ↓
                </Button>
              </div>
              <Input
                value={row.label}
                placeholder="Base price"
                aria-label="Cost line label"
                onChange={(event) =>
                  update(row.key, { label: event.target.value })
                }
              />
              <Input
                value={row.amount}
                type="number"
                min={0}
                placeholder="0"
                className="w-36"
                aria-label="Cost line amount"
                onChange={(event) =>
                  update(row.key, { amount: event.target.value })
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove cost line"
                className="text-destructive hover:bg-destructive/10"
                onClick={() =>
                  setRows((current) =>
                    current.filter((item) => item.key !== row.key)
                  )
                }
              >
                <Trash />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <p className="text-sm">
          <span className="text-muted-foreground">Total: </span>
          <span className="font-semibold">
            {formatCurrency(total, currency)}
          </span>
        </p>
        <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Spinner /> : <Save />}
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
