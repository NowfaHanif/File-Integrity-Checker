import {fmt} from "../lib/utils";
import {Tag} from "../components/ui";

export function HistoryPage({hist,clear}){
  return <><h1>Verification History</h1><p>Only metadata is stored: name, size, hashes, result and time.</p>
    <div className="card">{hist.length===0?<p>No history yet.</p>:<>
      <div className="tw"><table><thead><tr><th>Time</th><th>File</th><th>Size</th><th>Result</th><th>SHA-256</th></tr></thead>
        <tbody>{hist.map(h=><tr key={h.id}><td>{h.time}</td><td>{h.name}</td><td>{fmt(h.size)}</td><td><Tag s={h.status}/></td><td style={{fontFamily:"monospace"}}>{h.hash.slice(0,16)}…</td></tr>)}</tbody></table></div>
      <button className="btn rd" style={{marginTop:12}} onClick={clear}>Clear history</button></>}</div></>;
}
