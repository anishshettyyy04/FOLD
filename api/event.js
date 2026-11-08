import { createHash, timingSafeEqual } from 'node:crypto';

function same(a,b) {
  const hash = value => createHash('sha256').update(value).digest();
  return timingSafeEqual(hash(a),hash(b));
}
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  const {FORM_SCRIPT_URL, FORM_SECRET, ADMIN_PASSWORD} = process.env;
  const defaults = {
    venue: process.env.EVENT_VENUE || 'ISE LAB (30 seater 1st floor main block)',
    event_date: process.env.EVENT_DATE || '2026-11-12',
    time: process.env.EVENT_TIME || '11:00',
    formUrl: process.env.EVENT_FORM_URL || 'https://forms.gle/xgwbdJaWfsybkp6M7'
  };
  if (!['GET','PUT'].includes(req.method)) return res.status(405).end();
  let settings;
  if (req.method === 'PUT') {
    if (!ADMIN_PASSWORD || !same(req.headers.authorization || '', 'Bearer '+ADMIN_PASSWORD)) return res.status(401).json({error:'Organizer password was not accepted.'});
    const {venue,event_date,time,formUrl}=req.body || {};
    if (typeof venue!=='string'||!venue.trim()||venue.length>160||!/^\d{4}-\d{2}-\d{2}$/.test(event_date)||new Date(event_date+'T12:00:00Z').toJSON()?.slice(0,10)!==event_date||typeof time!=='string'||(time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))||typeof formUrl!=='string'||(formUrl&&!/^https:\/\/(forms\.gle\/[\w-]+|docs\.google\.com\/forms\/(?:u\/\d+\/)?d\/(?:e\/)?[\w-]+\/viewform)(?:\?[^\s#]*)?$/.test(formUrl))) return res.status(400).json({error:'Check the venue, date, start time and Google Form responder URL.'});
    settings={venue:venue.trim(),event_date,time,formUrl};
  }
  if(!FORM_SCRIPT_URL || !FORM_SECRET) return req.method==='GET'?res.json(defaults):res.status(503).json({error:'Connect the Google Form settings script in Vercel first.'});
  try {
    const response=await fetch(FORM_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:FORM_SECRET,settings}),signal:AbortSignal.timeout(15000)});
    if (!response.ok) {
      if (req.method === 'GET') return res.json(defaults);
      return res.status(502).json({error: `Google Apps Script returned status ${response.status}. Check Web App URL and permissions.`});
    }
    const data=await response.json();
    if (!data.ok) {
      if (req.method === 'GET') return res.json(defaults);
      return res.status(502).json({error: 'Google Apps Script rejected the shared secret.'});
    }
    const merged = {...defaults,...data.settings};
    if (merged.event_date === '2026-11-13') merged.event_date = '2026-11-12';
    if (merged.time === '10:00') merged.time = '11:00';
    if (merged.venue === 'MITE campus') merged.venue = 'ISE LAB (30 seater 1st floor main block)';
    return res.json(merged);
  } catch (err) {
    if (req.method === 'GET') return res.json(defaults);
    return res.status(503).json({error: err?.message || 'Event settings are temporarily unavailable.'});
  }
}
