/* ชั้นลอยเคลือบกระจก = ค่าเริ่มต้น (20 พ.ย. 2569) · ?glass=0 ปิด · ?glass=1 เปิดคืน · ใช้คู่ธีมกระดาษ ?paper=1 · 20 พ.ย. 2569 */
(function () {
  var H = document.documentElement;
  try {
    var s = location.search;
    if (/[?&]glass=1/.test(s)) sessionStorage.setItem('tarot-glass', '1');
    if (/[?&]glass=0/.test(s)) sessionStorage.setItem('tarot-glass', '0');
    if (sessionStorage.getItem('tarot-glass') === '0' || !H.classList.contains('paper')) return;
  } catch (e) { return; }
  H.classList.add('glass');
  // หน้าย่อยในกรอบ (สับไพ่ กรีดไพ่ ฯลฯ): ไม่สร้างฉากเอง ทำพื้นใส ให้เห็นฉากเดียวของหน้าหลักลอยต่อเนื่องทุกขั้น
  var inHost = false;
  try { inHost = window.parent !== window && !!window.parent.document.querySelector('script[src*="glass.js"]'); } catch (e) {}
  if (inHost) { H.classList.add('gframe'); return; }
  var base = '../ภาพพื้นหลัง/glass/';
  // [ชื่อชั้น, ความลึก] ลึกมาก = ลอยใกล้ตา ขยับมาก เงาไกล
  var L = [['mount', .3], ['cliff', .6], ['cloudL', .75], ['cloudR', .85], ['crane2', 1.05], ['crane1', 1.3]];
  var stage;
  function build() {
    if (stage) return;
    var bg = document.querySelector('.bg');
    if (!bg) { bg = document.createElement('div'); bg.className = 'ghost'; document.body.insertBefore(bg, document.body.firstChild); }
    stage = document.createElement('div');
    stage.className = 'gstage';
    L.forEach(function (l) {
      var d = document.createElement('div'), f = document.createElement('div'), img = new Image(), sh = document.createElement('i');
      d.className = 'gl g-' + l[0]; d.style.setProperty('--d', l[1]);
      f.className = 'gf';
      img.src = base + l[0] + '.webp?v=2'; img.alt = ''; img.decoding = 'async';
      var u = 'url("' + img.src + '")'; // img.src เข้ารหัสชื่อไทยให้แล้ว
      sh.style.webkitMaskImage = u; sh.style.maskImage = u;
      f.appendChild(img); f.appendChild(sh); d.appendChild(f); stage.appendChild(d);
      if (l[0] === 'cliff') img.addEventListener('load', function () { try { living(f, img); } catch (e) {} });
    });
    bg.appendChild(stage);
    loop();
  }
  // ต้นสนไหวตามลม (ณัทกรเลือก ค+ก: ใบไหวเบาๆ ตลอด + ลมมาเป็นระลอก) + น้ำตกไหล (ณัทกรเลือก ก)
  // วาดลง canvas แทนภาพนิ่ง · ใต้ ANCHOR_Y (ลำต้น หน้าผา) นิ่ง · ตัวเลขพิกัดอิงภาพ cliff 509×900
  function living(f, img) {
    var W = img.naturalWidth, H = img.naturalHeight, K = W / 509, AY = Math.round(270 * K);
    function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
    var base = mk(W, H), b = base.getContext('2d'); b.drawImage(img, 0, 0);
    var d = b.getImageData(0, 0, W, H).data, wm = mk(W, H), mc = wm.getContext('2d'), md = mc.createImageData(W, H);
    // น้ำตก 2 ส่วน (ณัทกร: อยากให้น้ำไหลตามส่วนโค้งด้วย)
    //  ส่วนโค้ง (y 358-450): น้ำพุ่งจากซอกหินซ้าย โค้งไปขวาแล้วค่อยดิ่ง → ลายน้ำวิ่งตามเส้นโค้ง
    //  ส่วนดิ่ง (y 425-705) + สายเล็กขวา: ลายน้ำไหลตรงลง · ช่วง 425-450 สองส่วนซ้อนจางเข้าหากัน รอยต่อจึงกลืน
    var cmd = mc.createImageData(W, H);
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) { var i = (y * W + x) * 4, xk = x / K, yk = y / K;
      if (d[i + 3] >= 150) continue;
      var em = 0;
      if (xk >= 150 && xk <= 258 && yk >= 425 && yk <= 705) em = Math.min(1, (yk - 425) / 25, (705 - yk) / 70);
      else if (xk >= 262 && xk <= 348 && yk >= 440 && yk <= 600) em = Math.min(1, (yk - 440) / 30, (600 - yk) / 50);
      if (em > 0) { md.data[i] = md.data[i + 1] = md.data[i + 2] = 255; md.data[i + 3] = 255 * em; }
      if (xk >= 152 && xk <= 252 && yk >= 358 && yk <= 452) { var ec = Math.min(1, (452 - yk) / 25, (yk - 358) / 6);
        if (ec > 0) { cmd.data[i] = cmd.data[i + 1] = cmd.data[i + 2] = 255; cmd.data[i + 3] = 255 * ec; } } }
    mc.putImageData(md, 0, 0);
    var bl = 'blur(' + (5 * K).toFixed(1) + 'px)';
    var mask = mk(W, H), m2 = mask.getContext('2d'); m2.filter = bl; m2.drawImage(wm, 0, 0);
    mc.putImageData(cmd, 0, 0);
    var cmask = mk(W, H), m3 = cmask.getContext('2d'); m3.filter = 'blur(' + (3 * K).toFixed(1) + 'px)'; m3.drawImage(wm, 0, 0);
    // เส้นกลางสายน้ำโค้ง (วัดจากภาพ หน่วย 509×900) + ความกว้างแต่ละจุด
    var CP = [[160, 364, 12], [170, 373, 22], [184, 384, 32], [198, 396, 40], [211, 409, 40], [221, 423, 40], [227, 440, 40], [229, 458, 40]];
    var cs = [], acc = 0;
    for (var k = 0; k < CP.length - 1; k++) { var a0 = CP[k], a1 = CP[k + 1], seg = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]), n = Math.ceil(seg / 1.2);
      for (var j = 0; j < n; j++) { var u = j / n; cs.push({ x: (a0[0] + (a1[0] - a0[0]) * u) * K, y: (a0[1] + (a1[1] - a0[1]) * u) * K, w: (a0[2] + (a1[2] - a0[2]) * u + 10) * K,
        ang: Math.atan2(a1[1] - a0[1], a1[0] - a0[0]), s: (acc + seg * u) * K }); }
      acc += seg; }
    var dry = mk(W, H), dc = dry.getContext('2d'); dc.drawImage(base, 0, 0); dc.globalCompositeOperation = 'destination-out'; dc.drawImage(mask, 0, 0); dc.drawImage(cmask, 0, 0);
    // สายน้ำใหม่จาก Codex (แผ่นต่อกันไร้รอย) · ?fall=a ละเอียดเป็นเส้นไหม · ?fall=b สายน้ำหนา (ค่าเริ่มต้น)
    var fv = 'b'; try { var fm = location.search.match(/[?&]fall=([ab])/); if (fm) sessionStorage.setItem('tarot-fall', fm[1]); fv = sessionStorage.getItem('tarot-fall') || 'b'; } catch (e) {}
    var fall = new Image(); fall.src = '../ภาพพื้นหลัง/glass/fall-' + fv + '.webp?v=1';
    var FX = Math.round(146 * K), FW = Math.round(206 * K), FY = Math.round(330 * K), FB = Math.round(712 * K);
    var cl = mk(W, H), ccx = cl.getContext('2d'), src = mk(W, H), sc = src.getContext('2d'), wl = mk(W, H), wc = wl.getContext('2d'), tmp = mk(W, H), tc = tmp.getContext('2d');
    var cv = mk(W, H), cx = cv.getContext('2d'); cv.className = 'gliving';
    f.insertBefore(cv, img); img.style.display = 'none';
    var lastT = 0;
    function draw(ms) {
      requestAnimationFrame(draw);
      if (ms - lastT < 33) return; lastT = ms; // ~30 ภาพ/วิ พอสำหรับลมกับน้ำ ประหยัดแบตมือถือ
      var t = ms / 1000;
      // น้ำตก: หินแห้ง + สายน้ำใหม่เลื่อนลงต่อเนื่อง ตัดตามรูปสายน้ำเดิม (ขอบบนล่างนุ่ม)
      sc.clearRect(0, 0, W, H); sc.drawImage(dry, 0, 0);
      if (fall.complete && fall.naturalWidth) {
        wc.clearRect(0, 0, W, H); var th = FW * fall.naturalHeight / fall.naturalWidth, off = (t * 46 * K) % th;
        for (var fy = FY - th + off; fy < FB; fy += th) wc.drawImage(fall, FX, fy, FW, th);
        wc.globalCompositeOperation = 'destination-in'; wc.drawImage(mask, 0, 0); wc.globalCompositeOperation = 'source-over'; sc.drawImage(wl, 0, 0);
        // ส่วนโค้ง: วาดลายน้ำเป็นแถบบางๆ เรียงตามเส้นโค้ง หมุนตามทิศน้ำ · แถวของลายเลื่อนตามเวลา น้ำจึงไหลตามโค้ง
        ccx.clearRect(0, 0, W, H); var spp = fall.naturalWidth / FW, fh = fall.naturalHeight, flow = t * 46 * K;
        for (var q = 0; q < cs.length; q++) { var c = cs[q], sy = Math.min(fh - 3 * spp, ((c.s - flow) * spp % fh + fh) % fh), sw = Math.min(fall.naturalWidth, c.w * spp);
          ccx.setTransform(Math.cos(c.ang - Math.PI / 2), Math.sin(c.ang - Math.PI / 2), -Math.sin(c.ang - Math.PI / 2), Math.cos(c.ang - Math.PI / 2), c.x, c.y);
          ccx.drawImage(fall, (fall.naturalWidth - sw) / 2, sy, sw, Math.max(1, 1.6 * K * spp), -c.w / 2, 0, c.w, 1.6 * K); }
        ccx.setTransform(1, 0, 0, 1, 0, 0);
        ccx.globalCompositeOperation = 'destination-in'; ccx.drawImage(cmask, 0, 0); ccx.globalCompositeOperation = 'source-over'; sc.drawImage(cl, 0, 0);
      } else sc.drawImage(base, 0, 0);
      // ลม (ณัทกรเลือก ก ผสม ข 20 พ.ย.): กิ่งขยับขึ้นลงอย่างเดียว (เลื่อนซ้ายขวาทำให้ขอบใบซ้อน ณัทกรว่าแปลก)
      //  ข = โยกขึ้นลงช้าๆ ตลอด · ก = ทุก 8 วิ ลมวูบ กิ่งยุบลงก่อนแล้วเด้งขึ้นเลยนิดหนึ่ง แกว่งหน่วงจนนิ่ง
      //  ยิ่งไกลลำต้นยิ่งขยับ · ปลายกิ่งตามโคนช้ากว่านิดหนึ่ง · พุ่มซ้ายขยับน้อยกว่า
      cx.clearRect(0, 0, W, H); cx.drawImage(src, 0, 0);
      var tc8 = t % 8;
      for (var xx = 0; xx < W; xx++) { var xk = xx / K,
          w = xk < 130 ? Math.pow(Math.max(0, Math.min(1, (118 - xk) / 118)), 1.2) * .55 : Math.pow(Math.max(0, Math.min(1, (xk - 150) / 340)), 1.3);
        if (!w) continue;
        var lag = w * .28, g = tc8 - lag, gu = g < 0 ? 0 : g < .9 ? Math.pow(Math.sin(g / .9 * Math.PI / 2), 2) : Math.cos((g - .9) * 2 * Math.PI / 1.6) * Math.exp(-1.25 * (g - .9));
        var dy = K * w * (6.5 * gu + 2.6 * Math.sin(2 * Math.PI * t / 4.6 - lag * 4));
        if (Math.abs(dy) < .05) continue;
        var colTop = Math.round((xk < 130 ? 125 : 232) * K);
        cx.clearRect(xx, 0, 1, colTop); cx.drawImage(src, xx, 0, 1, colTop, xx, dy, 1, colTop); }
      // แสง ก (ณัทกรเลือก): เส้นแสงบางพาดผ่านเร็ว 1.1 วิ ทุก 9 วิ แล้วหายไป · ติดเฉพาะเนื้อหมึก · วิ่งขวา→ซ้าย เอียง 22° ทางเดียวกับแสงบนนก (CSS 112deg)
      var lp = ((t + 3) % 9) / 1.1;
      if (lp < 1) { var lx = (809 - lp * 1009) * K; cx.globalCompositeOperation = 'source-atop'; cx.save(); cx.translate(lx, 0); cx.rotate(.385);
        var lg = cx.createLinearGradient(-60 * K, 0, 60 * K, 0); lg.addColorStop(0, 'rgba(255,248,232,0)'); lg.addColorStop(.5, 'rgba(255,248,232,.8)'); lg.addColorStop(1, 'rgba(255,248,232,0)');
        cx.fillStyle = lg; cx.fillRect(-60 * K, -H, 120 * K, H * 3); cx.restore(); cx.globalCompositeOperation = 'source-over'; }
    }
    requestAnimationFrame(draw);
  }
  // มุมมอง: เมาส์ (คอม) / เอียงเครื่อง (มือถือ) + ลอยเองช้าๆ ตอนไม่มีใครขยับ
  var tx = 0, ty = 0, x = 0, y = 0, last = 0;
  // คอม: ไม่ขยับตามเมาส์ (ณัทกร 20 พ.ย. ลายตา) ฉากลอยเองช้าๆ อย่างเดียว
  function tilt(e) {
    if (e.gamma == null) return;
    tx = Math.max(-1, Math.min(1, e.gamma / 22)); ty = Math.max(-1, Math.min(1, (e.beta - 40) / 22)); last = performance.now();
  }
  addEventListener('deviceorientation', tilt, { passive: true });
  // iPhone ต้องขออนุญาตเซนเซอร์ตอนแตะครั้งแรก
  addEventListener('touchend', function ask() {
    removeEventListener('touchend', ask);
    try { if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().catch(function () {}); } catch (e) {}
  });
  function loop(t) {
    t = t || 0;
    var idle = performance.now() - last > 2500;
    var gx = idle ? Math.sin(t / 5200) * .55 : tx, gy = idle ? Math.cos(t / 7100) * .4 : ty;
    x += (gx - x) * .05; y += (gy - y) * .05;
    stage.style.setProperty('--x', x.toFixed(4)); stage.style.setProperty('--y', y.toFixed(4));
    requestAnimationFrame(loop);
  }
  // เพลงคลอ (ณัทกรเลือก 20 พ.ย.): เพลง 7 กู่เจิงชิลป็อป → 9 จอมยุทธรุ่นใหม่ → วนต่อ · ตัดช่วงเงียบท้ายเพลงแล้ว (music/p1, p2)
  // เล่นที่หน้าหลัก จึงต่อเนื่องทุกขั้น · ปุ่มวงกลมกลางหัวเว็บ (ไม่ชนโลโก้/ปุ่มย้อนกลับ/ปุ่มล่างจอ)
  // คุมเสียงผ่าน Web Audio (ไอโฟนไม่ยอมให้ปรับ volume ของ <audio> ตรงๆ) · จางเข้า-ออกตอนต่อเพลง
  // กติกากันบั๊ก: ปิดเองแล้วต้องไม่เปิดเองอีก (เดิมแตะหน้าจอแล้วเพลงกลับมาดัง) · แตะหน้าจอครั้งแรกเปิดเพลงได้เฉพาะตอนยังไม่เคยกดปิด
  function music() {
    var LIST = ['../music/p1.mp3?v=1', '../music/p2.mp3?v=1'], VOL = .42, XF = 2.5;
    var want = true; try { want = localStorage.getItem('tarot-music') !== 'off'; } catch (e) {}
    var tracks = LIST.map(function (u) { var a = new Audio(u); a.preload = 'auto'; a.setAttribute('playsinline', ''); return { a: a, ft: 0 }; });
    var cur = 0, playing = false, wasPlaying = false, xfading = false;
    // คุมเสียงด้วย <audio> ธรรมดา (เลิกใช้ Web Audio 20 พ.ย.: บนไอโฟน Web Audio โดนปุ่มปิดเสียงข้างเครื่องปิดไปด้วย → ณัทกรว่าเงียบกริบ)
    // ค่อยๆ ดัง/เบาด้วยการปรับ volume ทีละนิด (ไอโฟนไม่ยอมให้ปรับ volume → จะดังเต็มที่ ไม่ค่อยๆ จาง แต่ได้ยินแน่นอน)
    function setVol(tr, v, sec) {
      clearInterval(tr.ft); v = Math.max(0, Math.min(1, v));
      if (!sec) { try { tr.a.volume = v; } catch (e) {} return; }
      var from = tr.a.volume, t0 = Date.now();
      tr.ft = setInterval(function () { var k = Math.min(1, (Date.now() - t0) / (sec * 1000)); try { tr.a.volume = from + (v - from) * k; } catch (e) {} if (k >= 1) clearInterval(tr.ft); }, 60);
    }
    function wire() {}
    function play() {
      wire(); var tr = tracks[cur]; setVol(tr, 0);
      var p = tr.a.play(); playing = true; paint();
      if (p && p.then) p.then(function () { setVol(tr, VOL, 2.5); }).catch(function () { playing = false; paint(); }); else setVol(tr, VOL, 2.5);
    }
    function stop() {
      playing = false; paint();
      tracks.forEach(function (tr) { setVol(tr, 0, .5); }); setTimeout(function () { if (!playing) tracks.forEach(function (tr) { tr.a.pause(); }); }, 550);
    }
    // ต่อเพลงถัดไปก่อนเพลงเดิมจบ XF วินาที (จางซ้อนกัน ไม่เงียบกลางทาง)
    tracks.forEach(function (tr, i) {
      tr.a.addEventListener('timeupdate', function () {
        if (!playing || i !== cur || xfading || !tr.a.duration) return;
        if (tr.a.currentTime > tr.a.duration - XF) {
          xfading = true; var nx = (cur + 1) % tracks.length, nt = tracks[nx];
          nt.a.currentTime = 0; setVol(nt, 0); nt.a.play().catch(function () {}); setVol(nt, VOL, XF); setVol(tr, 0, XF);
          cur = nx; setTimeout(function () { tr.a.pause(); tr.a.currentTime = 0; xfading = false; }, XF * 1000 + 200);
        }
      });
    });
    var b = document.createElement('button'); b.type = 'button'; b.className = 'gmusic';
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg><i></i><i></i><i></i>';
    function paint() { b.classList.toggle('play', playing); b.setAttribute('aria-label', playing ? 'ปิดเพลง' : 'เปิดเพลง'); }
    b.addEventListener('click', function (e) {
      e.stopPropagation(); e.preventDefault(); needResume = false;
      if (playing) { want = false; stop(); } else { want = true; play(); }
      try { localStorage.setItem('tarot-music', want ? 'on' : 'off'); } catch (er) {}
    });
    document.body.appendChild(b); paint();
    // เข้าหน้าเว็บแล้วเปิดเพลงเองทันที (ณัทกร 20 พ.ย. · คนไม่ชอบค่อยกดปิด)
    // เบราว์เซอร์ส่วนใหญ่ (โดยเฉพาะมือถือ) ไม่ยอมให้มีเสียงก่อนผู้ใช้แตะจอ → ถ้าโดนกัน จะเริ่มทันทีที่แตะ/คลิก/กดปุ่มครั้งแรก ที่ไหนก็ได้ทุกขั้น
    // เปิดได้แค่ครั้งแรก และเฉพาะถ้ายังไม่เคยกดปิด (กันบั๊กปิดแล้วเปิดเอง)
    var autoDone = false;
    function auto(e) {
      if (autoDone || !want || playing) return;
      if (e && e.target && e.target.closest && e.target.closest('.gmusic')) return;
      var tr = tracks[cur]; setVol(tr, 0);
      var p = tr.a.play();
      if (p && p.then) p.then(function () { if (autoDone || !want) { tr.a.pause(); return; } autoDone = true; playing = true; paint(); setVol(tr, VOL, 2.5); }).catch(function () {});
      else { autoDone = true; playing = true; paint(); setVol(tr, VOL, 2.5); }
    }
    var EV = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];  // มือถือนับการแตะตอนยกนิ้ว (pointerup/touchend)
    // บางเครื่องยอมเล่นเพลงตอนเข้าหน้า แต่ระบบเสียงยังพักอยู่ (เงียบ) → แตะครั้งไหนก็ปลุกระบบเสียงให้ดัง ถ้ายังอยากฟัง
    // เสียงอื่นแทรก (เช่น ดูสตอรี่ที่มีเพลง) → ระบบมือถือสั่งหยุดเพลงเรา · พอเสียงนั้นจบ ให้กลับมาเล่นต่อเอง (ณัทกร 22 พ.ย. 2569)
    // เล่นต่อเฉพาะถ้ายังอยากฟัง (want) และไม่ได้กดปิดเอง · ถ้าเครื่องไม่ยอมเล่นเอง จะเล่นต่อตอนแตะจอครั้งถัดไป
    var needResume = false;
    tracks.forEach(function (tr, i) {
      tr.a.addEventListener('pause', function () {
        if (playing && i === cur && !xfading && !tr.a.ended) { playing = false; needResume = !!MOBILE; paint(); }  // คอม: โดนกดหยุดจากปุ่มสื่อของเครื่อง = ตั้งใจหยุด ไม่เปิดเอง
      });
    });
    function tryResume() {
      if (!want || !needResume || playing || document.hidden) return;
      var tr = tracks[cur]; setVol(tr, 0);
      var p = tr.a.play();
      if (p && p.then) p.then(function () { if (!want || !needResume) { tr.a.pause(); return; } needResume = false; playing = true; paint(); setVol(tr, VOL, 1.5); }).catch(function () {});
    }
    function wake(e) {
      if (e && e.target && e.target.closest && e.target.closest('.gmusic')) return;
      tryResume();
    }
    setInterval(tryResume, 2000);
    window.addEventListener('focus', tryResume); window.addEventListener('pageshow', tryResume);
    function hook(doc) { try { EV.forEach(function (ev) { doc.addEventListener(ev, auto, true); doc.addEventListener(ev, wake, true); }); } catch (e) {} }
    hook(document);
    function hookFrame(f) { function h() { try { hook(f.contentDocument); } catch (e) {} } f.addEventListener('load', h); h(); }
    [].forEach.call(document.querySelectorAll('iframe'), hookFrame);
    new MutationObserver(function (ms) { ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (x) { if (x.tagName === 'IFRAME') hookFrame(x); }); }); }).observe(document.body, { childList: true });
    auto(); // ลองเปิดทันทีตอนเข้าหน้า
    // มือถือ: สลับไปแอปอื่น = หยุดชั่วคราว · กลับมา = เล่นต่อเฉพาะถ้าตอนออกไปกำลังเล่นอยู่
    // คอม: เพลงเล่นต่อแม้สลับแท็บ/หน้าต่าง (ณัทกร 22 พ.ย. 2569) — ไม่หยุดเลย
    var MOBILE = window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches;
    document.addEventListener('visibilitychange', function () {
      if (!MOBILE) return;
      if (document.hidden) { if (playing) { playing = false; needResume = true; paint(); tracks.forEach(function (tr) { tr.a.pause(); }); } }
      else tryResume();
    });
  }
  var HAS_MUSIC = true; // เพลงชุดใหม่ แต่งด้วย ElevenLabs 20 พ.ย. (ชุด FreePD เก่าโละทิ้งแล้ว)
  function init() { build(); if (HAS_MUSIC && !document.querySelector('.bg')) music(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
