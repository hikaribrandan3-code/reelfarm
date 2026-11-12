import React, {createContext, useContext, useEffect, useRef, useState, lazy, Suspense} from 'react';
import {studioCopy} from './studio.js';
import {deliveryCopy} from './delivery.js';
import {plans, planCopy} from './plans.js';
import {videos, categories, categoryMatches, durationLabel, industries} from './content.js';
import {dictionaries, localPath, parsePath} from './i18n.js';
import {Icon, Sprout} from './Icons.jsx';
import {faqCopy} from './faq.js';
import {campaigns, demoCopy} from './demo.js';
import Services,{serviceOptions,serviceLabels} from './Services.jsx';
import ContractorHome from './ContractorHome.jsx';
import LandingPage from './demo/LandingPage.jsx';
export {faqCopy};
import {buildBrief, emailLink, validateBrief, LEAD_EMAIL} from './lead.js';
import {SOCIAL_LINKS, SOCIAL_ICONS, socialLabels} from './socialLinks.js';
import {useDesktopMotion} from './desktop/motion.js';
import {useMobileMotion} from './mobileMotion.js';
import {DeviceLoop, DesktopRelated, ContactDesk} from './desktop/DesktopSections.jsx';
const MotionPlayer = lazy(() => import('./MotionPlayer.jsx'));
const Context = createContext(null);
const useSite = () => useContext(Context);
const categoryIcons = {all:'clapper', comedy:'mask', educational:'cap', editing:'video', visuals:'cube', promotions:'spark', explainers:'layers'};
const productionStatusLabels = {en:'Work in progress',es:'En producción',pt:'Em produção'};

