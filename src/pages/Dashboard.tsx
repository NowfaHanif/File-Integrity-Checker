import {Tag} from "../components/ui";

export function Dashboard({hist,go}){
  const v=hist.filter(h=>h.status==="Verified").length,t=hist.filter(h=>h.status==="Tampered").length;
  return <><h1>Dashboard</h1><p>Overview of your integrity checks.</p>
    <div className="grid">
      <div className="card stat"><b style={{color:"var(--bl)"}}>{hist.length}</b><span>Total files checked</span></div>
      <div className="card stat"><b style={{color:"var(--gr)"}}>{v}</b><span>Verified files</span></div>
      <div className="card stat"><b style={{color:"var(--rd)"}}>{t}</b><span>Possible tampering alerts</span></div></div>
    {t>0&&<div className="res bad">⚠ {t} possible tampering alert(s) detected. Review them in History.</div>}
    <div className="card" style={{marginTop:16}}><h2>Recent checks</h2>
      {hist.length===0?<p>No checks yet.</p>:<div className="tw"><table><tbody>{hist.slice(0,5).map(h=><tr key={h.id}><td>{h.name}</td><td><Tag s={h.status}/></td><td>{h.time}</td></tr>)}</tbody></table></div>}
      <button className="btn" onClick={()=>go("check")}>Check a file</button></div></>;
}
