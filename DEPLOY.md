# Lansering — VS Gruppen AB

Sajten är helt statisk (HTML/CSS/JS) och kan ligga på vilket webbhotell som helst.

## 1. Publicera (välj ett)

**Cloudflare Pages (rekommenderas, gratis):**
1. Skapa konto på pages.cloudflare.com
2. "Upload assets" → dra in hela mappen `vsgruppen-website` (utom `.claude/` och `DEPLOY.md`)
3. Koppla domänen `vsgruppenab.se` under Custom domains (kräver att DNS pekas om från WebbEss — inloggning hos er domänregistrar)

**Netlify:** samma princip — dra mappen till app.netlify.com/drop

HTTPS sköts automatiskt av båda. `404.html` plockas upp automatiskt som felsida.

## 2. Aktivera formuläret (viktigt — engångsgrej)

Offertformuläret skickar via FormSubmit till info@vsgruppenab.se.
**Första gången någon skickar formuläret på den publicerade sajten** kommer ett
aktiveringsmejl från formsubmit.co till info@vsgruppenab.se — klicka på länken i det.
Därefter landar alla förfrågningar direkt i inkorgen (snyggt formaterade som tabell).

Tips: gör själv det första test-inskicket direkt efter lansering.
Om FormSubmit inte kan nås faller formuläret automatiskt tillbaka på mailto.

## 2b. Nyhetsbrevet

Anmälningar från nyhetsbrevsformuläret (startsidan) och kryssrutan i offertformuläret
mejlas till info@vsgruppenab.se via FormSubmit (märkta "Nyhetsbrevsanmälan" resp.
"Vill ha nyhetsbrev: Ja"). Spara adresserna i en lista tills vidare.

När ni vill börja skicka riktiga utskick: skapa gratis konto hos **Brevo** (brevo.com,
EU-servrar) eller MailerLite, importera listan och peka formuläret mot deras API
(ändra FORM_ENDPOINT-anropet i js/main.js under "NYHETSBREV"). GDPR: samtyckestexten
finns redan i formuläret; avregistreringslänk sköter utskickstjänsten.

## 2c. Fasta priser

Prislistan visas som "Lanseras snart" (Rasmus beslut 2026-07-16) — inga priser är publika.
När ni bestämt riktiga priser: be Claude återinföra priskorten i `fasta-priser.html`.

## 3. Google efter lansering

1. **Search Console** (search.google.com/search-console): verifiera domänen och
   skicka in `https://www.vsgruppenab.se/sitemap.xml`
2. **Google Business Profile**: se till att webbplatsadressen pekar på nya sajten
3. Schema.org-märkning (Plumber + betyg) ligger redan i `index.html` och `kontakt.html`
   — testa med search.google.com/test/rich-results

## 4b. Så gör ni uppdateringar (efter lansering)

1. Be Claude om ändringen (ny referens, ändrad text, nya priser, ny sida...)
   — Claude ändrar lokalt i ~/vsgruppen-website och verifierar i förhandsvisningen
2. Claude packar en ny vsgruppenab-lansering.zip på skrivbordet
3. Cloudflare Pages → projektet vsgruppenab → "Create new deployment" → dra in zippen
4. Klart — live på ~30 sekunder. Gamla versioner ligger kvar under "Deployments"
   så ni kan återställa med ett klick om något blir fel.

Tips på sikt: koppla projektet till GitHub (Pages → "Connect to Git") så deployas
ändringar automatiskt när Claude pushar — då försvinner zip-steget helt.

## 4. Att uppdatera själv senare

- **Teamets uppgifter**: mailadresserna `fornamn@vsgruppenab.se` är antagna — verifiera!
  Jakob & Max saknar telefonnummer på sajten.
- **Referenser**: lägg till fler projektkort i `referenser.html` (kopiera ett `<article class="ref-card">`-block)
- **Om oss-texten**: `index.html`, sektionen `#om-oss`
- **Recensioner**: `index.html`, sektionen `#recensioner`

## Filstruktur

```
index.html          Startsida (offertformulär: #offert)
jour.html           Jour 24/7
kontakt.html        Kontaktpersoner + karta
referenser.html     Referensprojekt
404.html            Felsida
pumpar/             Värmepumpssidor med kalkylator
tjanster/           Tjänstesidor
kund/               Privat / Företag / BRF
assets/             Bilder (WebP + original), logotyper, favicon
css/, js/           Stilar och animationer
sitemap.xml         Skickas in i Search Console
robots.txt          Tillåter indexering
```
