/* ============ VS GRUPPEN — UNDERSIDOR ============ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

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
  if (!hasGsap || prefersReduced) {
    document.documentElement.classList.add("reduced-motion");
    document.querySelectorAll(".reveal").forEach((el) => (el.style.opacity = 1));
    updateCalc(false);
    return;
  }

  const heroCols = document.querySelectorAll(".subhero__grid > div");
  if (heroCols.length) {
    gsap.from(heroCols, { y: 36, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" });
  } else {
    const heroBlock = document.querySelector(".subhero .container, .jourhero .container");
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
