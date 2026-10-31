"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  id?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** Entries beyond this count are ignored, matching the column's intent. */
  max?: number;
  disabled?: boolean;
}

/**
 * Editor for the `TEXT[]` columns in the master schema — property highlights and
 * a location's key enclaves. Entries are added one at a time with Enter or the
 * Add button, and removed from the badge list.
 */
export function TagInput({
  id,
  value,
  onChange,
  placeholder,
  max = 8,
  disabled,
}: TagInputProps) {
  const [draft, setDraft] = React.useState("");

  function add() {
    const entry = draft.trim();
    setDraft("");
    if (!entry || value.includes(entry) || value.length >= max) return;
    onChange([...value, entry]);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          disabled={disabled || value.length >= max}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !draft.trim() || value.length >= max}
          onClick={add}
        >
          Add
        </Button>
      </div>

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((entry) => (
            <Badge key={entry} variant="secondary" className="gap-1">
              <span className="max-w-64 truncate">{entry}</span>
              <button
                type="button"
                aria-label={`Remove ${entry}`}
                disabled={disabled}
                className="text-muted-foreground hover:text-foreground"
                onClick={() => onChange(value.filter((item) => item !== entry))}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
