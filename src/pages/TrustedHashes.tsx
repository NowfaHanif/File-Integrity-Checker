import {useState} from "react";
import {norm} from "../lib/utils";

export function TrustedHashes({trusted,setTrusted,go}){
  const [label,setLabel]=useState(""),[h,setH]=useState(""),[err,setErr]=useState("");
  function add(){
    const n=norm(h);
    if(!/^([a-f0-9]{64}|[a-f0-9]{96}|[a-f0-9]{128})$/.test(n)){setErr("Hash must be 64 (SHA-256), 96 (SHA-384) or 128 (SHA-512) hex characters.");return}
    if(trusted.some(t=>t.hash===n)){setErr("This hash is already saved.");return}
    setTrusted([{id:Date.now(),label:label.trim()||"Untitled",hash:n,time:new Date().toLocaleString()},...trusted]);
    setLabel("");setH("");setErr("");
  }
  return <><h1>Trusted Hashes</h1><p>Reference hashes from official sources. Select them when verifying.</p>
    <div className="card">{err&&<div className="err">⚠ {err}</div>}
      <div className="row"><input type="text" style={{flex:1,minWidth:140}} placeholder="Label (e.g. setup.exe v1.2)" value={label} onChange={e=>setLabel(e.target.value)}/></div>
      <div className="row" style={{marginTop:10}}><input type="text" style={{flex:1,minWidth:200}} placeholder="SHA-256 / 384 / 512 hex hash" value={h} onChange={e=>setH(e.target.value)}/>
        <button className="btn" onClick={add}>Save hash</button></div></div>
    <div className="card"><h2>Saved ({trusted.length})</h2>
      {trusted.length===0&&<p>No trusted hashes saved yet.</p>}
      {trusted.map(t=><div key={t.id} style={{borderTop:"1px solid var(--bd)",padding:"10px 0"}}>
        <b>{t.label}</b> <span style={{color:"var(--mu)",fontSize:12}}>{t.time}</span>
        <div className="hash" style={{margin:"6px 0"}}>{t.hash}</div>
        <div className="row"><button className="btn gh" onClick={()=>go("check")}>Use in checker</button>
          <button className="btn rd" onClick={()=>setTrusted(trusted.filter(x=>x.id!==t.id))}>Delete</button></div></div>)}</div></>;
}
