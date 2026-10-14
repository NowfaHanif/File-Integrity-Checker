import {risk,score} from "../lib/utils";

export const Tag=({s})=><span className={"tag "+(s==="Verified"?"v":s==="Tampered"?"t":"h")}>{s}</span>;

export const Finger=({hash,size=96})=>hash?<svg viewBox="0 0 8 8" width={size} height={size} shapeRendering="crispEdges" style={{borderRadius:6,flexShrink:0}} aria-label="Hash fingerprint">{Array.from(hash).slice(0,64).map((c,i)=>{const d=parseInt(c,16);return <rect key={i} x={i%8} y={Math.floor(i/8)} width="1" height="1" fill={"hsl("+d*22+","+(55+d*2)+"%,"+(35+d*2)+"%)"}/>})}</svg>:null;

export const Meter=({v})=><div><div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"var(--mu)"}}><span>Trust score</span><b style={{color:v>=80?"var(--gr)":v>=40?"var(--cy)":"var(--rd)"}}>{v}/100</b></div><div style={{background:"#0a1330",border:"1px solid var(--bd)",borderRadius:99,height:12,overflow:"hidden"}}><div style={{width:v+"%",height:"100%",background:v>=80?"var(--gr)":v>=40?"var(--cy)":"var(--rd)",transition:"width .4s"}}/></div></div>;

export const RiskBox=({n})=>{const r=risk(n);return r.lvl?<div className={"res "+(r.lvl===2?"bad":"info")} style={{marginTop:10}}>{r.lvl===2?"🚨":"⚠"} {r.msg}</div>:null};
