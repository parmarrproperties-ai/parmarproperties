import type { PageContent } from "@/types";
import type { PageContentInput } from "@/lib/validations";

import { getSupabase, nullifyEmpty, throwOnError } from "./client";

const TABLE = "page_content";

export async function listPageContent(): Promise<PageContent[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("id", { ascending: true });

  throwOnError(error, "Loading page content");
  return (data ?? []) as unknown as PageContent[];
}

export async function getPageContent(id: string): Promise<PageContent | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwOnError(error, "Loading page content");
  return (data as unknown as PageContent) ?? null;
}

export async function updatePageContent(
  id: string,
  input: PageContentInput
): Promise<PageContent> {
  const supabase = getSupabase();
  const payload = {
    ...nullifyEmpty({
      title: input.title,
      subtitle: input.subtitle,
      breadcrumb: input.breadcrumb,
      badge: input.badge,
      meta_title: input.meta_title,
      meta_description: input.meta_description,
    }),
    sections_data: input.sections_data ?? {},
  };

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  throwOnError(error, "Saving page content");
  return data as unknown as PageContent;
}
