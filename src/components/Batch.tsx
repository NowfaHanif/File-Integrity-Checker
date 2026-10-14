import {risk} from "../lib/utils";
import {Tag,Finger} from "./ui";

export function Batch({rows}){const t=rows.filter(r=>r.status==="Tampered").length;return <div className="card" style={{marginTop:14}}><h2>Batch scan: {rows.length} files</h2>
 {t>0&&<div className="res bad">🚨 {t} possible tampering alert(s) found.</div>}
 <p style={{marginTop:10}}>Each file is matched with Trusted Hashes by hash, or by label equal to the file name.</p>
 <div className="tw"><table><thead><tr><th>Print</th><th>File</th><th>Result</th><th>Trust</th><th>Risk</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><td><Finger hash={r.hash} size={32}/></td><td>{r.name}</td><td><Tag s={r.status}/></td><td>{r.hash?r.score+"/100":"-"}</td><td>{r.err||(risk(r.name).lvl===2?"🚨 Double ext.":risk(r.name).lvl===1?"⚠ Executable":"OK")}</td></tr>)}</tbody></table></div></div>}
