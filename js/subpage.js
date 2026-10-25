/* ============ VS GRUPPEN — UNDERSIDOR ============ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- KAMPANJSPÅRNING (cookiefri) ----------
     Annonsklick kan landa på undersidor — spara utm-parametrarna så att
     offertformuläret på startsidan kan rapportera kampanjen. */
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("utm_source") || params.has("gclid") || params.has("fbclid")) {
      const bits = [];
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
        if (params.get(k)) bits.push(k.replace("utm_", "") + ": " + params.get(k));
      });
      if (params.has("gclid")) bits.push("Google Ads-klick");
      if (params.has("fbclid")) bits.push("Meta Ads-klick");
      sessionStorage.setItem("vsCampaign", bits.join(" · "));
    }
  } catch (e) {}

  /* ---------- NAV ---------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });

  /* ---------- KALKYLATOR (om sidan har en) ---------- */
  const calc = document.querySelector(".calc");
  const fmt = (n) => Math.round(n).toLocaleString("sv-SE");
  let lastResult = { year: 0, ten: 0, next: 0 };

  function updateCalc(animate) {
    if (!calc) return;
    const pageFactor = parseFloat(calc.dataset.factor);
    const cost = parseFloat(document.getElementById("calcCost").value);
    const typeFactor = parseFloat(document.getElementById("calcType").value);
    document.getElementById("calcCostOut").textContent = fmt(cost) + " kr";

    const saving = Math.min(cost * pageFactor * typeFactor, cost * 0.85);
    const target = { year: saving, ten: saving * 10, next: cost - saving };
    const els = {
      year: document.getElementById("calcYear"),
      ten: document.getElementById("calcTen"),
      next: document.getElementById("calcNew"),
    };

    if (hasGsap && !prefersReduced && animate) {
      const obj = { ...lastResult };
      gsap.to(obj, {
        ...target,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          els.year.textContent = fmt(obj.year);
          els.ten.textContent = fmt(obj.ten);
          els.next.textContent = fmt(obj.next);
        },
      });
    } else {
      els.year.textContent = fmt(target.year);
      els.ten.textContent = fmt(target.ten);
      els.next.textContent = fmt(target.next);
    }
    lastResult = target;
  }

  if (calc) {
    document.getElementById("calcCost").addEventListener("input", () => updateCalc(false));
    document.getElementById("calcCost").addEventListener("change", () => updateCalc(true));
    document.getElementById("calcType").addEventListener("change", () => updateCalc(true));
  }

  /* ---------- ANIMATIONER ---------- */
  /* ---------- PROJEKTFILTER (projektsidan) ---------- */
  const projFilter = document.querySelector(".projfilter");
  if (projFilter) {
    const chips = projFilter.querySelectorAll("[data-filter]");
    const cards = document.querySelectorAll(".projgrid .proj");
    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const f = chip.dataset.filter;
        // Se till att alla kort är färdig-animerade innan vi filtrerar
        cards.forEach((card) => { card.style.opacity = 1; card.style.transform = "none"; });
        cards.forEach((card) => card.classList.toggle("is-hidden", f !== "alla" && card.dataset.cat !== f));
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      })
    );
  }

  /* ---------- BILDGALLERI MED LIGHTBOX (projektdetaljsidor) ---------- */
  const galleryImgs = document.querySelectorAll(".galleri img");
  if (galleryImgs.length) {
    const dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    const big = document.createElement("img");
    big.alt = "";
    dlg.appendChild(big);
    const closeBtn = document.createElement("button");
    closeBtn.className = "lightbox__close";
    closeBtn.setAttribute("aria-label", "Stäng");
    closeBtn.innerHTML = "&times;";
    dlg.appendChild(closeBtn);
    document.body.appendChild(dlg);
    galleryImgs.forEach((img) =>
      img.addEventListener("click", () => {
        big.src = img.src;
        big.alt = img.alt;
        dlg.showModal();
      })
    );
    dlg.addEventListener("click", () => dlg.close());
  }

  if (!hasGsap || prefersReduced) {
    document.documentElement.classList.add("reduced-motion");
    document.querySelectorAll(".reveal").forEach((el) => (el.style.opacity = 1));
    updateCalc(false);
    return;
  }

  // Statistiksiffror räknar upp (projektsidans hero)
  const statEls = document.querySelectorAll(".projhero__stats strong[data-count]");
  statEls.forEach((el, i) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const fmt = (v) => v.toFixed(dec).replace(".", ",") + suffix;
    const obj = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(obj, {
      v: target,
      duration: 1.7,
      delay: 0.35 + i * 0.2,
      ease: "power2.out",
      onUpdate() { el.textContent = fmt(obj.v); },
      onComplete() { el.textContent = fmt(target); },
    });
  });

  const heroCols = document.querySelectorAll(".subhero__grid > div");
  if (heroCols.length) {
    gsap.from(heroCols, { y: 36, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" });
  } else {
    const heroBlock = document.querySelector(".subhero .container");
    if (heroBlock) gsap.from(heroBlock, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out" });
  }

  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%" } }
    );
  });

  if (document.querySelector(".howstep")) {
    ScrollTrigger.batch(".howstep", {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.14, ease: "power3.out", overwrite: true }
        ),
    });
  }

  // Animate calculator numbers the first time it scrolls into view
  if (calc) {
    ScrollTrigger.create({
      trigger: ".calc",
      start: "top 80%",
      once: true,
      onEnter: () => updateCalc(true),
    });
  }
})();
