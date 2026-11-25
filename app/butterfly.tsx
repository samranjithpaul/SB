import {randomInt} from 'node:crypto';

export default function Butterfly({landingMs}:{landingMs:number}) {
  // The upper and side margins share the notebook's coordinates. Mirroring
  // the route changes its entrance while keeping the central ink unobstructed.
  const right = randomInt(2) === 1;
  const point = (x:number,y:number) => [right ? 777-x : x,y].join(' ');
  const bend = randomInt(35,97);
  const perch = randomInt(76,128);
  const route = [
    'M'+point(-42,randomInt(110,230)),
    'C'+point(72,52)+' '+point(165,bend)+' '+point(194,144),
    'S'+point(170,227)+' '+point(142,207),
    'S'+point(58,239)+' '+point(67,320),
    'C'+point(74,400)+' '+point(16,440)+' '+point(37,524),
    'S'+point(133,626)+' '+point(91,710),
    'C'+point(44,792)+' '+point(perch-20,811)+' '+point(perch,827)
  ].join(' ');
  const duration = Math.max(1500,landingMs-2200);
  return <g className="butterfly" aria-hidden="true" pointerEvents="none">
    <defs>
      <linearGradient id="wing-color" x2=".9" y2="1"><stop stopColor="#ffda41"/><stop offset=".53" stopColor="#ff8915"/><stop offset="1" stopColor="#e74910"/></linearGradient>
      <g id="wing">
        <path d="M0 0 C2 -5 7 -17 17 -20 Q22 -21 21 -15 Q20 -5 12 1 Q18 4 13 10 Q7 17 3 10 Q0 6 0 0Z" fill="url(#wing-color)" stroke="#33231f" strokeWidth="1.3"/>
        <path d="M16 -20 Q22 -22 21 -15 L19 -10 Q17 -15 12 -16Z" fill="#271c19"/>
        <path d="M1 0 Q9 -8 17 -18 M1 1 Q10 -4 18 -7 M2 2 Q7 0 12 1 M2 3 Q6 6 11 10" fill="none" stroke="#86401d" strokeWidth=".7"/>
        <g fill="#fff7d7"><circle cx="17" cy="-16" r="1.1"/><circle cx="19.5" cy="-14" r=".7"/></g>
      </g>
    </defs>
    <g opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="2.2s" dur=".4s" fill="freeze"/>
      <animateMotion path={route} begin="2.2s" dur={duration+'ms'} rotate="auto" calcMode="spline" keyPoints="0;.2;.4;.7;1" keyTimes="0;.18;.43;.69;1" keySplines=".3 0 .65 1;.32 .1 .55 1;.34 0 .7 1;.2 .3 .4 1" fill="freeze"/>
      <g transform="rotate(90) scale(1.8)">
        {[-1,1].map(side=><g key={side} transform={`scale(${side} 1)`}><g>
          <animateTransform attributeName="transform" type="scale" values=".72 1;.18 .94;1 1;.72 1" keyTimes="0;.36;.8;1" dur=".29s" begin="2.2s" repeatCount={Math.max(1,Math.floor(duration/290))} fill="freeze"/>
          <use href="#wing"/>
        </g></g>)}
        <ellipse cy="1" rx="1.25" ry="7.5" fill="#493b34"/>
        <path d="M0 -5 Q-1 -9 -4 -11 M0 -5 Q1 -10 4 -12" fill="none" stroke="#493b34" strokeWidth=".75"/>
      </g>
    </g>
  </g>;
}
