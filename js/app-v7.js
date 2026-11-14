(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || "");

  /* ---------- theme (smooth View Transition when supported) ---------- */
  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    var apply = function () {
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    };
    if (document.startViewTransition && !reduce) document.startViewTransition(apply); else apply();
  }
  $("#theme").addEventListener("click", toggleTheme);

  /* ---------- tabs (hash routing) ---------- */
  var pages = $$(".page"), tabs = $$(".tabs a");
  var names = pages.map(function (p) { return p.getAttribute("data-page"); });
  var labels = { about: "About", resume: "Resume", projects: "Projects", certificates: "Certificates", writing: "Writing", skills: "Skills", contact: "Contact" };
  function show(name, userAction) {
    if (names.indexOf(name) < 0) name = "about";
    pages.forEach(function (p) { p.classList.toggle("active", p.getAttribute("data-page") === name); });
    tabs.forEach(function (t) {
      if (t.getAttribute("data-tab") === name) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
    document.title = (labels[name] || "About") + " | Maria Manzoor";
    if (userAction) {
      var small = window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
      var top = small ? Math.max(0, $("#content").getBoundingClientRect().top + window.pageYOffset - 10) : 0;
      window.scrollTo({ top: top, behavior: "instant" });
    }
  }
  window.addEventListener("hashchange", function () { show(location.hash.slice(1), true); });
  show(location.hash.slice(1), false);

  /* ---------- profile card: show/hide contacts on small screens ---------- */
  var side = $("#side"), more = $("#more");
  more.addEventListener("click", function () {
    var open = side.classList.toggle("open");
    more.setAttribute("aria-expanded", String(open));
    $("span", more).textContent = open ? "Hide contacts" : "Show contacts";
  });

  /* ---------- project filter ---------- */
  var pills = $$(".pill"), cards = $$(".proj");
  pills.forEach(function (p) {
    p.addEventListener("click", function () {
      var f = p.getAttribute("data-f");
      pills.forEach(function (x) { x.setAttribute("aria-pressed", String(x === p)); });
      cards.forEach(function (c) { c.hidden = !(f === "all" || c.getAttribute("data-c") === f); });
    });
  });

  /* ---------- dialogs ---------- */
  function openDialog(d) { if (d.showModal) d.showModal(); else d.setAttribute("open", ""); }
  function closeDialog(d) { if (d.close) d.close(); else d.removeAttribute("open"); }
  $$("dialog").forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) closeDialog(d); });
    $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { closeDialog(d); }); });
  });
  var pdlg = $("#pdlg");
  cards.forEach(function (c) {
    $(".more-btn", c).addEventListener("click", function () {
      $("#pdlg-by").textContent = c.getAttribute("data-by");
      $("#pdlg-title").innerHTML = c.getAttribute("data-title");
      $("#pdlg-lead").textContent = $(".lead", c).textContent;
      $("#pdlg-body").innerHTML = $(".more", c).innerHTML;
      $("#pdlg-tags").innerHTML = $(".tags", c).innerHTML;
      var a = $("#pdlg-link");
      a.href = c.getAttribute("data-url");
      a.textContent = c.getAttribute("data-label") + " ↗";
      openDialog(pdlg);
    });
  });


  /* ---------- certificates: filter + full-size viewer ---------- */
  var cpills = $$("[data-cf]"), certs = $$(".cert"), cdlg = $("#cdlg"), cur = 0;
  cpills.forEach(function (p) {
    p.addEventListener("click", function () {
      var f = p.getAttribute("data-cf");
      cpills.forEach(function (x) { x.setAttribute("aria-pressed", String(x === p)); });
      certs.forEach(function (c) { c.hidden = !(f === "all" || c.getAttribute("data-c") === f); });
    });
  });
  function visibleCerts() { return certs.filter(function (c) { return !c.hidden; }); }
  function showCert(i) {
    var v = visibleCerts(); if (!v.length) return;
    cur = (i + v.length) % v.length;
    var c = v[cur], img = $("img", c);
    $("#cdlg-img").src = c.getAttribute("data-full");
    $("#cdlg-img").alt = img.alt;
    $("#cdlg-title").textContent = $(".cert-t", c).textContent;
    $("#cdlg-sub").textContent = $(".cert-i", c).textContent + " · " + $(".cert-d", c).textContent;
    $("#cdlg-count").textContent = (cur + 1) + " / " + v.length;
    $("#cdlg-open").href = c.getAttribute("data-full");
  }
  certs.forEach(function (c) {
    $(".cert-btn", c).addEventListener("click", function () {
      showCert(visibleCerts().indexOf(c)); openDialog(cdlg);
    });
  });
  $("#cdlg-prev").addEventListener("click", function () { showCert(cur - 1); });
  $("#cdlg-next").addEventListener("click", function () { showCert(cur + 1); });
  cdlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); showCert(cur - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); showCert(cur + 1); }
  });

  /* ---------- copy buttons ---------- */
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      var a = document.createElement("textarea");
      a.value = t; a.style.position = "fixed"; a.style.opacity = "0";
      document.body.appendChild(a); a.select();
      try { document.execCommand("copy") ? res() : rej(); } catch (e) { rej(e); }
      document.body.removeChild(a);
    });
  }
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var old = b.textContent;
      copyText(b.getAttribute("data-copy"))
        .then(function () { b.textContent = "Copied ✓"; b.classList.add("ok"); }, function () { b.textContent = "Press Ctrl+C"; })
        .then(function () { setTimeout(function () { b.textContent = old; b.classList.remove("ok"); }, 1800); });
    });
  });

  /* ---------- command palette (Ctrl/⌘ + K) ---------- */
  var cmd = $("#cmdk"), input = $("#cmd-input"), list = $("#cmd-list"), empty = $("#cmd-empty");
  function go(name) { closeDialog(cmd); location.hash = name; }
  function ext(url) { closeDialog(cmd); window.open(url, "_blank", "noopener"); }
  var items = [
    { g: "Go to", i: "◉", t: "About", k: "about me", run: function () { go("about"); } },
    { g: "Go to", i: "◉", t: "Resume", k: "resume experience education volunteering jobs", run: function () { go("resume"); } },
    { g: "Go to", i: "◉", t: "Projects", k: "projects work portfolio", run: function () { go("projects"); } },
    { g: "Go to", i: "◉", t: "Writing & research", k: "writing articles medium isoc research paper ieee", run: function () { go("writing"); } },
    { g: "Go to", i: "◉", t: "Skills", k: "skills tools stack", run: function () { go("skills"); } },
    { g: "Go to", i: "◉", t: "Contact", k: "contact message email", run: function () { go("contact"); } },
    { g: "Go to", i: "◉", t: "Certificates", k: "certificates certificate degree msc award prize training cpd", run: function () { go("certificates"); } },
    { g: "Actions", i: "↗", t: "Hire me on Upwork", s: "Upwork", k: "upwork freelance hire", run: function () { ext("https://www.upwork.com/freelancers/~01010d024325ed192e"); } },
    { g: "Actions", i: "↓", t: "Download CV", s: "PDF", k: "cv resume download", run: function () { closeDialog(cmd); var a = document.createElement("a"); a.href = "assets/Maria-Manzoor-CV.pdf"; a.download = "Maria-Manzoor-CV.pdf"; document.body.appendChild(a); a.click(); a.remove(); } },
    { g: "Actions", i: "✉", t: "Send an email", s: "mariamanzoordc@gmail.com", k: "email mail", run: function () { closeDialog(cmd); location.href = "mailto:mariamanzoordc@gmail.com"; } },
    { g: "Actions", i: "⧉", t: "Copy email address", k: "copy email", run: function () { copyText("mariamanzoordc@gmail.com"); closeDialog(cmd); } },
    { g: "Links", i: "in", t: "LinkedIn", s: "in/mariaamanzoor", k: "linkedin social", run: function () { ext("https://www.linkedin.com/in/mariaamanzoor"); } },
    { g: "Links", i: "M", t: "Medium", s: "Writer profile", k: "medium writing blog", run: function () { ext("https://lnkd.in/dmgpGgJW"); } },
    { g: "Links", i: "✎", t: "ISOC DMU articles", s: "2 articles", k: "articles isoc dmu writing", run: function () { ext("https://lnkd.in/eMx7zJVA"); } },
    { g: "Links", i: "▤", t: "IEEE paper", s: "IEEE Xplore", k: "paper ieee research publication", run: function () { ext("https://ieeexplore.ieee.org/document/11499481"); } },
    { g: "Links", i: "C", t: "Cloudspart", s: "cloudspart.com", k: "cloudspart company", run: function () { ext("https://cloudspart.com/"); } },
    { g: "Links", i: "U", t: "upgradeVIP", s: "upgradevip.com", k: "upgradevip company", run: function () { ext("https://upgradevip.com/"); } },
    { g: "Links", i: "A", t: "Aaminah's Selections", s: "Live store", k: "aaminah store ecommerce shop", run: function () { ext("https://www.aaminahsselections.co.uk/aaminastore"); } },
    { g: "Preferences", i: "◐", t: "Toggle light / dark theme", k: "theme dark light mode", run: function () { closeDialog(cmd); toggleTheme(); } }
  ];
  var shown = [], active = 0;
  function setActive(n, scroll) {
    active = n;
    $$('[role="option"]', list).forEach(function (el, i) {
      var on = i === n; el.setAttribute("aria-selected", String(on));
      if (on) { input.setAttribute("aria-activedescendant", el.id); if (scroll) el.scrollIntoView({ block: "nearest" }); }
    });
  }
  function render(q) {
    q = (q || "").trim().toLowerCase();
    shown = items.filter(function (it) { return !q || (it.t + " " + (it.k || "") + " " + (it.s || "")).toLowerCase().indexOf(q) !== -1; });
    list.innerHTML = "";
    var lastG = "";
    shown.forEach(function (it, n) {
      if (it.g !== lastG) {
        lastG = it.g;
        var h = document.createElement("li"); h.className = "g"; h.setAttribute("role", "presentation"); h.textContent = it.g; list.appendChild(h);
      }
      var li = document.createElement("li");
      li.setAttribute("role", "option"); li.id = "cmd-" + n;
      li.innerHTML = '<span class="ci" aria-hidden="true"></span><span></span>' + (it.s ? "<small></small>" : "");
      li.children[0].textContent = it.i; li.children[1].textContent = it.t;
      if (it.s) li.children[2].textContent = it.s;
      li.addEventListener("click", function () { it.run(); });
      li.addEventListener("pointermove", function () { setActive(n, false); });
      list.appendChild(li);
    });
    empty.hidden = shown.length > 0;
    setActive(0, false);
  }
  function openCmd() { input.value = ""; render(""); openDialog(cmd); setTimeout(function () { input.focus(); }, 30); }
  input.addEventListener("input", function () { render(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (shown.length) setActive((active + 1) % shown.length, true); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (shown.length) setActive((active - 1 + shown.length) % shown.length, true); }
    else if (e.key === "Enter") { e.preventDefault(); if (shown[active]) shown[active].run(); }
  });
  $("#cmd-open").addEventListener("click", openCmd);
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (cmd.open) closeDialog(cmd); else openCmd();
    }
  });
  $("#cmd-open").title = "Search (" + (isMac ? "⌘ K" : "Ctrl K") + ")";

  /* ---------- contact form: opens the visitor's email app ---------- */
  var form = $("#form"), note = $("#note");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var n = form.name.value.trim(), m = form.email.value.trim(), msg = form.message.value.trim(), ok = true;
    [form.name, form.email, form.message].forEach(function (f) { f.classList.remove("bad"); });
    if (!n) { form.name.classList.add("bad"); ok = false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)) { form.email.classList.add("bad"); ok = false; }
    if (!msg) { form.message.classList.add("bad"); ok = false; }
    if (!ok) { note.className = "note err"; note.textContent = "Please complete all fields with a valid email address."; return; }
    if (form._honey && form._honey.value) return;
    var btn = $("button[type=submit]", form), label = btn.textContent;
    btn.disabled = true; btn.textContent = "Sending...";
    note.className = "note"; note.textContent = "";
    var fallback = function (why) {
      try { console.warn("Contact form: AJAX send failed", why); } catch (e) {}
      /* backup: normal form post to FormSubmit, which works from any origin */
      note.className = "note";
      note.textContent = "Sending with the backup method...";
      var next = $("#next-url"); if (next) next.value = location.origin + location.pathname + "#contact";
      var subj = form.elements["_subject"]; if (subj) subj.value = "Portfolio enquiry from " + n;
      setTimeout(function () { HTMLFormElement.prototype.submit.call(form); }, 400);
    };
    fetch("https://formsubmit.co/ajax/mariamanzoordc@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name: n, email: m, message: msg, _subject: "Portfolio enquiry from " + n, _replyto: m, _template: "table", _captcha: "false" })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok && String(x.d.success) !== "false") {
          note.className = "note ok";
          note.textContent = "Thank you, " + n.split(" ")[0] + ". Your message has been sent and I will reply by email.";
          form.reset();
        } else { fallback(x.d && x.d.message); }
      })
      .catch(fallback)
      .then(function () { setTimeout(function () { btn.disabled = false; btn.textContent = label; }, 1500); });
  });

  $("#yr").textContent = new Date().getFullYear();
})();
