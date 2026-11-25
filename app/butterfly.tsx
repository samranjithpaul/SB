'use client';

import {useEffect, useRef} from 'react';

const between = (low:number, high:number) => low + Math.random() * (high-low);
const perches = [[120,155],[365,116],[653,185],[684,490],[637,813],[326,838],[92,797],[67,454]];

export default function Butterfly() {
  const body = useRef<SVGGElement>(null);
  const shadow = useRef<SVGUseElement>(null);
  const blur = useRef<SVGFEGaussianBlurElement>(null);
  useEffect(() => {
    const bird = body.current;
    if (!bird) return;
    const wings = bird.querySelectorAll('[data-wing]');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = Math.floor(Math.random()*perches.length);
    let [x,y] = perches[index];
    let startX=x, startY=y, endX=x, endY=y;
    let heading=0, elapsed=0, duration=2.2, phase=0, arc=0;
    let resting=true, frame=0, previous=0;
    function depart() {
      startX=x; startY=y;
      index=(index+(Math.random()<.65?1:7))%perches.length;
      endX=perches[index][0]+between(-18,18);
      endY=perches[index][1]+between(-16,16);
      arc=between(-28,28);
      duration=Math.hypot(endX-x,endY-y)/between(68,104);
      resting=false;
    }
    function tick(now:number) {
      const dt=previous?Math.min(.05,(now-previous)/1000):0;
      previous=now; elapsed+=dt;
      if(elapsed>=duration){
        elapsed=0;
        if(resting) depart();
        else {x=endX; y=endY; resting=true; duration=between(1.2,3.8);}
      }
      let spread=.54+.19*Math.sin(phase+=dt*(resting?2:28));
      if(!resting){
        const t=elapsed/duration, u=t*t*(3-2*t);
        const dx=endX-startX, dy=endY-startY, length=Math.hypot(dx,dy);
        const bend=Math.sin(Math.PI*u)*arc+Math.sin(4*Math.PI*u)*8;
        const nextX=startX+dx*u-dy/length*bend, nextY=startY+dy*u+dx/length*bend;
        if(Math.abs(nextX-x)+Math.abs(nextY-y)>.02){
          const target=Math.atan2(nextY-y,nextX-x);
          heading+=Math.atan2(Math.sin(target-heading),Math.cos(target-heading))*Math.min(1,dt*9);
        }
        x=nextX; y=nextY;
        spread=t>.40 && t<.57?.94:.57+.39*Math.sin(phase);
      }
      const lift=resting ? 0 : Math.sin(Math.PI*elapsed/duration);
      shadow.current?.setAttribute('transform',`translate(${x+2+8*lift} ${y+3+12*lift}) rotate(${heading*180/Math.PI})`);
      shadow.current?.setAttribute('opacity',String(.30-.14*lift));
      blur.current?.setAttribute('stdDeviation',String(1.8+3.6*lift));
      bird!.setAttribute('transform',`translate(${x} ${y}) rotate(${heading*180/Math.PI})`);
      bird!.setAttribute('opacity','1');
      wings.forEach(wing=>wing.setAttribute('transform',`scale(${spread} 1)`));
      frame=requestAnimationFrame(tick);
    }
    function resume(){
      cancelAnimationFrame(frame); previous=0;
      if(!document.hidden && !preference.matches) frame=requestAnimationFrame(tick);
    }
    resume();
    document.addEventListener('visibilitychange',resume);
    preference.addEventListener('change',resume);
    return ()=>{cancelAnimationFrame(frame); document.removeEventListener('visibilitychange',resume); preference.removeEventListener('change',resume);};
  },[]);
  return <g className="butterfly" aria-hidden="true" pointerEvents="none">
    <defs>
      <filter id="butterfly-shadow" filterUnits="userSpaceOnUse" x="-85" y="-85" width="170" height="170">
        <feGaussianBlur ref={blur} in="SourceAlpha" result="blurred" stdDeviation="1.8"/>
        <feFlood floodColor="#48362b"/>
        <feComposite in2="blurred" operator="in"/>
      </filter>
      <linearGradient id="wing-color" x2=".9" y2="1"><stop stopColor="#ffda41"/><stop offset=".53" stopColor="#ff8915"/><stop offset="1" stopColor="#e74910"/></linearGradient>
      <g id="wing">
        <path d="M0 0 C2 -5 7 -17 17 -20 Q22 -21 21 -15 Q20 -5 12 1 Q18 4 13 10 Q7 17 3 10 Q0 6 0 0Z" fill="url(#wing-color)" stroke="#33231f" strokeWidth="1.3"/>
        <path d="M16 -20 Q22 -22 21 -15 L19 -10 Q17 -15 12 -16Z" fill="#271c19"/>
        <path d="M1 0 Q9 -8 17 -18 M1 1 Q10 -4 18 -7 M2 2 Q7 0 12 1 M2 3 Q6 6 11 10" fill="none" stroke="#86401d" strokeWidth=".7"/>
        <g fill="#fff7d7"><circle cx="17" cy="-16" r="1.1"/><circle cx="19.5" cy="-14" r=".7"/></g>
      </g>
    </defs>
    <use ref={shadow} href="#butterfly-shape" opacity="0" filter="url(#butterfly-shadow)"/>
    <g ref={body} opacity="0">
      <g id="butterfly-shape" transform="rotate(90) scale(2.07)">
        {[-1,1].map(side=><g key={side} transform={`scale(${side} 1)`}><g data-wing="">
          <use href="#wing"/>
        </g></g>)}
        <ellipse cy="1" rx="1.25" ry="7.5" fill="#493b34"/>
        <path d="M0 -5 Q-1 -9 -4 -11 M0 -5 Q1 -10 4 -12" fill="none" stroke="#493b34" strokeWidth=".75"/>
      </g>
    </g>
  </g>;
}
