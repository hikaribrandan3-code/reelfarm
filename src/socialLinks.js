// ReelFarm official public profiles. The footer icons and the Organization structured data
// (schema.org "sameAs") both read this list. An icon only appears when it has a real URL here,
// so a network that is not live yet (TikTok) or has no URL (Meta) stays hidden.
export const SOCIAL_LINKS = [
  {name: 'Instagram', asset: 'instagram', href: 'https://www.instagram.com/reelfarmstudio/'},
  {name: 'YouTube', asset: 'youtube', href: 'https://www.youtube.com/@Reelfarmstudio'},
];

// Brand colours for the footer icons. To add TikTok when it goes live, add
// {name: 'TikTok', asset: 'tiktok', href: '<profile url>'} to SOCIAL_LINKS above.
export const SOCIAL_ICONS = [
  {name: 'YouTube', asset: 'youtube', color: '#ff0033'},
  {name: 'Instagram', asset: 'instagram', color: 'ig'},
  {name: 'TikTok', asset: 'tiktok', color: '#111111'},
  {name: 'Meta', asset: 'meta', color: '#0866ff'},
];

// Accessible names. The link opens in a new tab, so the label says so.
export const socialLabels = {
  group: {en: 'ReelFarm on social media', es: 'ReelFarm en redes sociales', pt: 'ReelFarm nas redes sociais'},
  link: {
    en: name => `ReelFarm on ${name} (opens in a new tab)`,
    es: name => `ReelFarm en ${name} (se abre en una pestaña nueva)`,
    pt: name => `ReelFarm no ${name} (abre em uma nova aba)`,
  },
};
