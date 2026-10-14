import {useState,useRef} from "react";
import {fmt} from "../lib/utils";

export function Reports({hist,trusted,setHist,setTrusted}){
  const [msg,setMsg]=useState(""),[bm,setBm]=useState("");const fr=useRef<HTMLInputElement>(null);
  async function imp(f){
    if(!f)return;
    try{if(f.size>5242880)throw new Error("file too large (max 5 MB)");
      const d=JSON.parse(await f.text());
      if(d.app!=="SecureGuard"||!Array.isArray(d.trusted)||!Array.isArray(d.history))throw new Error("not a valid SecureGuard backup");
      const T=d.trusted.filter(x=>x&&typeof x.label==="string"&&/^[a-f0-9]{64,128}$/.test(x.hash)).map(x=>({id:x.id||Date.now()+Math.random(),label:x.label.slice(0,100),hash:x.hash,time:String(x.time||"")}));
      const H=d.history.filter(x=>x&&typeof x.name==="string"&&typeof x.hash==="string"&&typeof x.time==="string"&&typeof x.size==="number"&&["Verified","Tampered","Hash only"].includes(x.status)).map(x=>({id:x.id||Date.now()+Math.random(),name:x.name.slice(0,260),size:x.size,hash:x.hash,ref:typeof x.ref==="string"?x.ref:"",status:x.status,algo:x.algo,time:x.time}));
      setTrusted(c=>[...T.filter(t=>!c.some(k=>k.hash===t.hash&&k.label===t.label)),...c]);
      setHist(c=>[...H.filter(h=>!c.some(k=>k.id===h.id)),...c]);
      setBm("Restored "+T.length+" trusted hash(es) and "+H.length+" history record(s).")}
    catch(e){setBm("Import failed: "+(e.message||"invalid file"))}
  }
  async function dl(name,text,type){
    setMsg("");
    try{
      const blob=new Blob([text],{type});
      const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setMsg("Downloaded "+name);
    }catch(e){setMsg(e&&e.code==="declined"?"Download cancelled.":"Download failed: "+((e&&e.message)||e))}
  }
  const txt=()=>"SecureGuard – File Integrity Report\nGenerated: "+new Date().toLocaleString()+"\nTotal: "+hist.length+"\n\n"+hist.map((h,i)=>(i+1)+". "+h.name+" ("+fmt(h.size)+")\n   Result: "+h.status+"\n   Time: "+h.time+"\n   "+(h.algo||"SHA-256")+": "+h.hash+"\n   Reference: "+(h.ref||"n/a")).join("\n\n");
  const csv=()=>{const q=s=>'"'+String(s).replace(/"/g,'""')+'"';return "Time,File,Size (bytes),Result,Algorithm,Hash,Reference\n"+hist.map(h=>[h.time,h.name,h.size,h.status,h.algo||"SHA-256",h.hash,h.ref||""].map(q).join(",")).join("\n")};
  return <><h1>Reports</h1><p>Export your verification results.</p>
    <div className="card"><p>{hist.length} record(s) available.</p>
      <div className="row"><button className="btn" disabled={!hist.length} onClick={()=>dl("secureguard-report.txt",txt(),"text/plain")}>Download TXT</button>
        <button className="btn cy" disabled={!hist.length} onClick={()=>dl("secureguard-report.csv",csv(),"text/csv")}>Download CSV</button></div>
      {!hist.length&&<div className="res info">Run at least one check to enable reports.</div>}
      {msg&&<div className="res info">{msg}</div>}</div>
    <div className="card"><h2>Backup & Restore</h2><p>Export trusted hashes and history as a JSON file, or restore them later. Restoring merges with current data.</p>
      <div className="row"><button className="btn" disabled={!hist.length&&!trusted.length} onClick={()=>dl("secureguard-backup.json",JSON.stringify({app:"SecureGuard",version:1,exported:new Date().toISOString(),trusted,history:hist},null,2),"application/json")}>Export backup (JSON)</button>
        <button className="btn gh" onClick={()=>fr.current.click()}>Import backup</button>
        <input ref={fr} type="file" hidden accept=".json,application/json" onChange={e=>{const f=e.target.files[0];e.target.value="";imp(f)}}/></div>
      {bm&&<div className="res info">{bm}</div>}</div></>;
}
