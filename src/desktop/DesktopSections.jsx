// Desktop-only page sections (>= 1051px). They render in the HTML on every
// viewport but are hidden below the desktop breakpoint by desktop.css, so the
// mobile and tablet experience is untouched.
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Icon} from '../Icons.jsx';
import {videos, categoryMatches} from '../content.js';
import {localPath} from '../i18n.js';
import {validateBrief, emailLink} from '../lead.js';

const roof = videos.find(v => v.id === 'roof-build');

const I = ({children, size = 22, sw = 1.8}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
const HardHat = () => <I size={26}><path d="M4 18h16M5 18v-2a7 7 0 0 1 14 0v2M12 6v4M9 8.5v2M15 8.5v2"/><path d="M3 18h18v2H3z"/></I>;
const Bolt = () => <I size={26}><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></I>;
export const Swash = ({w = 480}) => <svg className="dk-swash" viewBox={`0 0 ${w} 14`} preserveAspectRatio="none" aria-hidden="true"><path d={`M3 9 C ${w*.25} 3, ${w*.65} 2, ${w-3} 8`} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/></svg>;

/* ---------------------------------------------------------------- hero */
export function DesktopHero() {
  const vref = useRef(null), box = useRef(null);
  const [playing, setPlaying] = useState(false), [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0), [dur, setDur] = useState(0);
  const [liked, setLiked] = useState(false), [note, setNote] = useState(false), [shared, setShared] = useState(false);
  const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const toggle = () => { const v = vref.current; if (!v) return; if (v.paused) v.play().catch(() => {}); else v.pause(); };
  const seek = e => { const v = vref.current; if (!v || !dur) return; const r = e.currentTarget.getBoundingClientRect(); v.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * dur; };
  const full = () => { const el = box.current; if (!el) return; if (document.fullscreenElement) document.exitFullscreen?.(); else el.requestFullscreen?.(); };
  async function share() {
    const url = location.origin + '/demo/roofing';
    try { if (navigator.share) await navigator.share({title: 'ReelFarm', url}); else { await navigator.clipboard.writeText(url); setShared(true); } } catch {}
  }
  return <section className="dk-hero desk-only dk-wrap" aria-labelledby="dk-hero-title">
    <div className="dk-hero-copy">
      <span className="dk-pill">VIDEO CONTENT FOR CONTRACTORS</span>
      <h1 id="dk-hero-title"><span>Stop the Scroll.</span><span className="dk-green">Get More Jobs.<Swash/></span></h1>
      <p className="dk-lead">Your work deserves to be seen. We create attention-grabbing videos, educational explainers, and commercials that help contractors stand out and turn viewers into leads.</p>
      <div className="dk-cta-row">
        <a className="dk-btn dk-btn-primary" href="#contractor-quote">Get a Free Quote<Icon name="arrow" size={20}/></a>
        <a className="dk-btn dk-btn-outline" href="#trade-title"><Icon name="play" size={18}/>Explore Our Videos</a>
      </div>
      <ul className="dk-benefits">
        <li><span className="dk-tile"><HardHat/></span><span>Made for<br/>contractors</span></li>
        <li><span className="dk-tile"><Icon name="video" size={26}/></span><span>Custom<br/>video production</span></li>
        <li><span className="dk-tile"><Bolt/></span><span>Ready for<br/>social media</span></li>
      </ul>
    </div>
    <article className="dk-ad" aria-label="Sponsored ad example: ReelFarm">
      <header className="dk-ad-bar"><span className="dk-ad-meta"><span className="dk-mask dk-meta" style={{maskImage: 'url(/brand/meta.svg)', WebkitMaskImage: 'url(/brand/meta.svg)'}}/>Meta</span><span className="dk-dots" aria-hidden="true">•••</span></header>
      <div className="dk-ad-profile">
        <img src="/brand/favicon.svg?v=play" width="44" height="44" alt=""/>
        <div><strong>ReelFarm</strong><small>Sponsored · <I size={13} sw={1.6}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></I></small></div>
      </div>
      <p className="dk-ad-caption">Professional video content for contractors. Show your work, build trust, and get more leads.</p>
      <div className="dk-ad-video" ref={box}>
        <video ref={vref} poster={roof.poster} muted={muted} loop playsInline preload="none" aria-label={roof.title.en}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={e => setDur(e.currentTarget.duration)} onDurationChange={e => setDur(e.currentTarget.duration)} onClick={toggle}>
          <source src={roof.video} type="video/mp4"/><source src="/media/roof-build.preview.mp4" type="video/mp4"/>
        </video>
        {!playing && <button type="button" className="dk-bigplay" onClick={toggle} aria-label="Play video"><Icon name="play" size={34}/></button>}
        <div className="dk-controls">
          <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}><Icon name={playing ? 'pause' : 'play'} size={18}/></button>
          <span className="dk-time">{fmt(time)} / {fmt(dur)}</span>
          <div className="dk-progress" onClick={seek} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={dur ? Math.round(time / dur * 100) : 0}><i style={{width: (dur ? time / dur * 100 : 0) + '%'}}/></div>
          <button type="button" onClick={() => setMuted(m => !m)} aria-label={muted ? 'Unmute' : 'Mute'} aria-pressed={!muted}><Icon name="volume" size={18}/></button>
          <button type="button" onClick={full} aria-label="Fullscreen"><I size={18}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></I></button>
        </div>
      </div>
      <div className="dk-ad-actions">
        <button type="button" aria-pressed={liked} onClick={() => setLiked(v => !v)}><Icon name="like" size={20}/>Like</button>
        <button type="button" aria-expanded={note} onClick={() => setNote(v => !v)}><Icon name="chat" size={20}/>Comment</button>
        <button type="button" onClick={share}><Icon name="share" size={20}/>{shared ? 'Link copied' : 'Share'}</button>
      </div>
      {note && <p className="dk-ad-note">This is an example ad. Ask us for yours in the quote form below.</p>}
    </article>
  </section>;
}


