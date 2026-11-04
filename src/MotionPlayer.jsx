import React, {useEffect, useRef, useState} from 'react';
import {Player} from '@remotion/player';
import {BrandMotion} from '../motion/remotion/BrandMotion.jsx';
export default function MotionPlayer(){
 const ref=useRef(null);const [visible,setVisible]=useState(false);const [reduced,setReduced]=useState(true);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');setReduced(query.matches);const change=()=>setReduced(query.matches);query.addEventListener('change',change);const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.2});if(ref.current)observer.observe(ref.current);return()=>{observer.disconnect();query.removeEventListener('change',change);};},[]);
 return <div ref={ref} aria-label="ReelFarm brand motion"><Player component={BrandMotion} durationInFrames={240} compositionWidth={1000} compositionHeight={420} fps={30} loop autoPlay={visible&&!reduced} initiallyMuted controls showVolumeControls={false} style={{width:'100%'}}/></div>;
}
