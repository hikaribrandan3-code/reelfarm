// Roofing VSL campaign config. Everything contractor-specific lives here so a new client or industry is a new config file.
// Brand details are DEMO placeholders (they match the fictional closing card inside the film), not a real business.
export const roofing = {
  id: 'roofing-demo',
  path: '/demo/roofing',
  videoId: 'roof-storm-uplift',
  seo: {
    title: 'Roof Storm Damage Repair — Free Estimate | Summit Peak Roofing (Demo)',
    description: 'Learn what causes roof storm damage, the warning signs to look for, and whether you need repairs or a replacement. Demo landing page produced by ReelFarm.',
  },
  brand: {name: 'Summit Peak Roofing', monogram: 'SP', tagline: 'Storm damage inspections', phoneDisplay: '(555) 010-0142', phoneHref: 'tel:+15550100142', demo: true},
  hero: {lead: 'Roof Storm Damage?', accent: 'Get It Repaired Fast.', copy: 'Learn what causes roof damage, how to recognize warning signs, and whether your roof may need repairs or replacement.', cta: 'Get My Free Estimate'},
  videoCaption: 'Watch the 78-second explainer · captions on screen',
  services: [
    {icon: 'storm', title: 'Storm Damage Assessment', text: 'A careful look at shingles, flashing and decking after wind or hail.'},
    {icon: 'repair', title: 'Roof Repair', text: 'Fix leaks, missing shingles and lifted edges before they spread.'},
    {icon: 'replace', title: 'Roof Replacement', text: 'A full new roof system when repairs are no longer enough.'},
  ],
  steps: [
    {title: 'Tell us about your roof', text: 'Share what you’re seeing and where the property is.'},
    {title: 'A roofing specialist contacts you', text: 'Expect a call or email to talk through the situation.'},
    {title: 'Discuss inspection and estimate options', text: 'Decide together on the right next step, with no obligation.'},
  ],
  assurances: ['Free estimate', 'No obligation', 'Your details stay private'],
  demoNotice: 'Demo experience. Summit Peak Roofing is a fictional brand: no real business, license or reviews are represented, and requests are for demonstration.',
};
