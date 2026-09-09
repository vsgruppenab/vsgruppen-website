/* ============ VS GRUPPEN — FLYTANDE KONTAKTKNAPP ============
   Liten knapp nere till höger på alla sidor: ring eller mejla oss
   oavsett var på sajten besökaren befinner sig. */
(function () {
  "use strict";

  const fab = document.createElement("div");
  fab.className = "fab";
  fab.innerHTML = `
    <div class="fab__panel" id="fabPanel" role="menu" aria-label="Kontakta oss" hidden>
      <p class="fab__note"><span class="fab__dot" aria-hidden="true"></span> Vi svarar dygnet runt</p>
      <a class="fab__item" href="tel:0768827070" role="menuitem">
        <span class="fab__item-icon fab__item-icon--tel" aria-hidden="true">
          <svg viewBox="0 0 20 20"><path d="M6 3h3l1.5 4-2 1.5a10 10 0 0 0 3.5 3.5L13.5 10 17 11.5V15a1.5 1.5 0 0 1-1.5 1.5A13 13 0 0 1 4.5 4.5 1.5 1.5 0 0 1 6 3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        </span>
        <span><strong>Ring oss</strong><small>076 – 882 70 70</small></span>
      </a>
      <a class="fab__item" href="mailto:info@vsgruppenab.se" role="menuitem">
        <span class="fab__item-icon fab__item-icon--mail" aria-hidden="true">
          <svg viewBox="0 0 20 20"><rect x="2.5" y="4.5" width="15" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 6l6.5 5 6.5-5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        </span>
        <span><strong>Mejla oss</strong><small>info@vsgruppenab.se</small></span>
      </a>
    </div>
    <button class="fab__btn" id="fabBtn" aria-expanded="false" aria-controls="fabPanel" aria-label="Kontakta oss">
      <svg class="fab__icon fab__icon--phone" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h3.2l1.7 4.6-2.3 1.7a12 12 0 0 0 4.6 4.6l1.7-2.3 4.6 1.7v3.2a1.8 1.8 0 0 1-1.8 1.8A15.5 15.5 0 0 1 5.2 5.3 1.8 1.8 0 0 1 7 3.5z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>
      <svg class="fab__icon fab__icon--close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      <span class="fab__ping" aria-hidden="true"></span>
    </button>
  `;
  document.body.appendChild(fab);

  const btn = fab.querySelector("#fabBtn");
  const panel = fab.querySelector("#fabPanel");

  function setOpen(open) {
    fab.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open);
    if (open) {
      panel.hidden = false;
    } else {
      // vänta ut stängningsanimationen innan hidden
      setTimeout(() => { if (!fab.classList.contains("is-open")) panel.hidden = true; }, 250);
    }
  }

  btn.addEventListener("click", () => setOpen(!fab.classList.contains("is-open")));
  document.addEventListener("click", (e) => {
    if (fab.classList.contains("is-open") && !fab.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && fab.classList.contains("is-open")) { setOpen(false); btn.focus(); }
  });
})();
