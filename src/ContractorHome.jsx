import {roofing} from './demo/roofing.js';
import ProductionSystem from './ProductionSystem.jsx';
import {DesktopHero, DesktopFunnel, DesktopProduction, DesktopWork, Swash} from './desktop/DesktopSections.jsx';
import React, {useEffect, useRef, useState} from 'react';
import {Icon} from './Icons.jsx';
import {videos, durationLabel} from './content.js';
import {homeCopy} from './homeCopy.js';
import {CONTRACTOR_CAMPAIGN, QUOTE_TRADES, validateContractorQuote} from './contractorQuote.js';
import {LEAD_EMAIL} from './lead.js';
import {localPath} from './i18n.js';

const roof = videos.find(video => video.id === 'roof-build');
const demoPath = '/demo/roofing';
const tradeAliases = {'Fences':'Fencing', 'Swimming pools':'Pools'};
const tradeById = {'driveway-commercial':'Concrete', 'garage-epoxy-peeling':'Flooring', 'bellevue-irrigation':'Irrigation'};
const tradeFor = video => tradeById[video.id] || tradeAliases[video.trade] || video.trade || 'Other';
const contractorVideos = videos.filter(video => video.industry === 'Home Services');
const broaderIds = ['acai-brasil','studio-edit','ai-for-business','views-to-visits','content-treadmill'];
const broaderVideos = broaderIds.map(id=>videos.find(video=>video.id===id)).filter(Boolean);

function MorePortfolio({copy,locale,t,VideoCard}) {
  const [index,setIndex]=useState(0);
  const [visible,setVisible]=useState(false);
  const [paused,setPaused]=useState(false);
  const [stepPx,setStepPx]=useState(0);
  const [beltTransition,setBeltTransition]=useState(true);
  const section=useRef(null);
  const windowRef=useRef(null);
  const trackRef=useRef(null);
  const idleTimer=useRef(null);
  const hovering=useRef(false);
  const focused=useRef(false);
  const count=broaderVideos.length;

  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});
    if(section.current)observer.observe(section.current);
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const frame=windowRef.current,track=trackRef.current;
    if(!frame||!track)return;
    const measure=()=>{
      const first=track.children[0],second=track.children[1];
      if(first&&second)setStepPx(second.getBoundingClientRect().left-first.getBoundingClientRect().left);
    };
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(frame);
    return()=>observer.disconnect();
  },[count]);
  useEffect(()=>{
    if(!visible||paused||!stepPx||navigator.connection?.saveData||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const timer=setTimeout(()=>{if(!document.hidden)setIndex(current=>current+1);},4500);
    return()=>clearTimeout(timer);
  },[visible,paused,index,stepPx]);
  useEffect(()=>()=>clearTimeout(idleTimer.current),[]);

  const pauseForInteraction=()=>{
    setPaused(true);
    clearTimeout(idleTimer.current);
    idleTimer.current=setTimeout(()=>{if(!hovering.current&&!focused.current)setPaused(false);},5000);
  };
  const resumeWhenIdle=()=>{
    clearTimeout(idleTimer.current);
    idleTimer.current=setTimeout(()=>{if(!hovering.current&&!focused.current)setPaused(false);},1200);
  };
  const items=[...broaderVideos,...broaderVideos.slice(0,4)];
  const [perView,setPerView]=useState(2);
  useEffect(()=>{const mq=matchMedia('(min-width:1051px)');const sync=()=>setPerView(mq.matches?3:2);sync();mq.addEventListener('change',sync);return()=>mq.removeEventListener('change',sync);},[]);

  return <section ref={section} className="contractor-section contractor-more wrap" aria-labelledby="contractor-more-title">
    <Heading id="contractor-more-title" title={copy.more}>{copy.moreText}</Heading>
    <div className="more-rail">
    <div className="contractor-more-window" ref={windowRef} onPointerEnter={()=>{hovering.current=true;setPaused(true);clearTimeout(idleTimer.current);}} onPointerLeave={()=>{hovering.current=false;resumeWhenIdle();}} onFocusCapture={()=>{focused.current=true;setPaused(true);clearTimeout(idleTimer.current);}} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget)){focused.current=false;resumeWhenIdle();}}} onTouchStart={pauseForInteraction} onTouchEnd={resumeWhenIdle}>
      <div ref={trackRef} className="contractor-more-track" style={{transform:`translateX(-${index*stepPx}px)`,transition:beltTransition?undefined:'none'}} onTransitionEnd={event=>{if(event.target!==event.currentTarget||index!==count)return;setBeltTransition(false);setIndex(0);requestAnimationFrame(()=>requestAnimationFrame(()=>setBeltTransition(true)));}}>
        {items.map((video,position)=>{
          const inView=position>=index&&position<index+perView;
          return <div className="contractor-more-slide" key={`${video.id}-${position}`}>
            <VideoCard video={video} animate={visible&&inView} paused={paused} duplicate={position>=count&&!inView}/>
          </div>;
        })}
      </div>
    </div>
    <button type="button" className="more-arrow more-prev" aria-label={copy.prev} onClick={()=>setIndex(i=>i>0?i-1:count-1)}><Icon name="arrow" size={21}/></button>
    <button type="button" className="more-arrow more-next" aria-label={copy.next} onClick={()=>setIndex(i=>i+1)}><Icon name="arrow" size={21}/></button>
    </div>
    <div className="more-dots">{Array.from({length:count},(_,i)=><button key={i} type="button" aria-label={'Slide '+(i+1)} aria-current={index%count===i} onClick={()=>setIndex(i)}/>)}</div>
    <a className="text-link" href={localPath('/explore',locale)}>{t.seeAll}<Icon name="arrow" size={18}/></a>
  </section>;
}

