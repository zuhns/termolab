import { createContext, useContext, useId, useState } from 'react';
import type { ReactNode } from 'react';
import katex from 'katex';
import { ArrowRight, Check, HelpCircle } from 'lucide-react';
import type { Question } from '../data/lessons';
import { fmt, waterState } from '../lib/physics';
export const GlossaryContext = createContext<(id:string,trigger?:HTMLElement)=>void>(()=>{});
export const MotionContext = createContext(true);
export function Rich({text}:{text:string}) {
 const open=useContext(GlossaryContext);
 return <>{text.split(/(\[\[.*?\]\])/).map((s,i)=>{ if(!s.startsWith('[[')) return s; const [id,label]=s.slice(2,-2).split('|'); return <button key={i} className="term" onClick={e=>open(id,e.currentTarget)}>{label||id}</button>; })}</>;
}
export function Formula({formula}:{formula:string}) { return <div className="math" dangerouslySetInnerHTML={{__html:katex.renderToString(formula,{throwOnError:false,displayMode:true,output:'htmlAndMathml'})}}/>; }
export function Range({label,value,onChange,min,max,step=1,unit='',digits=0}:{label:string;value:number;onChange:(n:number)=>void;min:number;max:number;step?:number;unit?:string;digits?:number}) {
 const id=useId(); return <label className="range-control" htmlFor={id}><span>{label}<output>{fmt(value,digits)} <small>{unit}</small></output></span><input id={id} aria-label={label} aria-valuetext={`${fmt(value,digits)} ${unit}`} type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/><span className="range-ends" aria-hidden="true"><span>{fmt(min, digits)} {unit}</span><span>{fmt(max,digits)} {unit}</span></span></label>;
}
export function Stat({label,value,accent=false}:{label:string;value:string;accent?:boolean}) { return <div className={'stat '+(accent?'accent':'')}><span>{label}</span><strong>{value}</strong></div>; }
export function Quiz({question,small=false}:{question:Question;small?:boolean}) { const [answer,setAnswer]=useState<number|null>(null); return <div className={'quiz '+(small?'small':'')}><p className="eyebrow"><HelpCircle size={14}/>{small?'PRIMA, PREVEDI':'RAGIONARE'}</p><h3>{question.prompt}</h3><div className="quiz-options">{question.options.map((o,i)=><button key={o} aria-pressed={answer===i} className={answer===i?(answer===question.correct?'selected correct':'selected retry'):''} onClick={()=>setAnswer(i)}><span className="option-letter">{String.fromCharCode(65+i)}</span>{o}{answer===i&&i===question.correct&&<Check size={18}/>}</button>)}</div>{answer!==null&&<div role="status" className="feedback"><strong>{answer===question.correct?'Esatto, ecco il ragionamento.':'Riprova a ragionare così.'}</strong><p>{question.feedback}</p></div>}</div>; }
export function Disclosure({title,children,open=false}:{title:string;children:ReactNode;open?:boolean}) { return <details className="disclosure" open={open||undefined}><summary>{title}<ArrowRight size={16}/></summary><div>{children}</div></details>; }
export type View = 'macro'|'micro'|'both';
export function ViewToggle({value,onChange}:{value:View;onChange:(v:View)=>void}) { return <div className="segmented" aria-label="Livello di osservazione">{(['macro','micro','both'] as View[]).map((v,i)=><button key={v} aria-pressed={value===v} onClick={()=>onChange(v)}>{['Macroscopico','Microscopico','Combinata'][i]}</button>)}</div>; }
export function Particles({temperature=20,solid=false,water=false,expanded=0}:{temperature?:number;solid?:boolean;water?:boolean;expanded?:number}) {
 const motion=useContext(MotionContext), n=solid?32:24, packing=water?1+(waterState(Math.max(0,Math.min(20,temperature))).volume-1)*35:1;
 return <svg viewBox="0 0 520 180" role="img" aria-label={solid?'Modello di atomi che vibrano intorno a posizioni medie':'Modello semplificato di particelle in movimento'} className={'particles '+(!motion?'still':'')}>
 <rect x="1" y="1" width="518" height="178" rx="18" fill="#eff4ee" stroke="#cddbd0"/>
 {Array.from({length:n},(_,i)=>{const x=solid?50+(i%8)*(55+expanded*5):260+(35+(i*73)%450-260)*packing,y=solid?40+Math.floor(i/8)*32:32+(i*47)%115; return <g key={i} style={{animationDuration:`${Math.max(.4,2-(temperature+20)/100)}s`,animationDelay:`${-i*.13}s`,transformOrigin:`${x}px ${y}px`}} className="molecule">{water&&i%4<(temperature<4?3:2)&&i<n-1&&<path d={`M${x} ${y}l${(i%2?1:-1)*26} ${i%3?15:-18}`} fill="none" stroke="#7aa896" strokeDasharray="3 4" opacity=".65"/>}<circle cx={x} cy={y} r={water?9:7} fill={temperature>45?'#c8794e':'#287d71'} opacity=".85"/>{water&&<><circle cx={x-8} cy={y-6} r="4" fill="#e3a873"/><circle cx={x+8} cy={y-6} r="4" fill="#e3a873"/></>}</g>;})}
 <text x="260" y="167" textAnchor="middle" fontSize="11" fill="#456457">{solid?'Posizioni medie · atomi non in scala':water?'Rete dinamica schematica · legami non rigidi · distanze amplificate':'Schema concettuale · non è un filmato di molecole reali'}</text></svg>;
}
export type Series = {name:string;color:string;points:[number,number][];dashed?:boolean};
export function Chart({series,xLabel,yLabel,xMin,xMax,yMin,yMax,point,onPick,markers=[]}:{series:Series[];xLabel:string;yLabel:string;xMin:number;xMax:number;yMin:number;yMax:number;point?:[number,number];onPick?:(x:number)=>void;markers?:{x:number;label:string}[]}) {
 const left=76,right=485,top=34,bottom=218;
 const sx=(x:number)=>left+(x-xMin)/(xMax-xMin)*(right-left),sy=(y:number)=>bottom-(y-yMin)/(yMax-yMin)*(bottom-top);
 const yDigits=Math.min(7,Math.max(0,Math.ceil(-Math.log10((yMax-yMin)/4))));
 const f=(n:number)=>fmt(n,yDigits);
 const xDigits=xMin%1!==0?2:((xMax-xMin)/4)%1!==0?1:0;
 return <figure className="chart" tabIndex={0}><p className="chart-mobile-hint">Scorri il grafico in orizzontale per leggere tutti i valori.</p><svg viewBox="0 0 520 278" role="img" aria-label={`${yLabel} in funzione di ${xLabel}`} onPointerDown={onPick?e=>{const r=e.currentTarget.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*520; onPick(Math.max(xMin,Math.min(xMax,xMin+(x-left)/(right-left)*(xMax-xMin))));}:undefined} style={onPick?{cursor:'crosshair'}:undefined}>
 <text x="15" y="17" fill="#4d6259" fontSize="11">{yLabel}</text>
 {Array.from({length:5},(_,i)=>{const y=yMin+(yMax-yMin)*i/4,x=xMin+(xMax-xMin)*i/4;return <g key={i}><line x1={left} y1={sy(y)} x2={right} y2={sy(y)} stroke="#dce3da" strokeDasharray="3 4"/><text x={left-9} y={sy(y)+4} textAnchor="end" fontSize="12" fill="#5c6d64">{f(y)}</text><line x1={sx(x)} x2={sx(x)} y1={top} y2={bottom} stroke="#e7ebe5"/><text x={sx(x)} y="238" textAnchor="middle" fontSize="12" fill="#5c6d64">{fmt(x,xDigits)}</text></g>})}
 <path d={`M${left} ${top}V${bottom}H${right}`} fill="none" stroke="#748a7c"/>
 {markers.map(m=><g key={m.label}><line x1={sx(m.x)} x2={sx(m.x)} y1={top} y2={bottom} stroke="#b47b40" strokeDasharray="4 3"/><text x={sx(m.x)+5} y="29" fontSize="12" fill="#8a5b2b">{m.label}</text></g>)}
 {series.map(s=><polyline key={s.name} points={s.points.map(([x,y])=>`${sx(x)},${sy(y)}`).join(' ')} stroke={s.color} fill="none" strokeWidth="2.5" strokeDasharray={s.dashed?'5 5':undefined}/>)}
 {point&&<><line x1={sx(point[0])} x2={sx(point[0])} y1={sy(point[1])} y2={bottom} stroke="#2e7764" strokeDasharray="3 3"/><circle cx={sx(point[0])} cy={sy(point[1])} r="6" fill="#c96d42" stroke="white" strokeWidth="2"/></>}
 <text x="285" y="267" textAnchor="middle" fontSize="11" fill="#4d6259">{xLabel}</text>
 </svg><figcaption className="chart-legend">{series.map(s=><span key={s.name}><i style={{background:s.color}}/>{s.name}</span>)}</figcaption></figure>;
}
export function sample(min:number,max:number,fn:(x:number)=>number,count=40):[number,number][] {return Array.from({length:count+1},(_,i)=>{const x=min+(max-min)*i/count;return [x,fn(x)];});}
