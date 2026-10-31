import { TriangleAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Shown instead of the admin UI when the Supabase environment variables are
 * missing, so a fresh clone explains itself rather than throwing.
 */
export function SetupNotice() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex size-9 items-center justify-center rounded-full bg-warning/15 text-warning-foreground">
          <TriangleAlert className="size-4" />
        </div>
        <CardTitle>Supabase is not configured</CardTitle>
        <CardDescription>
          Add your project credentials to <code>.env.local</code>, then restart
          the dev server.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs scrollbar-thin">
          {`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
        </pre>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Copy <code>.env.example</code> to <code>.env.local</code>.
          </li>
          <li>
            Run the files in <code>supabase/migrations</code> in the Supabase SQL
            editor, in order.
          </li>
          <li>
            Optionally run <code>supabase/seed.sql</code> for sample content.
          </li>
          <li>Invite yourself as a user, then sign in.</li>
        </ol>
      </CardContent>
    </Card>
  );
}