function Heading({as: Tag = 'h2', id, label, icon, title, accent, children}) {
  return <div className="contractor-heading">
    {label && <span className="contractor-label"><Icon name={icon} size={16}/>{label}</span>}
    <Tag id={id}>{title}{accent && <> <em>{accent}</em></>}</Tag>
    {children && <p>{children}</p>}
  </div>;
}

const heroTrades = {
  en: ['Roofers.', 'HVAC Pros.', 'Fencing Pros.', 'Remodelers.', 'Pool Pros.'],
  es: ['Techistas.', 'Climatización.', 'Cercas.', 'Remodelación.', 'Piscinas.'],
  pt: ['Telhadistas.', 'Climatização.', 'Cercas.', 'Reformas.', 'Piscinas.'],
};
function ContractorHeroHeading({copy, locale, t}) {
  const headline = {en:<><span>Stop the Scroll.</span><span><em>Get More Jobs.</em></span></>,es:<><span>Frená el scroll.</span><span><em>Conseguí más trabajos.</em></span></>,pt:<><span>Pare o scroll.</span><span><em>Conquiste mais trabalhos.</em></span></>}[locale];
  return <div className="contractor-heading contractor-hero-heading">
    <div className="hero-eyebrow"><span>{({en:'VIDEO CONTENT FOR CONTRACTORS',es:'CONTENIDO EN VIDEO PARA CONTRATISTAS',pt:'CONTEÚDO EM VÍDEO PARA EMPREITEIROS'})[locale]}</span></div>
    <h1 id="contractor-hero-title" className="hero-hook">{headline}</h1>
    <p>{{en:"Scroll-stopping video ads and simple landing pages that turn views into estimate requests.", es:"Anuncios en video y páginas sencillas que convierten vistas en solicitudes de presupuesto.", pt:"Anúncios em vídeo e páginas simples que transformam visualizações em pedidos de orçamento."}[locale]}</p>
  </div>;
}

function DemoLink({locale, children, ...props}) {
  const home = localPath('/',locale);
  const href = locale === 'en' ? demoPath : demoPath + '?lang=' + locale;
  return <a href={href} {...props} data-full-navigation="" onClick={() => {
    try { sessionStorage.setItem('reelfarm-demo-return', JSON.stringify({home, y: window.scrollY})); } catch {}
  }}>{children}</a>;
}

