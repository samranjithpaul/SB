'use client';
import {useEffect,useRef,useState} from 'react';

export default function Soundtrack({src}:{src:string}){
 const ref=useRef<HTMLAudioElement>(null);
 const [audible,setAudible]=useState(false);
 const toggle=useRef<()=>void>(()=>{});
 useEffect(()=>{
   const audio=ref.current!;
   let started=false;
   function align(){
     if(started)return;
     started=true;
     const time=audio.currentTime*1000;
     for(const animation of document.getAnimations()){
       if(animation instanceof CSSAnimation && ['open','draw','appear'].includes(animation.animationName)){
         animation.currentTime=time;
       }
     }
   }
   let context: AudioContext | undefined;
   let level: GainNode | undefined;
   let muted=false;
   audio.volume=0.562;
   function enableMix(){
     if(!window.AudioContext) return;
     if(!context){
       context=new AudioContext();
       let output: AudioNode=context.createMediaElementSource(audio);
       for(const [frequency,db] of [[150,1.5],[6500,-2.5],[12800,-3]]){
         const band=context.createBiquadFilter();
         band.type='peaking';
         band.frequency.value=frequency;
         band.Q.value=1;
         band.gain.value=db;
         output.connect(band);
         output=band;
       }
       level=context.createGain();
       level.gain.value=muted?0:0.562;
       output.connect(level).connect(context.destination);
       context.addEventListener('statechange',update);
       audio.volume=1;
     }
     if(context.state!=='running' && context.state!=='closed') void context.resume().catch(()=>{});
   }
   function play(){void audio.play().catch(()=>{});}
   function tap(){if(!muted){enableMix();play();}}
   function isAudible(){return !muted && !audio.paused && (!context || context.state==='running');}
   function update(){setAudible(isAudible());}
   toggle.current=()=>{
     muted=isAudible();
     audio.muted=muted;
     if(level && context) level.gain.setValueAtTime(muted?0:0.562,context.currentTime);
     if(!muted) tap();
     update();
   };
   for(const event of ['playing','pause','volumechange']) audio.addEventListener(event,update);
   audio.addEventListener('playing',align);
   audio.addEventListener('playing',enableMix);
   window.addEventListener('click',tap);
   play();
   return ()=>{for(const event of ['playing','pause','volumechange']) audio.removeEventListener(event,update);audio.removeEventListener('playing',align);audio.removeEventListener('playing',enableMix);window.removeEventListener('click',tap);audio.pause();if(context){context.removeEventListener('statechange',update);void context.close();}};
 },[]);
 return <><audio ref={ref} src={src} loop preload="auto" />
   <button type="button" className="sound-toggle" aria-label="Sound" aria-pressed={audible}
     title={audible?'Mute sound':'Turn sound on'} onClick={event=>{event.stopPropagation();toggle.current();}}>
     <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
       <path d="M3.5 9.3 7 9l5-4.3-.2 14.3L7 15l-3.5-.1z"/>
       {audible?<path d="M15 8.4q3.6 3.5 0 7M18 5.6q6 6 0 12.4"/>:<path d="m16 10 4.6 4.4m-.2-4.6L16 14.5"/>}
     </svg>
   </button></>;
}
