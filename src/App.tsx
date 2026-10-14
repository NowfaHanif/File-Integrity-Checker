import {useState,useEffect} from "react";
import {load,save} from "./lib/utils";
import {Home} from "./pages/Home";
import {Dashboard} from "./pages/Dashboard";
import {FileChecker} from "./pages/FileChecker";
import {TrustedHashes} from "./pages/TrustedHashes";
import {HistoryPage} from "./pages/HistoryPage";
import {Reports} from "./pages/Reports";
import {TamperDemo} from "./pages/TamperDemo";
import {Privacy} from "./pages/Privacy";
import type {HistoryEntry,TrustedHash} from "./types";

const PAGES=[["home","🏠 Home"],["dash","📊 Dashboard"],["check","🔍 File Checker"],["trusted","🔐 Trusted Hashes"],["hist","🕘 History"],["rep","📄 Reports"],["demo","🧪 Tamper Demo"],["priv","🛡️ Privacy & Security"]];

export default function App(){
  const [page,setPage]=useState("home");
  const [hist,setHist]=useState<HistoryEntry[]>(()=>load("sg_hist"));
  const [trusted,setTrusted]=useState<TrustedHash[]>(()=>load("sg_trusted"));
  useEffect(()=>save("sg_hist",hist),[hist]);
  useEffect(()=>save("sg_trusted",trusted),[trusted]);
  return <div className="app">
    <nav><div className="logo">🛡️ SecureGuard</div>
      {PAGES.map(([k,l])=><button key={k} className={page===k?"on":""} onClick={()=>setPage(k)}>{l}</button>)}</nav>
    <main>
      {page==="home"&&<Home go={setPage}/>}
      {page==="dash"&&<Dashboard hist={hist} go={setPage}/>}
      {page==="check"&&<FileChecker trusted={trusted} addHist={e=>setHist(h=>[e,...h])} addTrusted={t=>setTrusted(x=>[t,...x])}/>}
      {page==="trusted"&&<TrustedHashes trusted={trusted} setTrusted={setTrusted} go={setPage}/>}
      {page==="hist"&&<HistoryPage hist={hist} clear={()=>{if(confirm("Clear all history?"))setHist([])}}/>}
      {page==="rep"&&<Reports hist={hist} trusted={trusted} setHist={setHist} setTrusted={setTrusted}/>}
      {page==="demo"&&<TamperDemo/>}
      {page==="priv"&&<Privacy/>}
    </main></div>;
}