function RoofingAd({copy, locale, compact = false, t}) {
  const [liked,setLiked] = useState(false);
  const [shared,setShared] = useState(false);
  const [commentOpen,setCommentOpen] = useState(false);
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) return;
    video.muted = true;
    // Play the muted loop only while the ad is on screen, pause it when it scrolls away.
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) video.play().catch(() => {}); else video.pause(); }, {threshold: 0.5});
    io.observe(video);
    return () => io.disconnect();
  }, []);
  async function share() {
    const url = new URL(demoPath, location.origin).href;
    try {
      if (navigator.share) await navigator.share({title:'Summit Peak Roofing',url});
      else { await navigator.clipboard.writeText(url); setShared(true); }
    } catch {}
  }
  return <article id={compact ? undefined : 'sponsored-ad'} className={'roofing-ad' + (compact ? ' roofing-ad-compact' : '')} aria-label={`${copy.sponsored}: Summit Peak Roofing`}>
    <div className="roofing-ad-top">
      <div className="roofing-ad-brand">
        <span className="roofing-avatar"><Icon name="home" size={22}/></span>
        <div><strong>Summit Peak Roofing</strong><small>{copy.sponsored}</small></div>
      </div>
      <p>{copy.caption}</p>
    </div>
    <div className="roofing-ad-media">
      {compact
        ? <DemoLink locale={locale} aria-label={copy.live}><img src={roof.poster} alt="" width="600" height="1067" loading="lazy"/><span className="roofing-ad-play"><Icon name="play" size={21}/></span></DemoLink>
        : <video ref={videoRef} poster={roof.poster} muted loop controls playsInline preload="none" aria-label={roof.title[locale]}><source src={roof.video + "#t=30"} type="video/mp4"/><source src="/media/roof-build.preview.mp4" type="video/mp4"/></video>}
    </div>
    <div className="roofing-ad-cta">
      <strong>{copy.freeEstimate}</strong>
      <DemoLink locale={locale}>{copy.learn}</DemoLink>
    </div>
    {!compact && <div className="roofing-ad-social">
      <button type="button" aria-pressed={liked} onClick={() => setLiked(value => !value)}><Icon name="like" size={17}/>{copy.social[0]}</button>
      <button type="button" aria-expanded={commentOpen} onClick={() => setCommentOpen(value => !value)}><Icon name="chat" size={17}/>{copy.social[1]}</button>
      <button type="button" onClick={share}><Icon name="share" size={17}/>{shared ? t.copied : copy.social[2]}</button>
    </div>}
    {commentOpen && <p className="roofing-ad-notice">{copy.demoComment}</p>}
  </article>;
}

