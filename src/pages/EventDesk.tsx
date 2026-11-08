import {useEffect,useState,type FormEvent} from 'react';
import {eventDateParts,useEventConfig} from '../lib/event';
import {Link} from 'react-router-dom';

export function Register(){
 const cfg=useEventConfig();
 return <article className="legal-page"><span className="eyebrow">ZERONE PRESENTS / FOLD 2026</span><h1>Register your team.</h1><p>Two MITE students. One brochure. ₹100 per team.</p>{cfg?.settings.formUrl?<a className="button button-dark" href={cfg.settings.formUrl}>Open the Google Form ↗</a>:<p>Registration opens here when the organizers publish the Google Form.</p>}<h2>Your entry ticket</h2><p>After you submit, check the email address collected by the form for your private ticket download link.</p></article>
}
export function Ticket(){
 const cfg=useEventConfig(),date=eventDateParts(cfg);
 const [id,setId]=useState(''),[message,setMessage]=useState('Checking your ticket…');
 useEffect(()=>{const [code,signature]=location.hash.slice(1).split('.');
 if(!signature){setMessage('Open the ticket link sent to you after registration.');return}
 fetch('/api/ticket',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:code,signature})}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error);setId(d.id)}).catch(e=>setMessage(e.message));},[]);
 const details=[date.full,cfg?.settings.venue||'ISE LAB (30 seater 1st floor main block)','11:00 AM – 1:00 PM IST','1:30 hr design + 30 min judgement (2 hr total)','Prize pool: ₹4,500 RS','Entry fee: ₹100 per team'];
 function download(){const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=740;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#221510';ctx.fillRect(0,0,1080,740);ctx.fillStyle='#ffad24';ctx.font='bold 92px Arial';ctx.fillText('FOLD 2026',60,136);ctx.font='bold 34px Arial';ctx.fillText('ZERONE  /  TEAM ENTRY TICKET',64,207);ctx.fillStyle='#fff2dc';ctx.font='34px Arial';details.forEach((v,i)=>ctx.fillText(v,64,300+i*57,952));ctx.font='26px monospace';ctx.fillText(id,64,657);const a=document.createElement('a');a.href=canvas.toDataURL();a.download=id+'.png';a.click()}
 return <article className="legal-page"><span className="eyebrow">FOLD 2026 / ADMISSION</span><h1>Your team ticket.</h1>{id?<><strong>{id}</strong>{details.map(v=><p key={v}>{v}</p>)}<button className="button button-dark" onClick={download}>Download ticket (PNG)</button></>:<p role="status">{message}</p>}</article>
}
export function Admin(){
 const [settings,setSettings]=useState({venue:'',event_date:'',time:'',formUrl:''}),[ready,setReady]=useState(false),[password,setPassword]=useState(''),[message,setMessage]=useState('');
 useEffect(()=>{fetch('/api/event').then(async r=>{if(!r.ok)throw Error();setSettings(await r.json());setReady(true)}).catch(()=>{setSettings({venue:'ISE LAB (30 seater 1st floor main block)',event_date:'2026-11-12',time:'11:00',formUrl:''});setReady(true);setMessage('Loaded default settings.');})},[]);
 async function save(e:FormEvent){e.preventDefault();setMessage('Saving…');try{const r=await fetch('/api/event',{method:'PUT',headers:{Authorization:'Bearer '+password,'Content-Type':'application/json'},body:JSON.stringify(settings)});const data=await r.json();if(!r.ok)throw Error(data.error);window.dispatchEvent(new Event('event-updated'));setMessage('Published. Visitors will see the new event details.')}catch(err){setMessage(err instanceof Error?err.message:'Save failed.')}}
 return <article className="legal-page"><span className="eyebrow">ORGANIZER DESK</span><h1>Event settings.</h1><form onSubmit={save} style={{display:'grid',gap:18,maxWidth:620}}>{([['venue','Venue','text'],['event_date','Event date','date'],['time','Start time (IST)','time'],['formUrl','Google Form responder link (optional)','url']] as const).map(([key,label,type])=><label key={key}>{label}<input style={{display:'block',width:'100%',padding:12}} type={type} required={key==='venue'||key==='event_date'} value={settings[key]} onChange={e=>setSettings({...settings,[key]:e.target.value})}/></label>)}<label>Organizer password<input style={{display:'block',padding:12}} type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={!ready} className="button button-dark">Publish changes</button><p role="status">{message}</p></form><Link to="/">View event</Link></article>
}
