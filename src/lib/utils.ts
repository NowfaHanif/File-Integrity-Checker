

export const load=(k:string)=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return[]}};

export const save=(k:string,v:unknown)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

export const MAX=500*1024*1024;

export const fmt=(n:number)=>n<1024?n+" B":n<1048576?(n/1024).toFixed(1)+" KB":(n/1048576).toFixed(2)+" MB";

export const norm=(s:string)=>s.trim().toLowerCase().replace(/\s+/g,"");

export const LEN={"SHA-256":64,"SHA-384":96,"SHA-512":128};

export async function sha256(file:File,algo:string="SHA-256"){
  if(!(window.crypto&&crypto.subtle))throw new Error("Web Crypto needs HTTPS or localhost.");
  const buf=await file.arrayBuffer();
  const d=await crypto.subtle.digest(algo,buf);
  return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

export const RISKY=["exe","bat","cmd","js","vbs","scr","msi","ps1","jar","com","apk"],DOCX=["pdf","doc","docx","xls","xlsx","jpg","jpeg","png","txt","ppt","pptx","zip"];

export function risk(n){const p=n.toLowerCase().split("."),e=p.length>1?p[p.length-1]:"",v=p.length>2?p[p.length-2]:"";
 if(RISKY.includes(e)&&DOCX.includes(v))return{lvl:2,msg:"Double extension ("+v+"."+e+") is a common malware disguise."};
 if(RISKY.includes(e))return{lvl:1,msg:"."+e+" is an executable/script type. Run only if the source is trusted."};
 return{lvl:0,msg:""}}

export function score(st,r){let s=st==="Verified"?100:st==="Tampered"?5:55;s-=r.lvl===2?35:r.lvl===1?20:0;return Math.max(0,s)}

export async function hx(t){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,"0")).join("")}
