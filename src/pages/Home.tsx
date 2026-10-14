import {Privacy} from "./Privacy";

export function Home({go}){
  const F=[["🔒","Local SHA-256 hashing","Files never leave your device."],["✅","Integrity verification","Compare against a trusted reference hash."],["🚨","Tamper alerts","Mismatches are flagged clearly in red."],["📄","Exportable reports","Download TXT or CSV audit records."]];
  return <>
    <div className="hero"><p style={{color:"var(--cy)",fontWeight:700,margin:0}}>Hackathon theme: Cybersecurity, Digital Trust & Privacy</p>
      <h1>SecureGuard – <em>File Integrity Checker</em></h1>
      <p>Objective: let anyone prove a file is authentic and unmodified by generating its SHA-256 fingerprint in the browser and matching it with a trusted reference, with zero uploads.</p>
      <button className="btn cy" onClick={()=>go("check")}>Start File Verification →</button></div>
    <div className="grid">{F.map(f=><div className="card" key={f[1]}><div style={{fontSize:28}}>{f[0]}</div><h2>{f[1]}</h2><p style={{margin:0}}>{f[2]}</p></div>)}</div></>;
}
