import type { ComponentType } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  icon: ComponentType<{ className?: string }>;
  tone?: "default" | "success" | "warning" | "primary";
  loading?: boolean;
}

const toneClasses: Record<
  NonNullable<StatCardProps["tone"]>,
  string
> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/12 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-warning-foreground",
};

export function StatCard({
  label,
  value,
  hint,
  href,
  icon: Icon,
  tone = "primary",
  loading,
}: StatCardProps) {
  const body = (
    <CardContent className="flex items-start justify-between gap-4 p-5">
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        )}
        {hint ? (
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
          toneClasses[tone]
        )}
      >
        <Icon />
      </span>
    </CardContent>
  );

  if (href) {
    return (
      <Card className="transition-colors hover:border-ring/60">
        <Link href={href} className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
          {body}
        </Link>
      </Card>
    );
  }

  return <Card>{body}</Card>;
}
