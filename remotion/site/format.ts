const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Replaces ASCII digits with Bangla digits. */
export const toBn = (s: string | number) =>
  String(s).replace(/[0-9]/g, (d) => BN[Number(d)]);

/** 45200 -> "৪৫,২০০" (values stay below 1 lakh in the mockups). */
export const bnNumber = (n: number) =>
  toBn(Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

export const taka = (n: number) => `৳${bnNumber(n)}`;
