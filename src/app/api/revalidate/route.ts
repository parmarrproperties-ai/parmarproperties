import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Called by the admin after any save so the public site shows the change now
 * rather than within the 60-second ISR window. Only active admins may trigger it.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: isAdmin, error } = await supabase.rpc("is_admin");

  if (error || isAdmin !== true) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
