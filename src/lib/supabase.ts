import { createClient } from "@supabase/supabase-js";
import { CONFIG, type PaymentMethod } from "@/config";

/**
 * Browser Supabase client. Only the publishable (anon) key belongs here; every table is
 * protected by the RLS policies in supabase/migrations. Import this module lazily
 * (`await import("@/lib/supabase")`) from landing-page code so supabase-js stays out of
 * the first chunk.
 */
const url = import.meta.env.VITE_SUPABASE_URL || CONFIG.supabase.url;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || CONFIG.supabase.publishableKey;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

/* Row shapes (mirror supabase/migrations/20261013000000_phase2_dashboard.sql). */

export type EnrollmentStatus = "pending" | "verified" | "rejected";

export type Enrollment = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  payment_method: PaymentMethod;
  sender_number: string;
  trx_id: string;
  amount: number;
  status: EnrollmentStatus;
  admin_note: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  user_id: string | null;
};

export type EnrollmentInsert = Pick<
  Enrollment,
  "full_name" | "phone" | "email" | "payment_method" | "sender_number" | "trx_id" | "amount" | "user_id"
>;

/**
 * Supabase Auth is addressed by email, so a student who gives none signs in under an address
 * derived from the mobile number they always give. Nothing is ever sent to it.
 */
export const PHONE_LOGIN_DOMAIN = "phone.nextbuildbd.local";
export const authEmailForPhone = (phone: string) => `${phone}@${PHONE_LOGIN_DOMAIN}`;

export type CourseClass = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  duration_minutes: number;
  meet_url: string | null;
  recording_url: string | null;
  position: number;
  published: boolean;
};

export type CourseSettings = {
  whatsapp_group_link: string | null;
  meet_link: string | null;
};

/** Postgres unique_violation (e.g. a TrxID that was already submitted). */
export const UNIQUE_VIOLATION = "23505";