/* ------------------------------------------------- laptop + phone (mirrors /demo/roofing) */
export function DeviceLoop({className = ''}) {
  // The laptop and phone step through the same three states on one clock: request, estimate, schedule.
  const [st, setSt] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el || typeof IntersectionObserver === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => { clearInterval(timer); if (e.isIntersecting) timer = setInterval(() => setSt(x => (x + 1) % 3), 3200); }, {threshold: 0.35});
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, []);
  const ok = st > 0 ? ' ok' : '';
  const remember = () => { try { sessionStorage.setItem('reelfarm-demo-return', JSON.stringify({home: location.pathname, y: window.scrollY})); } catch {} };
  return <a ref={ref} className={'dk-devices dm-dark ' + className} href="/demo/roofing" data-full-navigation="" onClick={remember} aria-label="Open the live Summit Peak Roofing demo page">
    <div className="dk-laptop">
      <div className="dk-screen">
        <div className="dm-nav">
          <span className="dm-brand"><span className="dm-mark">SP</span><span>Summit Peak Roofing<small>DEMO · ROOFING</small></span></span>
          <span>Services</span><span>How it works</span><span>Free estimate</span>
          <span className="dm-call">Call Now</span>
        </div>
        <div className="dm-hero" style={{'--shot': 'url(/demo/storm-1024.webp)'}}>
          <div>
            <h3 className="dm-h">Roof Storm Damage?<br/><em>Get It Repaired Fast.</em></h3>
            <p className="dm-p">Learn what causes roof damage, how to recognize warning signs, and whether your roof may need repairs or replacement.</p>
            <span className={'dm-cta' + ok}>{CTAS[st]}</span>
          </div>
          <div className="dm-video" style={{'--shot': 'url(/demo/storm-1024.webp)'}}>
            <span className="dm-play"><Icon name="play" size={28}/></span>
            <span className="dm-cap">Why roofs get ripped off in storms · 1:18</span>
          </div>
        </div>
        <div className="dm-steps">{['Request a free estimate', 'Get a written estimate', 'Schedule your repair'].map((l, i) => <span key={l} className={i === st ? 'on' : i < st ? 'done' : ''}><b>{i < st ? '✓' : i + 1}</b>{l}</span>)}</div>
      </div>
      <div className="dk-laptop-base"/>
    </div>
    <div className="dk-phone">
      <div className="dk-phone-screen">
        <div className="dm-m-top"><span className="dm-brand"><span className="dm-mark">SP</span><span>Summit Peak</span></span><I size={22} sw={2.2}><path d="M4 7h16M4 12h16M4 17h16"/></I></div>
        <div className="dm-m-video" style={{'--shot': 'url(/demo/storm-1024.webp)'}}><span className="dm-play"><Icon name="play" size={22}/></span></div>
        <div className="dm-m-body">
          <h4>Roof Storm Damage? <em>Get It Repaired Fast.</em></h4>
          <p>Learn the warning signs and whether your roof needs repair.</p>
          <ul className="dm-m-list"><li><I size={22} sw={2}><path d="M3 11 12 4l9 7v9H3z"/></I>Roof repair</li><li><I size={22} sw={2}><path d="M4 20h16M6 20V9l6-5 6 5v11"/></I>Roof replacement</li><li><I size={22} sw={2}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></I>Free inspection</li></ul>
          <span className={'dm-m-cta' + ok}>{CTAS[st]}</span>
        </div>
      </div>
    </div>
  </a>;
}

