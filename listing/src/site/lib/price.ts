// Append "onwards" only to a plain price like "₹6.31 Cr"; leave ranges and free text as typed.
export const withOnwards = (p: string) => (/^₹[\d.,]+\s*Cr$/.test(p) ? `${p} onwards` : p);
