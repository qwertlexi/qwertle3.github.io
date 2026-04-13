(function () {
  /* ── Year ── */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Colorful scramble decode — fires every 5s ── */
  var MARK_TARGET = "qwertlexi";
  var SCRAMBLE_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*█░▒▓?/\\";
  var SCRAMBLE_COLORS = [
    "#ff3b6b","#ff8c00","#ffe600","#00e5ff","#b44fff",
    "#00ff99","#ff00cc","#39ff14","#ff6600","#00bfff"
  ];
  function rndColor() { return SCRAMBLE_COLORS[Math.floor(Math.random() * SCRAMBLE_COLORS.length)]; }
  function rndChar()  { return SCRAMBLE_POOL.charAt(Math.floor(Math.random() * SCRAMBLE_POOL.length)); }

  function runMarkScramble() {
    var el = document.getElementById("mark-text");
    if (!el) return;
    var n = MARK_TARGET.length;
    var state  = [], colors = [], locked = [];
    for (var i=0; i<n; i++) { state.push(rndChar()); colors.push(rndColor()); locked.push(false); }
    var frame = 0, maxFrames = 52 + n * 7;

    function tick() {
      frame++;
      var done = true;
      for (var j=0; j<n; j++) {
        if (!locked[j]) {
          done = false;
          if (frame > 10 + j*5 && Math.random() < 0.38) {
            locked[j]=true; state[j]=MARK_TARGET[j]; colors[j]=null;
          } else { state[j]=rndChar(); colors[j]=rndColor(); }
        }
      }
      if (frame >= maxFrames) {
        for (var k=0;k<n;k++){locked[k]=true;state[k]=MARK_TARGET[k];colors[k]=null;}
        done=true;
      }
      var html="";
      for (var m=0;m<n;m++) {
        if (colors[m]) html+='<span style="color:'+colors[m]+';text-shadow:0 0 8px '+colors[m]+'99">'+state[m]+'</span>';
        else html+=state[m];
      }
      el.innerHTML=html;
      if (!done) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  runMarkScramble();
  setInterval(runMarkScramble, 5000);

  /* ── Chrome clock / tick / hex ── */
  var clockEl = document.getElementById("chrome-clock");
  var tickEl  = document.getElementById("chrome-tick");
  var hexEl   = document.getElementById("chrome-hex");
  var tickN   = 0;
  function pad2(n) { return n < 10 ? "0"+n : String(n); }
  function updateChromeClock() {
    if (!clockEl) return;
    var d=new Date();
    clockEl.textContent=pad2(d.getHours())+":"+pad2(d.getMinutes())+":"+pad2(d.getSeconds());
  }
  updateChromeClock();
  setInterval(updateChromeClock, 1000);

  /* ── Millisecond clock ── */
  var msClockEl = document.getElementById("ms-clock-time");
  function updateMsClock() {
    if (!msClockEl) return;
    var d=new Date(), ms=d.getMilliseconds();
    msClockEl.textContent=pad2(d.getHours())+":"+pad2(d.getMinutes())+":"+pad2(d.getSeconds())+"."+(ms<10?"00":ms<100?"0":"")+ms;
  }
  updateMsClock();
  setInterval(updateMsClock, 50);

  setInterval(function(){ tickN++; if(tickEl) tickEl.textContent="tick "+tickN; }, 380);

  function randomHexLine() {
    var p=[];
    for(var i=0;i<5;i++){
      var s="",w=6+Math.floor(Math.random()*6);
      for(var z=0;z<w;z++) s+="0123456789abcdef".charAt(Math.floor(Math.random()*16));
      p.push(s);
    }
    return p.join("  ");
  }
  function updateChromeHex() {
    if(!hexEl) return;
    var lines=[];
    for(var h=0;h<8;h++) lines.push(randomHexLine());
    hexEl.textContent=lines.join("\n");
  }
  updateChromeHex();
  setInterval(updateChromeHex, 420+Math.random()*380);

  /* ── Sidebar metrics ── */
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  var NOISE_POOL=["low","Δ","hiss","· · ·","████","~","??","null"];
  var MODE_POOL=["idle","drift","scan","ghost","wait","??","void"];
  function tickMetrics(){
    document.querySelectorAll("[data-metric]").forEach(function(el){
      var k=el.getAttribute("data-metric");
      if(k==="noise")   el.textContent=pick(NOISE_POOL);
      else if(k==="latency") el.textContent="~"+Math.floor(4+Math.random()*140)+"ms";
      else if(k==="mode")    el.textContent=pick(MODE_POOL);
    });
  }
  tickMetrics();
  setInterval(tickMetrics, 1600+Math.random()*2400);

  /* ── Parallax ── */
  var stage=document.getElementById("main");
  if(stage){
    stage.addEventListener("mousemove",function(e){
      var r=stage.getBoundingClientRect();
      stage.style.setProperty("--parallax-x",((e.clientX-r.left)/r.width-0.5)*30+"px");
      stage.style.setProperty("--parallax-y",((e.clientY-r.top)/r.height-0.5)*24+"px");
    },{passive:true});
  }

  /* ── Portal / panel system ── */
  var portal=document.getElementById("portal");
  var backdrop=document.getElementById("stage-backdrop");
  var closeBtn=document.querySelector(".portal-close");
  var titleEl=document.getElementById("portal-title-active");
  var entries=document.querySelectorAll(".entry[data-open-panel]");
  var panels=document.querySelectorAll(".panel[data-panel-id]");
  var titles={
    photos:"摄影 · PHOTOS",cats:"猫 · CATS",notes:"手记 · NOTES",
    about:"关于 · ABOUT",links:"书签 · LINKS",signal:"信号 · SIGNAL",
    relay:"中继 · RELAY",tarot:"塔罗 · TAROT",music:"音乐 · MUSIC"
  };

  function syncMobNav(id){
    document.querySelectorAll(".mob-nav-btn[data-open-panel]").forEach(function(btn){
      btn.classList.toggle("is-active",!!id&&btn.getAttribute("data-open-panel")===id);
    });
  }

  function setEntryActive(id){
    entries.forEach(function(btn){
      var on=!!id&&btn.getAttribute("data-open-panel")===id;
      btn.classList.toggle("is-active",on);
      btn.setAttribute("aria-expanded",String(on));
    });
    syncMobNav(id);
  }

  function showPanel(id){
    panels.forEach(function(p){p.hidden=p.getAttribute("data-panel-id")!==id;});
    if(titleEl) titleEl.textContent=titles[id]||"面板";
  }

  function openPortal(id){
    if(!portal||!backdrop) return;
    showPanel(id); setEntryActive(id);
    portal.hidden=false; backdrop.hidden=false;
    portal.setAttribute("aria-hidden","false");
    backdrop.setAttribute("aria-hidden","false");
    if(stage) stage.classList.add("is-panel-open");
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      portal.classList.add("is-open");
      backdrop.classList.add("is-visible");
    });});
    document.body.classList.add("is-portal-open");
    if(titles[id]&&location.hash!=="#"+id) history.replaceState(null,"","#"+id);
    if(closeBtn) closeBtn.focus();
  }

  function closePortal(){
    if(!portal||!backdrop) return;
    portal.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    if(stage) stage.classList.remove("is-panel-open");
    document.body.classList.remove("is-portal-open");
    if(location.hash) history.replaceState(null,"",location.pathname+location.search);
    setEntryActive(null);
    setTimeout(function(){
      if(!portal.classList.contains("is-open")){
        portal.hidden=true; portal.setAttribute("aria-hidden","true");
        backdrop.hidden=true; backdrop.setAttribute("aria-hidden","true");
        panels.forEach(function(p){p.hidden=true;});
      }
    },520);
  }

  entries.forEach(function(btn){
    btn.addEventListener("click",function(){
      var id=btn.getAttribute("data-open-panel"); if(!id) return;
      if(portal&&portal.classList.contains("is-open")){
        if(document.querySelector(".entry.is-active")===btn){closePortal();return;}
      }
      openPortal(id);
    });
  });

  if(closeBtn) closeBtn.addEventListener("click",closePortal);
  if(backdrop) backdrop.addEventListener("click",closePortal);
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){
      var lb=document.getElementById("lightbox");
      if(lb&&lb.classList.contains("is-open")) return;
      closePortal();
    }
  });

  function openFromHash(){var h=(location.hash||"").replace(/^#/,"");if(titles[h])openPortal(h);}
  if(location.hash) openFromHash();
  window.addEventListener("hashchange",openFromHash);

  /* ── Mobile nav ── */
  document.querySelectorAll(".mob-nav-btn[data-open-panel]").forEach(function(btn){
    btn.addEventListener("click",function(){
      var id=btn.getAttribute("data-open-panel"); if(!id) return;
      if(portal&&portal.classList.contains("is-open")){
        var cur=document.querySelector(".panel:not([hidden])");
        if(cur&&cur.getAttribute("data-panel-id")===id){closePortal();return;}
      }
      openPortal(id);
    });
  });

  /* ── Comments ── */
  var COMMENT_KEY="lexi-comments-v1";
  var commentList=document.getElementById("comment-list");
  var commentForm=document.getElementById("comment-form");
  function loadComments(){try{var r=localStorage.getItem(COMMENT_KEY);var a=r?JSON.parse(r):[];return Array.isArray(a)?a:[];}catch(e){return[];}}
  function saveComments(arr){try{localStorage.setItem(COMMENT_KEY,JSON.stringify(arr));}catch(e){}}
  function renderComments(){
    if(!commentList) return;
    commentList.innerHTML="";
    loadComments().forEach(function(c){
      var li=document.createElement("li");li.className="comment-item";
      var meta=document.createElement("div");meta.className="comment-meta";
      var name=c.name&&String(c.name).trim()?String(c.name).trim():"访客";
      meta.textContent=name+" · "+new Date(c.t||Date.now()).toLocaleString("zh-CN",{hour12:false});
      var body=document.createElement("p");body.className="comment-body";body.textContent=c.body||"";
      li.appendChild(meta);li.appendChild(body);commentList.appendChild(li);
    });
  }
  if(commentForm&&commentList){
    renderComments();
    commentForm.addEventListener("submit",function(e){
      e.preventDefault();
      var nameEl=document.getElementById("comment-name");
      var bodyEl=document.getElementById("comment-body");
      if(!bodyEl) return;
      var body=String(bodyEl.value||"").trim();if(!body) return;
      var arr=loadComments();
      arr.push({name:nameEl?String(nameEl.value||"").trim():"",body:body,t:Date.now()});
      saveComments(arr);bodyEl.value="";renderComments();
    });
  }

  /* ── Signal ── */
  var SIGNAL_LINES=["∇ 03 · 未命名信道 · 无校验","……听……不清……（像猫踩过键盘）","4096 · void · 返回值为梦","坐标丢失。上次见到光，是昨天下午。","██████ · 已省略 · 原因不明","echo: silence","随机不是无意义，只是还没被读。","SIGNAL_OK · 概率 3.7%","∿∿∿ 潮声模拟中 ∿∿∿"];
  var signalTap=document.getElementById("signal-tap");
  var signalStream=document.getElementById("signal-stream");
  function appendSignalLine(){
    if(!signalStream) return;
    var line=pick(SIGNAL_LINES);
    if(signalStream.textContent) signalStream.textContent+="\n";
    signalStream.textContent+=line;
    signalStream.scrollTop=signalStream.scrollHeight;
    signalStream.classList.remove("is-flicker");void signalStream.offsetWidth;signalStream.classList.add("is-flicker");
  }
  if(signalTap) signalTap.addEventListener("click",appendSignalLine);

  /* ── Relay terminal ── */
  var relayOut=document.getElementById("relay-output");
  var relayForm=document.getElementById("relay-form");
  var relayInput=document.getElementById("relay-input");
  function relayLine(text,kind){
    if(!relayOut) return;
    var p=document.createElement("p");p.className="relay-line";
    if(kind==="sys")p.classList.add("relay-line--sys");
    if(kind==="err")p.classList.add("relay-line--err");
    p.textContent=text;relayOut.appendChild(p);relayOut.scrollTop=relayOut.scrollHeight;
  }
  if(relayOut) relayLine("relay v0.1 — 输入 help 查看指令","sys");
  function runRelayCommand(raw){
    var line=String(raw||"").trim();if(!line) return;
    relayLine("> "+line);
    var parts=line.split(/\s+/),cmd=parts[0].toLowerCase();
    if(cmd==="help"){relayLine("help · clear · date · roll · echo · whoami · open <panel>","sys");relayLine("panel: photos cats notes about links signal relay tarot music","sys");}
    else if(cmd==="clear"){relayOut.innerHTML="";relayLine("cleared.","sys");}
    else if(cmd==="date"){relayLine(new Date().toString(),"sys");}
    else if(cmd==="roll"){relayLine(String(Math.floor(Math.random()*100)+1),"sys");}
    else if(cmd==="whoami"){relayLine("qwertlexi · visitor · local session","sys");}
    else if(cmd==="echo"){relayLine(parts.slice(1).join(" ")||"…","sys");}
    else if(cmd==="open"&&parts[1]){
      var t=parts[1].toLowerCase();
      if(titles[t]){relayLine("opening "+t+" …","sys");openPortal(t);}
      else relayLine("unknown panel: "+parts[1],"err");
    } else relayLine("未知指令。试试 help","err");
  }
  if(relayForm&&relayInput){
    relayForm.addEventListener("submit",function(e){e.preventDefault();runRelayCommand(relayInput.value);relayInput.value="";relayInput.focus();});
  }

  /* ── Tarot ── */
  var TAROT_DECK=[{id:"0",cn:"愚者",desc:"新的开端或一次莽撞的跳跃；信任直觉，也记得看路。"},{id:"I",cn:"魔术师",desc:"把资源握在手中，专注能把想法落地。"},{id:"II",cn:"女祭司",desc:"静下来听内在声音；答案可能还没准备好现身。"},{id:"III",cn:"皇后",desc:"滋养、丰盛与感官之美；给自己一点温柔的空间。"},{id:"IV",cn:"皇帝",desc:"结构、边界与责任；秩序能托住混乱。"},{id:"V",cn:"教皇",desc:"传统与指引；适合向经验或师长借一双眼睛。"},{id:"VI",cn:"恋人",desc:"选择与契合；诚实面对心里真正想要的方向。"},{id:"VII",cn:"战车",desc:"意志与前进；把分散的力气拧成一股绳。"},{id:"VIII",cn:"力量",desc:"以柔克刚的勇气；耐心比硬扛更难得。"},{id:"IX",cn:"隐士",desc:"暂时退后、独自整理；有些路只能一个人走一截。"},{id:"X",cn:"命运之轮",desc:"周期与转折；顺势时别骄傲，逆势时别绝望。"},{id:"XI",cn:"正义",desc:"权衡与因果；做决定前把事实摊开来看。"},{id:"XII",cn:"倒吊人",desc:"暂停与视角转换；卡住时试试换个角度看。"},{id:"XIII",cn:"死神",desc:"结束与蜕变；旧壳脱落才有新芽。"},{id:"XIV",cn:"节制",desc:"调和与中庸；快慢、冷热之间找平衡。"},{id:"XV",cn:"恶魔",desc:"欲望与束缚；看清什么是习惯，什么是真的需要。"},{id:"XVI",cn:"高塔",desc:"突变与真相砸门；痛但可能必要。"},{id:"XVII",cn:"星星",desc:"希望与疗愈；远处有光，先把眼前一步走好。"},{id:"XVIII",cn:"月亮",desc:"迷雾与潜意识；别被想象吓到，也别完全轻信直觉。"},{id:"XIX",cn:"太阳",desc:"明朗与生命力；适合摊在阳光下的事就去做。"},{id:"XX",cn:"审判",desc:"觉醒与召唤；旧账可以结算，新章可以起笔。"},{id:"XXI",cn:"世界",desc:"圆满与旅程一圈；完成本身也是下一段的门票。"}];
  var tarotDraw=document.getElementById("tarot-draw"),tarotCube=document.getElementById("tarot-cube"),tarotRoman=document.getElementById("tarot-roman"),tarotName=document.getElementById("tarot-name"),tarotDesc=document.getElementById("tarot-desc"),tarotHint=document.getElementById("tarot-hint"),tarotBusy=false;
  function drawTarot(){
    if(!tarotCube||!TAROT_DECK.length||tarotBusy) return;
    tarotBusy=true;var card=pick(TAROT_DECK);
    var reduced=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    tarotCube.classList.remove("is-flipped");if(tarotHint)tarotHint.textContent="洗牌、切牌…（动画而已）";
    setTimeout(function(){
      if(tarotRoman)tarotRoman.textContent="大阿卡纳 · "+card.id;
      if(tarotName)tarotName.textContent=card.cn;
      if(tarotDesc)tarotDesc.textContent=card.desc;
      tarotCube.classList.add("is-flipped");
      if(tarotHint)tarotHint.textContent="已翻开。再点「抽一张」会先合牌再抽新的一张。";
      tarotBusy=false;
    },reduced?0:480);
  }
  if(tarotDraw) tarotDraw.addEventListener("click",drawTarot);

  /* ── Lightbox ── */
  var lightbox=document.getElementById("lightbox");
  if(lightbox){
    var lbImg=lightbox.querySelector("img"),lbClose=lightbox.querySelector(".lightbox-close");
    function openLb(src,alt){if(!src||!lbImg)return;lbImg.src=src;lbImg.alt=alt||"";lightbox.hidden=false;lightbox.classList.add("is-open");document.body.classList.add("is-portal-open");if(lbClose)lbClose.focus();}
    function closeLb(){lightbox.classList.remove("is-open");if(lbImg){lbImg.removeAttribute("src");lbImg.alt="";}lightbox.hidden=true;var p=document.getElementById("portal");if(!p||!p.classList.contains("is-open"))document.body.classList.remove("is-portal-open");}
    document.querySelectorAll(".js-lightbox").forEach(function(btn){btn.addEventListener("click",function(e){e.stopPropagation();var img=btn.querySelector("img");if(!img||!img.src)return;openLb(img.currentSrc||img.src,img.getAttribute("alt")||"");});});
    if(lbClose)lbClose.addEventListener("click",function(e){e.stopPropagation();closeLb();});
    lightbox.addEventListener("click",function(e){if(e.target===lightbox)closeLb();});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&lightbox.classList.contains("is-open"))closeLb();});
    if(lbImg)lbImg.addEventListener("click",function(e){e.stopPropagation();});
  }

  /* ══════════════════════════════════════════
     REAL AUDIO MUSIC PLAYER
     ══════════════════════════════════════════
     编辑下方 TRACKS 数组来添加你的音乐。
     src 填音频文件路径，建议在 index.html 同级
     建一个 music/ 文件夹，把 mp3/flac/ogg 放进去。
     例：src: "music/song01.mp3"
     title/artist 改成你想显示的名字。
     cover 是显示在播放器里的 emoji，随意改。
  */
  var TRACKS = [
    { title: "GO", artist: "BLACKPINK", src: "music/BLACKPINK - GO.mp3", cover: "⾛" },
    { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", src: "music/Billie Eilish - BIRDS OF A FEATHER.mp3", cover: "🪶" },
    { title: "Best Part", artist: "Daniel Caesar/H.E.R.", src: "music/Daniel Caesar; H.E.R. - Best Part.mp3", cover: "💑" },
    { title: "Oblivion", artist: "Grimes", src: "music/Grimes - Oblivion.mp3", cover: "♾️" },
    { title: "Realiti", artist: "Grimes", src: "music/Grimes - Realiti.mp3", cover: "🫧" },
    { title: "Episode 33", artist: "She Her Her Hers", src: "music/She Her Her Hers - Episode 33.mp3", cover: "🌊" }
    { title: "About You", artist: "The 1975", src: "music/The 1975 - About You.mp3", cover: "🫂" },
    { title: "Track 04", artist: "Artist", src: "music/04.mp3", cover: "🎹" },
    { title: "Track 05", artist: "Artist", src: "music/05.mp3", cover: "🎺" }
  ];

  var audio       = new Audio();
  var curTrackIdx = -1;
  var vizTimer    = null;

  var mArt      = document.getElementById("music-art");
  var mTitle    = document.getElementById("music-title");
  var mArtist   = document.getElementById("music-artist");
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

  function fmtTime(s){ if(!isFinite(s)||s<0)return"0:00"; var m=Math.floor(s/60),sec=Math.floor(s%60);return m+":"+(sec<10?"0":"")+sec; }

  /* Build tracklist */
  if(mTracklist){
    TRACKS.forEach(function(t,i){
      var btn=document.createElement("button");
      btn.type="button";btn.className="music-track";btn.dataset.idx=String(i);
      btn.innerHTML='<span class="music-track-num">'+String(i+1).padStart(2,"0")+'</span><span class="music-track-info"><span class="music-track-name">'+t.cover+"  "+t.title+'</span><span class="music-track-sub">'+t.artist+'</span></span><span class="music-track-dur" id="music-dur-'+i+'">—:——</span>';
      btn.addEventListener("click",function(){loadTrack(i,true);});
      mTracklist.appendChild(btn);
    });
  }

  function updateHighlight(){
    document.querySelectorAll(".music-track").forEach(function(row){row.classList.toggle("is-current",parseInt(row.dataset.idx)===curTrackIdx);});
  }

  function loadTrack(idx,autoplay){
    curTrackIdx=((idx%TRACKS.length)+TRACKS.length)%TRACKS.length;
    var t=TRACKS[curTrackIdx];
    audio.src=t.src;audio.load();
    if(mArt)mArt.textContent=t.cover;
    if(mTitle)mTitle.textContent=t.title;
    if(mArtist)mArtist.textContent=t.artist;
    if(mTimeCur)mTimeCur.textContent="0:00";
    if(mTimeTot)mTimeTot.textContent="—:——";
    if(mProgFill)mProgFill.style.width="0%";
    updateHighlight();
    if(autoplay)audio.play().catch(function(){});
  }

  function setPlayUI(playing){
    if(mPlayBtn){mPlayBtn.textContent=playing?"⏸":"▶";mPlayBtn.classList.toggle("is-playing",playing);}
    if(mArt)mArt.classList.toggle("is-playing",playing);
    if(mViz)mViz.classList.toggle("is-active",playing);
    if(playing){
      if(!vizTimer) vizTimer=setInterval(function(){
        if(!mViz)return;
        mViz.querySelectorAll(".music-viz-bar").forEach(function(b){b.style.height=Math.floor(10+Math.random()*85)+"%";});
      },90);
    } else {
      clearInterval(vizTimer);vizTimer=null;
    }
  }

  audio.addEventListener("play",    function(){setPlayUI(true);});
  audio.addEventListener("pause",   function(){setPlayUI(false);});
  audio.addEventListener("ended",   function(){loadTrack(curTrackIdx+1,true);});
  audio.addEventListener("timeupdate",function(){
    if(!isFinite(audio.duration))return;
    if(mProgFill)mProgFill.style.width=(audio.currentTime/audio.duration*100)+"%";
    if(mTimeCur)mTimeCur.textContent=fmtTime(audio.currentTime);
  });
  audio.addEventListener("loadedmetadata",function(){
    if(mTimeTot)mTimeTot.textContent=fmtTime(audio.duration);
    var d=document.getElementById("music-dur-"+curTrackIdx);
    if(d)d.textContent=fmtTime(audio.duration);
  });
  audio.addEventListener("error",function(){
    if(mTitle&&TRACKS[curTrackIdx])mTitle.textContent=TRACKS[curTrackIdx].title+" (未找到文件)";
  });

  if(mPlayBtn)mPlayBtn.addEventListener("click",function(){
    if(curTrackIdx<0){loadTrack(0,true);return;}
    if(audio.paused)audio.play().catch(function(){});else audio.pause();
  });
  if(mPrevBtn)mPrevBtn.addEventListener("click",function(){loadTrack(curTrackIdx-1,!audio.paused);});
  if(mNextBtn)mNextBtn.addEventListener("click",function(){loadTrack(curTrackIdx+1,!audio.paused);});

  if(mProgBar)mProgBar.addEventListener("click",function(e){
    if(!isFinite(audio.duration)||audio.duration===0)return;
    var rect=mProgBar.getBoundingClientRect();
    audio.currentTime=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width))*audio.duration;
  });

  if(mVolSlider){
    audio.volume=parseFloat(mVolSlider.value)||0.8;
    mVolSlider.addEventListener("input",function(){audio.volume=parseFloat(mVolSlider.value);});
  }

  if(TRACKS.length)loadTrack(0,false);

})();
