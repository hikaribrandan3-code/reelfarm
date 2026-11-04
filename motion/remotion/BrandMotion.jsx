import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
export function BrandMotion(){
 const frame=useCurrentFrame();
 const drift=interpolate(frame,[0,120,240],[-9,9,-9]);
 const scale=interpolate(frame,[0,120,240],[1,1.035,1]);
 return <AbsoluteFill style={{background:'#f4f8ee',fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif',overflow:'hidden',justifyContent:'center',alignItems:'center'}}><div style={{position:'absolute',width:700,height:700,border:'1px solid #e0e9d4',borderRadius:'50%',transform:`translate(${drift*2}px,100px)`}}/><div style={{display:'flex',gap:25,alignItems:'center',transform:`scale(${scale})`}}><svg width="110" height="120" viewBox="0 0 40 44"><path d="M20 39V24C19 15 25 8 38 8c-1 13-8 19-18 16M20 27C6 27 3 20 2 14c13-2 20 2 18 13Z" fill="#77c80b"/><path d="M20 40V26c4-7 9-11 14-14M20 30C16 23 10 20 6 18" fill="none" stroke="#239e15" strokeWidth="2"/></svg><div><div style={{fontSize:64,fontWeight:800,letterSpacing:-4,color:'#182013'}}>ReelFarm</div><div style={{fontSize:19,color:'#7d8d70',marginTop:5,letterSpacing:2}}>GOOD IDEAS. GREAT CONTENT.</div></div></div><div style={{position:'absolute',top:65,left:100,fontSize:40,color:'#a9c782',transform:`translateY(${drift}px)`}}>✦</div><div style={{position:'absolute',bottom:60,right:110,fontSize:25,color:'#a9c782',transform:`translateY(${-drift}px)`}}>✦</div></AbsoluteFill>;
}