function Link({to='/', children, ...props}) {
  const {locale} = useSite();
  return <a href={localPath(to,locale)} {...props}>{children}</a>;
}
function ButtonLink({to, children, secondary=false, className='', icon='arrow', ...props}) {
  return <Link to={to} className={`button ${secondary?'button-secondary':''} ${className}`} {...props}>{children}{icon && <Icon name={icon} size={18}/>}</Link>;
}
function Logo(){return <Link to="/" className="logo" aria-label="ReelFarm home"><img className="wordmark-icon" src="/brand/favicon.svg?v=play" width="33" height="33" alt=""/><span>ReelFarm<span className="logo-dot">®</span></span></Link>;}
function Header(){
  const {t, locale, route, selected} = useSite();
  const [languages, setLanguages] = useState(false);
  const languageRef=useRef(null);
  const headerRef=useRef(null);
  // Desktop only (>=1051px): the glass pill fades away while scrolling and flows back in when scrolling stops.
  useEffect(()=>{
    const el=headerRef.current;if(!el)return;
    const desk=matchMedia('(min-width:1051px)');const calm=matchMedia('(prefers-reduced-motion: reduce)');
    let timer=0,hidden=false,last=window.scrollY;
    const settle=()=>{hidden=false;el.classList.remove('is-away');el.classList.add('is-back');setTimeout(()=>el.classList.remove('is-back'),1100);};
    const onScroll=()=>{
      el.classList.toggle('is-stuck',window.scrollY>24);
      if(!desk.matches||calm.matches)return;
      const moved=Math.abs(window.scrollY-last);last=window.scrollY;
      if(window.scrollY>140&&moved>2&&!hidden){hidden=true;el.classList.remove('is-back');el.classList.add('is-away');}
      clearTimeout(timer);timer=setTimeout(()=>{if(hidden)settle();},220);
    };
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});
    return()=>{window.removeEventListener('scroll',onScroll);clearTimeout(timer);};
  },[]);
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    if (route !== '/') return;
    const categories = document.querySelector('.contractor-hero');
    const nav = document.querySelector('.mobile-nav');
    if (!categories || !nav) return;
    const update = () => {
      const bottom = parseFloat(getComputedStyle(nav).bottom) || 0;
      const navTop = window.innerHeight - nav.offsetHeight - bottom;
      setPastHero(categories.getBoundingClientRect().bottom + 8 <= navTop);
    };
    update();
    const observer = new IntersectionObserver(update);
    observer.observe(categories);
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [route]);
  useEffect(()=>{const close=e=>{if(!languageRef.current?.contains(e.target))setLanguages(false);};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);},[]);
  return <><a className="skip" href="#main">{t.skip}</a><header className="header" ref={headerRef}><div className="header-inner"><Logo/>
    <nav className="desktop-nav" aria-label="Main"><Link to="/explore" aria-current={route.startsWith('/explore')?'page':undefined}>{t.explore}</Link><Link to="/packages" aria-current={route==='/packages'?'page':undefined}>{t.packages}</Link><Link to="/quote" aria-current={route==='/quote'?'page':undefined}>{t.contact}</Link></nav>
    <div className="header-actions"><a className="montaj-nav-link" href="https://montaj.ag" target="_blank" rel="noopener noreferrer" aria-label={studioCopy[locale].nav} title="Montaj.ag"><img src="/brand/montaj-mark.png" width="24" height="24" alt=""/></a><div className="language-control" ref={languageRef}><button className="language-trigger" onClick={()=>setLanguages(!languages)} aria-expanded={languages} aria-label={`Language: ${locale.toUpperCase()}`}><Icon name="globe" size={19}/><span>{locale.toUpperCase()}</span></button>{languages && <div className="language-menu">{[['en','English'],['es','Español'],['pt','Português (BR)']].map(([code,name])=><a key={code} href={localPath(route,code)+(typeof window!=='undefined'?window.location.search:'')} hrefLang={code} lang={code} onClick={()=>setLanguages(false)} aria-current={locale===code?'true':undefined}>{name}{locale===code&&<Icon name="check" size={16}/>}</a>)}</div>}</div><ButtonLink to="/quote" className="header-quote">{t.quote}</ButtonLink><Link to="/contact" className="mobile-contact icon-button" aria-label={t.contact}><Icon name="chat"/></Link></div>
  </div></header><nav className={route === '/' && !pastHero ? 'mobile-nav mobile-nav-before-hero' : 'mobile-nav'} aria-label="Main">{[['/','home',t.home],['/explore','grid',t.explore],['/packages','layers',t.packages],['/quote','chat',t.quote]].map(([href,icon,label])=><Link key={href} to={href} className={(href==='/'?route==='/':route.startsWith(href))?'active':''} aria-current={(href==='/'?route==='/':route.startsWith(href))?'page':undefined}><span><Icon name={icon}/>{href==='/quote'&&selected.length>0&&<i>{selected.length}</i>}</span><small>{label}</small></Link>)}</nav></>;
}
function Footer(){const {t,locale}=useSite();const en=locale==='en';const year=new Date().getFullYear();return <footer className={'footer'+(en?' footer-has-desk':'')}><div className="footer-top"><div><Logo/><p>{t.footer}</p></div><Link to="/quote" className="footer-invite">{t.request}<Icon name="diagonal" size={30}/></Link></div><div className="footer-credit-row"><a className="montaj-footer-pill" href="https://montaj.ag" target="_blank" rel="noopener noreferrer"><img className="credit-montaj-mark" src="/brand/montaj-mark.png" width="20" height="20" alt="" loading="lazy"/><span className="credit-check"><Icon name="check" size={12}/></span><span>{en?<>Edited with <strong>Montaj</strong></>:<>Sponsored &amp; Created with <strong>Montaj.ag</strong></>}</span><Icon name="diagonal" size={12}/></a></div><div className="footer-bottom"><small>© {new Date().getFullYear()} ReelFarm. {t.footerNote}</small><div><Link to="/contact">{t.contact}</Link><Link to="/privacy">{t.privacy}</Link><a href={`mailto:${LEAD_EMAIL}`} aria-label={t.emailUs}><Icon name="mail" size={17}/></a></div></div>{en&&<div className="footer-desk">
 <div className="fd-grid">
  <div className="fd-brand"><Logo/><p>AI video production for contractors and local businesses. Educational videos, commercials, and content that turns viewers into leads.</p></div>
  <nav className="fd-col fd-services" aria-labelledby="fd-services"><h2 id="fd-services">Services</h2><ul><li><Link to="/packages"><Icon name="video" size={22}/>Video Content Production</Link></li><li><Link to="/packages"><Icon name="layers" size={22}/>Landing Pages &amp; Lead Gen</Link></li><li><Link to="/explore"><Icon name="spark" size={22}/>Commercials &amp; Ad Content</Link></li><li><Link to="/explore"><Icon name="cube" size={22}/>3D &amp; Technical Explainers</Link></li></ul></nav>
  <nav className="fd-col" aria-labelledby="fd-explore"><h2 id="fd-explore">Explore</h2><ul><li><Link to="/">Home</Link></li><li><Link to="/explore">Video Library</Link></li><li><Link to="/packages">Services</Link></li><li><Link to="/contact">Contact</Link></li></ul></nav>
  <div className="fd-col fd-touch"><h2>Get in Touch</h2><ul><li><a href={`mailto:${LEAD_EMAIL}`}><Icon name="mail" size={22}/>{LEAD_EMAIL}</a></li></ul><Link className="dk-btn dk-btn-primary" to="/quote">Get a Free Quote<Icon name="arrow" size={20}/></Link></div>
 </div>
 <div className="fd-bottom"><small>© {year} ReelFarm. All rights reserved.</small><Link to="/privacy">Privacy Policy</Link>
  <ul className="fd-social" aria-label={socialLabels.group[locale]||socialLabels.group.en}>{SOCIAL_ICONS.map(({name,asset,color})=>{const href=SOCIAL_LINKS.find(l=>l.name===name)?.href;if(!href)return null;const glyph=<span aria-hidden="true" className={'dk-mask'+(color==='ig'?' dk-ig':'')} style={{'--brand':color==='ig'?undefined:color,maskImage:`url(/brand/${asset}.svg)`,WebkitMaskImage:`url(/brand/${asset}.svg)`}}/>;return <li key={name}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={(socialLabels.link[locale]||socialLabels.link.en)(name)}>{glyph}</a></li>;})}</ul></div>
</div>}</footer>;}

