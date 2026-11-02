/* Cloudflare Pages Function: tar emot offertförfrågan och mejlar den till
   info@vsgruppenab.se via Resend. Kräver secret RESEND_KEY
   (wrangler pages secret put RESEND_KEY). Utan nyckel svarar den 503 och
   frontend faller tillbaka på mailto. */

export async function onRequestPost(context) {
  const key = context.env.RESEND_KEY;
  if (!key) return json({ error: "not_configured" }, 503);

  let d;
  try {
    d = await context.request.json();
  } catch (e) {
    return json({ error: "bad_json" }, 400);
  }

  const clean = (v, max) => String(v || "").trim().slice(0, max);
  const namn = clean(d.namn, 120);
  const epost = clean(d.epost, 200);
  const telefon = clean(d.telefon, 60);
  const ort = clean(d.ort, 120);
  const arende = clean(d.arende, 120);
  const meddelande = clean(d.meddelande, 5000);
  const kampanj = clean(d.kampanj, 300);

  if (!namn || !meddelande) return json({ error: "missing_fields" }, 400);
  if (d.webbplats) return json({ ok: true }, 200); // honeypot: låtsas lyckas

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const row = (k, v) =>
    v ? `<tr><td style="padding:6px 14px 6px 0;color:#555;white-space:nowrap">${k}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>` : "";
  const html = `
    <h2 style="font-family:sans-serif">Ny offertförfrågan från vsgruppenab.se</h2>
    <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
      ${row("Namn", namn)}${row("E-post", epost)}${row("Telefon", telefon)}
      ${row("Ort", ort)}${row("Ärende", arende)}${row("Kampanj", kampanj)}
    </table>
    <p style="font-family:sans-serif;font-size:15px;white-space:pre-wrap">${esc(meddelande)}</p>`;

  const payload = {
    from: "VS Gruppen Offert <offert@vsgruppenab.se>",
    to: ["info@vsgruppenab.se"],
    subject: "Offertförfrågan — " + (arende || "via hemsidan"),
    html,
  };
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(epost)) payload.reply_to = epost;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const t = await r.text();
    return json({ error: "send_failed", detail: t.slice(0, 300) }, 502);
  }
  return json({ ok: true }, 200);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
