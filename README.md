# FOLD 2026 • Vercel + Google Forms
The public site runs on Vercel. Google Forms stores registrations. The attached Apps Script stores event settings in Script Properties and emails each team a signed download link. No Supabase account or database is required.

## One-time setup
1. Import this folder as a Vite project in Vercel. Use Node 24, build command npm run build, output dist. Deploy once to get the production HTTPS address.
2. Create your Google Form. In Settings enable Collect email addresses (Verified is preferred). Ask for your team details. Set the confirmation message to “Registration received. Check your email for your private FOLD ticket download link.”
3. Open the form's Apps Script editor and paste google-form/Code.gs into it. In Project Settings → Script properties set SITE_URL to your production site origin (no path) and FORM_SECRET to a randomly generated secret of at least 32 bytes. Keep it private and stable; changing it invalidates existing tickets.
4. Under Triggers add sendTicket, event source From form, event type On form submit. Authorize the form owner to send the registration emails. Use a form-bound script, not a response-sheet script.
5. In Apps Script choose Deploy → New deployment → Web app, execute as yourself and allow Anyone to access it. The server checks the shared secret. Copy the deployed /exec URL. If your institution blocks anonymous web apps, this configuration needs an allowed deployment account.
6. In Vercel production environment variables set FORM_SCRIPT_URL to that /exec URL, FORM_SECRET to the matching secret and ADMIN_PASSWORD to a separate long random password. Redeploy. These variables are server-only.
7. Visit /admin, enter the venue, date, start time (India time) and organizer password, then publish. Leave the Google Form link empty until you are ready. Paste its responder URL in the same panel later. No rebuild is required for these edits.
8. Submit one test response through the live form. Open the emailed link and download the PNG ticket. Confirm the venue and time against the home page. A ticket acknowledges a submitted form; organizers handle fee collection and any capacity limits in Google Forms. If email fails, check Apps Script Executions and the owner's mail quota.

For local frontend preview run npm ci and npm run dev. Use vercel dev with project environment variables to exercise the server routes. The signed ticket link is a bearer credential and should stay with the team.
