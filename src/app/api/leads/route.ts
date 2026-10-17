import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Public enquiry endpoint. Every website form posts here (via submitLead) so
// leads get validation, rate limiting and a staff notification in one place.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// A malformed id must never cost us the lead: drop it instead of rejecting.
const optionalId = z
  .string()
  .optional()
  .transform((value) => (value && UUID_RE.test(value) ? value : undefined));

const leadSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().max(120).optional().or(z.literal("")),
  companyName: z.string().trim().max(120).optional(),
  sourceSlug: z.string().max(60),
  propertyId: optionalId,
  propertySlug: z.string().max(160).optional(),
  commercialId: optionalId,
  articleId: optionalId,
  assetClass: z.string().max(80).optional(),
  budgetRange: z.string().max(80).optional(),
  message: z.string().max(5000).optional(),
  gateType: z.string().max(50).optional(),
});

type LeadInput = z.infer<typeof leadSchema>;

// Best-effort per-instance burst limit; the real limit lives in submit_lead().
const recentByIp = new Map<string, number[]>();
const BURST_WINDOW_MS = 60_000;
const BURST_MAX = 3;

function isBursting(ipHash: string): boolean {
  const now = Date.now();
  const hits = (recentByIp.get(ipHash) ?? []).filter((t) => now - t < BURST_WINDOW_MS);
  hits.push(now);
  recentByIp.set(ipHash, hits);
  if (recentByIp.size > 5000) recentByIp.clear();
  return hits.length > BURST_MAX;
}

function clientIpHash(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return createHash("sha256")
    .update(`${ip}:${process.env.LEAD_IP_SALT ?? "parmar-leads"}`)
    .digest("hex");
}

function toRpcLead(lead: LeadInput) {
  return {
    full_name: lead.fullName,
    phone: lead.phone,
    email: lead.email || null,
    company_name: lead.companyName || null,
    source_slug: lead.sourceSlug,
    property_id: lead.propertyId || null,
    commercial_id: lead.commercialId || null,
    article_id: lead.articleId || null,
    asset_class: lead.assetClass || null,
    budget_range: lead.budgetRange || null,
    message: lead.message || null,
    gate_type: lead.gateType || null,
  };
}

/** Emails staff about a lead. Never throws: a mail failure must not lose the lead. */
async function notifyStaff(lead: LeadInput, savedToDb: boolean): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const lines = [
    `Name: ${lead.fullName}`,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.propertySlug ? `Property: ${lead.propertySlug}` : null,
    `Source: ${lead.sourceSlug}`,
    lead.budgetRange ? `Budget: ${lead.budgetRange}` : null,
    lead.message ? `Message: ${lead.message}` : null,
    savedToDb ? null : "",
    savedToDb ? null : "WARNING: this lead could NOT be saved to the admin inbox. Follow up from this email.",
  ].filter((line): line is string => line !== null);

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? "Parmar Leads <onboarding@resend.dev>",
        to: to.split(",").map((s) => s.trim()),
        subject: `${savedToDb ? "New enquiry" : "UNSAVED enquiry"}: ${lead.fullName}`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error("[leads] notification email failed", error);
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  let lead: LeadInput;
  try {
    lead = leadSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ success: false, error: "Invalid enquiry" }, { status: 400 });
  }

  const ipHash = clientIpHash(request);
  if (isBursting(ipHash)) {
    return NextResponse.json({ success: false, error: "Too many enquiries, please try again shortly" }, { status: 429 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    await notifyStaff(lead, false);
    return NextResponse.json({ success: false, error: "Enquiries are unavailable" }, { status: 503 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.rpc("submit_lead", { p_lead: toRpcLead(lead), p_ip_hash: ipHash });

  if (!error) {
    await notifyStaff(lead, true);
    return NextResponse.json({ success: true });
  }

  if (error.message.includes("rate_limited")) {
    return NextResponse.json({ success: false, error: "Too many enquiries, please try again shortly" }, { status: 429 });
  }

  // Migration 016 not applied yet: fall back to the direct insert (RLS 013 still applies).
  if (error.code === "PGRST202") {
    const { data: source } = await supabase
      .from("lookup_lead_sources")
      .select("id")
      .eq("slug", lead.sourceSlug)
      .maybeSingle();
    const record = toRpcLead(lead);
    const { error: insertError } = await supabase.from("leads").insert({
      full_name: record.full_name,
      phone: record.phone,
      email: record.email,
      company_name: record.company_name,
      source_id: source?.id,
      property_id: record.property_id,
      commercial_id: record.commercial_id,
      article_id: record.article_id,
      asset_class: record.asset_class,
      budget_range: record.budget_range,
      message: record.message,
      gate_type: record.gate_type,
      is_otp_verified: false,
    });
    if (!insertError) {
      await notifyStaff(lead, true);
      return NextResponse.json({ success: true });
    }
    console.error("[leads] direct insert failed", { code: insertError.code, message: insertError.message });
  } else {
    console.error("[leads] submit_lead failed", { code: error.code, message: error.message });
  }

  await notifyStaff(lead, false);
  return NextResponse.json({ success: false, error: "Could not save enquiry" }, { status: 502 });
}