function Preview({video, enabled=true, eager=false, className='', paused=false}){
  const ref=useRef(null);const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const data=Boolean(navigator.connection?.saveData);
    if(!enabled||reduced.matches||data)return;
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'20px',threshold:.15});
    if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();
  },[enabled]);
  useEffect(()=>{const el=ref.current?.querySelector('video');if(!el)return;const update=()=>{if(document.hidden||paused||!enabled||!visible)el.pause();else el.play().catch(()=>{});};update();document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[visible,enabled,paused]);
  return <div ref={ref} className={`preview ${className}`}><img src={video.poster} srcSet={`/media/${video.id}.small.webp 300w, ${video.poster} 600w`} sizes={eager?"240px":"(max-width: 760px) 45vw, 280px"} alt="" width="600" height="1067" loading={eager?'eager':'lazy'} fetchPriority={eager?'high':undefined}/>{visible&&<video src={`/media/${video.id}.preview.mp4`} poster={video.poster} autoPlay loop muted playsInline preload="none" aria-hidden="true"/>}</div>;
}
function VideoCard({video,animate=false,duplicate=false,paused=false}){
  const {t,locale,selected,toggleStyle,route}=useSite();const saved=selected.includes(video.id);
  return <article className="video-card"><div className="video-card-media"><Link to={`/explore/${video.slug}`} className="video-card-link" tabIndex={duplicate?-1:undefined} aria-label={`${t.watch}: ${video.title[locale]}`}><Preview video={video} enabled={animate} paused={paused}/><div className="card-shade"/>{video.productionStatus==='in-progress'&&<span className="production-status">{productionStatusLabels[locale]}</span>}{route==='/explore'&&<><span className="card-illustrative-label">{deliveryCopy[locale].feed}</span><div className="card-social-rail" aria-hidden="true"><span><Icon name="heart" size={17}/><small>128</small></span><span><Icon name="chat" size={17}/></span><span><Icon name="share" size={17}/></span></div><span className="card-sample-views">{deliveryCopy[locale].views}</span></>}<span className="video-play"><Icon name="play" size={15}/></span><span className="duration">{durationLabel(video.duration)}</span><span className="card-category">{t.categories[video.category]}</span></Link><button className={`save-button ${saved?'saved':''}`} onClick={()=>toggleStyle(video.id)} aria-label={`${saved?t.saved:t.save}: ${video.title[locale]}`} aria-pressed={saved} tabIndex={duplicate?-1:undefined}><Icon name={saved?'check':'plus'} size={17}/></button></div><Link to={`/explore/${video.slug}`} className="card-title" tabIndex={duplicate?-1:undefined}>{video.title[locale]}<Icon name="diagonal" size={14}/></Link><p>{video.language} <span>·</span> {t.categories[video.category]}</p>{video.landing&&<a className="demo-link" href={video.landing.path} target="_blank" rel="noopener" tabIndex={duplicate?-1:undefined}>{demoCopy[locale].cta}<Icon name="diagonal" size={13}/></a>}</article>;
}
function FAQ({items}={}){const {locale}=useSite();const faq={...faqCopy[locale],items:items||faqCopy[locale].items};const item=([q,a])=><details key={q}><summary>{q}<Icon name="plus" size={19}/></summary><p>{a}</p></details>;return <section className="faq wrap"><div><span className="eyebrow">{faq.label}</span><h2>{faq.title}</h2></div><div className="faq-items">{faq.items.slice(0,4).map(item)}{faq.items.length>4&&<details className="faq-more"><summary>{studioCopy[locale].more}<Icon name="arrow" size={17}/></summary><div className="faq-extra">{faq.items.slice(4).map(item)}</div></details>}</div></section>;}
function Explore(){
 const {t,search}=useSite();const params=new URLSearchParams(search);const category=categories.includes(params.get('category'))?params.get('category'):'all';const query=params.get('q')||'';
 const [term,setTerm]=useState(query);
 useEffect(()=>setTerm(query),[query]);
 const filtered=videos.filter(v=>!['google-ranking','how-lego-bricks-are-made'].includes(v.id)&&categoryMatches(v,category)&&[...Object.values(v.title),...Object.values(v.description),v.category,...v.tags,v.language,v.industry].join(' ').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').includes(query.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'')));
 const {navigate,locale}=useSite();
 const setFilter=(c,q)=>navigate(localPath(`/explore?${new URLSearchParams({...c!=='all'?{category:c}:{},...q?{q}:{}})}`,locale));
 return <section className="explore-page wrap page"><div className="page-heading explore-heading"><span className="eyebrow">REELFARM / {t.explore.toUpperCase()}</span><h1>{t.exploreTitle}<br/><em>{t.exploreAccent}</em></h1><p>{t.exploreSubtitle}</p></div><form className="search-form" onSubmit={e=>{e.preventDefault();setFilter(category,term.trim());}}><Icon name="search" size={20}/><input name="q" type="search" placeholder={t.search} aria-label={t.search} value={term} onChange={e=>{setTerm(e.target.value);if(!e.target.value)setFilter(category,'');}}/><button type="submit" aria-label={t.search}><Icon name="arrow" size={19}/></button></form><div className="filter-row" role="group" aria-label={t.explore}>{categories.map(c=><button key={c} onClick={()=>setFilter(c,term.trim())} className={category===c?'active':''} aria-pressed={category===c}>{t.categories[c]}</button>)}</div><div className="gallery-topline"><span>{filtered.length} {filtered.length===1?(locale==='en'?'video':locale==='es'?'video':'vídeo'):t.results}</span><span>{t.reelNote}</span></div><div className="video-grid">{filtered.map(v=><VideoCard video={v} key={v.id}/>)}</div>{!filtered.length&&<div className="empty"><Icon name="search" size={32}/><h2>{t.empty}</h2><p>{t.emptyText}</p><button className="button" onClick={()=>setFilter('all','')}>{t.reset}</button></div>}<SelectionBar/></section>;
}
function SelectionBar(){const {selected,t,clearStyles}=useSite();if(!selected.length)return null;return <div className="selection-bar"><div className="selection-stack">{selected.slice(0,3).map(id=><img key={id} src={videos.find(v=>v.id===id)?.poster} alt="" width="34" height="44"/>)}</div><span>{selected.length} {selected.length===1?t.selectedOne:t.selection}</span><button className="selection-clear" onClick={clearStyles}>{t.clear}</button><ButtonLink to="/quote">{t.useStyles}</ButtonLink></div>;}
function DetailPlayer({video}){const {t,locale}=useSite();const ref=useRef(null);const [started,setStarted]=useState(false);return <div className="detail-player" style={{'--poster':`url(${video.poster})`}}><video ref={ref} src={video.video} poster={video.poster} controls playsInline preload="none" aria-label={video.title[locale]} onPlaying={()=>setStarted(true)}/>{!started&&<button className="detail-watch button" onClick={()=>ref.current?.play().catch(()=>{})}><Icon name="play" size={17}/>{t.soundOn}</button>}</div>;}
// Phones/tablets only: a "make something like this" button pins above the nav once the player and the main button have scrolled away.
function DetailPin({video}){
 const {t}=useSite();const [on,setOn]=useState(false);
 useEffect(()=>{
  const a=document.querySelector('.detail-player'),b=document.querySelector('.detail-cta');
  if(!a||!b||!matchMedia('(max-width:1050px)').matches)return;
  const seen={a:true,b:false};const upd=()=>setOn(!seen.a&&!seen.b);
  const ia=new IntersectionObserver(([e])=>{seen.a=e.isIntersecting;upd();}),ib=new IntersectionObserver(([e])=>{seen.b=e.isIntersecting;upd();});
  ia.observe(a);ib.observe(b);return()=>{ia.disconnect();ib.disconnect();};
 },[]);
 return <ButtonLink to={`/quote?reference=${video.id}`} className={'detail-pin'+(on?' is-on':'')} aria-hidden={!on} tabIndex={on?0:-1}>{t.likeThis}</ButtonLink>;
}
function VideoDetail({video}){
 const {t,locale,selected,toggleStyle,route}=useSite();const saved=selected.includes(video.id);return <section className="detail-page wrap page"><Link to="/explore" className="back-link"><Icon name="arrow" size={17}/>{t.back}</Link><div className="detail-layout"><DetailPlayer video={video}/><div className="detail-info"><span className="eyebrow">{t.concept}</span><h1>{video.title[locale]}</h1>{video.productionStatus==='in-progress'&&<p className="production-status-note">{productionStatusLabels[locale]}</p>}<p className="detail-description">{video.description[locale]}</p><div className="detail-tags"><span>{t.categories[video.category]}</span>{video.tags.slice(0,3).map(tag=><span key={tag}>{tag}</span>)}</div><div className="creative-details"><span className="eyebrow">{t.details}</span><dl><div><dt>{t.format}</dt><dd>{t.vertical}</dd></div><div><dt>{t.language}</dt><dd>{video.language}</dd></div><div><dt>{t.watch}</dt><dd>{durationLabel(video.duration)}</dd></div></dl></div>{video.landing&&<a className="demo-callout" href={video.landing.path} target="_blank" rel="noopener"><span><strong>{demoCopy[locale].detailTitle}<Icon name="arrow" size={17}/></strong><small>{demoCopy[locale].detailText}</small></span></a>}<ButtonLink to={`/quote?reference=${video.id}`} className="detail-cta">{t.likeThis}</ButtonLink><button className={`button button-secondary save-detail ${saved?'is-saved':''}`} onClick={()=>toggleStyle(video.id)} aria-pressed={saved}><Icon name={saved?'check':'bookmark'} size={17}/>{saved?t.saved:t.save}</button></div></div><div className="related"><div className="section-heading"><h2>{t.related}</h2><Link to="/explore" className="text-link">{t.seeAll}<Icon name="arrow" size={18}/></Link></div><div className="video-grid">{videos.filter(v=>v.id!==video.id).sort((a,b)=>Number(b.category===video.category)-Number(a.category===video.category)).slice(0,4).map(v=><VideoCard key={v.id} video={v}/>)}</div><DesktopRelated video={video}/></div><DetailPin video={video}/></section>;
}
function Packages(){const {locale}=useSite();return <Services locale={locale} Link={Link}/>;}

function Field({label,optional,error,children}){const {t}=useSite();return <div className={`field ${error?'has-error':''}`}><label>{label}{optional&&<span>{t.optional}</span>}{children}</label>{error&&<span className="field-error" role="alert">{t[error]}</span>}</div>;}
function Quote(){
 const {t,locale,selected,toggleStyle,search}=useSite();const params=new URLSearchParams(search);const plan=['Starter','Content','Growth','Creator'].includes(params.get('package'))?params.get('package'):'';const reference=params.get('reference');
 const [values,setValues]=useState({name:'',email:'',business:'',website:'',industry:'',formats:[],package:plan,service:serviceOptions.includes(params.get('service'))?params.get('service'):(plan?serviceOptions[0]:serviceOptions[3]),frequency:'',languages:[],project:'',companyUrl:''});
 const [errors,setErrors]=useState({});const [prepared,setPrepared]=useState(null);const [copied,setCopied]=useState(false);const [removedReference,setRemovedReference]=useState(false);const resultRef=useRef(null);
 const references=videos.filter(v=>selected.includes(v.id)||(!removedReference&&v.id===reference));
 const set=(key,value)=>setValues(v=>({...v,[key]:value}));
 const toggle=(key,value)=>setValues(v=>({...v,[key]:v[key].includes(value)?v[key].filter(i=>i!==value):[...v[key],value]}));
 const submit=e=>{e.preventDefault();if(values.companyUrl)return;const found=validateBrief(values);setErrors(found);if(Object.keys(found).length){requestAnimationFrame(()=>document.querySelector('.has-error input')?.focus());return;}const body=buildBrief(values,references,window.location.href);const subject=`${t.emailSubject} — ${values.business||values.name}`;const href=emailLink(subject,body);setPrepared({body,href});window.location.href=href;requestAnimationFrame(()=>{resultRef.current?.scrollIntoView({behavior:'smooth',block:'center'});resultRef.current?.focus();});};
 const copy=async()=>{try{await navigator.clipboard.writeText(prepared.body);setCopied(true);}catch{const area=document.querySelector('.brief-fallback');area?.focus();area?.select();}};
 return <section className="quote-page wrap page"><div className="quote-layout"><div className="quote-intro"><span className="eyebrow">{t.quoteEyebrow}</span><h1>{t.quoteTitle}<br/><em>{t.quoteAccent}</em></h1><p>{t.quoteSubtitle}</p><div className="quote-devices desk-only"><DeviceLoop/></div><div className="quote-inspiration"><div className="quote-stills">{videos.slice(0,3).map(v=><img src={v.poster} key={v.id} alt="" width="600" height="1067" loading="lazy"/>)}</div><span><Icon name="check" size={16}/>{t.doneForYou}</span></div><a href={`mailto:${LEAD_EMAIL}`} className="quote-email"><Icon name="mail" size={17}/>{LEAD_EMAIL}</a></div>
 {prepared?<div className="prepared-card" tabIndex={-1} ref={resultRef}><span className="prepared-icon"><Icon name="mail" size={29}/></span><h2>{t.prepared}</h2><p>{t.preparedText}</p><div className="sent-status"><span className="live-dot"/>{t.notSent}</div><a className="button" href={prepared.href}>{t.openEmail}<Icon name="diagonal" size={18}/></a><button className="button button-secondary" onClick={copy}>{copied?t.copied:t.copy}</button><p className="copy-hint">{t.copyHint}<br/><a href={`mailto:${LEAD_EMAIL}`}>{LEAD_EMAIL}</a></p><details><summary>{t.copy}</summary><textarea className="brief-fallback" readOnly value={prepared.body} aria-label={t.copy}/></details><button className="text-link edit-brief" onClick={()=>setPrepared(null)}>{t.editBrief}</button></div>:
 <form className="quote-form" onSubmit={submit} noValidate>
  <h2>{t.formAbout}</h2>
  <div className="quote-progress desk-only" role="status"><i style={{width:(([values.name.trim(),values.email.trim()].filter(Boolean).length)/2*100)+'%'}}/><span>{[values.name.trim(),values.email.trim()].filter(Boolean).length} of 2 required fields</span></div>
  <div className="form-row">
    <Field label={t.name} error={errors.name}><input name="name" autoComplete="name" maxLength={100} required placeholder={t.namePlaceholder} value={values.name} onChange={e=>set('name',e.target.value)} aria-invalid={Boolean(errors.name)}/></Field>
    <Field label={t.email} error={errors.email}><input name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@yourbrand.com" value={values.email} onChange={e=>set('email',e.target.value)} aria-invalid={Boolean(errors.email)}/></Field>
  </div>
  <Field label={locale==='en'?'Service':locale==='es'?'Servicio':'Serviço'}><select name="service" value={values.service} onChange={e=>setValues(v=>({...v,service:e.target.value,package:e.target.value===serviceOptions[0]?v.package:''}))}>{serviceOptions.map((v,i)=><option key={v} value={v}>{serviceLabels[locale][i]}</option>)}</select></Field>
  <Field label={t.package} optional><select name="package" value={values.package} onChange={e=>setValues(v=>({...v,package:e.target.value,service:e.target.value?serviceOptions[0]:v.service}))}><option value="">{t.unsure}</option>{['Starter','Content','Growth','Creator'].map(p=><option key={p} value={p}>{p==='Creator'?'Creator / Custom':p}</option>)}</select></Field>
  <details className="quote-optional-details"><summary>{locale==='es'?'Añadir detalles del proyecto (opcional)':locale==='pt'?'Adicionar detalhes do projeto (opcional)':'Add project details'}<Icon name="plus" size={16}/></summary>
    <div className="quote-optional-content">
      <Field label={t.business} optional><input name="business" autoComplete="organization" maxLength={150} placeholder={t.businessPlaceholder} value={values.business} onChange={e=>set('business',e.target.value)}/></Field>
      <div className="form-row"><Field label={t.website} optional><input name="website" type="text" maxLength={300} placeholder={t.websitePlaceholder} value={values.website} onChange={e=>set('website',e.target.value)}/></Field><Field label={t.industry} optional><select name="industry" value={values.industry} onChange={e=>set('industry',e.target.value)}><option value="">{t.chooseIndustry}</option>{industries.map((v,i)=><option value={v} key={v}>{t.industryLabels[i]}</option>)}</select></Field></div>
      <Field label={t.frequency} optional><select name="frequency" value={values.frequency} onChange={e=>set('frequency',e.target.value)}><option value="">{t.unsure}</option>{dictionaries.en.frequencies.slice(0,4).map((v,i)=><option key={v} value={v}>{t.frequencies[i]}</option>)}</select></Field>
      <fieldset className="choice-field"><legend>{t.formats}</legend><div className="checkbox-grid">{dictionaries.en.formatOptions.map((value,i)=><label key={value} className={values.formats.includes(value)?'checked':''}><input type="checkbox" checked={values.formats.includes(value)} onChange={()=>toggle('formats',value)}/><Icon name={['mask','cap','spark','video','cube','layers'][i]} size={19}/><span>{t.formatOptions[i]}</span><i><Icon name="check" size={11}/></i></label>)}</div></fieldset>
      <fieldset className="choice-field"><legend>{t.preferredLanguage}</legend><div className="language-options">{dictionaries.en.languageOptions.map((v,i)=><label key={v} className={values.languages.includes(v)?'checked':''}><input type="checkbox" checked={values.languages.includes(v)} onChange={()=>toggle('languages',v)}/>{t.languageOptions[i]}</label>)}</div></fieldset>
      <Field label={t.project} optional><textarea name="project" maxLength={4000} rows={3} placeholder={t.projectPlaceholder} value={values.project} onChange={e=>set('project',e.target.value)}/></Field>
    </div>
  </details>
  {references.length>0&&<div className="references"><h3>{t.references}</h3>{references.map(v=><div key={v.id}><img src={v.poster} width="34" height="48" alt=""/><span>{v.title[parsePath(typeof window!=='undefined'?window.location.pathname:'/').locale]}</span><button type="button" className="icon-button" aria-label={`${t.remove}: ${v.title.en}`} onClick={()=>{if(selected.includes(v.id))toggleStyle(v.id);if(v.id===reference)setRemovedReference(true);}}><Icon name="close" size={16}/></button></div>)}</div>}
  <div className="honeypot" aria-hidden="true"><label>Company URL<input name="company_url" tabIndex={-1} autoComplete="off" value={values.companyUrl} onChange={e=>set('companyUrl',e.target.value)}/></label></div>
  <p className="manual-note"><Icon name="mail" size={17}/>{t.manualNote}</p><button type="submit" className="button form-submit">{t.send}<Icon name="arrow" size={18}/></button><p className="consent">{t.consent} <Link to="/privacy">{t.privacy}<Icon name="diagonal" size={11}/></Link></p>
</form>}
 </div></section>;
}
function HydratedMotion(){const [mounted,setMounted]=useState(false);useEffect(()=>setMounted(true),[]);return mounted?<Suspense fallback={<Sprout size={40}/>}><MotionPlayer/></Suspense>:<div style={{height:180,display:'grid',placeItems:'center'}}><Sprout size={40}/></div>;}
// Phones/tablets only (hidden >= 1051px by CSS): what happens after you reach out.
function ContactSteps(){return <section className="mb-steps" aria-label="What happens next"><span className="eyebrow">WHAT HAPPENS NEXT</span><ol><li><b>1</b><div><strong>You tell us what you need</strong><p>A few lines about your business and the videos you have in mind.</p></div></li><li><b>2</b><div><strong>We review it</strong><p>We talk through the project with you before anything starts.</p></div></li><li><b>3</b><div><strong>We plan the next step</strong><p>You get a clear plan and quote. No obligation.</p></div></li></ol></section>;}
function Contact(){const {t}=useSite();return <section className="contact-page wrap page"><div className="contact-orb"><Sprout size={65}/><img className="contact-clapper desk-only" src="/brand/reelfarm-clapper-transparent.png" alt="" width="64" height="64"/></div><span className="eyebrow">{t.contactEyebrow}</span><h1>{t.contactTitle}<br/><em>{t.contactAccent}</em></h1><p>{t.contactText}</p><div className="contact-actions"><ButtonLink to="/quote">{t.quote}</ButtonLink><a className="button button-secondary" href={`mailto:${LEAD_EMAIL}`}>{t.emailUs}<Icon name="mail" size={17}/></a></div><a className="contact-address" href={`mailto:${LEAD_EMAIL}`}>{LEAD_EMAIL}</a><div className="contact-motion"><HydratedMotion/></div><ContactSteps/><ContactDesk/></section>;}
function Privacy(){const {t}=useSite();return <section className="privacy-page wrap page"><span className="eyebrow">REELFARM / {t.privacy.toUpperCase()}</span><h1>{t.privacyTitle}</h1><p className="privacy-intro">{t.privacyIntro}</p>{t.privacySections.map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}</section>;}
function NotFound(){const {t}=useSite();return <section className="not-found wrap page"><Sprout size={60}/><h1>{t.notFound}</h1><p>{t.notFoundText}</p><ButtonLink to="/explore">{t.exploreVideos}</ButtonLink></section>;}

export default function App({initialPath='/',initialSearch=''}){
 const [location,setLocation]=useState({path:initialPath,search:initialSearch});const {locale,route}=parsePath(location.path);const t=dictionaries[locale];const [selected,setSelected]=useState([]);
 const navigate=url=>{const target=new URL(url,window.location.origin);const oldPath=window.location.pathname;if(target.pathname!==window.location.pathname||target.search!==window.location.search){window.history.pushState({},'',target.pathname+target.search);setLocation({path:target.pathname,search:target.search});if(target.pathname!==oldPath)window.scrollTo({top:0,behavior:'instant'});}};
 useEffect(()=>{const update=()=>setLocation({path:window.location.pathname,search:window.location.search});update();window.addEventListener('popstate',update);const click=e=>{const a=e.target.closest?.('a');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0||a.target||a.hasAttribute('download')||a.hasAttribute('data-full-navigation'))return;const href=new URL(a.href,window.location.href);if(href.origin!==window.location.origin||href.hash||!['http:','https:'].includes(href.protocol))return;e.preventDefault();navigate(href.href);};document.addEventListener('click',click);try{const stored=JSON.parse(sessionStorage.getItem('reelfarm-styles')||'[]');if(Array.isArray(stored))setSelected(stored.filter(id=>videos.some(v=>v.id===id)));}catch{}return()=>{window.removeEventListener('popstate',update);document.removeEventListener('click',click);};},[]);
 useEffect(()=>{if(campaigns[route])return;document.documentElement.lang=locale==='pt'?'pt-BR':locale;try{localStorage.setItem('reelfarm-language',locale);}catch{}const pageName=route==='/'?t.heroA:route.startsWith('/explore/')?videos.find(v=>route===`/explore/${v.slug}`)?.title[locale]:({'/explore':t.explore,'/packages':t.packages,'/quote':t.quote,'/contact':t.contact,'/privacy':t.privacy})[route];document.title=`${pageName||'ReelFarm'} | ReelFarm`;let canonical=document.querySelector('link[rel=canonical]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}canonical.href=window.location.origin+location.path;
import('./seo.js').then(({getSEO})=>{const meta=getSEO(locale,route,window.location.origin);document.title=meta.title;for(const [selector,attribute,value] of [['meta[name=description]','content',meta.description],['meta[property=\"og:title\"]','content',meta.title],['meta[property=\"og:description\"]','content',meta.description],['meta[property=\"og:url\"]','content',canonical.href],['meta[property=\"og:image\"]','content',window.location.origin+(meta.video?.poster||'/brand/reelfarm-logo.webp')]]){let el=document.querySelector(selector);if(el)el.setAttribute(attribute,value);}document.querySelectorAll('script[type=\"application/ld+json\"]').forEach(el=>el.remove());for(const data of meta.structured){const el=document.createElement('script');el.type='application/ld+json';el.textContent=JSON.stringify(data);document.head.append(el);}document.querySelectorAll('link[rel=alternate]').forEach(el=>el.remove());for(const code of ['en','es','pt']){const el=document.createElement('link');el.rel='alternate';el.hreflang=code==='pt'?'pt-BR':code;el.href=window.location.origin+localPath(route,code);document.head.append(el);}});},[locale,route]);
 useEffect(() => {
   if (route !== '/') return;
   const restore = () => {
     try {
       const saved = JSON.parse(sessionStorage.getItem('reelfarm-demo-return') || 'null');
       if (!saved || saved.home !== window.location.pathname) return;
       sessionStorage.removeItem('reelfarm-demo-return');
       const fromDemo = document.referrer && new URL(document.referrer).pathname === '/demo/roofing';
       if (fromDemo || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') {
         requestAnimationFrame(() => window.scrollTo({top:saved.y,behavior:'instant'}));
       }
     } catch {}
   };
   restore();
   window.addEventListener('pageshow', restore);
   return () => window.removeEventListener('pageshow', restore);
 }, [route]);
 const toggleStyle=id=>setSelected(list=>{const next=list.includes(id)?list.filter(v=>v!==id):[...list,id];try{sessionStorage.setItem('reelfarm-styles',JSON.stringify(next));}catch{}return next;});const clearStyles=()=>{setSelected([]);try{sessionStorage.removeItem('reelfarm-styles');}catch{}};
 useDesktopMotion(true,locale+route+location.search);
 useMobileMotion(locale+route+location.search);
 let page;if(route==='/')page=<ContractorHome {...{locale,t,Preview,VideoCard,FAQ}}/>;else if(route==='/explore')page=<Explore/>;else if(route.startsWith('/explore/')){const video=videos.find(v=>route===`/explore/${v.slug}`);page=video?<VideoDetail video={video} key={video.id}/>:<NotFound/>;}else if(route==='/packages')page=<Packages/>;else if(route==='/quote')page=<Quote key={location.path+location.search}/>;else if(route==='/contact')page=<Contact/>;else if(route==='/privacy')page=<Privacy/>;else page=<NotFound/>;
 const demo=campaigns[route];if(demo)return <LandingPage config={demo.config} preview={new URLSearchParams(location.search).get('preview')==='1'}/>;
 return <Context.Provider value={{t,locale,route,search:location.search,selected,toggleStyle,clearStyles,navigate}}><Header/><main id="main">{page}</main><Footer/></Context.Provider>;
}
