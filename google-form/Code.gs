// Bind this script to the Google Form. See README.md for installation.
function doGet(e) {
  const props = PropertiesService.getScriptProperties();
  return json({ok:true, settings: JSON.parse(props.getProperty('EVENT_SETTINGS') || '{}')});
}
function doPost(e) {
  const input = JSON.parse(e.postData.contents);
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('FORM_SECRET');
  if (!secret || input.secret !== secret) return json({ok:false});
  if (input.settings) props.setProperty('EVENT_SETTINGS', JSON.stringify(input.settings));
  return json({ok:true, settings: JSON.parse(props.getProperty('EVENT_SETTINGS') || '{}')});
}
function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function hex(bytes) {
  return bytes.map(function(b){return ('0'+(b & 255).toString(16)).slice(-2);}).join('');
}
function sendTicket(e) {
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('FORM_SECRET');
  const site = props.getProperty('SITE_URL');
  const email = e.response.getRespondentEmail();
  if (!secret || !site || !email) throw Error('Set FORM_SECRET, SITE_URL and enable Collect email addresses.');
  const id = 'FOLD-'+hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,e.response.getId())).slice(0,20);
  const signature = hex(Utilities.computeHmacSha256Signature('ticket:'+id,secret));
  const link = site.replace(/\/$/,'')+'/ticket#'+id+'.'+signature;
  MailApp.sendEmail(email,'Your FOLD 2026 team ticket','Thank you for registering. Download your team ticket here:\n'+link+'\nKeep this link private. Entry fee: ₹100 per team.');
}
