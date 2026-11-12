// Desktop-only motion (>= 1051px, and only when the visitor has not asked for reduced motion).
// It runs on every route and re-arms on navigation:
//  1. scroll reveals       - sections ease in as they enter the viewport, staggered
//  2. depth parallax       - hero ad, laptop, phone and Montaj card drift at different rates
//  3. explore hover preview- a muted preview plays when you hover a video card
//  4. detail poster glow   - the video detail page glows with its poster colours
//  5. price count-ups      - package prices count up when they first appear
// Nothing here runs on phones or tablets, and every element is fully visible without JS.
import {useEffect} from 'react';

const REVEAL = [
  // home
  '.dk-hero-copy > *', '.dk-ad', '.dk-funnel-copy > *', '.dk-devices',
  '.dk-how > *', '.dk-fcard', '.dk-flink',
  '.dk-work-head > *', '.dk-work-card',
  '.dk-prod-top > *', '.dk-node', '.dk-tool', '.dk-prod-strip',
  // explore
  '.explore-heading > *', '.search-form', '.filter-row', '.explore-page .video-card',
  // video detail
  '.detail-player', '.detail-info > *', '.related .section-heading', '.dk-related',
  // services
  '.services-heading > *', '.service-card', '.dk-sflow > *',
  // quote + contact
  '.quote-intro > *', '.quote-form', '.contact-page > *', '.dk-contact-desk > *',
];
const DEPTH = [['.dk-ad', 0.04], ['.dk-laptop', 0.05], ['.dk-phone', 0.12], ['.dk-montaj-card', 0.05], ['.detail-player', 0.03]];
const MAX = 64;

export function useDesktopMotion(enabled = true, routeKey = '') {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const desk = matchMedia('(min-width:1051px)');
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    let io, raf = 0, parallax = [], on = false, cleanups = [];

    const start = () => {
      if (on || !desk.matches || calm.matches) return;
      on = true;
      document.documentElement.classList.add('dk-motion');
      io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('dk-in'); io.unobserve(e.target); } }), {threshold: 0.12, rootMargin: '0px 0px -6% 0px'});
      REVEAL.forEach(sel => document.querySelectorAll(sel).forEach((el, i) => { el.classList.add('dk-rv'); el.style.setProperty('--rv-d', Math.min(i, 6) * 90 + 'ms'); io.observe(el); }));
      parallax = DEPTH.map(([sel, d]) => [document.querySelector(sel), d]).filter(([el]) => el);
      parallax.forEach(([el]) => el.setAttribute('data-dk-depth', ''));
      window.addEventListener('scroll', onScroll, {passive: true});
      onScroll();
      cleanups = [hoverPreview(), posterGlow(), countUps()];
    };
    const stop = () => {
      if (!on) return;
      on = false;
      io && io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cleanups.forEach(fn => fn && fn()); cleanups = [];
      document.documentElement.classList.remove('dk-motion');
      document.querySelectorAll('.dk-rv').forEach(el => { el.classList.remove('dk-rv', 'dk-in'); el.style.removeProperty('--rv-d'); });
      parallax.forEach(([el]) => { el.removeAttribute('data-dk-depth'); el.style.removeProperty('--py'); });
    };
    const frame = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      parallax.forEach(([el, d]) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        const dy = (r.top + r.height / 2) - mid;
        el.style.setProperty('--py', Math.max(-MAX, Math.min(MAX, -dy * d)).toFixed(1) + 'px');
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const sync = () => (desk.matches && !calm.matches ? start() : stop());
    sync();
    desk.addEventListener('change', sync); calm.addEventListener('change', sync);
    return () => { desk.removeEventListener('change', sync); calm.removeEventListener('change', sync); if (raf) cancelAnimationFrame(raf); stop(); };
  }, [enabled, routeKey]);
}

// 3. Hover a video card (explore grid, related) and a muted preview clip plays over the poster.
function hoverPreview() {
  const SEL = '.explore-page .video-card, .related .video-card';
  const over = e => {
    const card = e.target.closest && e.target.closest(SEL); if (!card) return;
    const media = card.querySelector('.preview'); if (!media || media.querySelector('video')) return;
    const href = card.querySelector('.video-card-link')?.getAttribute('href') || '';
    const id = href.split('/').filter(Boolean).pop(); if (!id) return;
    const v = document.createElement('video');
    v.className = 'dk-hover-preview'; v.src = `/media/${id}.preview.mp4`; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.setAttribute('aria-hidden', 'true');
    media.appendChild(v); v.play().catch(() => {});
  };
  const out = e => {
    const card = e.target.closest && e.target.closest(SEL); if (!card) return;
    if (e.relatedTarget && card.contains(e.relatedTarget)) return;
    card.querySelectorAll('video.dk-hover-preview').forEach(v => v.remove());
  };
  document.addEventListener('mouseover', over); document.addEventListener('mouseout', out);
  return () => { document.removeEventListener('mouseover', over); document.removeEventListener('mouseout', out); document.querySelectorAll('video.dk-hover-preview').forEach(v => v.remove()); };
}

// 4. The detail player glows with its own poster colours.
function posterGlow() {
  const el = document.querySelector('.detail-player'); const poster = el?.querySelector('video')?.getAttribute('poster');
  if (!el || !poster) return null;
  el.style.setProperty('--poster', `url(${poster})`); el.classList.add('dk-glow');
  return () => { el.style.removeProperty('--poster'); el.classList.remove('dk-glow'); };
}

// 5. Package prices count up the first time they scroll into view.
function countUps() {
  const nodes = [...document.querySelectorAll('.service-package b')].map(b => {
    const t = [...b.childNodes].find(n => n.nodeType === 3 && /\$\d/.test(n.data)); if (!t) return null;
    return {t, orig: t.data, target: +t.data.replace(/[^\d]/g, ''), b};
  }).filter(Boolean);
  if (!nodes.length) return null;
  const timers = [];
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const n = nodes.find(x => x.b === e.target); if (!n) return;
    const t0 = performance.now(), dur = 1000;
    const tick = now => { const k = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - k, 3); n.t.data = '$' + Math.round(n.target * eased); if (k < 1) timers.push(requestAnimationFrame(tick)); };
    n.t.data = '$0'; timers.push(requestAnimationFrame(tick));
  }), {threshold: 0.6});
  nodes.forEach(n => io.observe(n.b));
  return () => { io.disconnect(); timers.forEach(cancelAnimationFrame); nodes.forEach(n => { n.t.data = n.orig; }); };
}