function Estimator({locale}) {
  // Phones/tablets only: the three benefits light up one after another while the section is on screen.
  const [seq, setSeq] = useState(-1);
  const benefitsRef = useRef(null);
  useEffect(() => {
    const el = benefitsRef.current; if (!el) return;
    if (!matchMedia('(max-width:1050px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let t = 0; setSeq(0);
    const io = new IntersectionObserver(([e]) => { clearInterval(t); if (e.isIntersecting) t = setInterval(() => setSeq(s => (s + 1) % 3), 2400); }, {threshold: 0.5});
    io.observe(el);
    return () => { io.disconnect(); clearInterval(t); };
  }, []);
  return <section className={'contractor-section section-two wrap'+(locale==='en'?' mob-only':'')} aria-labelledby="estimator-title">
    <div className="section-two-copy"><span className="section-two-badge">VIDEO MARKETING FOR CONTRACTORS</span><h2 id="estimator-title">Turn Your Work<br/>Into <em>Leads.</em></h2><p>We create video ads, a simple landing page, and send real inquiries straight to your email.</p></div>
    <DemoLink locale={locale} className="section-two-image"><img src="/demo/roofing-phone-hand.webp" alt="A person holding a phone showing the Summit Peak Roofing landing page" loading="lazy" width="900" height="985"/></DemoLink>
    <div className="section-two-bottom"><div ref={benefitsRef} className={'section-two-benefits' + (seq >= 0 ? ' seq' : '')}>{[['video','Video Ads','Get the right people to click.'],['layers','Landing Page','A simple page built to capture inquiries.'],['mail','Email Leads','Estimate requests to your inbox.']].map(([icon,title,desc],i)=><div key={title} className={i===seq?'on':undefined}><Icon name={icon} size={26}/><strong>{title}</strong><span>{desc}</span></div>)}</div><div className="section-two-actions"><DemoLink locale={locale} className="button">See It In Action <Icon name="arrow" size={18}/></DemoLink><a className="button section-two-secondary" href="#trade-title">View Portfolio</a></div></div>
  </section>;
}

function TradePortfolio({copy, locale, t, Preview}) {
  const [index,setIndex] = useState(0);
  const [paused,setPaused] = useState(false);
  const [visible,setVisible] = useState(false);
  const [beltTransition,setBeltTransition] = useState(true);
  const section = useRef(null);
  const windowRef = useRef(null);
  const trackRef = useRef(null);
  const start = useRef(null);
  const [beltOffset,setBeltOffset] = useState(0);
  const hoverRef = useRef(false), visRef = useRef(false);
  const [desk,setDesk] = useState(false);
  const [allMode,setAllMode] = useState(true);
  const [page,setPage] = useState(0);
  const [pages,setPages] = useState(1);
  const count = contractorVideos.length;
  const logicalIndex = ((index % count) + count) % count;
  const video = contractorVideos[logicalIndex];
  const step = offset => setIndex(current => {
    if (offset > 0 && current === count - 1) return count;
    if (offset < 0 && current === 0) return -1;
    return (current + count + offset) % count;
  });
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { visRef.current = entry.isIntersecting; setVisible(entry.isIntersecting); }, {threshold:.3});
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { const mq=matchMedia('(min-width:1051px)'); const sync=()=>setDesk(mq.matches); sync(); mq.addEventListener('change',sync); return()=>mq.removeEventListener('change',sync); },[]);
  const scrollToCard = i => { const win=windowRef.current, card=trackRef.current?.children[i+1]; if(win&&card) win.scrollTo({left:card.offsetLeft,behavior:'smooth'}); };
  const pageBy = dir => { const win=windowRef.current; if(win) win.scrollBy({left:dir*win.clientWidth*.85,behavior:'smooth'}); };
  useEffect(() => { if(desk&&index>=0&&index<count) scrollToCard(index); },[desk,index]);
  useEffect(() => {
    const win=windowRef.current; if(!desk||!win) return;
    const sync=()=>{ const max=win.scrollWidth-win.clientWidth; const n=Math.max(1,Math.ceil(win.scrollWidth/win.clientWidth)); setPages(n); setPage(max>0?Math.round(win.scrollLeft/max*(n-1)):0); };
    sync(); win.addEventListener('scroll',sync,{passive:true}); window.addEventListener('resize',sync);
    return()=>{win.removeEventListener('scroll',sync);window.removeEventListener('resize',sync);};
  },[desk]);
  useEffect(() => {
    if (desk || !visible || paused || navigator.connection?.saveData || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(() => { if (!document.hidden) step(1); }, 4500);
    return () => clearTimeout(timer);
  }, [desk, visible, paused, index]);
  // Desktop only: the row glides left on its own, one card at a time, then eases back to the start.
  useEffect(() => {
    if (!desk || navigator.connection?.saveData || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer=setInterval(() => {
      const win=windowRef.current, track=trackRef.current;
      if (!win || !track || document.hidden || hoverRef.current || !visRef.current) return;
      const c1=track.children[1], c2=track.children[2]; if(!c1||!c2) return;
      const cardStep=c2.offsetLeft-c1.offsetLeft;
      const max=win.scrollWidth-win.clientWidth;
      if (win.scrollLeft >= max-6) win.scrollTo({left:0,behavior:'smooth'});
      else win.scrollBy({left:cardStep,behavior:'smooth'});
    }, 3800);
    return () => clearInterval(timer);
  }, [desk]);
  const trade = tradeFor(video);
  useEffect(() => {
    const frame=windowRef.current, track=trackRef.current;
    if(!frame||!track)return;
    const update=()=>{
      const active=track.children[index+1];
      if(!active)return;
      const frameRect=frame.getBoundingClientRect();
      const trackRect=track.getBoundingClientRect();
      const activeRect=active.getBoundingClientRect();
      const activeLeftInTrack=activeRect.left-trackRect.left;
      setBeltOffset((frame.clientWidth-active.clientWidth)/2-activeLeftInTrack);
    };
    update();
    const observer=new ResizeObserver(update);
    observer.observe(frame);
    if(track.children[1])observer.observe(track.children[1]);
    return()=>observer.disconnect();
  },[index,count]);
  useEffect(() => { const row=section.current?.querySelector('.trade-filters'); const selected=row?.querySelector('[aria-pressed="true"]'); if(row && selected) row.scrollTo({left:selected.offsetLeft-row.offsetLeft-(row.clientWidth-selected.clientWidth)/2,behavior:'smooth'}); },[logicalIndex]);
  return <section ref={section} className="contractor-section trade-portfolio wrap" aria-labelledby="trade-title">
    <Heading id="trade-title" label={copy.portfolio} icon="play" title={copy.built} accent={copy.trade}>{locale === 'en' ? 'Roofing, HVAC, concrete, fencing, pools & more. See what we can create for your business.' : copy.portfolioText}</Heading>
    <div className="trade-slide" onPointerEnter={() => { hoverRef.current = true; if (desk) setPaused(true); }} onPointerLeave={() => { hoverRef.current = false; if (desk) setPaused(false); }} onFocusCapture={() => { hoverRef.current = true; if (desk) setPaused(true); }} onBlurCapture={() => { hoverRef.current = false; if (desk) setPaused(false); }} onTouchStart={event => {start.current = [event.touches[0].clientX,event.touches[0].clientY];}} onTouchEnd={event => {
      if (!start.current) return;
      const dx = event.changedTouches[0].clientX - start.current[0];
      const dy = event.changedTouches[0].clientY - start.current[1];
      start.current = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { step(dx < 0 ? 1 : -1); }
    }} onTouchCancel={() => { start.current = null; }}>
      <div className="trade-window" ref={windowRef}><div className="trade-track" ref={trackRef} style={{transform:`translateX(${beltOffset}px)`,transition:beltTransition?undefined:'none'}} onTransitionEnd={event=>{if(event.target!==event.currentTarget||(index!==count&&index!==-1))return;setBeltTransition(false);setIndex(index===count?0:count-1);requestAnimationFrame(()=>requestAnimationFrame(()=>setBeltTransition(true)));}}>{[contractorVideos[count-1],...contractorVideos,contractorVideos[0]].map((item,slideIndex)=>{const isActive=slideIndex===index+1;return <a key={`${item.id}-${slideIndex}`} className="trade-video" href={localPath('/explore/' + item.slug,locale)} aria-label={t.watch + ': ' + item.title[locale]} tabIndex={isActive?0:-1}>
        <div className="trade-full-video"><video src={item.video} poster={item.poster} muted autoPlay={isActive&&visible&&!paused} loop playsInline preload={isActive?'metadata':'none'} aria-hidden="true" onLoadedMetadata={event=>{try{event.currentTarget.currentTime=Math.min(12,event.currentTarget.duration*.28);}catch{}}} /></div>
        <span className="trade-shade"/>
        <span className="roofing-ad-play"><Icon name="play" size={24}/></span>
        <span className="trade-title"><small>{copy.trades[QUOTE_TRADES.indexOf(tradeFor(item))]}</small><strong>{item.title[locale]}</strong></span>
        <span className="duration">{durationLabel(item.duration)}</span>
      </a>;})}</div></div>
      <button className="trade-arrow trade-prev" aria-label={copy.prev} onClick={() => desk ? pageBy(-1) : step(-1)}><Icon name="arrow" size={21}/></button>
      <button className="trade-arrow trade-next" aria-label={copy.next} onClick={() => desk ? pageBy(1) : step(1)}><Icon name="arrow" size={21}/></button>
    </div>
    <div className="trade-filters" data-all={allMode}>
      <button type="button" className="trade-all" aria-pressed={allMode} onClick={() => { setIndex(0); setAllMode(true); scrollToCard(0); }}><Icon name="grid" size={19}/>{({en:'All',es:'Todos',pt:'Todos'})[locale]}</button>
      {QUOTE_TRADES.map((name, i) => {
        const target = contractorVideos.findIndex(item => tradeFor(item) === name);
        if (target < 0) return null;
        return <button key={name} aria-pressed={name === trade} onClick={() => { setIndex(target); setAllMode(false); }}><Icon name={['home','spark','layers','grid','cube','spark','cube','layers','home'][i]} size={19}/>{copy.trades[i]}</button>;
      })}
    </div>
    <a className="trade-explore desk-only" href={localPath('/explore',locale)}>{t.seeAll}<Icon name="arrow" size={18}/></a>
    {desk && pages>1 && <div className="trade-dots">{Array.from({length:pages},(_,i)=><button key={i} type="button" aria-label={'Page '+(i+1)} aria-current={page===i} onClick={() => { const win=windowRef.current; if(win) win.scrollTo({left:i*(win.scrollWidth-win.clientWidth)/(pages-1),behavior:'smooth'}); }}/>)}</div>}
  </section>;
}

const fieldHints = {name:'John Doe',business:'Your Business LLC',phone:'(555) 123-4567',email:'you@email.com'};
const quoteFields = [
  {key:'name',icon:'user',autoComplete:'name',maxLength:100},
  {key:'business',icon:'home',autoComplete:'organization',maxLength:140},
  {key:'phone',icon:'phone',type:'tel',autoComplete:'tel',maxLength:30},
  {key:'email',icon:'mail',type:'email',autoComplete:'email',maxLength:254},
  {key:'trade',icon:'layers'},
];

function ContractorQuote({copy,locale}) {
  const [status,setStatus] = useState('idle');
  const [errors,setErrors] = useState({});
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const input = Object.fromEntries(new FormData(form));
    const showErrors = fields => {
      setErrors(fields);
      setStatus('invalid');
      form.elements.namedItem(Object.keys(fields)[0])?.focus();
    };
    const result = validateContractorQuote(input);
    if (!result.ok) { showErrors(result.errors); return; }
    setErrors({});
    setStatus('sending');
    try {
      const response = await fetch('/api/lead', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...input,campaign:CONTRACTOR_CAMPAIGN,startedAt:startedAt.current}),
      });
      const data = await response.json();
      if (response.ok && data.ok && data.via) { setStatus('sent'); return; }
      if (response.status === 422 && data.errors) { showErrors(data.errors); return; }
      setStatus('failed');
    } catch { setStatus('failed'); }
  }
  return <section id="contractor-quote" className="contractor-section contractor-quote wrap" aria-labelledby="contractor-quote-title">
    {locale==='en' && <div className="dq-left desk-only">
      <span className="dk-pill">GET A CUSTOM QUOTE</span>
      <h2 className="dq-title"><span>Turn Your Work</span><span className="dk-green">Into Leads.<Swash w={360}/></span></h2>
      <p className="dk-sub">Video content that showcases your expertise, builds trust, and helps you get more calls, quotes, and customers.</p>
      <ul className="dq-points">
        <li><span className="dk-tile"><Icon name="video" size={26}/></span><strong>Show Your Work</strong><small>Real projects that get attention.</small></li>
        <li><span className="dk-tile"><Icon name="spark" size={26}/></span><strong>Build Trust</strong><small>Educate, inform, and stand out.</small></li>
        <li><span className="dk-tile"><Icon name="user" size={26}/></span><strong>Get More Leads</strong><small>Turn views into real customer inquiries.</small></li>
      </ul>
    </div>}
    <div className="dq-card">
    <Heading id="contractor-quote-title" label={copy.contact} icon="mail" title={copy.request} accent={copy.free}>{copy.quoteText}</Heading>
    {status === 'sent' ? <p className="contractor-quote-success" role="status"><Icon name="check"/>{copy.sent}</p> :
      <form className="contractor-form" onSubmit={submit} noValidate aria-busy={status === 'sending'}>
        {quoteFields.map(({key,icon,...attributes}, i) => <label key={key} className="contractor-field">
          <span>{copy.fields[i]} <span aria-hidden="true">*</span></span>
          <span className="contractor-field-input">
            <Icon name={icon} size={19}/>
            {key === 'trade'
              ? <select name={key} defaultValue="" required aria-invalid={Boolean(errors[key])}><option value="" disabled>{copy.select}</option>{QUOTE_TRADES.map((name,j) => <option key={name} value={name}>{copy.trades[j]}</option>)}</select>
              : <><input name={key} required placeholder=" " aria-invalid={Boolean(errors[key])} {...attributes}/><span className="field-ph desk-only" aria-hidden="true">{fieldHints[key]}</span></>}
          </span>
        </label>)}
        <label className="contractor-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
        {status === 'invalid' && <p className="contractor-form-error" role="alert">{copy.invalid}</p>}
        {status === 'failed' && <p className="contractor-form-error" role="alert">{copy.failed} <a href={'mailto:' + LEAD_EMAIL}>{LEAD_EMAIL}</a></p>}
        <button className="button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? copy.sending : copy.submit}<Icon name="arrow" size={20}/></button>
      </form>}
    {locale==='en' && <small className="dq-note desk-only">No obligation. We’ll review your request and get back to you shortly.</small>}
    </div>
  </section>;
}

