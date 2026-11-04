export const LEAD_EMAIL = 'hikaristudioai@gmail.com';
export function validateBrief(values) {
  const errors = {};
  if (!values.name?.trim() || values.name.trim().length > 100) errors.name = 'required';
  if (!/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(values.email || '') || values.email.length > 254) errors.email = 'invalidEmail';
  return errors;
}
export function buildBrief(values, references, source, timestamp = new Date().toISOString()) {
  const safe = value => String(value || '').replace(/[\r\n]+/g, ' ').trim();
  return [
    'REELFARM — PROJECT BRIEF', '',
    `Prepared: ${timestamp}`, `Name: ${safe(values.name)}`, `Email: ${safe(values.email)}`,
    `Business: ${safe(values.business) || '—'}`, `Website / social: ${safe(values.website) || '—'}`,
    `Industry: ${safe(values.industry) || '—'}`, `Content: ${(values.formats || []).map(safe).join(', ') || '—'}`,
    `Package: ${safe(values.package) || 'Not sure yet'}`, `Frequency: ${safe(values.frequency) || 'Not sure yet'}`,
    `Languages: ${(values.languages || []).map(safe).join(', ') || '—'}`, '', 'PROJECT DETAILS',
    (values.project || '—').slice(0, 4000), '', 'VIDEO REFERENCES',
    ...references.map(v => `${v.title.en} [${v.id}] — ${new URL(`/explore/${v.slug}`, source).href}`),
    '', `Source: ${source}`,
  ].join('\n');
}
export function emailLink(subject, body) {
  return `mailto:${LEAD_EMAIL}?subject=${encodeURIComponent(subject.replace(/[\r\n]/g, ' '))}&body=${encodeURIComponent(body)}`;
}
