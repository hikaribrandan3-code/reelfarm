import React,{useEffect,useRef,useState} from 'react';
import {Icon} from './Icons.jsx';
import './production-system.css';

const tools=[['Claude','claude','#d97757',26,21],['ChatGPT','openai','#111',50,12],['Montaj','montaj','#078414',74,21],['YouTube','youtube','#ff0033',12,50],['Meta','meta','#0866ff',88,50],['TikTok','tiktok','#111',26,79],['Perplexity','perplexity','#111',50,88],['Instagram','instagram','#c13584',74,79],['Google Drive','googledrive','#16a765',50,12]];
const steps=[['search','Research','Understand your industry, audience, and the questions your customers ask.'],['mail','Script','Turn research into engaging video concepts and a clear message.'],['video','Produce','Create the visuals, animation, and voiceover that bring your story to life.'],['layers','Edit','Refine pacing, captions, audio, and every finishing detail.'],['share','Deliver','Receive finished videos ready for your business and your channels.']];
export default function ProductionSystem(){
 const [step,setStep]=useState(0),[visible,setVisible]=useState(false);
 const ref=useRef(null);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});observer.observe(ref.current);return()=>observer.disconnect();},[]);
 return <section ref={ref} id="production-tools" className={'production-system '+(visible?'is-running':'')} aria-labelledby="production-title"><div className="production-inner">
  <header><span className="production-badge"><Icon name="layers" size={17}/>OUR PRODUCTION SYSTEM</span><h2 id="production-title">A Complete AI Video<br/>Production System<br/>for <em>Local Businesses.</em></h2><p>From research and scripting to editing and final delivery, we combine professional tools and AI workflows to create videos for your business.</p></header>
  <div className="production-ecosystem" aria-label="ReelFarm production workflow tools">
   <svg viewBox="0 0 100 100" className="production-connections" aria-hidden="true">{tools.map(([name,,color,x,y],i)=><g key={name}><path d={`M 50 50 Q 50 ${y} ${x} ${y}`} pathLength="100"/><path className="production-signal" style={{animationDelay:`${i*-.6}s`}} d={`M 50 50 Q 50 ${y} ${x} ${y}`} pathLength="100"/></g>)}</svg>
   <div className="production-hub production-hub-a" aria-label="ReelFarm video production"><img className="production-film-mark" src="/brand/reelfarm-clapper-transparent.png" alt="ReelFarm clapperboard play logo"/></div>
   {tools.map(([name,asset,color,x,y],i)=><div key={name} className={'production-node'+(asset==='googledrive'?' drive-brand':'')+(asset==='instagram'?' instagram-brand':'')} style={{left:`${x}%`,top:`${y}%`,'--brand':color,'--delay':`${i*-.5}s`}} title={name}><div>{asset==='montaj'?<img src="/brand/montaj-mark.png" alt="" loading="lazy"/>:asset==='googledrive'?<svg className="drive-logo" viewBox="0 0 48 40" aria-label="Google Drive"><path fill="#00832d" d="M15 2h10L10 28H0z"/><path fill="#0066da" d="M10 28h33l-5 9H5z"/><path fill="#ffba00" d="M25 2 48 37H38L15 2z"/><path fill="#2684fc" d="M0 28h10l-5 9H0z"/><path fill="#00ac47" d="M38 28h10l-5 9H38z"/></svg>:asset==='perplexity'?<span className="perplexity-logo" aria-label="Perplexity">✳</span>:<span className="production-brand-symbol" style={{maskImage:`url(/brand/${asset}.svg)`,WebkitMaskImage:`url(/brand/${asset}.svg)`}}/>}<span>{name}</span></div></div>)}
  </div>
  <div className="production-workflow" role="group" aria-label="Production steps">{steps.map(([icon,label],i)=><button key={label} type="button" aria-pressed={step===i} onClick={()=>setStep(i)}><Icon name={icon} size={25}/><strong>{label}</strong><span>0{i+1}</span></button>)}</div>
  <p className="production-description" key={step} aria-live="polite">{steps[step][2]}</p>
  <a className="button production-cta" href="#trade-title">See Our Workflow <Icon name="arrow" size={20}/></a>
 </div></section>;
}
