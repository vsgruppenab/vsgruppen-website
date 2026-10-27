/* Cloudflare Pages Function: hämtar VS Gruppens Google-betyg via Places API (New).
   Kräver secret GOOGLE_PLACES_KEY (wrangler pages secret put GOOGLE_PLACES_KEY).
   Place-id:t löses automatiskt via textsökning och svaret cachas i 6 timmar. */

const SEARCH_QUERY = "VS Gruppen i Linköping AB, Idögatan 49, Linköping";
const CACHE_SECONDS = 6 * 60 * 60;

export async function onRequest(context) {
  const key = context.env.GOOGLE_PLACES_KEY;
  if (!key) return json({ error: "not_configured" }, 503, 300);

  const cache = caches.default;
  const cacheKey = new Request("https://vsgruppenab.pages.dev/__cache/reviews-v1");
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  try {
    // 1) Hitta place-id (env GOOGLE_PLACE_ID går före om satt)
    let placeId = context.env.GOOGLE_PLACE_ID;
    if (!placeId) {
      const sr = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "places.id,places.displayName",
        },
        body: JSON.stringify({ textQuery: SEARCH_QUERY, languageCode: "sv" }),
      });
      const sj = await sr.json();
      placeId = sj.places && sj.places[0] && sj.places[0].id;
      if (!placeId) return json({ error: "place_not_found" }, 502, 600);
    }

    // 2) Hämta betyg, antal och senaste recensioner
    const pr = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=sv`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
      },
    });
    if (!pr.ok) return json({ error: "places_error", status: pr.status }, 502, 600);
    const p = await pr.json();

    const body = {
      rating: p.rating,
      count: p.userRatingCount,
      mapsUrl: p.googleMapsUri,
      reviews: (p.reviews || []).map((r) => ({
        author: r.authorAttribution && r.authorAttribution.displayName,
        rating: r.rating,
        text: r.text && r.text.text,
        when: r.relativePublishTimeDescription,
      })),
    };
    const res = json(body, 200, CACHE_SECONDS);
    context.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch (e) {
    return json({ error: "fetch_failed" }, 502, 600);
  }
}

function json(obj, status, maxAge) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}`,
      "Access-Control-Allow-Origin": "*",
    },
  });
}
