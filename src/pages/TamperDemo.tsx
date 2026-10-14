import {useState,useEffect} from "react";
import {hx} from "../lib/utils";
import {Finger} from "../components/ui";

export function TamperDemo(){const O:string="Transfer 1000 rupees to Rahul";const [t,setT]=useState(O),[a,setA]=useState(""),[b,setB]=useState("");
 useEffect(()=>{(async()=>{try{setA(await hx(O));setB(await hx(t))}catch(e){}})()},[t]);
 const df=a&&b?Array.from(a).filter((c,i)=>c!==b[i]).length:0;
 return <><h1>Tamper Simulation Demo</h1><p>Change even one character and watch the whole SHA-256 change.</p>
 <div className="card"><p>Original text:</p><div className="hash" style={{color:"var(--tx)"}}>{O}</div>
 <p style={{marginTop:12}}>Edited text:</p><input type="text" value={t} onChange={e=>setT(e.target.value)}/>
 <div className="row" style={{marginTop:10}}><button className="btn rd" onClick={()=>setT(O.replace("1000","9000"))}>Change 1 digit (1000 → 9000)</button><button className="btn gh" onClick={()=>setT(O)}>Reset</button></div></div>
 <div className="grid"><div className="card"><h2>Original</h2><Finger hash={a} size={120}/><div className="hash" style={{marginTop:10}}>{a}</div></div>
 <div className="card"><h2>Edited</h2><Finger hash={b} size={120}/><div className="hash" style={{marginTop:10}}>{b}</div></div></div>
 {t===O?<div className="res ok">✅ Identical text: hashes match.</div>:<div className="res bad">🚨 Tampering detected: {df} of 64 hash characters changed (~{Math.round(df/64*100)}%).</div>}</>}
