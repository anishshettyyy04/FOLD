import { createHmac,timingSafeEqual } from 'node:crypto';
export default function handler(req,res){
  res.setHeader('Cache-Control','private, no-store');
  if(req.method!=='POST') return res.status(405).end();
  if(!process.env.FORM_SECRET) return res.status(503).json({error:'Ticket verification is not configured.'});
  const {id,signature}=req.body||{};
  if(typeof id!=='string'||!/^FOLD-[a-f0-9]{20}$/.test(id)||typeof signature!=='string'||!/^[a-f0-9]{64}$/.test(signature)) return res.status(403).json({error:'Use the complete link from your registration email.'});
  const digest=createHmac('sha256',process.env.FORM_SECRET).update('ticket:'+id).digest();
  if(!timingSafeEqual(digest,Buffer.from(signature,'hex')))return res.status(403).json({error:'Invalid ticket link.'});
  res.json({id});
}