/* -------------------------------------------------------------- funnel */
const Mountain = ({size = 30}) => <svg width={size} height={size * .72} viewBox="0 0 40 29" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 27 15 5l6 10 4-6 13 18"/><path d="M13 27l8-12"/></svg>;
const Shield = () => <I size={20} sw={1.7}><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.500 7-10V6z"/><path d="m9 12 2 2 4-4"/></I>;
const Star = () => <I size={20} sw={1.7}><path d="m12 3 2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z"/></I>;
const Menu = () => <I size={18} sw={2.2}><path d="M4 7h16M4 12h16M4 17h16"/></I>;
const SiteFeatures = () => <ul className="dk-site-feats"><li><Shield/><span>Licensed<br/>&amp; Insured</span></li><li><Bolt/><span>Fast<br/>Response</span></li><li><Star/><span>5-Star<br/>Rated</span></li></ul>;
const FunnelCard = ({tone, n, icon, title, text, children}) => <li className={'dk-fcard dk-tone-' + tone} style={{'--i': n}}><span className="dk-ficon">{icon}</span><div><h3>{n + 1}. {title}</h3><p>{text}</p></div><div className="dk-fart">{children}</div></li>;
const Squig = () => <li className="dk-flink" aria-hidden="true"><svg viewBox="0 0 70 30"><path className="dk-flow-line" d="M2 15 C14 15 16 6 28 6 S44 24 56 15 H68" fill="none" stroke="#1c9a2d" strokeWidth="3" strokeLinecap="round"/></svg></li>;
const CTAS = ['Get My Free Estimate →', 'Estimate on its way ✓', 'Repair scheduled ✓'];
export function DesktopFunnel() {
  return <section className="dk-funnel desk-only dk-wrap" aria-labelledby="dk-funnel-title">
    <div className="dk-funnel-grid">
      <div className="dk-funnel-copy">
        <span className="dk-pill">VIDEO MARKETING FOR CONTRACTORS</span>
        <h2 id="dk-funnel-title"><span>Get More</span><span className="dk-green">Roofing Leads.<Swash w={460}/></span></h2>
        <p className="dk-sub">A complete VSL funnel that turns roof problems into qualified leads and booked jobs.</p>
        <ul className="dk-checks">
          <li><Icon name="check" size={18}/><span>Professional video ad <b>(VSL)</b></span></li>
          <li><Icon name="check" size={18}/><span>High-converting <b>landing page</b></span></li>
          <li><Icon name="check" size={18}/><span>Lead capture <b>and follow-up setup</b></span></li>
        </ul>
      </div>
      <DeviceLoop/>
    </div>
    <div className="dk-how" aria-labelledby="dk-how-title">
      <span className="dk-pill">HOW IT WORKS</span>
      <h2 id="dk-how-title"><span>From Video to <span className="dk-green">Booked Jobs</span></span></h2>
      <p className="dk-sub dk-how-sub">A simple, automated process that turns attention into leads and real jobs.</p>
      <span className="dk-funnel-tag">Automated Funnel (n8n Style)<svg width="34" height="20" viewBox="0 0 34 20" fill="none" stroke="#e11d74" strokeWidth="2.2" aria-hidden="true"><circle cx="5" cy="10" r="3.5"/><circle cx="29" cy="4" r="3.5"/><circle cx="29" cy="16" r="3.5"/><path d="M8.5 10H15l5-6h5.5M15 10l5 6h5.5"/></svg></span>
      <ol className="dk-fsteps">
        <FunnelCard tone="purple" n={0} icon={<Icon name="video" size={30}/>} title="Video Ad (VSL)" text="Grab attention and show the solution."><span className="dk-fthumb" style={{'--shot': 'url(/demo/storm-640.webp)'}}><span><Icon name="play" size={18}/></span></span></FunnelCard>
        <Squig/>
        <FunnelCard tone="blue" n={1} icon={<I size={30}><rect x="3" y="5" width="18" height="14" rx="2.500"/><path d="M3 9h18"/></I>} title="Landing Page" text="Build trust and turn interest into inquiries."><span className="dk-fpage"><i/><i/><i/><b/></span></FunnelCard>
        <Squig/>
        <FunnelCard tone="green" n={2} icon={<Icon name="mail" size={30}/>} title="Lead Form" text="Capture qualified leads automatically."><span className="dk-fform"><i/><i/><b/></span></FunnelCard>
        <Squig/>
        <FunnelCard tone="green" n={3} icon={<I size={30}><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4m-7 9 2 2 4-4"/></I>} title="Booked Jobs" text="Turn leads into scheduled work."><span className="dk-fcal"><I size={44} sw={1.5}><rect x="3" y="5" width="18" height="16" rx="2.500"/><path d="M3 10h18M8 3v4M16 3v4m-7 9 2 2 4-4"/></I></span></FunnelCard>
      </ol>
      <div className="dk-floop" aria-hidden="true">
        <svg viewBox="0 0 1000 70" preserveAspectRatio="none"><path id="dk-loop" d="M875 0 V46 Q875 60 859 60 H141 Q125 60 125 46 V6" fill="none" stroke="#1c9a2d" strokeWidth="2.500" strokeDasharray="9 8" vectorEffect="non-scaling-stroke"/><path d="M117 14 125 0l8 14z" fill="#1c9a2d"/><circle className="dk-dot" r="5.500" fill="#1c9a2d"><animateMotion dur="7s" repeatCount="indefinite" path="M875 0 V46 Q875 60 859 60 H141 Q125 60 125 46 V6" rotate="0"/></circle></svg>
        <span className="dk-floop-pill"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-15.500 6.200L3 16M3 12A9 9 0 0 1 18.500 5.800L21 8M21 3v5h-5M3 21v-5h5"/></svg>Continues to Bring New Leads</span>
      </div>
      <a className="dk-btn dk-btn-outline dk-how-cta" href="#trade-title"><Icon name="play" size={18}/>View Video Examples</a>
    </div>
  </section>;
}


/* ------------------------------------------------------- see what we create */
const WORK_TABS = [['all', 'All Work', 'grid'], ['promotions', 'Promotional', 'video'], ['educational', 'Educational', 'layers'], ['editing', 'Animation', 'spark'], ['visuals', '3D / Visuals', 'cube']];
const fmtDur = s => { s = Math.round(s || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
export function DesktopWork() {
  const [tab, setTab] = useState('all');
  const [index, setIndex] = useState(0);
  const [noAnim, setNoAnim] = useState(false);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const trackRef = useRef(null);
  const list = videos.filter(v => categoryMatches(v, tab));
  const cycle = list.length;
  // Render one extra set of three so the belt can slide past the end without a gap.
  const items = Array.from({length: cycle ? cycle + 3 : 0}, (_, k) => list[k % cycle]);
  const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Card width + gap, measured so the slide lands exactly on a card at any width.
  useLayoutEffect(() => {
    const measure = () => { const li = trackRef.current?.children[0]; if (li) setStep(li.offsetWidth + 26); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Auto-slide to the left every few seconds; hovering or focusing pauses it.
  useEffect(() => {
    if (paused || cycle < 2 || reduced()) return;
    const t = setInterval(() => setIndex(i => i + 1), 4200);
    return () => clearInterval(t);
  }, [paused, cycle, tab]);

  // Reset when the filter changes.
  useEffect(() => { setIndex(0); }, [tab]);

  // When the belt reaches the duplicate set, jump back to the start without animating.
  useEffect(() => {
    if (!noAnim) return;
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setNoAnim(false)));
    return () => cancelAnimationFrame(r);
  }, [noAnim]);
  const onSlideEnd = () => { if (cycle && index >= cycle) { setNoAnim(true); setIndex(i => i - cycle); } };

  const go = d => setIndex(i => Math.max(0, i + d));
  return <section className="dk-work desk-only dk-wrap" aria-labelledby="dk-work-title">
    <div className="dk-work-head">
      <span className="dk-pill"><Icon name="play" size={14}/>OUR WORK</span>
      <h2 id="dk-work-title">See What We <span className="dk-green">Create.<Swash w={300}/></span></h2>
      <p>A look at real projects, from educational explainers and commercials to animation and creative storytelling.</p>
      <div className="dk-work-tabs" role="group" aria-label="Filter work">
        {WORK_TABS.map(([k, label, ic]) => <button key={k} type="button" aria-pressed={tab === k} onClick={() => setTab(k)}><Icon name={ic} size={18}/>{label}</button>)}
      </div>
    </div>
    <div className="dk-work-rail" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <button type="button" className="dk-work-arrow dk-work-prev" aria-label="Previous project" onClick={() => go(-1)}><Icon name="arrow" size={20}/></button>
      <div className="dk-work-window">
        <ul ref={trackRef} className="dk-work-cards" onTransitionEnd={onSlideEnd}
          style={{transform: `translate3d(${-index * step}px,0,0)`, transition: noAnim ? 'none' : 'transform .9s cubic-bezier(.65,0,.35,1)'}}>
          {items.map((v, k) => <li key={v.id + '-' + k}><a className="dk-work-card" href={localPath('/explore/' + v.id, 'en')}>
            <span className="dk-work-media"><img src={v.poster} alt="" loading="lazy" width="16" height="9"/><span className="dk-work-cat">{({educational: 'Educational', visuals: '3D / Visuals', editing: 'POV / Editing', comedy: 'Comedy'})[v.category] || 'Video'}</span><span className="dk-work-play"><Icon name="play" size={16}/></span><span className="dk-work-dur">{fmtDur(v.duration)}</span></span>
            <span className="dk-work-title"><strong>{v.title.en}</strong><Icon name="arrow" size={18}/></span>
          </a></li>)}
        </ul>
      </div>
      <button type="button" className="dk-work-arrow dk-work-next" aria-label="Next project" onClick={() => go(1)}><Icon name="arrow" size={20}/></button>
    </div>
    <div className="dk-work-foot"><a className="dk-btn dk-btn-outline" href={localPath('/explore', 'en')}><Icon name="play" size={18}/>Explore More Projects<Icon name="arrow" size={18}/></a></div>
  </section>;
}

/* ---------------------------------------------------------- production */
// Node layout in a 1000 x 600 unit box (scaled to the container). Every node, chip and
// connector is positioned from these numbers, so the diagram keeps its proportions.
const U = {w: 1000, h: 470};
const MAIN_Y = 128, MAIN_H = 154, MID_Y = MAIN_Y + MAIN_H / 2;
const STAGES = [
  {id: 'idea', x: 0, w: 140, title: 'Idea', sub: 'Your goals & video needs', icon: 'bulb'},
  {id: 'research', x: 166, w: 140, title: 'Research', sub: 'Insights, topics & direction', icon: 'search'},
  {id: 'script', x: 332, w: 140, title: 'Script', sub: 'Story, hook & structure', icon: 'doc'},
  {id: 'production', x: 498, w: 140, title: 'Production', sub: 'Video, animation & visuals', icon: 'camera'},
  {id: 'delivery', x: 860, w: 140, title: 'Delivery', sub: 'Finished, ready-to-use videos for your business', icon: 'screen'},
];
const MONTAJ = {x: 664, y: 108, w: 170, h: 184};
const AI_TOOLS = [
  {name: 'Claude', src: '/brand/claude.svg', mask: true, color: '#d97757', x: 210},
  {name: 'Perplexity', src: '/brand/perplexity.svg', mask: true, color: '#20808d', x: 400},
  {name: 'Google Drive', src: '/brand/google-drive-color.svg', x: 590},
];
const PLATFORMS = [
  {name: 'YouTube', src: '/brand/youtube.svg', color: '#ff0033', x: 170},
  {name: 'Instagram', src: '/brand/instagram.svg', color: 'ig', x: 340},
  {name: 'TikTok', src: '/brand/tiktok.svg', color: '#111111', x: 510},
  {name: 'Meta', src: '/brand/meta.svg', color: '#0866ff', x: 680},
];
const TOOL_W = 170, TOOL_H = 42, PLAT_Y = 396, TOP_Y = 8;
const pct = (v, total) => (v / total * 100) + '%';
const cx = x => x;

// SVG icons for the stage nodes (inline so they stay crisp and stroke-matched).
const StageIcon = ({name}) => {
  const p = {fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round'};
  const shape = {
    bulb: <><path {...p} d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></>,
    search: <><circle {...p} cx="11" cy="11" r="6.5"/><path {...p} d="m16 16 4.5 4.5"/></>,
    doc: <><path {...p} d="M7 3h7l5 5v13H7z"/><path {...p} d="M14 3v5h5M10 13h6M10 17h6"/></>,
    camera: <><rect {...p} x="3" y="6.5" width="13" height="11" rx="2"/><path {...p} d="m16 10.5 5-3v9l-5-3"/></>,
    screen: <><rect {...p} x="3" y="4" width="18" height="13" rx="2"/><path {...p} d="m10.5 8.5 4 2.5-4 2.5z"/><path {...p} d="M9 20h6"/></>,
  };
  return <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">{shape[name]}</svg>;
};

const Brand = ({t}) => t.mask
  ? <span className="dk-mask" style={{'--brand': t.color, width: '1.8em', height: '1.8em', maskImage: `url(${t.src})`, WebkitMaskImage: `url(${t.src})`}}/>
  : <img src={t.src} alt="" width="26" height="26" loading="lazy"/>;

const PlatformIcon = ({t}) => <span className={'dk-mask' + (t.color === 'ig' ? ' dk-ig' : '')} style={{'--brand': t.color === 'ig' ? undefined : t.color, width: '1.9em', height: '1.9em', maskImage: `url(${t.src})`, WebkitMaskImage: `url(${t.src})`}}/>;

export function DesktopProduction() {
  // Connector paths in unit space. Each one also gets a travelling dot.
  const mainPaths = STAGES.slice(0, -1).map((s, i) => ({id: 'pm' + i, d: `M${s.x + s.w} ${MID_Y} H${STAGES[i + 1].x}`}));
  mainPaths.push({id: 'pm-montaj-in', d: `M${STAGES[3].x + STAGES[3].w} ${MID_Y} H${MONTAJ.x}`});
  mainPaths.push({id: 'pm-montaj-out', d: `M${MONTAJ.x + MONTAJ.w} ${MID_Y} H${STAGES[4].x}`});
  const aiPaths = AI_TOOLS.map((t, i) => {
    const sx = t.x + TOOL_W / 2, sy = TOP_Y + TOOL_H, ex = MONTAJ.x + MONTAJ.w / 2, ey = MONTAJ.y;
    return {id: 'pa' + i, d: `M${sx} ${sy} C${sx} ${sy + 28}, ${ex} ${ey - 28}, ${ex} ${ey}`};
  });
  const platPaths = PLATFORMS.map((t, i) => {
    const sx = MONTAJ.x + MONTAJ.w / 2, sy = MONTAJ.y + MONTAJ.h, ex = t.x + TOOL_W / 2, ey = PLAT_Y;
    return {id: 'pp' + i, d: `M${sx} ${sy} C${sx} ${sy + 34}, ${ex} ${ey - 34}, ${ex} ${ey}`};
  });
  const all = [...mainPaths, ...aiPaths, ...platPaths];

  return <section id="production-tools-desktop" className="dk-prod desk-only" aria-labelledby="dk-prod-title">
    <div className="dk-prod-top dk-wrap">
      <div className="dk-prod-copy">
        <span className="dk-pill"><Icon name="layers" size={16}/>OUR PRODUCTION WORKFLOW</span>
        <h2 id="dk-prod-title"><span>Premium Videos.</span><span className="dk-green">Smarter Production.<Swash w={380}/></span></h2>
        <p className="dk-sub">Research, storytelling, animation, and professional editing, all connected through ReelFarm’s production workflow.</p>
      </div>
      <aside className="dk-montaj-card" aria-labelledby="dk-montaj-title">
        <img src="/brand/montaj-mark.png" alt="" width="54" height="54" loading="lazy"/>
        <div>
          <h3 id="dk-montaj-title">Edited with Montaj</h3>
          <p>Montaj is an advanced AI-powered video editor. Combined with our production workflow, it helps us deliver professionally edited videos with production value that would traditionally cost significantly more.</p>
        </div>
      </aside>
    </div>

    <div className="dk-wrap dk-flow-wrap">
      <div className="dk-diagram" role="img" aria-label="ReelFarm production workflow. Claude, Perplexity and Google Drive feed Montaj editing and colour grading. The stages run Idea, Research, Script, Production, Montaj, Delivery, and the finished videos publish to YouTube, Instagram, TikTok and Meta.">
        <svg className="dk-flow-svg" viewBox={`0 0 ${U.w} ${U.h}`} preserveAspectRatio="none" aria-hidden="true">
          {all.map(p => <path key={p.id} id={p.id} d={p.d} className="dk-flow-path"/>)}
          {all.map((p, i) => <circle key={'dot' + p.id} r="5" className="dk-flow-dot" style={{animationDelay: (i * 0.22) + 's'}}><animateMotion dur="4.6s" begin={(i * 0.22) + 's'} repeatCount="indefinite"><mpath href={'#' + p.id}/></animateMotion></circle>)}
        </svg>

        {AI_TOOLS.map(t => <div key={t.name} className="dk-tool dk-tool-ai" style={{left: pct(t.x, U.w), top: pct(TOP_Y, U.h), width: pct(TOOL_W, U.w), height: pct(TOOL_H, U.h)}}><Brand t={t}/><span>{t.name}</span></div>)}

        {STAGES.map(s => <div key={s.id} className="dk-node" style={{left: pct(s.x, U.w), top: pct(MAIN_Y, U.h), width: pct(s.w, U.w), height: pct(MAIN_H, U.h)}}>
          <span className="dk-node-icon"><StageIcon name={s.icon}/></span>
          <strong>{s.title}</strong><small>{s.sub}</small>
        </div>)}

        <div className="dk-node dk-node-montaj" style={{left: pct(MONTAJ.x, U.w), top: pct(MONTAJ.y, U.h), width: pct(MONTAJ.w, U.w), height: pct(MONTAJ.h, U.h)}}>
          <img src="/brand/montaj-mark.png" alt="" width="58" height="58" loading="lazy"/>
          <strong>Montaj</strong><small>Editing &amp; Color Grading</small>
        </div>

        {PLATFORMS.map(t => <div key={t.name} className="dk-tool dk-tool-pf" style={{left: pct(t.x, U.w), top: pct(PLAT_Y, U.h), width: pct(TOOL_W, U.w), height: pct(TOOL_H, U.h)}}><PlatformIcon t={t}/><span>{t.name}</span></div>)}

        {/* small green arrow badges on the stage connectors */}
        {STAGES.slice(0, -1).map((s, i) => <span key={'arr' + i} className="dk-arrow" style={{left: pct((s.x + s.w + STAGES[i + 1].x) / 2, U.w), top: pct(MID_Y, U.h)}} aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 6h6M6.5 3.5 9 6 6.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>)}
      </div>
    </div>

    <div className="dk-prod-strip dk-wrap">
      <span className="dk-strip-icon"><I size={34} sw={1.7}><rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/></I></span>
      <div><strong>One creative partner for your video content.</strong><p>ReelFarm handles research, scripting, production and delivery, so clients get finished, ready-to-use videos without an in-house production team.</p></div>
      <a className="dk-btn dk-btn-primary" href={localPath('/packages', 'en')}>Explore Our Video Packages<Icon name="arrow" size={20}/></a>
    </div>
  </section>;
}


/* ----------------------------------------------------------- shared auto-sliding belt */
function AutoBelt({items, perView = 4, gap = 24, render, label}) {
  const [index, setIndex] = useState(0);
  const [noAnim, setNoAnim] = useState(false);
  const [step, setStep] = useState(0);
  const trackRef = useRef(null), hover = useRef(false), vis = useRef(false), box = useRef(null);
  const n = items.length;
  const belt = Array.from({length: n ? n + perView : 0}, (_, k) => items[k % n]);
  useLayoutEffect(() => {
    const measure = () => { const li = trackRef.current?.children[0]; if (li) setStep(li.offsetWidth + gap); };
    measure(); window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [gap]);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { vis.current = e.isIntersecting; }, {threshold: 0.3});
    io.observe(el);
    if (n < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => io.disconnect();
    const t = setInterval(() => { if (!document.hidden && !hover.current && vis.current) setIndex(i => i + 1); }, 3800);
    return () => { io.disconnect(); clearInterval(t); };
  }, [n]);
  useEffect(() => { if (!noAnim) return; const r = requestAnimationFrame(() => requestAnimationFrame(() => setNoAnim(false))); return () => cancelAnimationFrame(r); }, [noAnim]);
  const onEnd = () => { if (n && index >= n) { setNoAnim(true); setIndex(i => i - n); } };
  return <div ref={box} className="dk-belt" aria-label={label} onPointerEnter={() => { hover.current = true; }} onPointerLeave={() => { hover.current = false; }}>
    <ul ref={trackRef} className="dk-belt-track" onTransitionEnd={onEnd} style={{gap: gap + 'px', transform: `translate3d(${-index * step}px,0,0)`, transition: noAnim ? 'none' : 'transform .9s cubic-bezier(.65,0,.35,1)'}}>
      {belt.map((it, k) => <li key={it.id + '-' + k} style={{flex: `0 0 calc((100% - ${gap * (perView - 1)}px) / ${perView})`}}>{render(it)}</li>)}
    </ul>
  </div>;
}

/* --------------------------------------------- video detail: related rail (slides left) */
export function DesktopRelated({video}) {
  const items = videos.filter(v => v.id !== video.id).sort((a, b) => Number(b.category === video.category) - Number(a.category === video.category)).slice(0, 9);
  return <div className="dk-related desk-only">
    <AutoBelt items={items} perView={4} gap={24} label="More videos" render={v => <a className="dk-rel-card" href={localPath('/explore/' + v.id, 'en')}>
      <span className="dk-rel-media"><img src={v.poster} alt="" loading="lazy" width="600" height="1067"/><span className="dk-work-play"><Icon name="play" size={16}/></span><span className="dk-work-dur">{fmtDur(v.duration)}</span></span>
      <span className="dk-rel-title">{v.title.en}</span>
    </a>}/>
  </div>;
}

/* ------------------------------------------------------ services: how a package works */
export function DesktopServicesFlow() {
  return <section className="dk-sflow desk-only dk-wrap" aria-labelledby="dk-sflow-title">
    <span className="dk-pill"><Icon name="layers" size={16}/>HOW A PACKAGE WORKS</span>
    <h2 id="dk-sflow-title">From brief to <span className="dk-green">finished videos.</span></h2>
    <ol className="dk-fsteps">
      <FunnelCard tone="purple" n={0} icon={<Icon name="chat" size={30}/>} title="Tell us" text="Share your trade, goals and the videos you need."/>
      <Squig/>
      <FunnelCard tone="blue" n={1} icon={<I size={30}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></I>} title="We plan" text="Concepts, scripts and structure for each video."/>
      <Squig/>
      <FunnelCard tone="green" n={2} icon={<Icon name="video" size={30}/>} title="We produce" text="Visuals, voiceover and editing, built in our workflow."/>
      <Squig/>
      <FunnelCard tone="green" n={3} icon={<I size={30}><rect x="3" y="4" width="18" height="13" rx="2"/><path d="m10.5 8.5 4 2.500-4 2.500z"/><path d="M9 20h6"/></I>} title="You receive" text="Finished, ready-to-use videos for your channels."/>
    </ol>
  </section>;
}

/* ------------------------------------------------------------ contact: what happens next + quick form */
export function ContactDesk() {
  const [v, setV] = useState({name: '', email: '', project: ''});
  const [err, setErr] = useState({});
  const set = k => e => setV(x => ({...x, [k]: e.target.value}));
  const submit = e => {
    e.preventDefault();
    const found = validateBrief({name: v.name, email: v.email});
    setErr(found);
    if (Object.keys(found).length) return;
    const body = `Name: ${v.name}\nEmail: ${v.email}\n\nWhat I'm looking for:\n${v.project || '(not specified)'}`;
    window.location.href = emailLink(`ReelFarm inquiry from ${v.name}`, body);
  };
  return <div className="dk-contact-desk desk-only dk-wrap">
    <div className="dk-next">
      <span className="dk-pill">WHAT HAPPENS NEXT</span>
      <ol>
        <li><b>1</b><div><strong>You tell us what you need</strong><p>A few lines about your business and the videos you have in mind.</p></div></li>
        <li><b>2</b><div><strong>We review it</strong><p>We look at your request and talk through the project with you before anything starts.</p></div></li>
        <li><b>3</b><div><strong>We plan the next step</strong><p>You get a clear plan and quote. No obligation.</p></div></li>
      </ol>
    </div>
    <form className="dk-quick" onSubmit={submit} noValidate>
      <h2>Quick message</h2>
      <label>Your name<input value={v.name} onChange={set('name')} autoComplete="name" maxLength={100} aria-invalid={Boolean(err.name)}/></label>
      <label>Email<input type="email" value={v.email} onChange={set('email')} autoComplete="email" maxLength={254} aria-invalid={Boolean(err.email)}/></label>
      <label>What do you need?<textarea rows={3} value={v.project} onChange={set('project')} maxLength={1500}/></label>
      {(err.name || err.email) && <p className="dk-quick-err" role="alert">Please add your name and a valid email.</p>}
      <button type="submit" className="dk-btn dk-btn-primary">Prepare my email<Icon name="arrow" size={18}/></button>
      <small>This opens your email app with the message ready to send. Nothing is sent until you press send.</small>
    </form>
  </div>;
}
