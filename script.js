/* ============================================================
   SETTINGS — edit this one line after you publish the site.
   Paste your GitHub Pages link between the quotes, e.g.
   "https://YOUR-USERNAME.github.io/for-my-jaan/"
   ============================================================ */
const SITE_URL = "PASTE_YOUR_PUBLISHED_LINK_HERE";
const SHARE_TEXT = "Ek chhota sa surprise, sirf tumhare liye ❤️";

(function () {
  "use strict";
  var screens = Array.prototype.slice.call(document.querySelectorAll(".screen"));
  var dots = document.querySelectorAll("#progress li");
  var current = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Screen navigation ---------- */
  function go(n) {
    if (n < 0 || n >= screens.length) return;
    screens[current].classList.remove("active");
    screens[current].hidden = true;
    current = n;
    screens[current].hidden = false;
    screens[current].classList.add("active");
    window.scrollTo(0, 0);
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("done", i <= current);
    var h = screens[current].querySelector("h1,h2");
    if (h) h.focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-next]")) go(current + 1);
  });

  /* ---------- Background hearts and sparkles ---------- */
  var bg = document.getElementById("bg");
  if (!reduceMotion) {
    for (var i = 0; i < 18; i++) {
      var el = document.createElement("span");
      var heart = i % 3 !== 0;
      el.className = "fl " + (heart ? "h" : "s");
      if (heart) { el.style.fontSize = (6 + Math.random() * 10) + "px"; el.innerHTML = '<span class="hs"></span>'; }
      el.style.left = Math.random() * 100 + "%";
      el.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
      el.style.animationDuration = (12 + Math.random() * 14) + "s";
      el.style.animationDelay = (-Math.random() * 20) + "s";
      bg.appendChild(el);
    }
  }

  /* ---------- Screen 3: expandable cards ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".card-head"), function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      document.getElementById(btn.getAttribute("aria-controls")).classList.toggle("open", !open);
    });
  });

  /* ---------- Screen 4: heart game ---------- */
  var game = document.getElementById("game");
  var countEl = document.getElementById("count");
  var msgEl = document.getElementById("game-msg");
  var winEl = document.getElementById("game-win");
  var nextBtn = document.getElementById("game-next");
  var messages = [
    "Aap meri favourite feeling ho.",
    "Aapke saath chhoti si baat bhi special lagti hai.",
    "Aapki smile mere din ko better bana deti hai.",
    "Main aapko samajhna aur behtar chahti hoon.",
    "Aap mere liye bahut precious ho, sona."
  ];
  /* Safe positions (percent of the game box) so hearts always stay inside */
  var spots = [[8, 12], [62, 8], [35, 42], [10, 68], [66, 62]];
  var collected = 0;

  function buildGame() {
    collected = 0;
    game.innerHTML = "";
    countEl.textContent = "0";
    msgEl.textContent = "Kisi bhi dil ko tap karo.";
    winEl.hidden = true;
    nextBtn.hidden = true;
    spots.forEach(function (p, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pick";
      b.setAttribute("aria-label", "Dil " + (idx + 1));
      b.style.left = "min(" + p[0] + "%, calc(100% - 64px))";
      b.style.top = "min(" + p[1] + "%, calc(100% - 64px))";
      b.style.animationDelay = (idx * 0.4) + "s";
      b.innerHTML = '<span class="hs"></span>';
      b.addEventListener("click", function () {
        if (b.classList.contains("got")) return;
        b.classList.add("got");
        b.disabled = true;
        countEl.textContent = String(++collected);
        msgEl.textContent = messages[collected - 1];
        if (collected === 5) {
          winEl.hidden = false;
          nextBtn.hidden = false;
          nextBtn.focus({ preventScroll: true });
        }
      });
      game.appendChild(b);
    });
  }
  buildGame();

  /* ---------- Screen 5: envelope ---------- */
  var env = document.getElementById("envelope");
  var letter = document.getElementById("letter");
  env.addEventListener("click", function () {
    var open = env.getAttribute("aria-expanded") === "true";
    if (open) { env.setAttribute("aria-expanded", "false"); letter.hidden = true; return; }
    env.setAttribute("aria-expanded", "true");
    setTimeout(function () {
      letter.hidden = false;
      letter.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }, reduceMotion ? 0 : 700);
  });

  /* ---------- Screen 6: hug, share, restart ---------- */
  var hugBtn = document.getElementById("hug-btn");
  var hugMsg = document.getElementById("hug-msg");
  hugBtn.addEventListener("click", function () {
    hugMsg.hidden = false;
    hugMsg.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    if (reduceMotion) return;
    var r = hugBtn.getBoundingClientRect();
    for (var i = 0; i < 16; i++) {
      var s = document.createElement("span");
      s.className = "burst";
      s.innerHTML = '<span class="hs"></span>';
      s.style.left = (r.left + r.width / 2) + "px";
      s.style.top = (r.top + r.height / 2) + "px";
      var a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 120;
      s.style.setProperty("--bx", Math.cos(a) * d + "px");
      s.style.setProperty("--by", (Math.sin(a) * d - 60) + "px");
      document.body.appendChild(s);
      setTimeout(function (n) { n.remove(); }, 1500, s);
    }
  });

  var shareNote = document.getElementById("share-note");
  document.getElementById("share-btn").addEventListener("click", function () {
    var configured = SITE_URL && SITE_URL.indexOf("PASTE_YOUR") === -1;
    var url = configured ? SITE_URL : (/^https?:/.test(location.protocol) ? location.href : "");
    if (!url) {
      shareNote.textContent = "Pehle script.js mein SITE_URL apne published link se badal do.";
      shareNote.hidden = false;
      return;
    }
    if (navigator.share) {
      navigator.share({ title: document.title, text: SHARE_TEXT, url: url }).catch(function () {});
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(SHARE_TEXT + " " + url), "_blank", "noopener");
    }
  });

  function restart() {
    buildGame();
    env.setAttribute("aria-expanded", "false");
    letter.hidden = true;
    hugMsg.hidden = true;
    shareNote.hidden = true;
    Array.prototype.forEach.call(document.querySelectorAll(".card-head"), function (b) { b.setAttribute("aria-expanded", "false"); });
    Array.prototype.forEach.call(document.querySelectorAll(".card-body"), function (c) { c.classList.remove("open"); });
    go(0);
  }
  document.getElementById("restart-top").addEventListener("click", restart);
  document.getElementById("restart-end").addEventListener("click", restart);

  go(0);
})();
