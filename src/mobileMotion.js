// Phone/tablet-only motion (<= 1050px, and only without reduced-motion): light scroll reveals.
// Desktop (>= 1051px) never runs this; its own motion lives in desktop/motion.js.
import {useEffect} from 'react';

const REVEAL = [
  '.contractor-hero-heading > *', '.roofing-ad:not(.roofing-ad-compact)',
  '.section-two-copy > *', '.section-two-image', '.section-two-bottom',
  '.trade-portfolio .contractor-heading > *', '.trade-slide',
  '.contractor-quote', '.production-inner > header > *', '.production-ecosystem', '.production-workflow', '.production-montaj',
  '.faq', '.contractor-more .contractor-heading > *',
];

export function useMobileMotion(routeKey = '') {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mobile = matchMedia('(max-width:1050px)');
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    let io, on = false, live = null;
    const start = () => {
      if (on || !mobile.matches || calm.matches) return;
      on = true;
      document.documentElement.classList.add('mb-motion');
      io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('mb-in'); io.unobserve(e.target); } }), {threshold: 0.1, rootMargin: '0px 0px -4% 0px'});
      REVEAL.forEach(sel => document.querySelectorAll(sel).forEach((el, i) => { el.classList.add('mb-rv'); el.style.setProperty('--rv-d', Math.min(i, 4) * 70 + 'ms'); io.observe(el); }));
      live = explorePlay();
    };
    const stop = () => {
      if (!on) return;
      on = false; io && io.disconnect(); live && live(); live = null;
      document.documentElement.classList.remove('mb-motion');
      document.querySelectorAll('.mb-rv').forEach(el => { el.classList.remove('mb-rv', 'mb-in'); el.style.removeProperty('--rv-d'); });
    };
    const sync = () => (mobile.matches && !calm.matches ? start() : stop());
    sync();
    mobile.addEventListener('change', sync); calm.addEventListener('change', sync);
    return () => { mobile.removeEventListener('change', sync); calm.removeEventListener('change', sync); stop(); };
  }, [routeKey]);
}

// Explore on phones: only the card nearest the middle of the screen plays its muted preview.
function explorePlay() {
  const cards = [...document.querySelectorAll('.explore-page .video-card')];
  if (!cards.length || navigator.connection?.saveData) return null;
  let raf = 0, current = null;
  const clear = () => { document.querySelectorAll('video.mb-live').forEach(v => v.remove()); current = null; };
  const pick = () => {
    raf = 0;
    const mid = window.innerHeight * 0.45; let best = null, bd = 1e9;
    cards.forEach(c => { const r = c.getBoundingClientRect(); if (r.bottom < 90 || r.top > window.innerHeight - 90) return; const d = Math.abs((r.top + r.bottom) / 2 - mid); if (d < bd) { bd = d; best = c; } });
    if (best === current) return;
    clear(); current = best; if (!best) return;
    const media = best.querySelector('.preview');
    const id = (best.querySelector('.video-card-link')?.getAttribute('href') || '').split('/').filter(Boolean).pop();
    if (!media || !id || media.querySelector('video')) return;
    const v = document.createElement('video');
    v.className = 'mb-live'; v.src = `/media/${id}.preview.mp4`; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.setAttribute('aria-hidden', 'true');
    media.appendChild(v); v.play().catch(() => {});
  };
  const on = () => { if (!raf) raf = requestAnimationFrame(pick); };
  window.addEventListener('scroll', on, {passive: true}); window.addEventListener('resize', on); on();
  return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); clear(); };
}
