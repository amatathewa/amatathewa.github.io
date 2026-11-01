// ประกอบวอลเปเปอร์ในเบราว์เซอร์ · ค่าตำแหน่งยึดภาพรอบ 10 ที่ณัทกรให้ผ่าน (ออกแบบบนขนาด 852x1846)
;(function (root) {
  const ASSET = 'assets/'
  const DW = 852
  const Y_INK = (36 + 31 + 27) / 3
  const JOBS = new Map()
  const img = src => {
    if (!JOBS.has(src)) JOBS.set(src, new Promise((ok, no) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => ok(i); i.onerror = () => { JOBS.delete(src); no(new Error('โหลดภาพไม่ได้ ' + src)) }; i.src = src }))
    return JOBS.get(src)
  }
  const THAI = '๑๒๓๔๕๖๗๘๙'
  const layer = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c }
  // ความเข้มของหมึกเก็บในช่องโปร่งใส
  const alphaOf = c => { const d = c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height).data, a = new Uint8Array(c.width * c.height); for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3]; return a }
  const place = (ctx, sp, cx, cy, bw, bh, deg, k) => {
    const r = Math.min(bw / sp.width, bh / sp.height), w = sp.width * r, h = sp.height * r
    ctx.save(); ctx.translate(cx * k, cy * k); ctx.rotate(-deg * Math.PI / 180); ctx.drawImage(sp, -w * k / 2, -h * k / 2, w * k, h * k); ctx.restore()
  }
  const digit = (ch, thai) => img(`${ASSET}digit/${thai ? 't' : 'a'}${ch}.png`)
  // วัดเนื้อหมึกจริงของเลขแต่ละตัว เพื่อให้ทุกตัวดูใหญ่เท่ากัน
  const INK = new WeakMap()
  const inkBox = sp => {
    if (INK.has(sp)) return INK.get(sp)
    const c = layer(sp.width, sp.height), g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(sp, 0, 0)
    const d = g.getImageData(0, 0, c.width, c.height).data
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
    const box = { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }
    INK.set(sp, box); return box
  }
  const placeEven = (ctx, sp, cx, cy, size, maxW, maxH, deg, k) => {
    const b = inkBox(sp), r = Math.min(size / Math.sqrt(b.w * b.h), maxW / b.w, maxH / b.h)
    ctx.save(); ctx.translate(cx * k, cy * k); ctx.rotate(-deg * Math.PI / 180)
    ctx.drawImage(sp, -(b.x + b.w / 2) * r * k, -(b.y + b.h / 2) * r * k, sp.width * r * k, sp.height * r * k); ctx.restore()
  }
  const grain = (x, y) => { const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return n - Math.floor(n) }

  async function render(canvas, s, meta, baseUrl) {
    const W = canvas.width, H = canvas.height, k = W / DW
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const deity = meta.deities.find(d => d.id === s.image)
    const base = await img(baseUrl)
    const need = []
    if (s.frame && s.frame !== 'none' && s.grid) { need.push(img(`${ASSET}frame/${s.frame}.png`), img(`${ASSET}mask/${s.image}.png`)); for (const n of new Set(s.grid)) need.push(digit(n, true)) }
    if (s.showNumber && s.number) for (const c of s.number) need.push(digit(+c, s.thaiNumber))
    if (s.showSeal && s.word) need.push(img(`${ASSET}seal.png`))
    await Promise.all(need)
    if (root.document.fonts) await Promise.all([document.fonts.load('700 40px ShopSeal', 'กมั่ง'), document.fonts.load('700 40px ShopName', 'กมั่ง')])

    ctx.drawImage(base, 0, 0, W, H)
    const page = ctx.getImageData(0, 0, W, H), px = page.data
    const inkOn = (al, c = [36, 31, 27], paper = .55, solid = .45) => {
      for (let i = 0, p = 0; i < al.length; i++, p += 4) {
        const a = al[i]; if (!a) continue
        for (let n = 0; n < 3; n++) px[p + n] = px[p + n] * (1 - a) + (px[p + n] * c[n] / 255 * paper + c[n] * solid) * a
      }
    }

    if (s.frame && s.frame !== 'none' && s.grid) {
      const f = meta.frames[s.frame], L = layer(W, H), g = L.getContext('2d'), M = layer(W, H), mg = M.getContext('2d')
      g.drawImage(await img(`${ASSET}frame/${s.frame}.png`), 0, 0, W, H)
      const cw = f.w / 3, ch = f.h / 3
      for (let i = 0; i < 9; i++) {
        const r = Math.floor(i / 3), c = i % 3
        placeEven(g, await digit(s.grid[i], true), f.x + (c + .5) * cw, f.y + (r + .5) * ch, Math.sqrt(cw * ch) * .6, cw * .76, ch * .76, 0, k)
      }
      mg.drawImage(await img(`${ASSET}mask/${s.image}.png`), 0, 0, W, H)
      const la = alphaOf(L), ma = alphaOf(M), al = new Float32Array(la.length)
      for (let i = 0; i < al.length; i++) al[i] = la[i] / 255 * .30 * ma[i] / 255
      inkOn(al)
    }

    const side = s.side || deity.side, top = deity.y
    const bw = 153.4, bh = 139.8, gap = 150, nx = side === 'L' ? 109.1 : 742.9, ny = top + bh / 2
    if (s.showNumber && s.number) {
      const L = layer(W, H), g = L.getContext('2d')
      for (let i = 0; i < 2; i++) placeEven(g, await digit(+s.number[i], s.thaiNumber), nx + [-4, 6][i], ny + i * gap, 116, bw, bh, [2.5, -2][i], k)
      const la = alphaOf(L), al = new Float32Array(la.length)
      for (let i = 0; i < al.length; i++) al[i] = la[i] / 255 * .94
      inkOn(al)
    }

    if (s.showSeal && s.word) {
      const sw = 182, sh = 104, sy = ny + gap + bh / 2 + 18 + sh / 2, L = layer(W, H), g = L.getContext('2d')
      g.drawImage(await img(`${ASSET}seal.png`), (nx - sw / 2) * k, (sy - sh / 2) * k, sw * k, sh * k)
      // ตัวอักษรเว้นเป็นเนื้อกระดาษแบบแกะตรา วัดรวมวรรณยุกต์และสระ ให้อยู่ในกรอบแดงเสมอ
      let size = 58
      g.textAlign = 'center'; g.textBaseline = 'alphabetic'
      const measure = () => { g.font = `700 ${size * k}px ShopSeal, sans-serif`; return g.measureText(s.word) }
      let m = measure()
      const fit = Math.min(1, sw * .82 * k / (m.actualBoundingBoxLeft + m.actualBoundingBoxRight), sh * .68 * k / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent))
      size *= fit; m = measure()
      g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'
      g.fillText(s.word, nx * k + (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2, sy * k + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2)
      const la = alphaOf(L), al = new Float32Array(la.length)
      for (let i = 0; i < al.length; i++) al[i] = Math.min(1, la[i] / 255 * 1.9) * .97
      inkOn(al, [158, 34, 22], .18, .82)
    }

    // ชื่อใช้หมึกดำเท่านั้น คนไทยจำนวนมากถือเรื่องเขียนชื่อตัวเองด้วยสีแดง
    if (s.showName && s.name) {
      // วางเหนือแถบปุ่มหน้าจอล็อกและช่องค้นหาหน้าโฮม พื้นหลังสว่างขึ้นเล็กน้อยให้อ่านออกเมื่อทับลายองค์เทพ
      const NAME_Y = 1458, L = layer(W, H), g = L.getContext('2d'), G = layer(W, H), gg = G.getContext('2d')
      let size = 50
      const setFont = c => { c.font = `700 ${size * k}px ShopName, serif`; c.textAlign = 'center'; c.textBaseline = 'middle' }
      setFont(g)
      const tw = g.measureText(s.name).width, room = 660 * k
      if (tw > room) { size *= room / tw; setFont(g) }
      setFont(gg); gg.shadowColor = '#000'; gg.shadowBlur = 26 * k; gg.fillStyle = '#000'
      for (let i = 0; i < 3; i++) gg.fillText(s.name, DW / 2 * k, NAME_Y * k)
      const ga = alphaOf(G), glow = new Float32Array(ga.length)
      for (let i = 0; i < ga.length; i++) glow[i] = ga[i] / 255 * .78
      let pr = 0, pg = 0, pb = 0, count = 0
      for (let p = 0; p < W * 4 * 40; p += 20) { pr += px[p]; pg += px[p + 1]; pb += px[p + 2]; count++ }
      inkOn(glow, [pr / count, pg / count, pb / count], 0, 1)
      g.fillStyle = '#000'; g.fillText(s.name, DW / 2 * k, NAME_Y * k)
      const la = alphaOf(L), al = new Float32Array(la.length)
      for (let i = 0; i < al.length; i++) if (la[i]) al[i] = la[i] / 255 * (.8 + .2 * grain(i % W, Math.floor(i / W)))
      inkOn(al)
    }
    ctx.putImageData(page, 0, 0)
  }
  root.Compose = { render, THAI, Y_INK }
})(window)
