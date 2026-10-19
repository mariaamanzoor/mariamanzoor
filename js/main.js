(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById("themeToggle");
  function isDark() {
    var t = doc.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      doc.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var links = document.getElementById("navLinks");
  function closeMenu() {
    if (!links) return;
    links.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Nav shadow + active link ---------- */
  var nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });

    /* ---------- Reveal on scroll + skill bars ---------- */
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          revealer.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { revealer.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Typing effect ---------- */
  var typed = document.getElementById("typed");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typed && !reduce) {
    var words = [];
    try { words = JSON.parse(typed.getAttribute("data-words")); } catch (e) {}
    if (words.length) {
      var w = 0, c = 0, deleting = false;
      (function tick() {
        var word = words[w];
        typed.textContent = word.substring(0, c);
        var delay = deleting ? 45 : 85;
        if (!deleting && c === word.length) { deleting = true; delay = 1600; }
        else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
        c += deleting ? -1 : 1;
        setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  var TO_EMAIL = "mariamanzoordc@gmail.com";
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var msg = form.message.value.trim();
      var ok = true;
      [form.name, form.email, form.message].forEach(function (f) { f.classList.remove("invalid"); });
      if (!name) { form.name.classList.add("invalid"); ok = false; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { form.email.classList.add("invalid"); ok = false; }
      if (!msg) { form.message.classList.add("invalid"); ok = false; }
      if (!ok) {
        note.className = "form-note err";
        note.textContent = "Please fill in all fields with a valid email address.";
        return;
      }
      var subject = "Portfolio enquiry from " + name;
      var body = msg + "\n\n— " + name + " (" + email + ")";
      window.location.href = "mailto:" + TO_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      note.className = "form-note ok";
      note.textContent = "Opening your email app… if nothing happens, email me directly at " + TO_EMAIL + ".";
      form.reset();
    });
  }
})();

/* ============ v2: dynamic effects ============ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll progress bar */
  var bar = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Cursor glow */
  var glow = document.getElementById("glow");
  if (glow && !reduce) {
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      glow.classList.add("on");
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, { passive: true });
  }

  /* Animated counters */
  var counters = document.querySelectorAll(".count");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduce) { el.textContent = target; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else { counters.forEach(runCounter); }

  /* Skill bars animate when their group is revealed */
  document.querySelectorAll(".skill-group").forEach(function (g) {
    if (!("IntersectionObserver" in window)) { g.classList.add("in"); return; }
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { g.classList.add("in"); so.disconnect(); } });
    }, { threshold: 0.3 });
    so.observe(g);
  });

  /* Project filter */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var projects = document.querySelectorAll(".project[data-cat]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.classList.toggle("active", c === chip); });
      projects.forEach(function (p) {
        p.classList.toggle("hide", f !== "all" && p.getAttribute("data-cat") !== f);
      });
    });
  });

  /* 3D tilt on cards and hero photo (fine pointers only) */
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !reduce) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
    var photo = document.getElementById("tilt");
    if (photo) {
      photo.addEventListener("pointermove", function (e) {
        var r = photo.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        photo.style.transform = "perspective(900px) rotateY(" + (x * 12).toFixed(2) + "deg) rotateX(" + (-y * 12).toFixed(2) + "deg)";
      });
      photo.addEventListener("pointerleave", function () { photo.style.transform = ""; });
    }
  }

  /* Hero particle network */
  var canvas = document.getElementById("particles");
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext("2d");
    var dots = [], W = 0, H = 0, mouse = { x: -999, y: -999 }, running = true;
    function size() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(24, Math.min(70, Math.floor(W / 20)));
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 });
      }
    }
    size();
    window.addEventListener("resize", size);
    canvas.parentElement.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { running = es[0].isIntersecting; if (running) draw(); }).observe(canvas);
    }
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var a = dots[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, 6.283);
        ctx.fillStyle = "rgba(127,212,255,.65)"; ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var b = dots[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < 14000) {
            ctx.strokeStyle = "rgba(20,184,166," + (0.28 * (1 - d / 14000)).toFixed(3) + ")";
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        var mx = a.x - mouse.x, my = a.y - mouse.y, md = mx * mx + my * my;
        if (md < 18000) {
          ctx.strokeStyle = "rgba(37,99,235," + (0.5 * (1 - md / 18000)).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
})();
