

export function Privacy(){
  const P=[["Local processing","Files are read and hashed inside your browser with the Web Crypto API. Nothing is uploaded."],["No server","There is no backend. No file content, name or hash is sent over the network."],["Minimal storage","Only metadata (name, size, hash, result, time) is kept in your browser's localStorage."],["You stay in control","Delete trusted hashes or clear history anytime. Clearing site data removes everything."],["Why SHA-256","A one-bit change in a file produces a completely different hash, so tampering is easy to detect."],["Limits","A match proves the file equals the reference. Always get the reference hash from a trusted, separate source."]];
  return <><h1>Privacy & Security</h1><p>Built for digital trust: verify without surrendering your data.</p>
    <div className="grid">{P.map(p=><div className="card" key={p[0]}><h2 style={{color:"var(--cy)"}}>{p[0]}</h2><p style={{margin:0}}>{p[1]}</p></div>)}</div></>;
}
