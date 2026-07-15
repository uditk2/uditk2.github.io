/* ============================================================
   Udit Khandelwal — uditk2.github.io
   Vanilla JS: constellation, reveals, tilt, rotator, PiP tour.
   All lightweight. Respects prefers-reduced-motion. No deps.
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Typed role rotator ---------- */
  (function rotator() {
    var el = document.getElementById("rotator");
    if (!el) return;
    var words = ["Founder", "Principal Engineer", "Eternal learner", "Now learning to distribute", "AR game maker"];
    if (reduceMotion) { el.textContent = words[0]; el.style.borderRight = "none"; return; }
    var w = 0, c = 0, deleting = false;
    function tick() {
      var word = words[w];
      el.textContent = deleting ? word.substring(0, c--) : word.substring(0, c++);
      var delay = deleting ? 45 : 90;
      if (!deleting && c === word.length + 1) { deleting = true; delay = 1500; c = word.length; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    }
    tick();
  })();

  /* ---------- Scroll reveal ---------- */
  (function reveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i) { io.observe(i); });
  })();

  /* ---------- Card pointer glow + subtle tilt ---------- */
  (function tilt() {
    if (reduceMotion) return;
    var cards = document.querySelectorAll(".tilt");
    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (ev) {
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width;
        var py = (ev.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        var rx = (0.5 - py) * 5, ry = (px - 0.5) * 5;
        card.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  })();

  /* ---------- Constellation canvas ---------- */
  (function constellation() {
    var canvas = document.getElementById("constellation");
    if (!canvas || reduceMotion) { if (canvas) canvas.style.display = "none"; return; }
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    var w, h, pts, raf, running = true;
    var mouse = { x: -9999, y: -9999 };

    function size() {
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr);
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      var target = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
      pts = [];
      for (var i = 0; i < target; i++) {
        pts.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18 * dpr,
          vy: (Math.random() - 0.5) * 0.18 * dpr,
          r: (Math.random() * 1.4 + 0.4) * dpr
        });
      }
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(210,216,224,0.5)";
        ctx.fill();
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d = dx * dx + dy * dy;
          var max = 120 * dpr * (120 * dpr);
          if (d < max) {
            var a = (1 - d / max) * 0.26;
            ctx.strokeStyle = "rgba(180,186,196," + a + ")";
            ctx.lineWidth = dpr * 0.6;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        // subtle mouse attraction glow
        var mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        var md = mdx * mdx + mdy * mdy;
        var mmax = 160 * dpr * (160 * dpr);
        if (md < mmax) {
          var ma = (1 - md / mmax) * 0.5;
          ctx.strokeStyle = "rgba(255,255,255," + ma + ")";
          ctx.lineWidth = dpr * 0.7;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("pointermove", function (e) {
      mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr;
    });
    window.addEventListener("pointerout", function () { mouse.x = mouse.y = -9999; });
    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) { draw(); } else if (raf) cancelAnimationFrame(raf);
    });
    size(); draw();
  })();

  /* ---------- Picture-in-picture guided tour ---------- */
  (function tour() {
    var launch = document.getElementById("pipLaunch");
    var pip = document.getElementById("pip");
    if (!launch || !pip) return;
    var stepEl = document.getElementById("pipStep");
    var countEl = document.getElementById("pipCount");
    var barEl = document.getElementById("pipBar");
    var nextBtn = document.getElementById("pipNext");
    var prevBtn = document.getElementById("pipPrev");
    var closeBtn = document.getElementById("pipClose");

    var steps = [
      { sel: "#hero",     text: "Meet Udit — a builder who never stops learning. Here's a 20-second tour." },
      { sel: "#about",    text: "The nature: curious, hands-on, allergic to standing still. Range over lanes." },
      { sel: "#howiwork", text: "The operating system: build end-to-end, learn relentlessly, and now — crack distribution." },
      { sel: "#work",     text: "The proof: Seerly, AR webcam games, AI/ML experiments, and quant builds." },
      { sel: "#writing",  text: "The thinking: short notes on building, AI-era discovery, and growth." },
      { sel: "#collab",   text: "The ask: open to collaborations — building, or distributing what's built. Say hi." }
    ];
    var idx = 0, active = false, prevSpot = null;

    function spotlight(sel) {
      if (prevSpot) prevSpot.classList.remove("tour-spot");
      var target = document.querySelector(sel);
      if (target) {
        target.classList.add("tour-spot");
        prevSpot = target;
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    }
    function render() {
      var s = steps[idx];
      stepEl.textContent = s.text;
      countEl.textContent = (idx + 1) + " / " + steps.length;
      barEl.style.width = ((idx + 1) / steps.length * 100) + "%";
      prevBtn.disabled = idx === 0;
      prevBtn.style.opacity = idx === 0 ? 0.4 : 1;
      nextBtn.textContent = idx === steps.length - 1 ? "Finish" : "Next";
      spotlight(s.sel);
    }
    function open() { active = true; pip.hidden = false; launch.style.display = "none"; idx = 0; render(); }
    function close() {
      active = false; pip.hidden = true; launch.style.display = "";
      if (prevSpot) { prevSpot.classList.remove("tour-spot"); prevSpot = null; }
    }
    launch.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    nextBtn.addEventListener("click", function () {
      if (idx === steps.length - 1) { close(); return; }
      idx++; render();
    });
    prevBtn.addEventListener("click", function () { if (idx > 0) { idx--; render(); } });
    document.addEventListener("keydown", function (e) {
      if (!active) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") nextBtn.click();
      else if (e.key === "ArrowLeft") prevBtn.click();
    });
  })();
})();
