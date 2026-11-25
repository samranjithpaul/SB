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
   function play(){void audio.play().catch(()=>{});}
   audio.addEventListener('playing',align);
   window.addEventListener('click',play);
   play();
   return ()=>{audio.removeEventListener('playing',align);window.removeEventListener('click',play);audio.pause();};
 },[]);
 return <audio ref={ref} src="/notebook-loop.mp3" loop preload="auto" />;
}
