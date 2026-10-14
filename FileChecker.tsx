import {useState,useRef} from "react";
import {load,save,MAX,fmt,norm,LEN,sha256,risk,score} from "../lib/utils";
import {Finger,Meter,RiskBox} from "../components/ui";
import {Batch} from "../components/Batch";

export function FileChecker({trusted,addHist,addTrusted}){
  const [file,setFile]=useState(null),[hash,setHash]=useState(""),[busy,setBusy]=useState(false),[err,setErr]=useState(""),[over,setOver]=useState(false);
  const [batch,setBatch]=useState([]),[algo,setAlgo]=useState("SHA-256"),[ref,setRef]=useState(""),[res,setRes]=useState(null),[label,setLabel]=useState(""),[msg,setMsg]=useState("");
  const inp=useRef<HTMLInputElement>(null),cs=useRef<HTMLInputElement>(null);
  function chg(a){setAlgo(a);setRes(null);setErr("");if(file){setBusy(true);sha256(file,a).then(h=>{setHash(h);setBusy(false)}).catch(e=>{setErr(e.message);setBusy(false)})}}
  async function loadSum(f){
    setErr("");if(!f)return;
    if(f.size>1048576){setErr("Checksum file too large (max 1 MB).");return}
    try{const L=(await f.text()).split(/\r?\n/);let found=null;
      for(const l of L){const m=l.match(/\b([a-fA-F0-9]{128}|[a-fA-F0-9]{96}|[a-fA-F0-9]{64})\b/);if(!m)continue;if(!found)found=m[1];if(file&&l.toLowerCase().includes(file.name.toLowerCase())){found=m[1];break}}
      if(!found){setErr("No valid SHA-256/384/512 hash found in that file.");return}
      const a=found.length===64?"SHA-256":found.length===96?"SHA-384":"SHA-512";
      setRef(found.toLowerCase());setRes(null);if(a!==algo)chg(a);setMsg("Hash loaded from "+f.name+" ("+a+").")}
    catch(e){setErr("Could not read checksum file.")}
  }
  const now=()=>new Date().toLocaleString();
  async function batchRun(fs){
    setFile(null);setBusy(true);const rows=[];
    for(const f of fs){
      if(f.size===0||f.size>MAX){rows.push({name:f.name,hash:"",status:"Error",err:f.size?"Over 500 MB":"Empty file"});continue}
      try{const h=await sha256(f,algo);const ex=trusted.find(t=>t.hash===h),nm=trusted.find(t=>t.label===f.name);
        const st=ex?"Verified":nm?"Tampered":"Hash only";
        addHist({id:Date.now()+Math.random(),name:f.name,size:f.size,hash:h,ref:ex?ex.hash:nm?nm.hash:"",status:st,algo,time:now()});
        rows.push({name:f.name,hash:h,status:st,score:score(st,risk(f.name))})}
      catch(e){rows.push({name:f.name,hash:"",status:"Error",err:e.message})}
    }
    setBatch(rows);setBusy(false);
  }
  async function pick(fl){
    setErr("");setRes(null);setMsg("");setHash("");setBatch([]);
    const arr=Array.from(fl||[]);if(!arr.length)return;
    if(arr.length>1){await batchRun(arr);return}
    const f=arr[0];
    if(f.size===0){setErr("This file is empty (0 bytes).");return}
    if(f.size>MAX){setErr("File is larger than 500 MB. Please choose a smaller file.");return}
    setFile(f);setBusy(true);
    try{setHash(await sha256(f,algo))}catch(e){setErr("Could not hash file: "+e.message);setFile(null)}
    setBusy(false);
  }
  function verify(){
    setErr("");
    const r=norm(ref);
    if(!r){setErr("Enter or select a trusted reference hash first.");return}
    if(r.length!==LEN[algo]||!/^[a-f0-9]+$/.test(r)){setErr("Reference must be a "+LEN[algo]+"-character hexadecimal "+algo+" hash.");return}
    const ok=r===hash;
    const status=ok?"Verified":"Tampered";
    setRes(status);
    addHist({id:Date.now()+Math.random(),name:file.name,size:file.size,hash,ref:r,status,algo,time:now()});
  }
  function justRecord(){
    addHist({id:Date.now()+Math.random(),name:file.name,size:file.size,hash,ref:"",status:"Hash only",algo,time:now()});
    setMsg("Hash recorded in history.");
  }
  function saveTrusted(){
    addTrusted({id:Date.now()+Math.random(),label:label.trim()||file.name,hash,algo,time:now()});
    setLabel("");setMsg("Saved as trusted hash.");
  }
  return <><h1>File Checker</h1><p>Drop a file to generate its SHA-256 hash, then verify it.</p>
    {err&&<div className="err">⚠ {err}</div>}
    <div className="row" style={{marginBottom:12}}><span style={{color:"var(--mu)",fontSize:14}}>Algorithm:</span><select value={algo} onChange={e=>chg(e.target.value)} style={{background:"#0a1330",color:"var(--tx)",border:"1px solid var(--bd)",borderRadius:8,padding:9}}><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select></div>
    <div className={"drop"+(over?" over":"")} onClick={()=>inp.current.click()}
      onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)}
      onDrop={e=>{e.preventDefault();setOver(false);pick(e.dataTransfer.files)}}>
      <div style={{fontSize:34}}>📁</div><b>Drag & drop file(s) here</b><p style={{margin:0}}>or click to browse. Select many files for a batch scan (max 500 MB each)</p>
      <input ref={inp} type="file" hidden multiple onChange={e=>{const fl=Array.from(e.target.files);e.target.value="";pick(fl)}}/></div>
    {busy&&<div className="card" style={{marginTop:14}}><span className="spin"/>Calculating SHA-256…</div>}
    {batch.length>0&&!busy&&<Batch rows={batch}/>}
    {file&&hash&&!busy&&<div className="card" style={{marginTop:14}}>
      <h2>{file.name} <span style={{color:"var(--mu)",fontSize:13}}>({fmt(file.size)})</span></h2>
      <div className="hash">{hash}</div>
      <div className="row" style={{marginTop:12,alignItems:"center"}}><Finger hash={hash}/><div style={{flex:1,minWidth:180}}><Meter v={score(res||"Hash only",risk(file.name))}/><p style={{margin:"6px 0 0",fontSize:12}}>Fingerprint: any change to the file gives a totally different pattern.</p></div></div>
      <RiskBox n={file.name}/>
      <div className="row" style={{marginTop:10}}>
        <button className="btn gh" onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(hash).then(()=>setMsg("Hash copied."),()=>setMsg("Copy blocked by browser."))}>Copy hash</button>
        <button className="btn gh" onClick={justRecord}>Record in history</button></div>
      <div className="row" style={{marginTop:10}}>
        <input type="text" style={{flex:1,minWidth:160}} placeholder="Label to save as trusted hash" value={label} onChange={e=>setLabel(e.target.value)}/>
        <button className="btn cy" onClick={saveTrusted}>Save as trusted</button></div>
      {msg&&<div className="res info">{msg}</div>}
      <h2 style={{marginTop:20}}>Integrity Verification</h2>
      <div className="row" style={{marginBottom:8}}><button className="btn gh" onClick={()=>cs.current.click()}>Load .sha256 / checksum file</button><input ref={cs} type="file" hidden accept=".sha256,.sha384,.sha512,.txt,.checksum,.sum" onChange={e=>{const f=e.target.files[0];e.target.value="";loadSum(f)}}/></div>
      <input type="text" placeholder="Paste trusted reference hash (or load a checksum file)" value={ref} onChange={e=>{setRef(e.target.value);setRes(null)}}/>
      <div className="row" style={{margin:"10px 0"}}>
        <select style={{background:"#0a1330",color:"var(--tx)",border:"1px solid var(--bd)",borderRadius:8,padding:9}} value="" onChange={e=>{setRef(e.target.value);setRes(null)}}>
          <option value="">Use a saved trusted hash…</option>
          {trusted.map(t=><option key={t.id} value={t.hash}>{t.label}</option>)}</select>
        <button className="btn" onClick={verify}>Verify integrity</button></div>
      {res==="Verified"&&<div className="res ok">✅ VERIFIED – hashes match. The file is unmodified.</div>}
      {res==="Tampered"&&<div className="res bad">🚨 POSSIBLE TAMPERING – hashes do NOT match. Do not trust this file.<div className="hash" style={{marginTop:8,color:"#fca5a5"}}>Expected: {norm(ref)}<br/>Actual:&nbsp;&nbsp;&nbsp;{hash}</div></div>}
    </div>}</>;
}
