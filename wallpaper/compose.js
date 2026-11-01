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
    if (root.document.fonts) await Promise.all([document.fonts.load('700 40px ShopSeal', 'กมั่ง'), document.fonts.load('500 40px ShopName', 'กมั่ง')])

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
        const shrink = s.grid[i] === 1 ? .78 : s.grid[i] === 3 ? .84 : 1, r = Math.floor(i / 3), c = i % 3
        place(g, await digit(s.grid[i], true), f.x + (c + .5) * cw, f.y + (r + .5) * ch, cw * .74 * shrink, ch * .74 * shrink, 0, k)
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
      for (let i = 0; i < 2; i++) place(g, await digit(+s.number[i], s.thaiNumber), nx + [-4, 6][i], ny + i * gap, bw, bh, [2.5, -2][i], k)
      const la = alphaOf(L), al = new Float32Array(la.length)
      for (let i = 0; i < al.length; i++) al[i] = la[i] / 255 * .94
      inkOn(al)
    }

    if (s.showSeal && s.word) {
      const sw = 170.4, sh = 89.5, sy = ny + gap + bh / 2 + 65, L = layer(W, H), g = L.getContext('2d')
      g.drawImage(await img(`${ASSET}seal.png`), (nx - sw / 2) * k, (sy - sh / 2) * k, sw * k, sh * k)
      // ตัวอักษรเว้นเป็นเนื้อกระดาษแบบแกะตรา ให้เบราว์เซอร์วางวรรณยุกต์ไทย
      let size = 54
      g.font = `700 ${size * k}px ShopSeal, sans-serif`
      const room = sw * .82 * k, tw = g.measureText(s.word).width
      if (tw > room) { size *= room / tw; g.font = `700 ${size * k}px ShopSeal, sans-serif` }
      g.globalCompositeOperation = 'destination-out'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000'
      g.fillText(s.word, nx * k, (sy + size * .06) * k)
      const la = alphaOf(L), al = new Float32Array(la.length)
      for (let i = 0; i < al.length; i++) al[i] = la[i] / 255 * .97
      inkOn(al, [160, 40, 27], .72, .28)
    }

    // ชื่อใช้หมึกดำเท่านั้น คนไทยจำนวนมากถือเรื่องเขียนชื่อตัวเองด้วยสีแดง
    if (s.showName && s.name) {
      const L = layer(W, H), g = L.getContext('2d')
      let size = 34
      g.font = `500 ${size * k}px ShopName, sans-serif`
      const tw = g.measureText(s.name).width, room = 700 * k
      if (tw > room) { size *= room / tw; g.font = `500 ${size * k}px ShopName, sans-serif` }
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000'
      g.fillText(s.name, DW / 2 * k, 1800 * k)
      const la = alphaOf(L), al = new Float32Array(la.length)
      for (let i = 0; i < al.length; i++) al[i] = la[i] / 255 * .86
      inkOn(al)
    }
    ctx.putImageData(page, 0, 0)
  }
  root.Compose = { render, THAI, Y_INK }
})(window)
