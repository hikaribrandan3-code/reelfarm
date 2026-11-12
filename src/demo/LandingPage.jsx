import React, {useEffect, useRef, useState} from 'react';
import {videos} from '../content.js';
import {SERVICE_OPTIONS, validateLead} from './leadSchema.js';

const paths = {
  storm: <><path d="M7 16a4.5 4.5 0 1 1 1-8.9A5.5 5.5 0 0 1 18.6 9 3.8 3.8 0 0 1 18 16.5"/><path d="m12 11-2.5 4.5H13L11 20"/></>,
  repair: <><path d="m14.7 6.3 3 3-8.4 8.4-3.7.7.7-3.7z"/><path d="m13 8 3 3M17 3.5l3.5 3.5-2 2-3.5-3.5z"/></>,
  replace: <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  phone: <path d="M6.6 3.8 9 3.5l1.8 4.3-1.9 1.4a11 11 0 0 0 5.9 5.9l1.4-1.9 4.3 1.8-.3 2.4A2.7 2.7 0 0 1 17.6 20 15 15 0 0 1 4 6.4 2.7 2.7 0 0 1 6.6 3.8z"/>,
  user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></>,
  pin: <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></>,
  home: <><path d="m3 11 9-7.5 9 7.5"/><path d="M5.5 9.500V20h13V9.500M10 20v-5h4v5"/></>,
  shield: <><path d="M12 3 4.500 6v5.500c0 4.500 3 7.800 7.500 9.500 4.500-1.700 7.500-5 7.500-9.500V6z"/><path d="m8.800 12 2.400 2.400 4.200-4.600"/></>,
  check: <path d="m5 12.500 4.500 4.500L19 7.500"/>,
  arrow: <path d="M5 12h14m-5-6 6 6-6 6"/>,
  send: <path d="M21 3 3 10.500l7 2.500 2.500 7zM10 13l5-4.500"/>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  restart: <><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.500h4.500"/></>,
  chevron: <path d="m6 9 6 6 6-6"/>,
  play: <path d="M8 5.500v13l11-6.500z" fill="currentColor"/>,
};
const Icon = ({name, size = 22}) => <svg className="rr-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;

function Player({video, caption}) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const play = () => ref.current?.play().catch(() => {});
  return <figure className="rr-player-wrap">
    <div className="rr-player">
      <video id="rr-demo-video" ref={ref} src={video.video} poster={video.poster} controls autoPlay muted loop playsInline preload="metadata" width="1080" height="1920" aria-label={video.title.en} onPlay={() => setStarted(true)}>
        Your browser can’t play this video. <a href={video.video}>Open the video</a>.
      </video>
      <button type="button" className="rr-restart rr-d" onClick={() => { const v = ref.current; if (v) { v.currentTime = 0; v.play().catch(() => {}); } }}><Icon name="restart" size={16}/>Restart</button>
      {!started && <button type="button" className="rr-play" onClick={play} aria-label="Play the roof storm damage video"><span><Icon name="play" size={30}/></span></button>}
    </div>
    <figcaption>{caption}</figcaption>
  </figure>;
}

