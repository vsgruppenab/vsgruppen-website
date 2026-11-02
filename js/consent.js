/* ============ VS GRUPPEN — SAMTYCKE & META-PIXEL ============
   Meta-pixeln (1465266695716611) laddas ENDAST efter att besökaren godkänt
   marknadsföringscookies i bannern nedan. Valet sparas i localStorage.
   På tacksidan skickas även "Lead" — konverteringshändelsen som Meta Ads
   optimerar mot. Ingen spårning sker före godkännande eller vid avvisande. */
(function () {
  "use strict";
  var KEY = "vsConsent"; // "yes" | "no"
  var PIXEL_ID = "1465266695716611";

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function loadPixel() {
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
    // Konvertering: offertförfrågan skickad (tacksidan)
    if (/\/tack(\.html)?$/.test(window.location.pathname)) {
      window.fbq("track", "Lead");
    }
  }

  function showBanner() {
    var css =
      ".vsconsent{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;max-width:430px;margin:0 auto;" +
      "background:#0a1650;color:#e2e9fd;border-radius:16px;padding:1.2rem 1.3rem;box-shadow:0 18px 50px rgba(9,14,34,.45);" +
      "font-size:.92rem;line-height:1.5}" +
      ".vsconsent p{margin:0 0 .9rem}" +
      ".vsconsent a{color:#9db4ff}" +
      ".vsconsent__btns{display:flex;gap:.6rem}" +
      ".vsconsent button{flex:1;border:0;border-radius:999px;padding:.6rem 1rem;font:inherit;font-weight:600;cursor:pointer}" +
      ".vsconsent__yes{background:#1535cb;color:#fff}" +
      ".vsconsent__no{background:transparent;color:#e2e9fd;border:1px solid rgba(226,233,253,.35)!important}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var root = location.pathname.split("/").length > 2 && !/^\/[^/]*$/.test(location.pathname) ? "../" : "";
    var el = document.createElement("div");
    el.className = "vsconsent";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Cookies");
    el.innerHTML =
      "<p>Vi vill använda en marknadsföringscookie (Meta) för att mäta våra annonser. Inget annat spåras. <a href=\"" +
      root + "integritetspolicy.html\">Läs mer</a></p>" +
      "<div class=\"vsconsent__btns\">" +
      "<button type=\"button\" class=\"vsconsent__no\">Avvisa</button>" +
      "<button type=\"button\" class=\"vsconsent__yes\">Acceptera</button></div>";
    document.body.appendChild(el);

    el.querySelector(".vsconsent__yes").addEventListener("click", function () {
      setChoice("yes"); el.remove(); loadPixel();
    });
    el.querySelector(".vsconsent__no").addEventListener("click", function () {
      setChoice("no"); el.remove();
    });
  }

  var choice = getChoice();
  if (choice === "yes") loadPixel();
  else if (choice !== "no") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else showBanner();
  }
})();
