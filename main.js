(function () {
  /* ── Year ── */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Scramble decode ── */
  var MARK_TARGET = "qwertlexi";
  var SCRAMBLE_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*█░▒▓?/\\";
  var SCRAMBLE_COLORS = ["#ff3b6b","#ff8c00","#ffe600","#00e5ff","#b44fff","#00ff99","#ff00cc","#39ff14","#ff6600","#00bfff"];
  function rndColor() { return SCRAMBLE_COLORS[Math.floor(Math.random() * SCRAMBLE_COLORS.length)]; }
  function rndChar()  { return SCRAMBLE_POOL.charAt(Math.floor(Math.random() * SCRAMBLE_POOL.length)); }

  function runMarkScramble() {
    var el = document.getElementById("mark-text");
    if (!el) return;
    var n = MARK_TARGET.length, state = [], colors = [], locked = [];
    for (var i = 0; i < n; i++) { state.push(rndChar()); colors.push(rndColor()); locked.push(false); }
    var frame = 0, maxFrames = 52 + n * 7;
    function tick() {
      frame++;
      var done = true;
      for (var j = 0; j < n; j++) {
        if (!locked[j]) {
          done = false;
          if (frame > 10 + j * 5 && Math.random() < 0.38) { locked[j] = true; state[j] = MARK_TARGET[j]; colors[j] = null; }
          else { state[j] = rndChar(); colors[j] = rndColor(); }
        }
      }
      if (frame >= maxFrames) { for (var k = 0; k < n; k++) { locked[k] = true; state[k] = MARK_TARGET[k]; colors[k] = null; } done = true; }
      var html = "";
      for (var m = 0; m < n; m++) {
        if (colors[m]) html += '<span style="color:' + colors[m] + ';text-shadow:0 0 8px ' + colors[m] + '99">' + state[m] + '</span>';
        else html += state[m];
      }
      el.innerHTML = html;
      if (!done) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  runMarkScramble();
  setInterval(runMarkScramble, 5000);

  /* ── Chrome clock / tick ── */
  var clockEl = document.getElementById("chrome-clock");
  var tickEl  = document.getElementById("chrome-tick");
  var tickN   = 0;
  function pad2(n) { return n < 10 ? "0" + n : String(n); }
  function updateChromeClock() {
    if (!clockEl) return;
    var d = new Date();
    clockEl.textContent = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
  }
  updateChromeClock();
  setInterval(updateChromeClock, 1000);
  setInterval(function () { tickN++; if (tickEl) tickEl.textContent = "tick " + tickN; }, 380);

  /* ── Millisecond clock ── */
  var msClockEl = document.getElementById("ms-clock-time");
  function updateMsClock() {
    if (!msClockEl) return;
    var d = new Date(), ms = d.getMilliseconds();
    msClockEl.textContent = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds()) + "." + (ms < 10 ? "00" : ms < 100 ? "0" : "") + ms;
  }
  updateMsClock();
  setInterval(updateMsClock, 50);

  /* ── Sidebar metrics ── */
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  var NOISE_POOL = ["low", "Δ", "hiss", "· · ·", "████", "~", "??", "null"];
  var MODE_POOL  = ["idle", "drift", "scan", "ghost", "wait", "??", "void"];
  function tickMetrics() {
    document.querySelectorAll("[data-metric]").forEach(function (el) {
      var k = el.getAttribute("data-metric");
      if (k === "noise") el.textContent = pick(NOISE_POOL);
      else if (k === "latency") el.textContent = "~" + Math.floor(4 + Math.random() * 140) + "ms";
      else if (k === "mode") el.textContent = pick(MODE_POOL);
    });
  }
  tickMetrics();
  setInterval(tickMetrics, 1600 + Math.random() * 2400);

  /* ── Parallax ── */
  var stage = document.getElementById("main");
  if (stage) {
    stage.addEventListener("mousemove", function (e) {
      var r = stage.getBoundingClientRect();
      stage.style.setProperty("--parallax-x", ((e.clientX - r.left) / r.width - 0.5) * 28 + "px");
      stage.style.setProperty("--parallax-y", ((e.clientY - r.top) / r.height - 0.5) * 22 + "px");
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────
     CODE CANVAS BACKGROUND
  ───────────────────────────────────────────────────── */
  var canvas = document.getElementById("code-canvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var CODE_SNIPPETS = [
      "const signal = await channel.recv();",
      "if (!ctx) return null;",
      "let entropy = Math.random() * 0xff;",
      "export default function render(props) {",
      "  transform: translate(-50%, -50%);",
      "await fetch('/api/v1/stream');",
      "observer.observe(target, { subtree: true });",
      "// no uplink · local session",
      "function* orbit(r, speed) {",
      "  yield { x: Math.cos(t)*r, y: Math.sin(t)*r };",
      "backdrop-filter: blur(28px);",
      "requestAnimationFrame(tick);",
      "const [state, setState] = useState(null);",
      "/* awaiting channel.select */",
      "z-index: var(--z-portal);",
      "grid-template-columns: repeat(auto-fill, 1fr);",
      "@keyframes orbit-spin { from{ rotate:0 } }",
      "document.dispatchEvent(new CustomEvent('open'));",
      "const data = await response.json();",
      "opacity: color-mix(in srgb, #4cede2 45%, transparent);",
      "while (true) { yield await sleep(380); }",
      "border-radius: clamp(8px, 2vw, 16px);",
      "if (key === 'Escape') closePortal();",
      "performance.now() - t0 < threshold",
      "transform: translate3d(var(--x), var(--y), 0);",
      "filter: drop-shadow(0 0 14px #4cede2);",
    ];

    var lines = [];
    var LINE_COUNT = 28;
    var FONT_SIZE = 11;
    var LINE_SPEED_MIN = 0.18;
    var LINE_SPEED_MAX = 0.6;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function initLines() {
      lines = [];
      var h = canvas.height || 600;
      for (var i = 0; i < LINE_COUNT; i++) {
        lines.push({
          text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
          y: Math.random() * h,
          speed: LINE_SPEED_MIN + Math.random() * (LINE_SPEED_MAX - LINE_SPEED_MIN),
          opacity: 0.08 + Math.random() * 0.22,
          size: FONT_SIZE - 1 + Math.floor(Math.random() * 3),
        });
      }
    }

    function drawCanvas() {
      if (!canvas.width) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var h = canvas.height;
      for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        l.y += l.speed;
        if (l.y > h + 20) {
          l.y = -20;
          l.text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
          l.opacity = 0.08 + Math.random() * 0.22;
          l.speed = LINE_SPEED_MIN + Math.random() * (LINE_SPEED_MAX - LINE_SPEED_MIN);
        }
        ctx.save();
        ctx.font = l.size + "px 'Cutive Mono', monospace";
        ctx.fillStyle = "rgba(2,26,29," + l.opacity + ")";
        ctx.fillText(l.text, 12 + Math.random() * 0.3, l.y);
        ctx.restore();
      }
      requestAnimationFrame(drawCanvas);
    }

    resizeCanvas();
    initLines();
    drawCanvas();
    window.addEventListener("resize", function () { resizeCanvas(); initLines(); });
  }

  /* ─────────────────────────────────────────────────────
     PORTAL / PANEL SYSTEM
  ───────────────────────────────────────────────────── */
  var portal   = document.getElementById("portal");
  var backdrop = document.getElementById("stage-backdrop");
  var closeBtn = document.querySelector(".portal-close");
  var titleEl  = document.getElementById("portal-title-active");
  var entries  = document.querySelectorAll(".entry[data-open-panel]");
  var panels   = document.querySelectorAll(".panel[data-panel-id]");
  var titles = {
    photos: "摄影 · PHOTOS", cats: "猫 · CATS", notes: "手记 · NOTES",
    about: "关于 · ABOUT", links: "书签 · LINKS", signal: "信号 · SIGNAL",
    relay: "中继 · RELAY", tarot: "塔罗 · TAROT"
  };

  function syncMobNav(id) {
    document.querySelectorAll(".mob-nav-btn[data-open-panel]").forEach(function (btn) {
      btn.classList.toggle("is-active", !!id && btn.getAttribute("data-open-panel") === id);
    });
  }

  function setEntryActive(id) {
    entries.forEach(function (btn) {
      var on = !!id && btn.getAttribute("data-open-panel") === id;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-expanded", String(on));
    });
    syncMobNav(id);
  }

  function showPanel(id) {
    panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel-id") !== id; });
    if (titleEl) titleEl.textContent = titles[id] || "面板";
  }

  function openPortal(id) {
    if (!portal || !backdrop) return;
    showPanel(id); setEntryActive(id);
    portal.hidden = false; backdrop.hidden = false;
    portal.setAttribute("aria-hidden", "false");
    backdrop.setAttribute("aria-hidden", "false");
    if (stage) stage.classList.add("is-panel-open");
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      portal.classList.add("is-open");
      backdrop.classList.add("is-visible");
    }); });
    document.body.classList.add("is-portal-open");
    if (titles[id] && location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
    if (closeBtn) closeBtn.focus();
  }

  function closePortal() {
    if (!portal || !backdrop) return;
    portal.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    if (stage) stage.classList.remove("is-panel-open");
    document.body.classList.remove("is-portal-open");
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    setEntryActive(null);
    setTimeout(function () {
      if (!portal.classList.contains("is-open")) {
        portal.hidden = true; portal.setAttribute("aria-hidden", "true");
        backdrop.hidden = true; backdrop.setAttribute("aria-hidden", "true");
        panels.forEach(function (p) { p.hidden = true; });
      }
    }, 520);
  }

  entries.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-open-panel"); if (!id) return;
      if (portal && portal.classList.contains("is-open")) {
        if (document.querySelector(".entry.is-active") === btn) { closePortal(); return; }
      }
      openPortal(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closePortal);
  if (backdrop) backdrop.addEventListener("click", closePortal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var lb = document.getElementById("lightbox");
      if (lb && lb.classList.contains("is-open")) return;
      closePortal();
    }
  });

  function openFromHash() { var h = (location.hash || "").replace(/^#/, ""); if (titles[h]) openPortal(h); }
  if (location.hash) openFromHash();
  window.addEventListener("hashchange", openFromHash);

  /* Mobile nav */
  document.querySelectorAll(".mob-nav-btn[data-open-panel]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-open-panel"); if (!id) return;
      if (portal && portal.classList.contains("is-open")) {
        var cur = document.querySelector(".panel:not([hidden])");
        if (cur && cur.getAttribute("data-panel-id") === id) { closePortal(); return; }
      }
      openPortal(id);
    });
  });

  /* ─────────────────────────────────────────────────────
     PHOTO ALBUM — location tabs + upload
  ───────────────────────────────────────────────────── */
  var photoUpload  = document.getElementById("photo-upload");
  var photoLocIn   = document.getElementById("photo-location-input");
  var photoDateIn  = document.getElementById("photo-date-input");
  var albumTabs    = document.getElementById("album-tabs");
  var photoGallery = document.getElementById("photo-gallery");
  var currentLoc   = "all";

  // Set today as default date
  if (photoDateIn) {
    var today = new Date();
    photoDateIn.value = today.getFullYear() + "-" + pad2(today.getMonth() + 1) + "-" + pad2(today.getDate());
  }

  function buildAlbumTabs() {
    if (!albumTabs || !photoGallery) return;
    var locs = new Set(["all"]);
    photoGallery.querySelectorAll(".gallery-item[data-loc]").forEach(function (li) {
      var l = li.getAttribute("data-loc");
      if (l) locs.add(l);
    });
    // keep existing tabs; add missing
    locs.forEach(function (loc) {
      if (!albumTabs.querySelector('[data-loc="' + loc + '"]')) {
        var btn = document.createElement("button");
        btn.type = "button"; btn.className = "album-tab";
        btn.setAttribute("data-loc", loc); btn.setAttribute("role", "tab");
        btn.textContent = loc === "all" ? "全部" : loc;
        btn.addEventListener("click", function () { filterAlbum(loc); });
        albumTabs.appendChild(btn);
      }
    });
    // Remove tabs for locs that no longer exist
    albumTabs.querySelectorAll(".album-tab[data-loc]").forEach(function (btn) {
      var l = btn.getAttribute("data-loc");
      if (l !== "all" && !locs.has(l)) btn.remove();
    });
    // Hook click on "全部"
    var allTab = albumTabs.querySelector('[data-loc="all"]');
    if (allTab) allTab.onclick = function () { filterAlbum("all"); };
  }

  function filterAlbum(loc) {
    currentLoc = loc;
    if (albumTabs) albumTabs.querySelectorAll(".album-tab").forEach(function (btn) {
      var active = btn.getAttribute("data-loc") === loc;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    if (photoGallery) photoGallery.querySelectorAll(".gallery-item").forEach(function (li) {
      var l = li.getAttribute("data-loc") || "";
      li.classList.toggle("is-hidden", loc !== "all" && l !== loc);
    });
  }

  buildAlbumTabs();
  filterAlbum("all");

  if (photoUpload) {
    photoUpload.addEventListener("change", function () {
      var files = Array.from(photoUpload.files);
      var loc  = (photoLocIn && photoLocIn.value.trim()) || "未知";
      var date = (photoDateIn && photoDateIn.value) || new Date().toISOString().slice(0, 10);
      files.forEach(function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var li = document.createElement("li");
          li.className = "gallery-item";
          li.setAttribute("data-loc", loc);
          li.setAttribute("data-date", date);
          li.innerHTML = '<figure><button type="button" class="js-lightbox">'
            + '<img src="' + e.target.result + '" alt="" style="width:100%;height:auto;aspect-ratio:4/3;object-fit:cover" loading="lazy" />'
            + '</button><figcaption>'
            + '<span class="photo-loc">' + loc + '</span>'
            + '<span class="photo-date">' + date + '</span>'
            + '</figcaption></figure>';
          photoGallery.appendChild(li);
          // attach lightbox
          var btn = li.querySelector(".js-lightbox");
          if (btn) btn.addEventListener("click", function (ev) {
            ev.stopPropagation();
            var img = btn.querySelector("img");
            if (img) openLb(img.src, "");
          });
          buildAlbumTabs();
          filterAlbum(currentLoc);
        };
        reader.readAsDataURL(file);
      });
      photoUpload.value = "";
    });
  }

  /* ─────────────────────────────────────────────────────
     LIGHTBOX
  ───────────────────────────────────────────────────── */
  var lightbox = document.getElementById("lightbox");
  var lbImg, lbClose;
  if (lightbox) {
    lbImg = lightbox.querySelector("img");
    lbClose = lightbox.querySelector(".lightbox-close");
    function openLb(src, alt) {
      if (!src || !lbImg) return;
      lbImg.src = src; lbImg.alt = alt || "";
      lightbox.hidden = false; lightbox.classList.add("is-open");
      document.body.classList.add("is-portal-open");
      if (lbClose) lbClose.focus();
    }
    function closeLb() {
      lightbox.classList.remove("is-open");
      if (lbImg) { lbImg.removeAttribute("src"); lbImg.alt = ""; }
      lightbox.hidden = true;
      var p = document.getElementById("portal");
      if (!p || !p.classList.contains("is-open")) document.body.classList.remove("is-portal-open");
    }
    document.querySelectorAll(".js-lightbox").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var img = btn.querySelector("img");
        if (!img || !img.src) return;
        openLb(img.currentSrc || img.src, img.getAttribute("alt") || "");
      });
    });
    if (lbClose) lbClose.addEventListener("click", function (e) { e.stopPropagation(); closeLb(); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLb(); });
    if (lbImg) lbImg.addEventListener("click", function (e) { e.stopPropagation(); });
  }

  /* ─────────────────────────────────────────────────────
     COMMENTS
  ───────────────────────────────────────────────────── */
  var COMMENT_KEY  = "lexi-comments-v1";
  var commentList  = document.getElementById("comment-list");
  var commentForm  = document.getElementById("comment-form");
  var commentSubmit = document.getElementById("comment-submit");
  function loadComments() { try { var r = localStorage.getItem(COMMENT_KEY); var a = r ? JSON.parse(r) : []; return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function saveComments(arr) { try { localStorage.setItem(COMMENT_KEY, JSON.stringify(arr)); } catch (e) {} }
  function renderComments() {
    if (!commentList) return;
    commentList.innerHTML = "";
    loadComments().forEach(function (c) {
      var li = document.createElement("li"); li.className = "comment-item";
      var meta = document.createElement("div"); meta.className = "comment-meta";
      var name = c.name && String(c.name).trim() ? String(c.name).trim() : "访客";
      meta.textContent = name + " · " + new Date(c.t || Date.now()).toLocaleString("zh-CN", { hour12: false });
      var body = document.createElement("p"); body.className = "comment-body"; body.textContent = c.body || "";
      li.appendChild(meta); li.appendChild(body); commentList.appendChild(li);
    });
  }
  if (commentForm && commentList) {
    renderComments();
    if (commentSubmit) commentSubmit.addEventListener("click", function () {
      var nameEl = document.getElementById("comment-name");
      var bodyEl = document.getElementById("comment-body");
      if (!bodyEl) return;
      var body = String(bodyEl.value || "").trim(); if (!body) return;
      var arr = loadComments();
      arr.push({ name: nameEl ? String(nameEl.value || "").trim() : "", body: body, t: Date.now() });
      saveComments(arr); bodyEl.value = ""; renderComments();
    });
  }

  /* ─────────────────────────────────────────────────────
     SIGNAL
  ───────────────────────────────────────────────────── */
  var SIGNAL_LINES = ["∇ 03 · 未命名信道 · 无校验","……听……不清……（像猫踩过键盘）","4096 · void · 返回值为梦","坐标丢失。上次见到光，是昨天下午。","██████ · 已省略 · 原因不明","echo: silence","随机不是无意义，只是还没被读。","SIGNAL_OK · 概率 3.7%","∿∿∿ 潮声模拟中 ∿∿∿"];
  var signalTap = document.getElementById("signal-tap");
  var signalStream = document.getElementById("signal-stream");
  function appendSignalLine() {
    if (!signalStream) return;
    var line = pick(SIGNAL_LINES);
    if (signalStream.textContent) signalStream.textContent += "\n";
    signalStream.textContent += line;
    signalStream.scrollTop = signalStream.scrollHeight;
    signalStream.classList.remove("is-flicker"); void signalStream.offsetWidth; signalStream.classList.add("is-flicker");
  }
  if (signalTap) signalTap.addEventListener("click", appendSignalLine);

  /* ─────────────────────────────────────────────────────
     RELAY TERMINAL
  ───────────────────────────────────────────────────── */
  var relayOut   = document.getElementById("relay-output");
  var relayForm  = document.getElementById("relay-form");
  var relayInput = document.getElementById("relay-input");
  function relayLine(text, kind) {
    if (!relayOut) return;
    var p = document.createElement("p"); p.className = "relay-line";
    if (kind === "sys") p.classList.add("relay-line--sys");
    if (kind === "err") p.classList.add("relay-line--err");
    p.textContent = text; relayOut.appendChild(p); relayOut.scrollTop = relayOut.scrollHeight;
  }
  if (relayOut) relayLine("relay v0.1 — 输入 help 查看指令", "sys");
  function runRelayCommand(raw) {
    var line = String(raw || "").trim(); if (!line) return;
    relayLine("> " + line);
    var parts = line.split(/\s+/), cmd = parts[0].toLowerCase();
    if (cmd === "help") { relayLine("help · clear · date · roll · echo · whoami · open <panel>", "sys"); relayLine("panel: photos cats notes about links signal relay tarot", "sys"); }
    else if (cmd === "clear") { relayOut.innerHTML = ""; relayLine("cleared.", "sys"); }
    else if (cmd === "date") { relayLine(new Date().toString(), "sys"); }
    else if (cmd === "roll") { relayLine(String(Math.floor(Math.random() * 100) + 1), "sys"); }
    else if (cmd === "whoami") { relayLine("qwertlexi · visitor · local session", "sys"); }
    else if (cmd === "echo") { relayLine(parts.slice(1).join(" ") || "…", "sys"); }
    else if (cmd === "open" && parts[1]) {
      var t = parts[1].toLowerCase();
      if (titles[t]) { relayLine("opening " + t + " …", "sys"); openPortal(t); }
      else relayLine("unknown panel: " + parts[1], "err");
    } else relayLine("未知指令。试试 help", "err");
  }
  if (relayInput) {
    relayInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); runRelayCommand(relayInput.value); relayInput.value = ""; relayInput.focus(); }
    });
  }

  /* ─────────────────────────────────────────────────────
     TAROT with image upload
  ───────────────────────────────────────────────────── */
  var TAROT_DECK = [
    {id:"0",cn:"愚者",desc:"新的开端或一次莽撞的跳跃；信任直觉，也记得看路。"},
    {id:"I",cn:"魔术师",desc:"把资源握在手中，专注能把想法落地。"},
    {id:"II",cn:"女祭司",desc:"静下来听内在声音；答案可能还没准备好现身。"},
    {id:"III",cn:"皇后",desc:"滋养、丰盛与感官之美；给自己一点温柔的空间。"},
    {id:"IV",cn:"皇帝",desc:"结构、边界与责任；秩序能托住混乱。"},
    {id:"V",cn:"教皇",desc:"传统与指引；适合向经验或师长借一双眼睛。"},
    {id:"VI",cn:"恋人",desc:"选择与契合；诚实面对心里真正想要的方向。"},
    {id:"VII",cn:"战车",desc:"意志与前进；把分散的力气拧成一股绳。"},
    {id:"VIII",cn:"力量",desc:"以柔克刚的勇气；耐心比硬扛更难得。"},
    {id:"IX",cn:"隐士",desc:"暂时退后、独自整理；有些路只能一个人走一截。"},
    {id:"X",cn:"命运之轮",desc:"周期与转折；顺势时别骄傲，逆势时别绝望。"},
    {id:"XI",cn:"正义",desc:"权衡与因果；做决定前把事实摊开来看。"},
    {id:"XII",cn:"倒吊人",desc:"暂停与视角转换；卡住时试试换个角度看。"},
    {id:"XIII",cn:"死神",desc:"结束与蜕变；旧壳脱落才有新芽。"},
    {id:"XIV",cn:"节制",desc:"调和与中庸；快慢、冷热之间找平衡。"},
    {id:"XV",cn:"恶魔",desc:"欲望与束缚；看清什么是习惯，什么是真的需要。"},
    {id:"XVI",cn:"高塔",desc:"突变与真相砸门；痛但可能必要。"},
    {id:"XVII",cn:"星星",desc:"希望与疗愈；远处有光，先把眼前一步走好。"},
    {id:"XVIII",cn:"月亮",desc:"迷雾与潜意识；别被想象吓到，也别完全轻信直觉。"},
    {id:"XIX",cn:"太阳",desc:"明朗与生命力；适合摊在阳光下的事就去做。"},
    {id:"XX",cn:"审判",desc:"觉醒与召唤；旧账可以结算，新章可以起笔。"},
    {id:"XXI",cn:"世界",desc:"圆满与旅程一圈；完成本身也是下一段的门票。"}
  ];

  // Built-in SVG art for each card (simplified geometric designs)
  var TAROT_SVG_ART = [
    // 0 Fool - circle and dot
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><circle cx="50" cy="60" r="32" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><circle cx="50" cy="60" r="8" stroke="currentColor" stroke-opacity=".7" stroke-width="1"/><line x1="50" y1="28" x2="50" y2="92" stroke="currentColor" stroke-opacity=".3" stroke-width=".8"/><line x1="18" y1="60" x2="82" y2="60" stroke="currentColor" stroke-opacity=".3" stroke-width=".8"/><path d="M35 40 L50 28 L65 40" stroke="currentColor" stroke-opacity=".4" stroke-width="1" fill="none"/></svg>',
    // I Magician - wand and infinity
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><line x1="50" y1="10" x2="50" y2="140" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5"/><path d="M30 55 Q50 40 70 55 Q50 70 30 55 Z" stroke="currentColor" stroke-opacity=".6" stroke-width="1" fill="currentColor" fill-opacity=".08"/><circle cx="50" cy="30" r="8" stroke="currentColor" stroke-opacity=".6" stroke-width="1"/><g stroke="currentColor" stroke-opacity=".3" stroke-width=".7"><line x1="30" y1="90" x2="70" y2="90"/><line x1="30" y1="100" x2="70" y2="100"/><line x1="30" y1="110" x2="70" y2="110"/></g></svg>',
    // II High Priestess - columns and veil
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><rect x="20" y="20" width="10" height="110" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/><rect x="70" y="20" width="10" height="110" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/><path d="M20 60 Q50 80 80 60" stroke="currentColor" stroke-opacity=".5" stroke-width="1" fill="none"/><circle cx="50" cy="40" r="12" stroke="currentColor" stroke-opacity=".5" stroke-width="1"/><line x1="50" y1="52" x2="50" y2="130" stroke="currentColor" stroke-opacity=".3" stroke-width=".8" stroke-dasharray="4,3"/></svg>',
    // III Empress - venus symbol
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><circle cx="50" cy="55" r="28" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><line x1="50" y1="83" x2="50" y2="120" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><line x1="35" y1="105" x2="65" y2="105" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><g stroke="currentColor" stroke-opacity=".25" stroke-width=".7"><circle cx="50" cy="55" r="18"/><circle cx="50" cy="55" r="8"/></g></svg>',
    // IV Emperor - square and triangle
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><rect x="25" y="30" width="50" height="50" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><path d="M25 80 L50 120 L75 80" stroke="currentColor" stroke-opacity=".4" stroke-width="1.2" fill="none"/><line x1="50" y1="30" x2="50" y2="80" stroke="currentColor" stroke-opacity=".3" stroke-width=".8"/><line x1="25" y1="55" x2="75" y2="55" stroke="currentColor" stroke-opacity=".3" stroke-width=".8"/></svg>',
    // V Hierophant - triple cross
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><line x1="50" y1="10" x2="50" y2="140" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5"/><line x1="25" y1="40" x2="75" y2="40" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5"/><line x1="30" y1="65" x2="70" y2="65" stroke="currentColor" stroke-opacity=".4" stroke-width="1.2"/><line x1="35" y1="88" x2="65" y2="88" stroke="currentColor" stroke-opacity=".35" stroke-width="1"/><circle cx="50" cy="20" r="7" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/></svg>',
    // VI Lovers - two circles + arrow
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><circle cx="36" cy="70" r="22" stroke="currentColor" stroke-opacity=".45" stroke-width="1"/><circle cx="64" cy="70" r="22" stroke="currentColor" stroke-opacity=".45" stroke-width="1"/><path d="M50 20 L55 35 M50 20 L45 35" stroke="currentColor" stroke-opacity=".6" stroke-width="1.2" stroke-linecap="round"/><line x1="50" y1="20" x2="50" y2="48" stroke="currentColor" stroke-opacity=".6" stroke-width="1.2"/></svg>',
    // VII Chariot - shield
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M20 30 L80 30 L80 85 Q80 120 50 135 Q20 120 20 85 Z" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><line x1="50" y1="30" x2="50" y2="135" stroke="currentColor" stroke-opacity=".3" stroke-width=".8"/><line x1="20" y1="75" x2="80" y2="75" stroke="currentColor" stroke-opacity=".3" stroke-width=".8"/><g stroke="currentColor" stroke-opacity=".4" stroke-width=".8"><line x1="30" y1="48" x2="70" y2="48"/></g></svg>',
    // VIII Strength - infinity + lion
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M25 60 Q30 40 50 60 Q70 80 75 60 Q70 40 50 60" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" fill="none"/><ellipse cx="50" cy="105" rx="25" ry="20" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/><line x1="50" y1="60" x2="50" y2="85" stroke="currentColor" stroke-opacity=".3" stroke-width=".8"/></svg>',
    // IX Hermit - lantern
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><rect x="38" y="45" width="24" height="35" rx="3" stroke="currentColor" stroke-opacity=".5" stroke-width="1"/><path d="M38 45 L50 25 L62 45" stroke="currentColor" stroke-opacity=".5" stroke-width="1" fill="none"/><line x1="50" y1="80" x2="50" y2="130" stroke="currentColor" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="62" r="6" stroke="currentColor" stroke-opacity=".6" stroke-width="1"/></svg>',
    // X Wheel - wheel
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><circle cx="50" cy="75" r="36" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><circle cx="50" cy="75" r="18" stroke="currentColor" stroke-opacity=".35" stroke-width="1"/><circle cx="50" cy="75" r="6" fill="currentColor" fill-opacity=".25"/><g stroke="currentColor" stroke-opacity=".3" stroke-width=".8"><line x1="50" y1="39" x2="50" y2="111"/><line x1="14" y1="75" x2="86" y2="75"/><line x1="24" y1="49" x2="76" y2="101"/><line x1="76" y1="49" x2="24" y2="101"/></g></svg>',
    // XI Justice - scales
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><line x1="50" y1="15" x2="50" y2="130" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5"/><line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><path d="M25 50 L15 75 Q25 85 35 75 Z" stroke="currentColor" stroke-opacity=".4" stroke-width="1" fill="currentColor" fill-opacity=".07"/><path d="M75 50 L65 75 Q75 85 85 75 Z" stroke="currentColor" stroke-opacity=".4" stroke-width="1" fill="currentColor" fill-opacity=".07"/></svg>',
    // XII Hanged Man - inverted triangle
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M50 30 L20 90 L80 90 Z" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2" fill="none"/><line x1="50" y1="90" x2="50" y2="130" stroke="currentColor" stroke-opacity=".45" stroke-width="1.5"/><circle cx="50" cy="115" r="10" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/></svg>',
    // XIII Death - scythe
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M60 20 Q90 30 80 65 Q70 90 35 85" stroke="currentColor" stroke-opacity=".55" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="35" y1="85" x2="30" y2="140" stroke="currentColor" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/><g stroke="currentColor" stroke-opacity=".25" stroke-width=".8"><line x1="10" y1="120" x2="90" y2="120"/><path d="M20 120 Q25 110 30 120 Q35 130 40 120 Q45 110 50 120"/></g></svg>',
    // XIV Temperance - two cups + flow
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M22 40 L30 75 L14 75 Z" stroke="currentColor" stroke-opacity=".45" stroke-width="1"/><path d="M78 40 L86 75 L70 75 Z" stroke="currentColor" stroke-opacity=".45" stroke-width="1"/><path d="M30 60 Q50 45 70 60" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" fill="none"/><path d="M70 60 Q50 75 30 60" stroke="currentColor" stroke-opacity=".4" stroke-width="1" fill="none" stroke-dasharray="3,2"/><circle cx="50" cy="110" r="18" stroke="currentColor" stroke-opacity=".35" stroke-width="1"/></svg>',
    // XV Devil - pentagram
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M50 20 L63 58 L98 58 L68 80 L80 118 L50 96 L20 118 L32 80 L2 58 L37 58 Z" stroke="currentColor" stroke-opacity=".4" stroke-width="1" fill="none"/><circle cx="50" cy="75" r="14" stroke="currentColor" stroke-opacity=".5" stroke-width="1"/></svg>',
    // XVI Tower - lightning
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><rect x="30" y="50" width="40" height="80" rx="2" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><path d="M30 50 L50 20 L70 50" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2" fill="none"/><path d="M65 10 L48 50 L58 50 L42 90" stroke="currentColor" stroke-opacity=".7" stroke-width="1.5" stroke-linecap="round"/></svg>',
    // XVII Star - 8-pointed star
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><circle cx="50" cy="75" r="30" stroke="currentColor" stroke-opacity=".3" stroke-width=".8"/><g stroke="currentColor" stroke-opacity=".5" stroke-width="1"><line x1="50" y1="20" x2="50" y2="130"/><line x1="5" y1="75" x2="95" y2="75"/><line x1="15" y1="35" x2="85" y2="115"/><line x1="85" y1="35" x2="15" y2="115"/></g><circle cx="50" cy="75" r="8" fill="currentColor" fill-opacity=".25"/></svg>',
    // XVIII Moon - crescent
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M60 25 Q30 40 30 75 Q30 110 60 125 Q10 110 10 75 Q10 40 60 25 Z" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2" fill="currentColor" fill-opacity=".08"/><circle cx="72" cy="55" r="18" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/><g stroke="currentColor" stroke-opacity=".25" stroke-width=".7"><line x1="40" y1="130" x2="90" y2="130"/><path d="M45 130 Q50 118 55 130 Q60 142 65 130 Q70 118 75 130"/></g></svg>',
    // XIX Sun - radiant sun
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><circle cx="50" cy="65" r="24" stroke="currentColor" stroke-opacity=".6" stroke-width="1.5"/><circle cx="50" cy="65" r="14" fill="currentColor" fill-opacity=".15"/><g stroke="currentColor" stroke-opacity=".45" stroke-width="1.2"><line x1="50" y1="20" x2="50" y2="32"/><line x1="50" y1="98" x2="50" y2="110"/><line x1="15" y1="65" x2="27" y2="65"/><line x1="73" y1="65" x2="85" y2="65"/><line x1="24" y1="39" x2="33" y2="48"/><line x1="67" y1="82" x2="76" y2="91"/><line x1="76" y1="39" x2="67" y2="48"/><line x1="33" y1="82" x2="24" y2="91"/></g></svg>',
    // XX Judgement - angel trumpet
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M50 20 L65 35 Q75 55 50 65 Q25 55 35 35 Z" stroke="currentColor" stroke-opacity=".5" stroke-width="1" fill="none"/><path d="M50 65 Q30 80 25 105" stroke="currentColor" stroke-opacity=".4" stroke-width="1.2" fill="none"/><path d="M50 65 Q70 80 75 105" stroke="currentColor" stroke-opacity=".4" stroke-width="1.2" fill="none"/><ellipse cx="50" cy="35" rx="7" ry="5" stroke="currentColor" stroke-opacity=".55" stroke-width="1"/><g stroke="currentColor" stroke-opacity=".3" stroke-width=".8"><line x1="20" y1="130" x2="40" y2="120"/><line x1="60" y1="120" x2="80" y2="130"/><line x1="50" y1="115" x2="50" y2="130"/></g></svg>',
    // XXI World - wreath + dancer
    '<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" fill="none"><ellipse cx="50" cy="75" rx="38" ry="55" stroke="currentColor" stroke-opacity=".5" stroke-width="1.2"/><ellipse cx="50" cy="75" rx="28" ry="45" stroke="currentColor" stroke-opacity=".25" stroke-width=".7"/><circle cx="50" cy="75" r="12" stroke="currentColor" stroke-opacity=".55" stroke-width="1"/><g stroke="currentColor" stroke-opacity=".4" stroke-width="1"><line x1="50" y1="63" x2="42" y2="55"/><line x1="50" y1="63" x2="58" y2="55"/><line x1="50" y1="87" x2="44" y2="98"/><line x1="50" y1="87" x2="56" y2="98"/></g></svg>'
  ];

  var customTarotImages = []; // array indexed by card order
  var tarotDraw  = document.getElementById("tarot-draw");
  var tarotCube  = document.getElementById("tarot-cube");
  var tarotRoman = document.getElementById("tarot-roman");
  var tarotName  = document.getElementById("tarot-name");
  var tarotDesc  = document.getElementById("tarot-desc");
  var tarotHint  = document.getElementById("tarot-hint");
  var tarotImgWrap = document.getElementById("tarot-img-wrap");
  var tarotUpload  = document.getElementById("tarot-upload");
  var tarotBusy = false;
  var lastCardIdx = -1;

  if (tarotUpload) {
    tarotUpload.addEventListener("change", function () {
      var files = Array.from(tarotUpload.files);
      customTarotImages = [];
      var loaded = 0;
      files.forEach(function (file, i) {
        var reader = new FileReader();
        reader.onload = function (e) {
          customTarotImages[i] = e.target.result;
          loaded++;
          if (loaded === files.length) {
            if (tarotHint) tarotHint.textContent = "已上传 " + files.length + " 张牌面图。点击「抽一张」使用。";
          }
        };
        reader.readAsDataURL(file);
      });
      tarotUpload.value = "";
    });
  }

  function drawTarot() {
    if (!tarotCube || !TAROT_DECK.length || tarotBusy) return;
    tarotBusy = true;
    var idx = Math.floor(Math.random() * TAROT_DECK.length);
    var card = TAROT_DECK[idx];
    var reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    tarotCube.classList.remove("is-flipped");
    if (tarotHint) tarotHint.textContent = "洗牌、切牌…（动画而已）";
    setTimeout(function () {
      if (tarotRoman) tarotRoman.textContent = "大阿卡纳 · " + card.id;
      if (tarotName)  tarotName.textContent = card.cn;
      if (tarotDesc)  tarotDesc.textContent = card.desc;
      // Render card image
      if (tarotImgWrap) {
        tarotImgWrap.innerHTML = "";
        if (customTarotImages[idx]) {
          var img = document.createElement("img");
          img.src = customTarotImages[idx];
          img.alt = card.cn;
          tarotImgWrap.appendChild(img);
        } else {
          tarotImgWrap.innerHTML = TAROT_SVG_ART[idx] || TAROT_SVG_ART[0];
          var svgEl = tarotImgWrap.querySelector("svg");
          if (svgEl) { svgEl.style.width = "100%"; svgEl.style.height = "auto"; svgEl.style.color = "var(--ink)"; }
        }
      }
      tarotCube.classList.add("is-flipped");
      if (tarotHint) tarotHint.textContent = "已翻开。再点「抽一张」会先合牌再抽新的一张。";
      tarotBusy = false;
    }, reduced ? 0 : 480);
  }
  if (tarotDraw) tarotDraw.addEventListener("click", drawTarot);

  /* ─────────────────────────────────────────────────────
     FLOATING MUSIC PLAYER
  ───────────────────────────────────────────────────── */
  var TRACKS = [
    { title: "GO", artist: "BLACKPINK", src: "music/BLACKPINK - GO.mp3", cover: "走" },
    { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", src: "music/Billie Eilish - BIRDS OF A FEATHER.mp3", cover: "🪶" },
    { title: "Best Part", artist: "Daniel Caesar / H.E.R.", src: "music/Daniel Caesar; H.E.R. - Best Part.mp3", cover: "💑" },
    { title: "Oblivion", artist: "Grimes", src: "music/Grimes - Oblivion.mp3", cover: "♾" },
    { title: "Realiti", artist: "Grimes", src: "music/Grimes - Realiti.mp3", cover: "🫧" },
    { title: "Episode 33", artist: "She Her Her Hers", src: "music/She Her Her Hers - Episode 33.mp3", cover: "🌊" },
    { title: "About You", artist: "The 1975", src: "music/The 1975 - About You.mp3", cover: "🫂" },
    { title: "Track 04", artist: "—", src: "music/04.mp3", cover: "🎹" },
    { title: "Track 05", artist: "—", src: "music/05.mp3", cover: "🎺" }
  ];

  var audio       = new Audio();
  var curTrackIdx = -1;
  var vizTimer    = null;

  var mFloatEl     = document.getElementById("music-float");
  var mFloatTitle  = document.getElementById("music-float-title");
  var mFloatArtist = document.getElementById("music-float-artist");
  var mFloatPlay   = document.getElementById("music-float-play");
  var mFloatToggle = document.getElementById("music-float-toggle");
  var mFloatPanel  = document.getElementById("music-float-panel");
  var mFloatEq     = document.getElementById("music-float-eq");

  var mPlayBtn  = document.getElementById("music-play");
  var mPrevBtn  = document.getElementById("music-prev");
  var mNextBtn  = document.getElementById("music-next");
  var mProgBar  = document.getElementById("music-progress-bar");
  var mProgFill = document.getElementById("music-progress-fill");
  var mTimeCur  = document.getElementById("music-time-cur");
  var mTimeTot  = document.getElementById("music-time-tot");
  var mViz      = document.getElementById("music-viz");
  var mVolSlider= document.getElementById("music-vol");
  var mTracklist= document.getElementById("music-tracklist");

  function fmtTime(s) { if (!isFinite(s) || s < 0) return "0:00"; var m = Math.floor(s / 60), sec = Math.floor(s % 60); return m + ":" + (sec < 10 ? "0" : "") + sec; }

  // Toggle expand
  if (mFloatToggle && mFloatEl && mFloatPanel) {
    mFloatToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var expanded = mFloatEl.classList.toggle("is-expanded");
      mFloatToggle.setAttribute("aria-expanded", String(expanded));
      mFloatPanel.setAttribute("aria-hidden", String(!expanded));
    });
  }
  // Bar click also toggles
  var mFloatBar = document.getElementById("music-float-bar");
  if (mFloatBar && mFloatEl) {
    mFloatBar.addEventListener("click", function (e) {
      if (e.target === mFloatPlay || e.target.closest("#music-float-play") || e.target === mFloatToggle) return;
      var expanded = mFloatEl.classList.toggle("is-expanded");
      if (mFloatToggle) mFloatToggle.setAttribute("aria-expanded", String(expanded));
      if (mFloatPanel) mFloatPanel.setAttribute("aria-hidden", String(!expanded));
    });
  }

  // Build tracklist
  if (mTracklist) {
    TRACKS.forEach(function (t, i) {
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "music-track"; btn.dataset.idx = String(i);
      btn.innerHTML = '<span class="music-track-num">' + String(i + 1).padStart(2, "0") + '</span>'
        + '<span class="music-track-info"><span class="music-track-name">' + t.cover + "  " + t.title + '</span>'
        + '<span class="music-track-sub">' + t.artist + '</span></span>'
        + '<span class="music-track-dur" id="music-dur-' + i + '">—:——</span>';
      btn.addEventListener("click", function () { loadTrack(i, true); });
      mTracklist.appendChild(btn);
    });
  }

  function updateHighlight() {
    document.querySelectorAll(".music-track").forEach(function (row) {
      row.classList.toggle("is-current", parseInt(row.dataset.idx) === curTrackIdx);
    });
  }

  function loadTrack(idx, autoplay) {
    curTrackIdx = ((idx % TRACKS.length) + TRACKS.length) % TRACKS.length;
    var t = TRACKS[curTrackIdx];
    audio.src = t.src; audio.load();
    if (mFloatTitle)  mFloatTitle.textContent  = t.title;
    if (mFloatArtist) mFloatArtist.textContent = t.artist;
    if (mTimeCur) mTimeCur.textContent = "0:00";
    if (mTimeTot) mTimeTot.textContent = "—:——";
    if (mProgFill) mProgFill.style.width = "0%";
    updateHighlight();
    if (autoplay) audio.play().catch(function () {});
  }

  function setPlayUI(playing) {
    var sym = playing ? "⏸" : "▶";
    if (mPlayBtn)    { mPlayBtn.textContent = sym; mPlayBtn.classList.toggle("is-playing", playing); }
    if (mFloatPlay)  { mFloatPlay.textContent = sym; }
    if (mViz)        mViz.classList.toggle("is-active", playing);
    if (mFloatEl)    mFloatEl.classList.toggle("is-playing", playing);
    // EQ bars
    if (mFloatEq) {
      var eqSpans = mFloatEq.querySelectorAll("span");
      eqSpans.forEach(function (s) {
        if (playing) { s.style.animation = "eq-bar .8s ease-in-out infinite alternate"; }
        else         { s.style.animation = "none"; s.style.transform = "scaleY(.3)"; }
      });
    }
    if (playing) {
      if (!vizTimer) vizTimer = setInterval(function () {
        if (!mViz) return;
        mViz.querySelectorAll(".music-viz-bar").forEach(function (b) {
          b.style.height = Math.floor(10 + Math.random() * 85) + "%";
        });
      }, 90);
    } else {
      clearInterval(vizTimer); vizTimer = null;
    }
  }

  audio.addEventListener("play",    function () { setPlayUI(true); });
  audio.addEventListener("pause",   function () { setPlayUI(false); });
  audio.addEventListener("ended",   function () { loadTrack(curTrackIdx + 1, true); });
  audio.addEventListener("timeupdate", function () {
    if (!isFinite(audio.duration)) return;
    if (mProgFill) mProgFill.style.width = (audio.currentTime / audio.duration * 100) + "%";
    if (mTimeCur)  mTimeCur.textContent = fmtTime(audio.currentTime);
  });
  audio.addEventListener("loadedmetadata", function () {
    if (mTimeTot) mTimeTot.textContent = fmtTime(audio.duration);
    var d = document.getElementById("music-dur-" + curTrackIdx);
    if (d) d.textContent = fmtTime(audio.duration);
  });
  audio.addEventListener("error", function () {
    if (mFloatTitle && TRACKS[curTrackIdx]) mFloatTitle.textContent = TRACKS[curTrackIdx].title + " (未找到)";
  });

  function togglePlay() {
    if (curTrackIdx < 0) { loadTrack(0, true); return; }
    if (audio.paused) audio.play().catch(function () {}); else audio.pause();
  }

  if (mPlayBtn)    mPlayBtn.addEventListener("click", togglePlay);
  if (mFloatPlay)  mFloatPlay.addEventListener("click", function (e) { e.stopPropagation(); togglePlay(); });
  if (mPrevBtn)    mPrevBtn.addEventListener("click", function () { loadTrack(curTrackIdx - 1, !audio.paused); });
  if (mNextBtn)    mNextBtn.addEventListener("click", function () { loadTrack(curTrackIdx + 1, !audio.paused); });

  if (mProgBar) mProgBar.addEventListener("click", function (e) {
    if (!isFinite(audio.duration) || audio.duration === 0) return;
    var rect = mProgBar.getBoundingClientRect();
    audio.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * audio.duration;
  });

  if (mVolSlider) {
    audio.volume = parseFloat(mVolSlider.value) || 0.8;
    mVolSlider.addEventListener("input", function () { audio.volume = parseFloat(mVolSlider.value); });
  }

  if (TRACKS.length) loadTrack(0, false);

})();