const empty = {name: '', phone: '', email: '', zip: '', service: '', message: '', website: ''};
function EstimateForm({config, preview = false}) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | unavailable | failed
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  const set = key => e => { setValues(v => ({...v, [key]: e.target.value})); if (errors[key]) setErrors(er => ({...er, [key]: undefined})); };
  async function submit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    const result = validateLead(values);
    setErrors(result.errors);
    if (!result.ok) { requestAnimationFrame(() => document.querySelector('.rr-field.has-error :is(input,select,textarea)')?.focus()); return; }
    if (preview) { setStatus('preview'); return; }
    setStatus('sending');
    try {
      const response = await fetch('/api/lead', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...values, campaign: config.id, startedAt: startedAt.current})});
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.ok) { setStatus('sent'); return; }
      if (response.status === 422 && data.errors) { setErrors(data.errors); setStatus('idle'); return; }
      setStatus(data.error === 'not_configured' ? 'unavailable' : 'failed');
    } catch { setStatus('failed'); }
  }
  if (status === 'preview') return <div className="rr-success" role="status"><h3>Demo request complete</h3><p>This is a preview. Your details were not sent.</p><button type="button" className="rr-button" onClick={() => { setValues(empty); setStatus('idle'); }}>Try again</button></div>;
  if (status === 'sent') return <div className="rr-success" role="status" tabIndex={-1} ref={el => el?.focus()}>
    <span className="rr-success-icon"><Icon name="check" size={30}/></span>
    <h3>Request received</h3>
    <p>Thanks, {values.name.split(' ')[0]}. {config.brand.name} has your details and will contact you at {values.phone} or {values.email}.</p>
    <p className="rr-fine">This is a demo brand, so no real contractor will follow up.</p>
  </div>;
  const field = (key, label, input) => <div className={`rr-field ${key === 'message' ? 'rr-field-visible' : ''} ${errors[key] ? 'has-error' : ''}`}><label htmlFor={`rr-${key}`}>{label}</label>{input}{errors[key] && <p className="rr-error" id={`rr-${key}-error`} role="alert">{errors[key]}</p>}</div>;
  const common = key => ({id: `rr-${key}`, name: key, value: values[key], onChange: set(key), 'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `rr-${key}-error` : undefined});
  return <form className="rr-form" onSubmit={submit} noValidate aria-busy={status === 'sending'}>
    <div className="rr-row">
      {field('name', 'Full name', <div className="rr-input"><Icon name="user" size={19}/><input {...common('name')} autoComplete="name" placeholder="Full Name" maxLength={100} required/></div>)}
      {field('phone', 'Phone number', <div className="rr-input"><Icon name="phone" size={19}/><input {...common('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="Phone Number" maxLength={20} required/></div>)}
    </div>
    {field('email', 'Email address', <div className="rr-input"><Icon name="mail" size={19}/><input {...common('email')} type="email" inputMode="email" autoComplete="email" placeholder="Email Address" maxLength={254} required/></div>)}
    <div className="rr-row rr-extra-fields">
      {field('zip', 'ZIP code', <div className="rr-input"><Icon name="pin" size={19}/><input {...common('zip')} inputMode="numeric" autoComplete="postal-code" placeholder="ZIP Code" maxLength={5} pattern="[0-9]*" required/></div>)}
      {field('service', 'Service needed', <div className="rr-input"><Icon name="home" size={19}/><select {...common('service')} required><option value="">Service Needed</option>{SERVICE_OPTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select><Icon name="chevron" size={18}/></div>)}
    </div>
    {field('message', <>Project description <span>(optional)</span></>, <div className="rr-input rr-textarea"><textarea {...common('message')} rows={3} maxLength={1000} placeholder="What are you seeing on your roof?"/></div>)}
    <div className="rr-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')}/></label></div>
    {status === 'unavailable' && <p className="rr-alert" role="alert">This demo form isn’t connected to a live inbox yet, so your request was <strong>not</strong> sent. Summit Peak Roofing is a fictional demo brand.</p>}
    {status === 'failed' && <p className="rr-alert" role="alert">We couldn’t send your request. Nothing was submitted. Check your connection and try again.</p>}
    <button type="submit" className="rr-button rr-submit" disabled={status === 'sending'}>{status === 'sending' ? <><span className="rr-spinner" aria-hidden="true"/>Sending…</> : <><Icon name="send" size={20}/>Request My Free Estimate<Icon name="arrow" size={20}/></>}</button>
    <ul className="rr-assure">{config.assurances.map(a => <li key={a}><Icon name="check" size={16}/>{a}</li>)}</ul>
  </form>;
}

export default function LandingPage({config, preview = false}) {
  useEffect(() => {
    if (!preview) return;
    let timer, raf, stopped = false, phase = 0;
    const scroll = () => {
      if (stopped) return;
      const root = document.scrollingElement;
      const max = root.scrollHeight - window.innerHeight;
      const target = phase === 0 ? Math.min(document.querySelector('#estimate')?.offsetTop || 0,max) : max;
      const start = root.scrollTop, duration = phase === 0 ? 5500 : 4200, began = performance.now();
      const tick = now => {
        if (stopped) return;
        const p = Math.min(1,(now-began)/duration);
        root.scrollTop = start + (target-start)*p;
        if (p<1) raf=requestAnimationFrame(tick);
        else { phase=(phase+1)%2; timer=setTimeout(scroll,phase===1?1100:500); }
      };
      raf=requestAnimationFrame(tick);
    };
    const receive = event => {
      if (event.origin !== location.origin) return;
      if (event.data?.type === 'reelfarm-preview-start' && !stopped) timer=setTimeout(scroll,1500);
      if (event.data?.type === 'reelfarm-preview-stop') { stopped=true; clearTimeout(timer); cancelAnimationFrame(raf); }
    };
    const stop = () => { stopped=true; clearTimeout(timer); cancelAnimationFrame(raf); };
    addEventListener('message',receive);
    for (const type of ['pointerdown','touchstart','wheel','keydown','focusin']) addEventListener(type,stop,{once:true,passive:true});
    return () => { stop(); removeEventListener('message',receive); };
  },[preview]);
  const video = videos.find(v => v.id === config.videoId);
  const {brand, hero} = config;
  const [stuck, setStuck] = useState(false);
  const [callNote, setCallNote] = useState(false);
  const [home, setHome] = useState('/');
  const [backLabel, setBackLabel] = useState('Back to ReelFarm');
  useEffect(() => {
    const locale = new URLSearchParams(location.search).get('lang');
    if (locale === 'es' || locale === 'pt') {
      setHome('/' + locale + '/');
      setBackLabel(locale === 'es' ? 'Volver a ReelFarm' : 'Voltar para ReelFarm');
    }
  }, []);
  useEffect(() => {
    const form = document.getElementById('estimate'), top = document.querySelector('.rr-hero');
    if (!form || !top || !('IntersectionObserver' in window)) return;
    const state = {hero: true, form: false};
    const observer = new IntersectionObserver(entries => { for (const e of entries) state[e.target === form ? 'form' : 'hero'] = e.isIntersecting; setStuck(!state.hero && !state.form); }, {threshold: 0.15});
    observer.observe(form); observer.observe(top);
    return () => observer.disconnect();
  }, []);
  // Desktop only (>= 1051px, no reduced motion): the storm backdrop and video card drift in depth as you scroll.
  useEffect(() => {
    if (!matchMedia('(min-width:1051px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches || preview) return;
    const page = document.querySelector('.rr-page'); if (!page) return;
    page.classList.add('rr-3d');
    let raf = 0;
    const on = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const y = Math.min(window.scrollY, 900); page.style.setProperty('--rr-s', y); page.style.setProperty('--rr-t', (y / 900).toFixed(3)); }); };
    window.addEventListener('scroll', on, {passive: true}); on();
    return () => { window.removeEventListener('scroll', on); page.classList.remove('rr-3d'); if (raf) cancelAnimationFrame(raf); };
  }, [preview]);
  return <div className={preview ? "rr-page rr-page-preview" : "rr-page"}>
    <picture className="rr-bg" aria-hidden="true"><img src="/demo/storm-1024.webp" srcSet="/demo/storm-640.webp 640w, /demo/storm-1024.webp 1024w" sizes="100vw" width="1024" height="1536" alt="" decoding="async"/></picture>
    <div className="rr-scrim" aria-hidden="true"/>
    <a className="rr-skip" href="#estimate">Skip to estimate form</a>
    <header className="rr-header"><div className="rr-header-inner">
      <a href={home} className="rr-back" data-full-navigation="" onClick={event => {
        const from = document.referrer && new URL(document.referrer);
        if (from && from.origin === location.origin && from.pathname === home && history.length > 1) {
          event.preventDefault();
          history.back();
        }
      }}><Icon name="arrow" size={16}/>{backLabel}</a>
      <a className="rr-brand" href="#top" aria-label={`${brand.name} home`}><span className="rr-mark">{brand.monogram}</span><span><strong>{brand.name}</strong><small>{brand.demo ? 'Demo · Roofing' : brand.tagline}</small></span></a>
      <nav className="rr-nav" aria-label="Page"><a href="#services">Services</a><a href="#how">How it works</a><a href="#estimate">Free estimate</a></nav>
      <button type="button" className="rr-call" onClick={() => setCallNote(n => !n)} aria-expanded={callNote}><Icon name="phone" size={19}/>Call Now</button>
      {callNote && <p className="rr-call-note" role="status">Demo only: Summit Peak Roofing is fictional, so there is no phone number to call.</p>}
    </div></header>
    <main id="top">
      <section className="rr-hero rr-wrap">
        <div className="rr-hero-copy">
          <span className="rr-eyebrow rr-d"><Icon name="shield" size={15}/>Roofing Experts</span>
          <h1>{preview ? <>Roof Repair<br/><em>Estimator</em></> : <>{hero.lead}<br/><em>{hero.accent}</em></>}</h1>
          <p>{hero.copy}</p>
          <div className="rr-cta-row">
            <a className="rr-button" href="#estimate">{hero.cta}<Icon name="arrow" size={20}/></a>
            <button type="button" className="rr-ghost rr-d" onClick={() => { const v = document.getElementById('rr-demo-video'); if (!v) return; v.scrollIntoView({behavior: 'smooth', block: 'center'}); v.currentTime = 0; v.muted = false; v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); }}><Icon name="play" size={16}/>Watch the 78-Second Demo</button>
          </div>
          <ul className="rr-feats rr-d"><li><Icon name="bolt" size={26}/>Storm Damage<br/>Assessment</li><li><Icon name="shield" size={26}/>Repair or<br/>Replacement</li><li><Icon name="clock" size={26}/>Fast<br/>Response</li></ul>
        </div>
        {!preview && <Player video={video} caption={config.videoCaption}/>}
      </section>
      <section className="rr-services rr-wrap" id="services" aria-label="Services"><ul>{config.services.map(s => <li key={s.title}><Icon name={s.icon} size={34}/><h2>{s.title}</h2><p>{s.text}</p></li>)}</ul></section>
      <div className="rr-bottom rr-wrap">
      <section className="rr-estimate rr-wrap" id="estimate" aria-labelledby="estimate-title">
        <div className="rr-card"><h2 id="estimate-title">Get a Free Roof Estimate</h2><p className="rr-sub">Tell us about your project and we’ll be in touch soon.</p><EstimateForm config={config} preview={preview}/></div>
      </section>

      <section className="rr-how rr-wrap" id="how" aria-labelledby="how-title">
        <h2 id="how-title">What happens after you reach out</h2>
        <ol>{config.steps.map((s, i) => <li key={s.title}><span>{i + 1}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol>
      </section>
      </div>
      <section className="rr-final rr-wrap" aria-labelledby="final-title"><h2 id="final-title">Worried about your roof after the storm?</h2><p>Get a free estimate and find out what it needs.</p><a className="rr-button" href="#estimate">{hero.cta}<Icon name="arrow" size={20}/></a></section>
    </main>
    <footer className="rr-footer rr-wrap"><p>{config.demoNotice}</p><p>Demo experience produced by <a href="/">ReelFarm</a></p></footer>
    <a className={`rr-sticky ${stuck ? 'is-visible' : ''}`} href="#estimate" tabIndex={stuck ? 0 : -1} aria-hidden={!stuck}>{hero.cta}<Icon name="arrow" size={19}/></a>
  </div>;
}
