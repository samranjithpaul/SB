'use client';
import {useEffect,useRef} from 'react';

export default function Soundtrack(){
 const ref=useRef<HTMLAudioElement>(null);
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
       const level=context.createGain();
       level.gain.value=0.562;
       output.connect(level).connect(context.destination);
       audio.volume=1;
     }
     if(context.state==='suspended') void context.resume().catch(()=>{});
   }
   function play(){void audio.play().catch(()=>{});}
   function tap(){enableMix();play();}
   audio.addEventListener('playing',align);
   audio.addEventListener('playing',enableMix);
   window.addEventListener('click',tap);
   play();
   return ()=>{audio.removeEventListener('playing',align);audio.removeEventListener('playing',enableMix);window.removeEventListener('click',tap);audio.pause();if(context) void context.close();};
 },[]);
 return <audio ref={ref} src="/notebook-loop.mp3" loop preload="auto" />;
}
