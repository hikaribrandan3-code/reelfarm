// Shared by the landing-page form (client) and /api/lead (server). Pure functions, no dependencies.
export const SERVICE_OPTIONS = [
  ['storm-damage', 'Storm damage'],
  ['leak-repair', 'Roof leak / repair'],
  ['replacement', 'Full roof replacement'],
  ['inspection', 'Roof inspection'],
  ['not-sure', 'Not sure yet'],
];
export const CAMPAIGNS = ['roofing-demo'];
const clean = v => String(v ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();
export const normalizePhone = v => { const d = String(v ?? '').replace(/\D/g, ''); return d.length === 11 && d[0] === '1' ? d.slice(1) : d; };
export function validateLead(input) {
  const errors = {};
  const name = clean(input.name), email = clean(input.email), zip = clean(input.zip), message = String(input.message ?? '').replace(/\r/g, '').trim();
  const phone = normalizePhone(input.phone);
  if (name.length < 2) errors.name = 'Please enter your full name.';
  else if (name.length > 100) errors.name = 'Name is too long (100 characters max).';
  if (!phone) errors.phone = 'Please enter a phone number.';
  else if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(phone)) errors.phone = 'Enter a valid 10-digit US phone number.';
  if (!email) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) errors.email = 'Enter a valid email, like name@example.com.';
  if (!zip) errors.zip = 'Please enter your ZIP code.';
  else if (!/^\d{5}$/.test(zip)) errors.zip = 'Enter a 5-digit US ZIP code.';
  if (!SERVICE_OPTIONS.some(([id]) => id === input.service)) errors.service = 'Choose the service you need.';
  if (message.length > 1000) errors.message = 'Please keep this under 1,000 characters.';
  return {ok: !Object.keys(errors).length, errors, value: {name, phone, email, zip, service: input.service, message}};
}
export const formatPhone = p => p.length === 10 ? `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}` : p;
