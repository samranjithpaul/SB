'use client';
import {useEffect,useState,type ReactNode} from 'react';

export default function Sheet({children,back,readyMs}:{children:ReactNode;back:ReactNode;readyMs:number}){
 const [turned,setTurned]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
   const motion=matchMedia('(prefers-reduced-motion: reduce)');
   const unlock=()=>setReady(true);
   const check=()=>{if(motion.matches) unlock();};
   check();
   motion.addEventListener('change',check);
   const timer=setTimeout(unlock,readyMs);
   return ()=>{clearTimeout(timer);motion.removeEventListener('change',check);};
 },[readyMs]);
 return <g className={turned?'sheet turned':'sheet'}>{[children,back].map((face,i)=>{
   const active=Number(turned)===i;
   return <g key={i} className={i?'face reverse':'face front'} aria-hidden={!active}>
     {face}
     <rect transform="translate(-66 200) rotate(-14)" x="-1600" width="2238" height="783"
       fill="transparent" pointerEvents={active&&ready?'all':'none'} role="button"
       aria-label={i?'Return to the FLAMES result':'Read the note on the back'}
       aria-disabled={!ready} tabIndex={active&&ready?0:-1} style={{cursor:ready?'pointer':'default'}}
       onClick={()=>{if(active&&ready)setTurned(!turned);}}
       onKeyDown={event=>{if(active&&ready&&(event.key==='Enter'||event.key===' ')){event.preventDefault();setTurned(!turned);requestAnimationFrame(()=>document.querySelector<SVGRectElement>('.face[aria-hidden="false"] rect[role="button"]')?.focus());}}}/>
   </g>;
 })}</g>;
}
