const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Accepts Bangla digits, spaces, dashes and a +88 / 88 prefix; returns 01XXXXXXXXX form. */
export function normalizePhone(raw: string) {
  const ascii = raw.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
  const digits = ascii.replace(/[\s-]/g, "").replace(/^\+?88(?=01)/, "");
  return digits;
}

/** Bangladesh mobile: 01[3-9]XXXXXXXX (11 digits). */
export const BD_PHONE = /^01[3-9]\d{8}$/;
/** Rocket wallets are the 11-digit mobile number plus one check digit. */
export const ROCKET_ACCOUNT = /^01[3-9]\d{8}\d?$/;
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const TRX_ID = /^[A-Z0-9]{6,20}$/;
