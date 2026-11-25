import Soundtrack from './soundtrack';
import Butterfly from './butterfly';
import {game} from '../lib/game';
import {notebookDate} from '../lib/date';
import {glyph} from '../lib/glyph';
import type {CSSProperties,ReactNode} from 'react';
export const dynamic='force-dynamic';
export default function Page(){
 const dateLabel = 'Date : ' + notebookDate(process.env.NOTEBOOK_DATE);
 const names=[process.env.MALE_NAME??'SAM RANJITH PAUL S',process.env.FEMALE_NAME??'BINUSHA B','FLAMES'];
 const {pairs,count,order,winner}=game(names[0],names[1]);
 const centers=[[338,370],[370,473],[403,661]];
 const rows=names.map((name,r)=>{
   const chars=Array.from(name);
   const widths=chars.map(c=>c===' '?13:r===2?34:c==='I'?16:25);
   const width=widths.reduce((a,b)=>a+b,0);
   const scale=Math.min(r===2?2:1.65,(r===2?388:468)/width);
   let x=-width/2;
   return chars.map((c,i)=>{
     const offset=x; x+=widths[i];
     return {c,transform:`translate(${centers[r].join(' ')}) rotate(-14) scale(${scale}) translate(${offset} ${-20+Math.sin(i)*1.3}) rotate(${2*Math.sin(i*2)} 10 20)`};
   });
 });
 const ink:ReactNode[]=[];
 // Estimated transient grid in the supplied loop, in milliseconds.
 const song = process.env.NOTEBOOK_SONG?.trim() || '/notebook-loop.mp3';
 const bpm = Number(process.env.SONG_BPM?.trim() || 142.65);
 const offset = Number(process.env.SONG_BEAT_OFFSET_MS?.trim() || 227);
 if (!Number.isFinite(bpm) || bpm <= 0 || !Number.isFinite(offset) || offset < 0) {
   throw Error('Set SONG_BPM to a positive tempo and SONG_BEAT_OFFSET_MS to a nonnegative millisecond value.');
 }
 const beat=60000/bpm;
 const cue=(time:number)=>offset+Math.ceil((time-offset)/beat)*beat;
 let clock=cue(1850);
 const timing=(duration:number)=>{
   const style={'--delay':clock+'ms','--duration':duration+'ms'} as CSSProperties;
   clock+=duration;
   return style;
 };
 function stroke(d:string,transform:string,duration:number,heart=false){
   ink.push(<path key={ink.length} className="stroke" pathLength="1" d={d} transform={transform}
     fill="none" stroke={heart?'#ba5058':'#383245'} strokeWidth={heart?1.65:1.55}
     strokeLinecap="round" strokeLinejoin="round" style={timing(duration)}/>);
 }
 for(const r of [2,0,1]){
   for(const {c,transform} of rows[r]){
     if(c===' '){clock+=145;continue;}
     if(glyph[c]) for(const d of glyph[c].split('|')) stroke(d,transform,r===2?155:200);
     else ink.push(<text key={ink.length} className="fade" transform={transform} y="38" fontFamily="cursive" fontSize="39" textLength="20" lengthAdjust="spacingAndGlyphs" style={timing(230)}>{c}</text>);
   }
   clock=cue(clock+400);
 }
 function strike(row:number,i:number){
   stroke('M16 -5 Q13 14 4 46',rows[row][i].transform,445);
 }
 for(const [i,j] of pairs){strike(0,i);clock=cue(clock+100);strike(1,j);clock=cue(clock+100); }
 order.forEach((i,round)=>{
   if(round>0) clock=cue(clock+200);
   strike(2,i);
 });
 if(winner!==null){
   clock=cue(clock+1000);
   stroke('M13 50 C3 37 -11 23 -10 8 C-9 -6 3 -9 11 4 C18 -12 32 -8 31 7 C30 23 20 37 11 46 L14 51',rows[2][winner].transform,4*beat,true);
   // A second pass of the nib leaves a little more pigment at the crossing.
   ink.push(<path key="heart-ink-overlap" className="fade" d="M11.9 47.6 L13.1 49.6"
     transform={rows[2][winner].transform} fill="none" stroke="#933c46" strokeWidth="1.2"
     strokeLinecap="round" style={timing(65)}/>);
 }else ink.push(<text key="empty" className="fade" x="300" y="760" fontFamily="cursive" style={timing(450)}>No letters left to count.</text>);
 const meaning=winner===null?'No letters left to count':['Friends','Love','Affection','Marriage','Enemies','Siblings'][winner];
 return <main><Soundtrack src={song}/><svg className="world" viewBox="0 0 777 947" role="img" aria-label={dateLabel+'. '+names.slice(0,2).join(' and ')+'. '+count+' letters remain. '+meaning+'.'}>
 <defs>
 <linearGradient id="paper" x2=".8" y2="1"><stop stopColor="#f8e7dc"/><stop offset=".65" stopColor="#f3e4d7"/><stop offset="1" stopColor="#e6d3c3"/></linearGradient>
 <pattern id="rule" width="800" height="38" patternUnits="userSpaceOnUse"><path d="M0 37.3 Q350 38 800 37.3" stroke="#98847f" opacity=".48" strokeWidth="1.9" fill="none"/></pattern>
 </defs>
 <g transform="translate(-66 200) rotate(-14)">
 <rect x="-1600" y="6" width="2242" height="785" rx="5" fill="#8c9d92" opacity=".36"/>
 <rect x="-1600" width="2238" height="783" rx="5" fill="url(#paper)"/>
 <rect x="-1600" y="48" width="2238" height="735" fill="url(#rule)"/>
 <path d="M80 24 Q82 395 80 783" stroke="#b58988" strokeWidth="2.4" fill="none"/>
 <g transform={`translate(${608-dateLabel.length*8.75} 24) scale(.35)`} fill="none" stroke="#383245" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
 {Array.from(dateLabel,(c,i)=>glyph[c]?.split('|').map((d,j)=><path key={i+'-'+j} d={d} transform={`translate(${25*i} ${Math.sin(i)*1.3}) rotate(${2*Math.sin(i*2)} 10 20)`}/>))}
 </g>
 </g>{ink}<Butterfly/></svg>
 <div className="texture" aria-hidden="true"/>
 <div className="opening" aria-hidden="true"/>
 </main>;
}
