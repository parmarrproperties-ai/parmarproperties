import { withBasePath } from '@/lib/base-path';

export type LeadSourceSlug =
  | 'navbar_advisory'
  | 'private_opportunities_otp'
  | 'property_gate_modal'
  | 'property_sidebar_inquiry'
  | 'commercial_card_modal'
  | 'article_consultation_modal'
  | 'google_ppc_landing';

export interface SubmitLeadPayload {
  fullName: string;
  phone: string;
  email?: string;
  companyName?: string;
  sourceSlug: LeadSourceSlug;
  propertyId?: string;
  propertySlug?: string;
  commercialId?: string;
  articleId?: string;
  assetClass?: string;
  budgetRange?: string;
  message?: string;
  gateType?: string;
  isOtpVerified?: boolean;
}

function keepOfflineCopy(payload: SubmitLeadPayload, reason: string) {
  try {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('parmar_offline_leads') || '[]');
      stored.push({ ...payload, submittedAt: new Date().toISOString(), reason });
      localStorage.setItem('parmar_offline_leads', JSON.stringify(stored));
    }
  } catch {
    // Storage unavailable (private mode); nothing more we can do client-side.
  }
}

/**
 * Sends an enquiry to POST /api/leads, which validates, rate-limits, saves it
 * through the submit_lead() database function and emails staff.
 */
export async function submitLead(payload: SubmitLeadPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(withBasePath('/api/leads'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = (await response.json().catch(() => ({}))) as { success?: boolean; error?: string };

    if (response.ok && result.success) return { success: true };

    const error = result.error || `Enquiry failed (${response.status})`;
    keepOfflineCopy(payload, error);
    return { success: false, error };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    keepOfflineCopy(payload, message);
    return { success: false, error: message };
  }
}
