/* ============ VS GRUPPEN — ANIMATIONER (startsidan) ============ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  }

  /* ---------- NAV ---------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav__mobile a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- CONTACT FORM ----------
     Skickas via FormSubmit (https://formsubmit.co) direkt till info@vsgruppenab.se.
     OBS: Första inskicket efter lansering triggar ett aktiveringsmejl från FormSubmit
     till info@vsgruppenab.se — klicka på länken i det en gång, sen fungerar allt.
     Om tjänsten inte kan nås faller formuläret tillbaka på ett vanligt mailto. */
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/info@vsgruppenab.se";
  const form = document.getElementById("contactForm");
  if (form) {
    const statusEl = document.getElementById("formStatus");
    const submitBtn = document.getElementById("formSubmit");

    const readForm = () => ({
      name: document.getElementById("fName").value.trim(),
      email: document.getElementById("fEmail").value.trim(),
      phone: document.getElementById("fPhone").value.trim(),
      area: document.getElementById("fArea").value.trim(),
      type: document.getElementById("fType").value,
      message: document.getElementById("fMsg").value.trim(),
      newsletter: document.getElementById("fNews") && document.getElementById("fNews").checked ? "Ja" : "Nej",
    });

    const mailtoFallback = (d) => {
      const body = encodeURIComponent(
        `Hej VS Gruppen!\n\nÄrende: ${d.type}\n\n${d.message}\n\n— ${d.name}` +
          (d.email ? `\nE-post: ${d.email}` : "") +
          (d.phone ? `\nTelefon: ${d.phone}` : "") +
          (d.area ? `\nOrt: ${d.area}` : "")
      );
      window.location.href = `mailto:info@vsgruppenab.se?subject=${encodeURIComponent(
        "Offertförfrågan — " + d.type
      )}&body=${body}`;
    };

    const setStatus = (text, ok) => {
      statusEl.hidden = false;
      statusEl.textContent = text;
      statusEl.classList.toggle("is-ok", !!ok);
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = readForm();

      submitBtn.disabled = true;
      submitBtn.textContent = "Skickar…";
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: "Offertförfrågan — " + d.type,
            _template: "table",
            _captcha: "false",
            Namn: d.name,
            "E-post": d.email,
            Telefon: d.phone,
            Ort: d.area,
            Ärende: d.type,
            Meddelande: d.message,
            "Vill ha nyhetsbrev": d.newsletter,
          }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        submitBtn.textContent = "Skickat ✓";
        // Tacksidan gör att förfrågningar kan mätas som konvertering i Google Ads
        window.location.href = "tack.html";
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Skicka förfrågan <span aria-hidden="true">→</span>';
        setStatus("Det gick inte att skicka just nu — vi öppnar ditt e-postprogram i stället.", false);
        mailtoFallback(d);
      }
    });
  }

  /* ---------- NYHETSBREV ----------
     Anmälningar mejlas till info@vsgruppenab.se via FormSubmit med ämnet
     "Nyhetsbrevsanmälan". När ni börjar med riktiga utskick: skapa konto hos
     Brevo/MailerLite och peka formuläret dit i stället (se DEPLOY.md). */
  const nlForm = document.getElementById("newsletterForm");
  if (nlForm) {
    const nlStatus = document.getElementById("nlStatus");
    const nlBtn = document.getElementById("nlSubmit");
    nlForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!nlForm.reportValidity()) return;
      const email = document.getElementById("nlEmail").value.trim();
      nlBtn.disabled = true;
      nlBtn.textContent = "Skickar…";
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: "Intresseanmälan — nyhetsbrev",
            _template: "table",
            _captcha: "false",
            "E-post": email,
            Samtycke: "Ja — via intresseanmälan på startsidan (nyhetsbrevet ej lanserat ännu)",
          }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        nlForm.reset();
        nlBtn.textContent = "Klart ✓";
        nlStatus.hidden = false;
        nlStatus.className = "newsletter__status is-ok";
        nlStatus.textContent = "Tack! Du står på listan — du får första utskicket när vi lanserar.";
      } catch (err) {
        nlBtn.disabled = false;
        nlBtn.textContent = "Prenumerera";
        nlStatus.hidden = false;
        nlStatus.className = "newsletter__status is-err";
        nlStatus.textContent = "Något gick fel — mejla oss på info@vsgruppenab.se så lägger vi till dig.";
      }
    });
  }

  /* ---------- GSAP SCENES ---------- */
  if (!hasGsap || prefersReduced) {
    document.documentElement.classList.add("reduced-motion");
    document.querySelectorAll(".reveal").forEach((el) => (el.style.opacity = 1));
    return;
  }

  // Hero entrance
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .from(".nav__inner", { y: -30, opacity: 0, duration: 0.7 })
    .from(".hero__eyebrow", { y: 24, opacity: 0, duration: 0.6 }, "-=0.3")
    .from(".hero__line", { yPercent: 110, duration: 0.9, stagger: 0.12, ease: "power4.out" }, "-=0.35")
    .from(".hero__sub", { y: 26, opacity: 0, duration: 0.7 }, "-=0.5")
    .from(".hero__actions .btn", { y: 22, opacity: 0, duration: 0.55, stagger: 0.1 }, "-=0.45")
    .from(".hero__rating", { y: 18, opacity: 0, duration: 0.5 }, "-=0.35")
    .from(".hero__trust li", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3")
    .from(".hero__scrollcue", { opacity: 0, duration: 0.8 }, "-=0.2");

  // Filmisk bakgrund: långsam Ken Burns-zoom + parallax vid scroll
  const heroBg = document.getElementById("heroBgImg");
  if (heroBg) {
    gsap.fromTo(heroBg, { scale: 1.14 }, { scale: 1.04, duration: 3, ease: "power2.out" });
    gsap.to(heroBg, {
      scale: 1.1, duration: 20, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 3,
    });
    gsap.to(heroBg, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: ".hero--cinema", start: "top top", end: "bottom top", scrub: true },
    });
  }

  // Jour strip pulse handled in CSS; give the strip a slide-in
  gsap.from(".jourstrip__inner", {
    y: 24, opacity: 0, duration: 0.7, ease: "power2.out",
    scrollTrigger: { trigger: ".jourstrip", start: "top 95%" },
  });

  // Reviews marquee: duplicate cards and loop
  const track = document.getElementById("reviewsTrack");
  if (track) {
    track.innerHTML += track.innerHTML;
    const half = track.scrollWidth / 2;
    const marqueeTween = gsap.to(track, {
      x: -half,
      duration: 55,
      ease: "none",
      repeat: -1,
      modifiers: { x: (x) => (parseFloat(x) % half) + "px" },
    });
    track.addEventListener("mouseenter", () => marqueeTween.timeScale(0.15));
    track.addEventListener("mouseleave", () => marqueeTween.timeScale(1));
  }

  // Generic scroll reveals
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { y: 44, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" },
      }
    );
  });

  // Card grids stagger (services, pumps, steps)
  [".service-card", ".pump-card", ".step"].forEach((sel) => {
    ScrollTrigger.batch(sel, {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { y: 54, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", overwrite: true }
        ),
    });
  });

  // Step numbers pop
  ScrollTrigger.batch(".step__num", {
    start: "top 88%",
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { scale: 0, rotation: -30 },
        { scale: 1, rotation: 0, duration: 0.6, stagger: 0.12, delay: 0.25, ease: "back.out(2.2)", overwrite: true }
      ),
  });

  // Case banner parallax
  gsap.to("#caseBannerImg", {
    yPercent: 16,
    ease: "none",
    scrollTrigger: { trigger: ".casebanner", start: "top bottom", end: "bottom top", scrub: true },
  });

  // Contact: pulse rings + icon micro-animations
  gsap.to(".pulse-ring", {
    scale: 1.45,
    opacity: 0,
    duration: 1.8,
    repeat: -1,
    stagger: { each: 0.6 },
    startAt: { scale: 1, opacity: 0.8 },
    ease: "power1.out",
  });
  gsap.to(".contact-card__icon--phone svg", {
    rotate: 12,
    duration: 0.12,
    repeat: 7,
    yoyo: true,
    ease: "sine.inOut",
    scrollTrigger: { trigger: ".contact__cards", start: "top 80%" },
    delay: 0.8,
  });
  gsap.to(".pin-dot", {
    y: -3, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut",
  });

  // Footer subtle fade
  gsap.from(".footer__inner > div", {
    y: 26,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: "power2.out",
    scrollTrigger: { trigger: ".footer", start: "top 92%" },
  });
})();
