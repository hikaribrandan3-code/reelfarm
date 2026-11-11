// POST /api/lead — validates a roofing-demo estimate request and delivers it to the contractor.
// Delivery providers (first configured wins):
//   Email via Resend : RESEND_API_KEY, LEAD_NOTIFY_EMAIL (recipient), LEAD_FROM_EMAIL (verified sender)
//   Webhook          : LEAD_WEBHOOK_URL (+ optional LEAD_WEBHOOK_SECRET sent as `x-lead-secret`)
// Optional: LEAD_ALLOWED_ORIGINS (comma-separated extra origins). With nothing configured it answers 503 `not_configured`;
// it never reports success unless a provider accepted the lead.
import {validateLead, formatPhone, CAMPAIGNS, SERVICE_OPTIONS} from '../src/demo/leadSchema.js';

import {CONTRACTOR_CAMPAIGN, validateContractorQuote} from '../src/contractorQuote.js';

const hits = new Map(); // best-effort per-instance limiter; the honeypot + timing checks are the primary spam controls
const WINDOW = 10 * 60_000, MAX_HITS = 5, MIN_FILL_MS = 1500;
const send = (res, status, body) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
async function readBody(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  let size = 0; const chunks = [];
  for await (const chunk of req) { size += chunk.length; if (size > 20_000) throw Object.assign(new Error('too_large'), {code: 'too_large'}); chunks.push(chunk); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}
function originAllowed(req) {
  const origin = req.headers.origin; if (!origin) return true;
  let host; try { host = new URL(origin).host; } catch { return false; }
  const extra = (process.env.LEAD_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean).map(o => { try { return new URL(o).host; } catch { return o; } });
  return host === req.headers.host || extra.includes(host);
}
export const deliveryConfigured = () => Boolean((process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL && process.env.LEAD_FROM_EMAIL) || process.env.LEAD_WEBHOOK_URL);
async function deliver(lead, meta) {
  const service = SERVICE_OPTIONS.find(([id]) => id === lead.service)?.[1] || lead.service;
  const quote = meta.campaign === CONTRACTOR_CAMPAIGN;
  const title = quote ? 'New ReelFarm quote request' : 'New roof estimate request';
  const subject = quote ? `${title} — ${lead.business}` : `${title} — ${service} (${lead.zip})`;
  const rows = [['Name', lead.name], ['Phone', quote ? lead.phone : formatPhone(lead.phone)], ['Email', lead.email],
    ...(quote ? [['Business', lead.business], ['Trade', lead.trade]] : [['ZIP', lead.zip], ['Service', service], ['Details', lead.message || '—']]),
    ['Campaign', meta.campaign], ['Received', meta.receivedAt]];
  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL && process.env.LEAD_FROM_EMAIL) {
    const r = await fetch('https://api.resend.com/emails', {method: 'POST', headers: {Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({from: process.env.LEAD_FROM_EMAIL, to: process.env.LEAD_NOTIFY_EMAIL.split(',').map(s => s.trim()), reply_to: lead.email, subject,
        html: `<h2>${title}</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>`, text: rows.map(([k, v]) => `${k}: ${v}`).join('\n')})});
    if (!r.ok) throw new Error(`resend ${r.status}`);
    return 'email';
  }
  const headers = {'Content-Type': 'application/json'}; if (process.env.LEAD_WEBHOOK_SECRET) headers['x-lead-secret'] = process.env.LEAD_WEBHOOK_SECRET;
  const r = await fetch(process.env.LEAD_WEBHOOK_URL, {method: 'POST', headers, body: JSON.stringify({...lead, ...meta})});
  if (!r.ok) throw new Error(`webhook ${r.status}`);
  return 'webhook';
}
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, {error: 'method_not_allowed'}); }
  if (!originAllowed(req)) return send(res, 403, {error: 'forbidden_origin'});
  let body; try { body = await readBody(req); } catch (e) { return send(res, e.code === 'too_large' ? 413 : 400, {error: e.code === 'too_large' ? 'too_large' : 'bad_json'}); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return send(res, 400, {error: 'bad_json'});
  if (body.website) return send(res, 200, {ok: true}); // honeypot: silently drop bots
  if (!(Date.now() - Number(body.startedAt) >= MIN_FILL_MS)) return send(res, 400, {error: 'too_fast'});
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim(); const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW); if (recent.length >= MAX_HITS) return send(res, 429, {error: 'rate_limited'});
  const quote = body.campaign === CONTRACTOR_CAMPAIGN;
  const campaign = quote || CAMPAIGNS.includes(body.campaign) ? body.campaign : 'roofing-demo';
  const result = quote ? validateContractorQuote(body) : validateLead(body);
  if (!result.ok) return send(res, 422, {error: 'invalid', errors: result.errors});
  if (!deliveryConfigured()) return send(res, 503, {error: 'not_configured'});
  recent.push(now); hits.set(ip, recent);
  try { const via = await deliver(result.value, {campaign, receivedAt: new Date().toISOString()}); return send(res, 200, {ok: true, via}); }
  catch (e) { console.error('lead delivery failed:', e.message); return send(res, 502, {error: 'delivery_failed'}); }
}
