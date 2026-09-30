# VS Gruppen — Film 1: "Det läcker" · showreel (20 s)

Snabb motion graphics-reel i sajtens formspråk. Panelsvep mellan scenerna, typografi som
slår in med översläng, konstant rörelse — inga döda bildrutor förrän slutkortet.
Ett enda budskap: **det läcker → stäng av kranen → ring jouren.**
Inga formulär, ingen offertresa. De fem stegen blir Film 2.

**Format:** 1920×1080 och 1080×1920, 30 fps, 600 frames (20,0 s)
**Palett:** `#1535cb` kobolt · `#0a1650` marin · `#e8452f` akut · `#f0f3fe` ljus bg
**Typsnitt:** Poppins (samma som sajten)
**Text på skärmen:** ja — filmen fungerar helt utan ljud.
**Rendera:** `npm start` (studio) · `npm run build` (liggande) · `npm run build:vertical` (stående)

---

## Speakermanus med tidskoder

Tempot är högt. Korta meningar, `//` = kort paus. Vi klipper animationen mot din inläsning.

| Tid | Speaker |
|---|---|
| 00:00,5 | Det läcker. |
| 00:03,5 | Vatten på golvet. // Hemma. Just nu. |
| 00:07,5 | Stäng av huvudkranen. |
| 00:11,5 | Och ring oss. // Noll sju sex — åtta åtta två, sjuttio, sjuttio. |
| 00:16 | VS Gruppen. // Jour dygnet runt i Linköping. |

Ordantal: ~30. Talid ca 14 s av 20.

---

## Scen för scen

Scenerna överlappar 0,5 s: den nya panelen sveper in från höger med ett smalt kantband
som leder svepet, den gamla glider ut åt vänster.

### S1 · KALLSTART — 00:00–00:03,7
En stor droppe faller rakt ner och slår i. Ringar exploderar utåt, stänk skjuter upp.
**På skärmen:** `DET LÄCKER.` slår in ord för ord · `Hemma. Just nu.`

### S2 · TOALETTEN — 00:03,2–00:07,5
Toaletten monteras i bild: cisternen faller ner, skålen kommer upp underifrån, tilloppsröret
glider in från vänster. Kopplingen droppar i snabb takt, fuktfläcken breder ut sig.
Långsam inzoomning hela scenen.
**På skärmen:** `Vatten på golvet.`

### S3 · STÄNG AV — 00:07,1–00:11,4
Röret skjuts in från vänster, fullt av strömmande vatten. Huvudkranen faller ner ovanifrån.
Spaken smäller om med översläng — hela bilden rycker till — flödet stannar och röret töms nedströms.
**På skärmen:** `1` `Stäng av huvudkranen`

### S4 · RING — 00:10,9–00:15,8
Telefonlur i akutröd cirkel studsar in, ringsignaler pulsar ut tätt.
Numret slår in siffra för siffra.
**På skärmen:** `2` `Ring oss direkt` · `076 882 70 70` · `24/7` `Jour i Linköping, året om`

### S5 · SLUTKORT — 00:15,3–00:20
Marin panel sveper in. Logotypen studsar in, akutröd linje ritas, texterna slår in.
Ligger stilla de sista ~2 s — fungerar som thumbnail.
**På skärmen:** logotyp · `Rörmokare i Linköping · Dygnet runt` · `076 882 70 70` · `vsgruppen.se`

---

## Film 2, senare
Den planerade resan: de fem stegen, hembesök, fast pris, ROT, uppföljning.
Samma komponenter (`Panel`, `KineticWords`, `StepLabel`) — byggs i samma projekt.
