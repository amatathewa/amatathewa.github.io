// หน้าร้านวอลเปเปอร์: คำนวณเลข → แต่งภาพ → รับภาพ · ลูกค้าเลือกเองทุกอย่าง เรามีหน้าที่ให้ข้อเสนอ
;(async function () {
  const $ = id => document.getElementById(id), L = window.ThaiAstro, SHOP = window.SHOP
  const meta = await (await fetch('assets/meta.json?v=202611031')).json()
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e }
  const fill = (s, list) => list.forEach(([v, t]) => s.add(new Option(t, v)))
  const SET_IMAGES = 6
  const MONTH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
  const WORDS = ['มั่งคั่ง', 'เมตตา', 'รุ่งเรือง', 'สำเร็จ', 'มั่นคง', 'ร่มเย็น', 'ราบรื่น', 'โชคดี', 'สงบสุข']
  const SRC = { chart: 'คำนวณจากดวงเกิดของคุณ', taksa: 'คำนวณจากทักษาวันเกิดของคุณ', general: 'คู่มาตรฐานที่ไม่ขัดกับเลขกาลกิณีของคุณ' }
  const MOTIVE = {
    wealth: 'ใส่ไว้ให้เห็นทุกครั้งที่หยิบมือถือ เตือนใจเรื่องการเงินที่ตั้งใจไว้',
    charm: 'ใส่ไว้เตือนใจเรื่องความรักและการวางตัวกับคนรอบข้าง',
    flow: 'ใส่ไว้เตือนใจให้ใช้ชีวิตอย่างใจเย็นและมีผู้ใหญ่คอยหนุน',
    fame: 'ใส่ไว้เตือนใจเรื่องงานและชื่อเสียงที่อยากไปให้ถึง',
    extra: 'เป็นคู่สำรองจากดวงเดียวกัน เลือกใส่แทนคู่หลักได้',
  }
  const FRAME_NOTE = {
    mountain: 'ดั่งขุนเขาที่ตั้งมั่น เปรียบถึงความมั่นคงและความรุ่งเรืองในหน้าที่การงาน',
    plain: 'เรียบนิ่งอย่างคนที่ไปถึงจุดหมาย เปรียบถึงความสำเร็จในชีวิตการงาน',
    lotus: 'ดั่งกลีบบัวที่ค่อยๆ เบ่งบาน เปรียบถึงความงอกงามของการเงิน',
    heart: 'ดั่งดอกบัวกลางหัวใจ เปรียบถึงความงดงามและเสน่ห์ในความรัก',
    none: 'ภาพองค์เทพล้วน ไม่มีตารางเลข',
  }
  // ความหมายของแถวเป็นแนวทางที่อมตเทวาออกแบบเอง ไม่ใช่หลักจากตำราโดยตรง
  const ROWS = [
    ['แถวบน', 'งานและชื่อเสียง', 'ส่วนบนเหมือนสิ่งที่คนมองเห็นเรา จึงวางเลขเรื่องงานไว้ตรงนี้', 'fame'],
    ['แถวกลาง', 'ตัวเราและความรัก', 'ใจกลางของตารางเหมือนใจของเรา จึงวางเลขเรื่องเสน่ห์และความสัมพันธ์ไว้ตรงนี้', 'charm'],
    ['แถวล่าง', 'เงินและฐานชีวิต', 'ส่วนล่างเหมือนรากฐาน จึงวางเลขเรื่องทรัพย์ไว้ตรงนี้', 'wealth'],
  ]
  const DEFAULT_FRAME = { ganesha: 'mountain', lakshmi: 'lotus', parvati: 'heart', saraswati: 'lotus', shiva: 'plain', vishnu: 'plain', brahma: 'lotus', trimurti: 'plain', trishakti: 'heart' }
  const THAI = '๐๑๒๓๔๕๖๗๘๙', thai = n => String(n).replace(/\d/g, d => THAI[d])
  const pad = n => String(n).padStart(2, '0'), range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
  fill($('d'), range(1, 31).map(n => [n, n])); fill($('m'), MONTH.map((t, i) => [i + 1, t])); fill($('y'), range(2460, 2569).reverse().map(n => [n, n]))
  fill($('hh'), range(0, 23).map(n => [n, pad(n) + ' นาฬิกา'])); fill($('mm'), range(0, 59).map(n => [n, pad(n) + ' นาที']))
  $('y').value = 2535; $('hh').value = 8
  const PROV = L.getThaiAstrologyProvinceLocations().slice().sort((a, b) => a.province.localeCompare(b.province, 'th'))
  fill($('prov'), PROV.map(p => [p.province, p.province]))
  const fillAmp = () => { $('amp').length = 0; fill($('amp'), [['', 'ตัวจังหวัด / ไม่ทราบ'], ...((window.AMPHOE || {})[$('prov').value] || []).map(([n]) => [n, n])]) }
  $('prov').value = 'กรุงเทพมหานคร'; fillAmp(); $('prov').onchange = fillAmp
  const isWed = () => new Date(Date.UTC(+$('y').value - 543, +$('m').value - 1, +$('d').value)).getUTCDay() === 3
  const sync = () => { $('timeBox').hidden = $('noTime').checked; $('nightBox').hidden = !($('noTime').checked && isWed()) }
  ;['noTime', 'd', 'm', 'y'].forEach(id => $(id).addEventListener('change', sync)); sync()
  const lonOf = () => { const p = $('prov').value, a = $('amp').value, r = ((window.AMPHOE || {})[p] || []).find(x => x[0] === a); return r ? r[1] : (PROV.find(x => x.province === p) || {}).longitude }

  // กันดึงภาพออกแบบง่ายๆ แคปหน้าจอยังทำได้ ภาพที่แสดงจึงมีลายน้ำเสมอ
  document.addEventListener('contextmenu', e => { if (e.target.closest('img,canvas')) e.preventDefault() })
  document.addEventListener('dragstart', e => { if (e.target.closest('img,canvas')) e.preventDefault() })

  const S = { image: 'shiva-ganesha', frame: 'plain', frameChosen: false, grid: null, variant: 0, tried: [0], diagonal: false, nameHigh: false, showNumber: true, number: null, thaiNumber: false, side: null, showSeal: true, word: 'มั่งคั่ง', showName: false, name: '', plan: 'one' }
  // แต่งแยกรายภาพ ยกเว้นตารางและชื่อที่ติดตัวเจ้าของดวงเสมอแม้เปลี่ยนภาพ
  const DESIGN_KEYS = ['frame', 'frameChosen', 'showNumber', 'number', 'thaiNumber', 'side', 'showSeal', 'word']
  const SHARED_KEYS = ['grid', 'variant', 'tried', 'diagonal', 'showName', 'name', 'nameHigh']
  let chart = null, allPairs = [], picked = [], owner = null, gridOptions = []

  // ---------- เก็บในเครื่องลูกค้า ----------
  const keep = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d } catch { return d } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
  }
  const passes = keep.get('amt-passes', {})
  const allDesigns = keep.get('amt-designs', {}), allSaved = keep.get('amt-saved', {}), allShared = keep.get('amt-shared', {})
  const designs = () => allDesigns[owner] || (allDesigns[owner] = {})
  const savedFiles = () => allSaved[owner] || (allSaved[owner] = {})
  const saveDesign = () => {
    if (!owner) return
    const d = {}, sh = { picked }
    DESIGN_KEYS.forEach(k => { d[k] = S[k] }); SHARED_KEYS.forEach(k => { sh[k] = S[k] })
    designs()[S.image] = d; allShared[owner] = sh
    keep.set('amt-designs', allDesigns); keep.set('amt-shared', allShared)
  }
  // วันเกิดหนึ่งดวงซื้อได้หลายครั้ง เก็บการซื้อเป็นรายการ (ข้อมูลเก่าที่เก็บเป็นชิ้นเดียวแปลงเป็นรายการ)
  const passList = () => {
    if (!owner) return []
    let l = passes[owner]
    if (!Array.isArray(l)) { l = passes[owner] = l ? [l] : []; l.forEach(p => { if (p.scope === 'set' && !p.images) p.images = Object.keys(savedFiles()) }); keep.set('amt-passes', passes) }
    return l.filter(p => p.exp > Date.now())
  }
  const setLeft = p => SET_IMAGES - Math.max((p.images || []).length, p.used || 0)
  // ภาพนี้ใช้สิทธิ์จากการซื้อครั้งไหน: ครั้งที่เคยใช้กับภาพนี้แล้วก่อน แล้วค่อยชุดที่ยังมีสิทธิ์เหลือ
  const passFor = img => {
    const l = passList()
    return l.find(p => (p.images || []).includes(img) || (p.scope === 'one' && p.image === img)) || l.find(p => p.scope === 'set' && setLeft(p) > 0) || null
  }
  const passNow = () => passFor(S.image)
  const covers = () => !!passNow()
  let buyMore = false

  // ---------- วาดภาพ ----------
  const view = $('view')
  let drawing = false, again = false
  const showPaidPreview = () => { if (covers()) { $('paidPreview').src = view.toDataURL('image/jpeg', .85); $('paidName').textContent = meta.deities.find(d => d.id === S.image).label } }
  const draw = async () => {
    if (drawing) { again = true; return }
    drawing = true; $('busy').textContent = 'กำลังวาดภาพ'
    try { await window.Compose.render(view, S, meta, `assets/base/${S.image}.jpg?v=202611031`); $('busy').textContent = ''; view.dataset.ready = (+view.dataset.ready || 0) + 1; showPaidPreview(); $('miniView').getContext('2d').drawImage(view, 0, 0, 336, 728) }
    catch (e) { $('busy').textContent = 'โหลดภาพไม่สำเร็จ ลองแตะอีกครั้ง'; console.error(e) }
    drawing = false
    if (again) { again = false; draw() }
  }

  // มือถือ: ภาพใหญ่เลื่อนตามหน้าปกติ พอเลื่อนลงไปแต่ง มีภาพเล็กมุมจอให้เห็นผล กดแล้วกลับไปดูภาพใหญ่
  const mini = $('miniView'), mobile = window.matchMedia('(max-width:799px)')
  let stagePassed = false, buyReached = false
  const syncMini = () => { mini.hidden = !(mobile.matches && stagePassed && !buyReached) }
  // ขึ้นเมื่อเลื่อนผ่านภาพใหญ่ในข้อ 3 ไปแล้วเท่านั้น และหายทันทีที่ข้อ 4 โผล่เกิน 15% ของจอ
  new IntersectionObserver(([e]) => { stagePassed = !e.isIntersecting && e.boundingClientRect.top < 0; syncMini() }, { threshold: .25 }).observe($('stage'))
  new IntersectionObserver(([e]) => { buyReached = e.isIntersecting || e.boundingClientRect.top < 0; syncMini() }, { rootMargin: '0px 0px -15% 0px' }).observe($('buy'))
  mini.onclick = () => $('stage').scrollIntoView({ block: 'center' })

  // มือถือ: แตะช่องเลือกวัน เดือน ปี จังหวัด แล้วหน้าจอต้องอยู่นิ่ง จนกว่าลูกค้าจะแตะจอครั้งถัดไป
  let touchTop = 0, holdTop = null
  const holdStill = () => {
    if (holdTop === null) return
    if (document.body.scrollTop !== holdTop) document.body.scrollTop = holdTop
    if (document.documentElement.scrollTop) document.documentElement.scrollTop = 0
    requestAnimationFrame(holdStill)
  }
  const startHold = () => { if (!mobile.matches || holdTop !== null) return; holdTop = touchTop; holdStill() }
  document.addEventListener('touchstart', () => { touchTop = document.body.scrollTop; holdTop = null }, { capture: true, passive: true })
  document.addEventListener('focusin', e => { if (e.target.matches('select')) startHold() })
  document.addEventListener('click', e => { if (e.target.matches('select')) startHold() })
  document.addEventListener('focusout', e => { if (e.target.matches('select')) holdTop = null })

  // ---------- ตัวเลือก ----------
  const chips = (box, items, isOn, onTap) => {
    box.textContent = ''
    for (const [value, text] of items) {
      const b = el('button', 'chip', text); b.type = 'button'; b.setAttribute('aria-pressed', isOn(value))
      b.onclick = () => { onTap(value); saveDesign(); renderControls(); draw() }
      box.append(b)
    }
  }
  const renderControls = () => {
    chips($('frames'), [...Object.entries(meta.frames).map(([k, f]) => [k, f.label]), ['none', 'ไม่ใส่']], v => S.frame === v, v => { S.frame = v; S.frameChosen = true })
    $('frameNote').textContent = FRAME_NOTE[S.frame] || ''
    chips($('numberPick'), [...allPairs.map(p => [p.num, p.num]), ['none', 'ไม่ใส่']], v => v === 'none' ? !S.showNumber : S.showNumber && S.number === v, v => { if (v === 'none') S.showNumber = false; else { S.showNumber = true; S.number = v } })
    chips($('numberStyle'), [['ar', 'เลขสากล'], ['th', 'เลขไทย']], v => (v === 'th') === S.thaiNumber, v => { S.thaiNumber = v === 'th' })
    chips($('namePlace'), [['low', 'ใต้องค์เทพ'], ['high', 'ขยับขึ้น']], v => (v === 'high') === !!S.nameHigh, v => { S.nameHigh = v === 'high' })
    chips($('sidePick'), [['R', 'ขวา'], ['L', 'ซ้าย']], v => (S.side || meta.deities.find(d => d.id === S.image).side) === v, v => { S.side = v })
    chips($('words'), [...WORDS.map(w => [w, w]), ['none', 'ไม่ใส่']], v => v === 'none' ? !S.showSeal : S.showSeal && S.word === v && !$('ownWord').value.trim(), v => { $('ownWord').value = ''; if (v === 'none') S.showSeal = false; else { S.showSeal = true; S.word = v } })
    const saved = owner ? savedFiles() : {}
    for (const b of $('thumbs').children) { b.setAttribute('aria-pressed', b.dataset.id === S.image); b.classList.toggle('done', !!saved[b.dataset.id]) }
    for (const b of $('plans').children) b.setAttribute('aria-pressed', b.dataset.plan === S.plan)
    syncPay()
  }
  const applyDesign = () => {
    const d = designs()[S.image]
    if (d) { DESIGN_KEYS.forEach(k => { S[k] = d[k] }); $('ownWord').value = WORDS.includes(S.word) ? '' : S.word }
    else { S.side = null; if (!S.frameChosen) S.frame = DEFAULT_FRAME[S.image.split('-')[0]] }
  }
  // กลับมาวันเกิดเดิมแล้วได้ตารางและชื่อเดิม ตารางที่เลิกมีในชุดตัวเลือกแล้วกลับไปแบบแนะนำ
  const applyShared = () => {
    const sh = allShared[owner]
    S.diagonal = !!(sh && sh.diagonal)
    if (sh && sh.picked) picked = allPairs.map(p => p.num).filter(n => sh.picked.includes(n))
    const g = rebuildGrid()
    if (!sh) return g
    const at = gridOptions.indexOf((sh.grid || []).join(''))
    if (at >= 0) { S.variant = at; S.grid = gridOptions[at].split('').map(Number); S.tried = [...new Set([...(sh.tried || []).filter(i => i < gridOptions.length), 0, at])].sort((a, b) => a - b) }
    S.name = sh.name || ''; S.showName = !!sh.showName; S.nameHigh = !!sh.nameHigh; $('name').value = S.name
    return g
  }
  meta.deities.forEach(d => {
    const b = el('button', 'thumb'); b.type = 'button'; b.dataset.id = d.id
    const i = el('img'); i.src = `assets/thumb/${d.id}.jpg?v=202611011`; i.alt = ''; i.loading = 'lazy'; i.width = 180; i.height = 390; i.draggable = false
    b.append(i, el('span', '', d.label))
    b.onclick = () => { saveDesign(); S.image = d.id; applyDesign(); renderGridWhy(); renderControls(); draw() }
    $('thumbs').append(b)
  })
  ;[['one', SHOP.price.one, 'ภาพนี้ 1 ภาพ'], ['set', SHOP.price.set, `เลือกได้ ${SET_IMAGES} ภาพ`]].forEach(([k, p, t]) => {
    const b = el('button', 'plan'); b.type = 'button'; b.dataset.plan = k; b.append(el('b', '', `${p} บาท`), el('span', '', t))
    b.onclick = () => { S.plan = k; renderControls() }; $('plans').append(b)
  })
  $('ownWord').oninput = () => { const v = $('ownWord').value.trim(); if (v) { S.showSeal = true; S.word = v } else S.word = WORDS[0]; saveDesign(); renderControls(); draw() }
  $('name').oninput = () => { S.name = $('name').value.trim(); S.showName = !!S.name; saveDesign(); draw() }

  // ---------- เลขมงคล ----------
  const clean = t => String(t || '').split(' · ')[0].replace(/\s*มองจาก.*$/, '').replace(/\s*เสริมเงิน เสริมดวง เสริมบารมี/, '').trim()
  const pairName = (a, b) => { const k = `${Math.min(a, b)}-${Math.max(a, b)}`, p = (window.PAIR_LONG || {})[k]; return p ? p.name.replace(/\s*\(.*\)\s*$/, '') : '' }
  const rowPair = key => { const p = allPairs.find(x => x.key === key) || (key === 'fame' ? allPairs.find(x => x.key === 'flow') : null); return p || null }
  const rebuildGrid = (keepGrid = false) => {
    const pool = allPairs.map(p => p.num), rows = ROWS.map(r => { const p = rowPair(r[3]); return p ? p.num : null })
    const g = window.Lucky.grid(chart.kal, picked.length ? picked : pool, pool, { rank: chart.rank, salt: chart.salt, rows, diagonal: S.diagonal })
    gridOptions = g.options
    if (!keepGrid) { S.variant = 0; S.tried = [0] }
    S.variant = Math.min(S.variant, gridOptions.length - 1)
    S.grid = gridOptions[S.variant].split('').map(Number)
    return g
  }
  const goGrid = i => { S.variant = (i + gridOptions.length) % gridOptions.length; S.grid = gridOptions[S.variant].split('').map(Number); S.tried = [...new Set([...(S.tried || []), S.variant])].sort((a, b) => a - b); saveDesign(); renderGridWhy(); renderControls(); draw() }
  const dropTried = i => {
    S.tried = i === null ? [0] : S.tried.filter(x => x !== i)
    if (!S.tried.includes(S.variant)) goGrid(0); else { saveDesign(); renderGridWhy(); renderControls() }
  }
  const setLevel = diagonal => { if (S.diagonal === diagonal) return; S.diagonal = diagonal; const g = rebuildGrid(); note(g); saveDesign(); renderGridWhy(); renderControls(); draw() }
  const renderGridPicker = () => document.querySelectorAll('.gridpick').forEach(box => {
    box.textContent = ''
    const levels = el('div', 'chips')
    ;[[false, 'มงคล 4 ทิศ'], [true, 'มงคล 8 ทิศ']].forEach(([v, t]) => { const b = el('button', 'chip', t); b.type = 'button'; b.setAttribute('aria-pressed', S.diagonal === v); b.onclick = () => setLevel(v); levels.append(b) })
    box.append(levels, el('p', 'help', S.diagonal ? 'เข้มที่สุด เลขเฉียงก็เป็นคู่มงคลด้วย แต่บางเลขจะไม่ขึ้นในตาราง และเรื่องรายแถวตรงน้อยลง' : 'เลขที่ติดกันซ้าย ขวา บน ล่าง เป็นคู่มงคล เลขหลากหลายกว่า และเรื่องรายแถวตรงได้มากกว่า'))
    const nav = el('div', 'gridnav'), prev = el('button', 'chip', '◀ แบบก่อนหน้า'), next = el('button', 'chip', 'แบบถัดไป ▶')
    prev.type = next.type = 'button'; prev.onclick = () => goGrid(S.variant - 1); next.onclick = () => goGrid(S.variant + 1)
    nav.append(prev, el('b', '', `แบบที่ ${S.variant + 1} จาก ${gridOptions.length}`), next); box.append(nav)
    const seen = el('div', 'triedgrids')
    ;(S.tried || []).forEach(i => {
      const wrap = el('div', 'triedwrap'), b = el('button', 'tried'); b.type = 'button'; b.setAttribute('aria-pressed', i === S.variant); b.setAttribute('aria-label', `กลับไปตารางแบบที่ ${i + 1}`)
      const t = el('span', 'triedmini'); [...gridOptions[i]].forEach(n => t.append(el('i', '', thai(n))))
      b.append(t, el('small', '', i === 0 ? 'แบบแนะนำ' : `แบบที่ ${i + 1}`)); b.onclick = () => goGrid(i); wrap.append(b)
      if (i !== 0) { const del = el('button', 'trieddel', '×'); del.type = 'button'; del.setAttribute('aria-label', `ลบตารางแบบที่ ${i + 1} ออกจากแถบนี้`); del.onclick = () => dropTried(i); wrap.append(del) }
      seen.append(wrap)
    })
    box.append(el('p', 'help', 'เรียงลำดับตายตัว ไม่ได้สุ่ม กดกลับไปแบบที่ดูแล้วได้ทุกเมื่อ กด × เพื่อลบแบบที่ไม่เอาออกจากแถบ'), seen)
    if ((S.tried || []).length > 2) { const clear = el('button', 'chip', 'ล้างแบบที่ดูแล้ว'); clear.type = 'button'; clear.onclick = () => dropTried(null); box.append(clear) }
  })
  const renderPairs = () => {
    const box = $('pairs'); box.textContent = ''
    allPairs.forEach(p => {
      const row = el('div', 'pair'), num = el('div', 'num', p.num), txt = el('div')
      num.append(el('small', '', `หรือ ${p.back}`))
      txt.append(el('b', '', p.name ? `${p.label} · ${p.name}` : p.label))
      const meaning = clean(p.meaning)
      if (meaning) txt.append(el('p', '', meaning))
      txt.append(el('p', 'why', `ที่มาของเลขนี้: ${p.why}`), el('p', 'motive', MOTIVE[p.key]))
      const lab = el('label', 'check'), c = el('input'); c.type = 'checkbox'; c.checked = picked.includes(p.num)
      c.onchange = () => { picked = allPairs.map(x => x.num).filter(n => n === p.num ? c.checked : picked.includes(n)); const g = rebuildGrid(); note(g); saveDesign(); renderGridWhy(); renderControls(); draw() }
      lab.append(c, 'ใส่ในตารางเลข')
      row.append(num, txt, lab); box.append(row)
    })
    box.append(el('div', 'avoid', `เลขกาลกิณีของคนเกิดวัน${chart.day} คือ ${chart.avoidDigit} ระบบจึงไม่ใส่เลขนี้ในภาพ${chart.hasTime ? '' : ' และเพราะไม่รู้เวลาเกิด เลขชุดนี้จึงคิดจากวันเกิดอย่างเดียว'}`))
    const n = el('p', 'help'); n.id = 'gridMiss'; box.append(n)
  }
  const note = g => { const n = $('gridMiss'); if (n) n.textContent = g.missing.length ? `ตารางมีช่องจำกัด คู่ ${g.missing.join(' ')} จึงยังไม่ได้อยู่ติดกัน ลองเอาติ๊กบางคู่ออกได้` : '' }

  // ทำไมต้องเลข 9 ตัวนี้ อธิบายจากดวงของเจ้าของจริง
  const renderGridWhy = () => {
    if (!S.grid) return
    const GRID_EDGES = S.diagonal ? window.Lucky.GRID_ALL : window.Lucky.GRID_STRAIGHT
    const g = S.grid, mini = $('miniGrid'); mini.textContent = ''
    g.forEach(n => mini.append(el('span', '', thai(n))))
    const center = [window.Lucky.NAME[g[4]] || 'เกตุ']
    const reasons = $('gridReasons'); reasons.textContent = ''
    ;[`ไม่มีเลข ${chart.avoidDigit} เพราะเป็นเลขกาลกิณีของคนเกิดวัน${chart.day}`,
      `ช่องกลางคือเลข ${g[4]} ดาว${center[0]} ${chart.strong.length && chart.strong[0].n === g[4] ? 'ซึ่งเป็นดาวที่แข็งที่สุดในดวงของคุณ' : 'เลือกจากดาวที่มีกำลังและเป็นคุณกับดวงของคุณ'}`,
      `เลขที่อยู่ติดกันทั้งซ้าย ขวา บน ล่าง${S.diagonal ? ' และแนวเฉียง' : ''} รวม ${GRID_EDGES.length} คู่ เป็นคู่มงคลทุกคู่`].forEach(t => reasons.append(el('li', '', t)))
    const rowsBox = $('gridRows'); rowsBox.textContent = ''
    ROWS.forEach((r, i) => {
      const cells = g.slice(i * 3, i * 3 + 3), wanted = rowPair(r[3]), inRow = [`${cells[0]}${cells[1]}`, `${cells[1]}${cells[2]}`]
      const norm = x => [...x].sort().join(''), match = wanted && inRow.find(x => norm(x) === norm(wanted.num))
      const row = el('div', 'grid-row'), head = el('div', 'grid-row-num', cells.map(thai).join(' ')), body = el('div')
      body.append(el('b', '', `${r[0]} · ${r[1]}`), el('p', '', r[2]))
      const use = match || inRow.find(x => allPairs.some(p => norm(p.num) === norm(x))) || inRow[0], name = pairName(+use[0], +use[1])
      body.append(el('p', 'rowuse', match ? `เลขที่ควรใช้ ${use}${name ? ` ${name}` : ''} ซึ่งเป็นคู่เรื่อง${wanted.label}ของคุณ` : `แถวนี้มีคู่ ${use}${name ? ` ${name}` : ''}${wanted ? ` ส่วนคู่เรื่อง${wanted.label} ${wanted.num} ยังเลือกใส่เป็นเลขใหญ่บนภาพได้` : ''}`))
      row.append(head, body); rowsBox.append(row)
    })
    const pairs = $('gridPairs'); pairs.textContent = ''
    const seen = new Set()
    GRID_EDGES.forEach(([a, b]) => {
      const k = [g[a], g[b]].sort().join('')
      if (seen.has(k)) return
      seen.add(k)
      const name = pairName(g[a], g[b])
      pairs.append(el('li', '', `${g[a]}${g[b]}${name ? ` ${name}` : ''}`))
    })
    renderGridPicker()
  }

  const sha = async text => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map(b => b.toString(16).padStart(2, '0')).join('')
  $('f').onsubmit = async ev => {
    ev.preventDefault()
    const y = +$('y').value - 543, m = +$('m').value, d = +$('d').value, ok = new Date(Date.UTC(y, m - 1, d)).getUTCMonth() === m - 1
    $('err').hidden = ok
    if (!ok) { $('err').textContent = 'เดือนนี้ไม่มีวันที่นี้ ลองเลือกวันใหม่'; return }
    const noTime = $('noTime').checked, night = $('night').checked
    const inp = noTime ? { y, m, d, hh: null, mm: null, night } : { y, m, d, hh: +$('hh').value, mm: +$('mm').value, lon: lonOf(), province: $('prov').value }
    chart = window.Lucky.build(window.Health, window.Reader, inp)
    // วันเกิดไม่ออกจากเครื่อง ส่งเฉพาะรหัสที่แฮชแล้วตอนซื้อ เพื่อผูกการซื้อกับเจ้าของวันเกิด
    owner = await sha(`amatathewa:${y}-${m}-${d}-${noTime ? `n${night ? 1 : 0}` : `${inp.hh}-${inp.mm}`}`)
    allPairs = [...chart.pairs, ...chart.extras]; picked = allPairs.map(p => p.num)
    S.number = allPairs[0].num; S.showNumber = true
    const g = applyShared()
    applyDesign()
    if (!allPairs.some(p => p.num === S.number)) S.number = allPairs[0].num
    renderPairs(); note(g); renderGridWhy(); renderControls()
    ;['numbers', 'gridWhy', 'studio', 'buy'].forEach(id => { $(id).hidden = false })
    draw(); $('numbers').scrollIntoView()
  }

  // ---------- รับภาพ ----------
  // QR พร้อมเพย์ตามมาตรฐาน EMVCo ใส่ยอดไว้ให้ ลูกค้าไม่ต้องพิมพ์เอง
  const tlv = (id, v) => id + String(v.length).padStart(2, '0') + v
  const crc16 = s => { let c = 0xFFFF; for (let i = 0; i < s.length; i++) { c ^= s.charCodeAt(i) << 8; for (let b = 0; b < 8; b++) c = c & 0x8000 ? (c << 1) ^ 0x1021 : c << 1; c &= 0xFFFF } return c.toString(16).toUpperCase().padStart(4, '0') }
  // ใช้รหัส e-Wallet จาก QR ของ K PLUS แทนเบอร์โทร ลูกค้าถอดรหัสแล้วไม่เห็นเบอร์
  const promptpayPayload = (wallet, amount) => {
    const body = tlv('00', '01') + tlv('01', '12') + tlv('29', tlv('00', 'A000000677010111') + tlv('03', wallet)) + tlv('58', 'TH') + tlv('53', '764') + tlv('54', amount.toFixed(2)) + '6304'
    return body + crc16(body)
  }
  const drawQr = amount => {
    const qr = window.qrcode(0, 'M'); qr.addData(promptpayPayload(SHOP.bank.wallet, amount)); qr.make()
    const c = $('payQr'), n = qr.getModuleCount(), size = Math.floor(c.width / (n + 8)), off = Math.floor((c.width - size * n) / 2), x = c.getContext('2d')
    x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = '#000'
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (qr.isDark(r, k)) x.fillRect(off + k * size, off + r * size, size, size)
  }
  const syncPay = () => {
    const open = SHOP.paymentsOpen, p = passNow(), paid = !!p && !buyMore, had = passList().length > 0
    $('notice').hidden = open
    $('buyBack').hidden = !(buyMore && p)
    $('passNote').hidden = paid || !had || buyMore
    $('passNote').textContent = 'สิทธิ์ที่ซื้อไว้ใช้ครบแล้ว หรือไม่รวมภาพนี้ ซื้อเพิ่มเพื่อรับภาพนี้ได้เลย'
    $('payClosed').hidden = open
    $('paid').hidden = !paid; $('payOpen').hidden = !open || paid
    $('plans').hidden = !!paid
    $('planNote').hidden = !!paid
    if (open && !paid) {
      const amount = S.plan === 'set' ? SHOP.price.set : SHOP.price.one
      $('payAmount').textContent = amount
      $('payBankName').textContent = SHOP.bank.name
      $('payAccount').textContent = SHOP.bank.account
      $('payHolder').textContent = SHOP.bank.holder
      drawQr(amount)
    }
    if (paid) {
      const thisOne = (p.images || []).includes(S.image)
      const left = passList().filter(q => q.scope === 'set').reduce((n, q) => n + setLeft(q), 0)
      $('paidNote').textContent = p.scope === 'set'
        ? `ชุดนี้ใช้สิทธิ์แล้ว ${SET_IMAGES - setLeft(p)} จาก ${SET_IMAGES} ภาพ (สิทธิ์เหลือรวม ${left} ภาพ) · ${thisOne ? 'ภาพนี้ใช้สิทธิ์แล้ว แก้แล้วโหลดซ้ำไม่เสียสิทธิ์เพิ่ม' : 'ภาพนี้ยังไม่ใช้สิทธิ์ กดบันทึกจะนับ 1 สิทธิ์'} · กดเลือกองค์เทพด้านบนเพื่อแต่งภาพถัดไป ระบบจำการแต่งแยกรายภาพให้ในเครื่องนี้`
        : 'บันทึกภาพนี้เป็นไฟล์เต็มได้'
      showPaidPreview()
    }
  }
  const saveBlob = async (blob, name) => {
    const inApp = /Line\/|FBAN|FBAV|Instagram/i.test(navigator.userAgent)
    const file = new File([blob], name, { type: 'image/jpeg' })
    if (inApp) {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file] }); return } catch {} }
      $('saveImg').src = URL.createObjectURL(blob); $('saveov').hidden = false; return
    }
    const a = el('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 60000)
  }
  const blobOf = c => new Promise(ok => c.toBlob(ok, 'image/jpeg', .93))
  $('saveClose').onclick = () => { $('saveov').hidden = true }
  $('savePreview').onclick = async () => { while (drawing) await new Promise(r => setTimeout(r, 60)); saveBlob(await blobOf(view), `amatathewa-ตัวอย่าง-${S.image}.jpg`) }
  $('saveQr').onclick = async () => saveBlob(await blobOf($('payQr')), `amatathewa-qr-${S.plan === 'set' ? SHOP.price.set : SHOP.price.one}.jpg`)
  $('copyAccount').onclick = async () => {
    const b = $('copyAccount'), number = SHOP.bank.account.replace(/-/g, '')
    try { await navigator.clipboard.writeText(number); b.textContent = 'คัดลอกแล้ว' } catch { b.textContent = number }
    setTimeout(() => { b.textContent = 'คัดลอกเลขบัญชี' }, 2500)
  }
  $('sendSlip').onclick = async () => {
    const file = $('slip').files[0], err = $('payErr'); err.hidden = true
    if (!file) { err.textContent = 'แนบรูปสลิปก่อนนะครับ'; err.hidden = false; return }
    const b = $('sendSlip'); b.disabled = true; b.textContent = 'กำลังตรวจสลิป'
    try {
      const fd = new FormData(); fd.append('plan', S.plan); fd.append('image', S.image); fd.append('owner', owner); fd.append('slip', file)
      const r = await fetch(`${SHOP.api}/order`, { method: 'POST', body: fd }), j = await r.json()
      if (!r.ok) throw new Error(j.message || 'ตรวจสลิปไม่ผ่าน')
      const l = passList(); passes[owner] = l
      if (!l.some(q => q.id && q.id === j.id)) l.push({ token: j.token, scope: j.scope, image: j.image, exp: j.exp, id: j.id, images: [] })
      keep.set('amt-passes', passes); buyMore = false; renderControls()
      $('buy').scrollIntoView()
    } catch (e) { err.textContent = e.message + ' ถ้าโอนแล้วแต่ไม่ผ่าน ทักมาที่ LINE ของอมตเทวาพร้อมสลิป'; err.hidden = false }
    b.disabled = false; b.textContent = 'ส่งสลิปและรับภาพ'
  }
  $('saveFull').onclick = async () => {
    const b = $('saveFull'), err = $('fullErr'); err.hidden = true; b.disabled = true; b.textContent = 'กำลังสร้างไฟล์เต็ม'
    try {
      const pass = passNow()
      const r = await fetch(`${SHOP.api}/asset/${S.image}`, { headers: { Authorization: `Bearer ${pass.token}`, 'X-Owner': owner } })
      if (!r.ok) throw new Error((await r.json()).message || 'โหลดไฟล์ไม่ได้')
      const left = r.headers.get('X-Downloads-Left')
      const url = URL.createObjectURL(await r.blob()), c = document.createElement('canvas'); c.width = meta.full[0]; c.height = meta.full[1]
      await window.Compose.render(c, S, meta, url)
      await saveBlob(await blobOf(c), `amatathewa-${S.image}.jpg`); URL.revokeObjectURL(url)
      savedFiles()[S.image] = 1; keep.set('amt-saved', allSaved)
      if (pass.scope === 'set') { pass.images = pass.images || []; if (!pass.images.includes(S.image)) pass.images.push(S.image) }
      const usedNow = +r.headers.get('X-Images-Used'); if (usedNow) pass.used = usedNow
      keep.set('amt-passes', passes)
      $('fullLeft').textContent = left !== null ? `ภาพนี้โหลดได้อีก ${left} ครั้ง` : ''
      renderControls()
    } catch (e) { err.textContent = e.message + (/ครบ/.test(e.message) ? ' ถ้าไฟล์มีปัญหา ทักมาที่ LINE ของอมตเทวา' : ' ลองกดอีกครั้ง'); err.hidden = false }
    b.disabled = false; b.textContent = 'บันทึกภาพเต็ม'
  }
  $('buyMoreBtn').onclick = () => { buyMore = true; renderControls(); $('plans').scrollIntoView({ block: 'center' }) }
  $('buyBack').onclick = () => { buyMore = false; renderControls() }
  renderControls()
  window.__shop = { S, meta, draw, get options() { return gridOptions }, set: o => { Object.assign(S, o); renderControls(); return draw() }, get chart() { return chart }, get owner() { return owner } }
})()
