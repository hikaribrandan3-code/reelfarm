export const CONTRACTOR_CAMPAIGN = 'contractor-quote';
export const QUOTE_TRADES = ['Roofing', 'HVAC', 'Concrete', 'Fencing', 'Pools', 'Solar', 'Masonry', 'Flooring', 'Irrigation', 'Other'];
const clean = value => typeof value === 'string' ? value.replace(/[\x00-\x1f\x7f]/g, ' ').trim() : '';

export function validateContractorQuote(input) {
  const {name, business, phone, email, trade} = Object.fromEntries(
    ['name', 'business', 'phone', 'email', 'trade'].map(key => [key, clean(input[key])]),
  );
  const digits = phone.replace(/\D/g, '');
  const errors = {};
  if (name.length < 2 || name.length > 100) errors.name = true;
  if (business.length < 2 || business.length > 140) errors.business = true;
  if (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15 || phone.length > 30) errors.phone = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) errors.email = true;
  if (!QUOTE_TRADES.includes(trade)) errors.trade = true;
  return {ok: !Object.keys(errors).length, errors, value: {name, business, phone, email, trade}};
}