function Production({copy}) {
  return <section className="contractor-process contractor-section" id="production-tools" aria-labelledby="contractor-process-title">
    <div className="wrap">
      <Heading id="contractor-process-title" label={copy.process} icon="spark" title={copy.processTitle} accent={copy.processAccent}>{copy.processText}</Heading>
      <div className="project-journey">
        <article className="journey-card">
          <div className="journey-script"><span>SUMMIT PEAK ROOFING · DEMO</span><strong>What happens when the wind gets under your roof?</strong><p>Show homeowners how storm damage starts — and what to do next.</p><span>VIDEO SCRIPT · EXAMPLE</span></div>
          <div><small>01 · THE IDEA</small><h3>Start with a story</h3><p>We turn a question your customers ask into a clear, engaging script.</p></div>
        </article>
        <article className="journey-card">
          <div className="journey-production"><img src="/brand/montaj-construction-reference.webp" alt="Illustrative Montaj construction editor concept" loading="lazy"/></div>
          <div><small>02 · THE PRODUCTION</small><h3>Bring it to life</h3><p>We build the visuals, voiceover, and edit around your message.</p></div>
        </article>
        <article className="journey-card">
          <div className="journey-finished"><img src={roof.poster} alt="" loading="lazy"/><span><Icon name="play" size={21}/></span></div>
          <div><small>03 · THE FINISHED AD</small><h3>Ready to reach homeowners</h3><p>You receive a finished video ready to share or use in a campaign.</p></div>
        </article>
      </div>
      <div className="contractor-montaj">
        <div>
          <img src="/brand/montaj-mark.png" width="39" height="39" alt="Montaj" loading="lazy"/>
          <h3>{copy.montajTitle}</h3><p>{copy.montajText}</p>
          <a href="https://montaj.ag" target="_blank" rel="noopener noreferrer"><img src="/brand/montaj-mark.png" width="19" height="19" alt="" loading="lazy"/>{copy.montajCredit}<Icon name="diagonal" size={15}/></a>
        </div>
        <div className="montaj-editor-visual" role="img" aria-label={copy.montajAlt}>
          <img src="/brand/montaj-construction-reference.webp" alt="" width="1199" height="1312" loading="lazy"/>
        </div>
      </div>
    </div>
  </section>;
}

