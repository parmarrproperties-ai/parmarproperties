"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";

interface OrderControlsProps {
  index: number;
  total: number;
  disabled?: boolean;
  onMove: (from: number, to: number) => void;
}

/**
 * Up/down reordering. Chosen over drag-and-drop so ordering also works with a
 * keyboard and on touch screens.
 */
export function OrderControls({
  index,
  total,
  disabled,
  onMove,
}: OrderControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Move up"
        disabled={disabled || index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <ChevronUp />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Move down"
        disabled={disabled || index >= total - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <ChevronDown />
      </Button>
    </div>
  );
}

/**
 * Returns a copy of `items` with the entry at `from` moved to `to`.
 */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