export default function ContractorHome({locale, t, Preview, VideoCard, FAQ}) {
  const copy = homeCopy[locale];
  return <div className="contractor-home">
    {locale==='en' && <DesktopHero/>}
    <section className={'contractor-hero wrap'+(locale==='en'?' mob-only':'')} aria-labelledby="contractor-hero-title">
      <div className="contractor-hero-copy">
        <ContractorHeroHeading copy={copy} locale={locale} t={t}/>
        <div className="contractor-hero-benefits" aria-label="Why video works">
          {[
            ['cap','Educates customers','Explain the work and what to expect.'],
            ['check','Builds confidence','Show your process, quality, and care.'],
            ['spark','Makes you the expert','Answer the questions customers already have.'],
            ['video','Keeps attention','Turn complex services into engaging stories.'],
          ].map(([icon,title,detail])=><div key={title}><Icon name={icon} size={22}/><span><strong>{title}</strong><small>{detail}</small></span></div>)}
        </div>
      </div>
      <RoofingAd copy={copy} locale={locale} t={t}/>
    </section>
    <Estimator copy={copy} locale={locale} t={t}/>
    {locale==='en' && <DesktopFunnel/>}
    <TradePortfolio copy={copy} locale={locale} t={t} Preview={Preview}/>
    <ContractorQuote copy={copy} locale={locale}/>
    <div className={'ctn'+(locale==='en'?' mob-only':'')}><ProductionSystem/></div>
    {locale==='en' && <DesktopProduction/>}
    <FAQ items={copy.faq}/>
    {locale==='en' && <DesktopWork/>}
    <div className={locale==='en'?'mob-only':undefined}><MorePortfolio copy={copy} locale={locale} t={t} VideoCard={VideoCard}/></div>
  </div>;
}
