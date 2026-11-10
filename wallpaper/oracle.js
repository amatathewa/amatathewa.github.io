// องค์เทพอยากบอกอะไรกับคุณ: คำนายดาวจรสั้นๆ + เลือกภาพองค์เทพที่หนุนที่สุดช่วงนี้ (ณัทกร 10 พ.ย. 2569)
// น้ำเสียง: องค์เทพพูดกับลูก (แบบ ก) + แต่ละองค์มีบุคลิกของตัวเอง (แนวคิดแบบ ค) · ณัทกรเลือก 10 พ.ย.
// โครง: คำเปิดตามบุคลิกองค์ → ใจความตามดาวจร (7 แบบ ใช้ร่วมกันทุกองค์) → คำปิดตามบุคลิกองค์ → ถึงเมื่อไร
// จุดอ้างอิง: รู้เวลาเกิด = ราศีลัคนา · ไม่รู้ = ราศีของดาวประจำวันเกิดในดวงเดิม · ดาวจรที่ดู: พฤหัส เสาร์ ราหู
// เทพประจำวันเกิดตามความเชื่อไทย (ไฟล์ เทพฮินดูกับดาว 3 ระบบ · ระบบ ก) · เสาร์ = พระพิฆเนศ · ราหู = พระแม่ทุรคา ภาคหนึ่งของพระแม่ปารวตี
;(function () {
  const KEY = { 1: 'sun', 2: 'moon', 3: 'mars', 4: 'mercury', 5: 'jupiter', 6: 'venus', 7: 'saturn', 8: 'rahu' }
  const STAR = { 1: 'อาทิตย์', 2: 'จันทร์', 3: 'อังคาร', 4: 'พุธ', 5: 'พฤหัส', 6: 'ศุกร์', 7: 'เสาร์', 8: 'ราหู' }
  const SIGNS = ['เมษ', 'พฤษภ', 'เมถุน', 'กรกฎ', 'สิงห์', 'กันย์', 'ตุลย์', 'พิจิก', 'ธนู', 'มังกร', 'กุมภ์', 'มีน']
  const MONTH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']

  // บุคลิกแต่ละองค์: u = คำที่องค์ท่านเรียกเรา · open/close = คำเปิดคำปิด · why = ทำไมเป็นองค์นี้ (เสียงร้าน ไม่ใช่เสียงองค์เทพ)
  const GOD = {
    shiva: { name: 'พระศิวะ', image: 'shiva-moon', u: 'ลูก', open: 'ลูกเอ๋ย', close: 'ใจที่นิ่ง คือพลังที่แท้จริงของลูก' },
    parvati: { name: 'พระแม่ปารวตี', image: 'parvati-himalaya', u: 'ลูก', open: 'ลูกรักของแม่', close: 'แม่อยู่ตรงนี้เสมอ เหนื่อยเมื่อไรก็กลับมาพักที่ใจแม่นะ' },
    durga: { name: 'พระแม่ปารวตี', image: 'parvati-face', u: 'ลูก', open: 'ลูกรักของแม่', close: 'แม่ยืนคุ้มครองลูกอยู่ตรงนี้ ใจลูกจะไม่หลงทาง' },
    durgaCare: { name: 'พระแม่ปารวตี', image: 'parvati-face', u: 'ลูก', open: 'ลูกรักของแม่ อย่าหวั่นใจไปเลย', close: 'แม่ยืนคุ้มครองลูกอยู่ตรงนี้ ใจลูกจะไม่หลงทาง' },
    skanda: { name: 'พระขันธกุมาร', image: 'skanda-peacock', u: 'เจ้า', open: 'เจ้าเก่งกว่าที่ตัวเองคิดนัก', close: 'หอกของเรายังอยู่ข้างเจ้าเสมอ ก้าวไปข้างหน้าได้เลย' },
    vishnu: { name: 'พระวิษณุ', image: 'vishnu-blessing', u: 'ลูก', open: 'ลูกเอ๋ย เรามองเห็นทางข้างหน้าของลูกแล้ว', close: 'เราดูแลทุกก้าวของลูกอยู่ เดินไปอย่างสบายใจเถิด' },
    saraswati: { name: 'พระแม่สรัสวตี', image: 'saraswati-swan', u: 'ลูก', open: 'ลูกรัก ฟังแม่นะ', close: 'ปัญญาที่ลูกมี คือแสงสว่างที่ไม่มีใครเอาไปจากลูกได้' },
    lakshmi: { name: 'พระแม่ลักษมี', image: 'lakshmi-flame', u: 'ลูก', open: 'ลูกรัก แม่มีเรื่องดีมาบอก', close: 'แม่จุดประทีปรอไว้ให้ ขอให้บ้านของลูกอบอุ่นและอิ่มเอมทุกวัน' },
    ganesha: { name: 'พระพิฆเนศ', image: 'ganesha-mouse', u: 'ลูก', open: 'เรามาพร้อมข่าวดีนะลูก', close: 'หินก้อนไหนขวางทาง ยกให้เราจัดการเอง' },
    ganeshaCare: { name: 'พระพิฆเนศ', image: 'ganesha-mouse', u: 'ลูก', open: 'ลูกเอ๋ย อย่าเพิ่งท้อนะ', close: 'หินก้อนไหนขวางทาง ยกให้เราจัดการเอง' },
  }
  // ดาวประจำวันเกิด → องค์เทพ + เหตุผล
  const OWN = {
    1: ['shiva', 'เทพประจำวันอาทิตย์'], 2: ['parvati', 'เทพประจำวันจันทร์'], 3: ['skanda', 'เทพประจำวันอังคาร'],
    4: ['vishnu', 'เทพประจำวันพุธ'], 5: ['saraswati', 'เทพประจำวันพฤหัสบดี'], 6: ['lakshmi', 'เทพประจำวันศุกร์'],
    7: ['ganesha', 'เทพประจำวันเสาร์'], 8: ['durga', 'ผู้ดูแลดาวราหู ดาวประจำคนเกิดวันพุธกลางคืน ในภาคพระแม่ทุรคา'],
  }
  // ยังไม่มีภาพพระขันธกุมารในร้าน: คนเกิดวันอังคารได้พระศิวะอุ้มพระพิฆเนศ พระบิดาและพระเชษฐาของพระขันธกุมาร
  const SKANDA_STANDIN = { ...GOD.shiva, image: 'shiva-ganesha', name: 'พระศิวะและพระพิฆเนศ' }
  const GUARD = {
    7: ['ganeshaCare', 'พระพิฆเนศคือผู้ขจัดอุปสรรค และเป็นเทพประจำดาวเสาร์ตามความเชื่อไทย ช่วงที่ต้องใช้ความอดทน องค์ท่านจึงหนุนคุณได้ตรงที่สุด'],
    8: ['durgaCare', 'พระแม่ปารวตีในภาคพระแม่ทุรคาเป็นผู้ดูแลดาวราหู ช่วงที่มีเรื่องให้ตัดสินใจ องค์ท่านช่วยให้ใจนิ่งและเลือกได้ถูก'],
  }
  // ใจความตามดาวจร {u} = คำที่องค์ท่านเรียกเรา
  const CORE = {
    rise: 'ช่วงนี้ผู้ใหญ่จะเมตตา{u} ความรู้และโอกาสใหม่ๆ จะเข้ามาหาเอง เรื่องสำคัญที่อยากเริ่ม เริ่มเสียตอนนี้เลย จังหวะกำลังดี',
    money: 'ช่วงนี้เงินจะเข้ามือ{u}ง่ายกว่าที่เคย งานที่ลงแรงไว้เริ่มออกดอกออกผล ทางรายได้ใหม่ก็กำลังเปิด หมั่นสังเกตไว้ให้ดี',
    people: 'ช่วงนี้จะมีคนดีเดินเข้ามาในชีวิต{u} ทั้งคนที่จะช่วยงาน และคนที่จะอยู่ข้างกาย เปิดใจรับเขาไว้นะ',
    hard7: 'ช่วงนี้งานจะหนักขึ้น บางวันอาจเหนื่อยกว่าที่ควร แต่ทุกอย่างที่{u}สร้างตอนนี้จะมั่นคงไปอีกนาน ค่อยๆ วางทีละก้อน',
    hard8: 'ช่วงนี้จะมีเรื่องใหม่ๆ เข้ามาให้ตัดสินใจเร็ว มีทั้งโอกาสที่ไม่เคยเจอ และสิ่งที่ชวนให้ใจวอกแวก ใจนิ่งเมื่อไร {u}จะเลือกถูกเอง',
    win: 'ช่วงนี้ความพยายามที่{u}สะสมมาเริ่มเห็นผล อุปสรรคที่เคยขวางค่อยๆ เบาลง เดินต่ออีกนิด ทางข้างหน้าโล่งกว่าที่คิด',
    calm: 'ช่วงนี้ฟ้ายังสงบ ไม่มีดาวใหญ่ดวงไหนมากวนใจ{u} ชีวิตจะไปได้ไกลแค่ไหน ขึ้นอยู่กับแรงที่{u}ลงมือทำ เป็นเวลาดีที่จะวางรากฐานเรื่องที่ตั้งใจให้แน่น',
  }
  const CARE = { 7: 'งานที่หนักขึ้นช่วงนี้ ค่อยๆ ทำไป อย่าเร่งตัวเองเกินแรง', 8: 'เรื่องใหญ่เรื่องไหนที่ต้องตัดสินใจ ค่อยๆ คิดให้รอบก่อน' }

  const chartOn = (L, d, hh = 12, mm = 0) => L.calculateThaiHoroscope({ date: { year: d.getUTCFullYear(), era: 'CE', month: d.getUTCMonth() + 1, day: d.getUTCDate() }, time: { hour: hh, minute: mm }, referenceMode: 'traditional' }).points
  // วันที่ดาวออกจากราศีปัจจุบัน (ก้าวทีละ 7 วัน พอสำหรับบอกเป็นเดือน)
  const leaves = (L, n, from, sign) => {
    let d = from
    for (let i = 0; i < 200; i++) { d = new Date(d.getTime() + 7 * 86400000); if (chartOn(L, d)[KEY[n]].sign !== sign) return d }
    return null
  }
  // บอกเดือน · ข้ามปีพูดว่า "ปีหน้า" ถ้าเป็นปีถัดไป
  const when = d => {
    if (!d) return ''
    const y = d.getUTCFullYear(), now = new Date().getFullYear()
    return `เดือน${MONTH[d.getUTCMonth()]}${y === now ? 'นี้' : y === now + 1 ? 'ปีหน้า' : ` ปี ${y + 543}`}`.replace('เดือนเดือน', 'เดือน')
  }

  function read(inp, chart, hasImage = () => true) {
    const L = window.ThaiAstro, hasTime = inp.hh !== null && inp.hh !== undefined
    const wd = new Date(Date.UTC(inp.y, inp.m - 1, inp.d)).getUTCDay()
    const day = wd === 3 && inp.night && !hasTime ? 8 : [1, 2, 3, 4, 5, 6, 7][wd]
    const natal = chartOn(L, new Date(Date.UTC(inp.y, inp.m - 1, inp.d)), hasTime ? inp.hh : 12, hasTime ? inp.mm : 0)
    const lag = SIGNS.indexOf(chart.lagna)
    const ref = hasTime ? (lag >= 0 ? lag : natal.ascendant.sign) : natal[KEY[day]].sign
    const refName = hasTime ? 'ลัคนา' : `ดาว${STAR[day]}ประจำวันเกิด`
    const t = new Date(), today = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())), now = chartOn(L, today)
    const house = n => ((now[KEY[n]].sign - ref + 12) % 12) + 1
    const hj = house(5), hs = house(7), hr = house(8)
    const verb = h => h === 1 ? 'กุม' : h === 7 ? 'เล็ง' : 'หนุน'
    const hit = [7, 8].filter(n => [1, 7].includes(house(n)))
    let core, planet, guard = null, care = ''
    if ([1, 5, 9, 2, 11, 7].includes(hj)) {
      planet = 5; core = [2, 11].includes(hj) ? 'money' : hj === 7 ? 'people' : 'rise'
      if (hit.length) care = CARE[hit[0]]
    } else if (hit.length) { planet = hit[0]; core = 'hard' + planet; guard = GUARD[planet] }
    else if ([3, 6, 11].includes(hs) || [3, 6, 11].includes(hr)) { planet = [3, 6, 11].includes(hs) ? 7 : 8; core = 'win' }
    else { planet = null; core = 'calm' }

    const [ownKey, ownWhy] = OWN[day]
    let g = GOD[guard ? guard[0] : ownKey]
    if (!guard && ownKey === 'skanda' && !hasImage(g.image)) g = SKANDA_STANDIN
    const fill = s => s.replaceAll('{u}', g.u)
    const lines = [`${g.open} ${fill(CORE[core])}`]
    if (care) lines.push(care)
    const until = planet ? when(leaves(L, planet, today, now[KEY[planet]].sign)) : ''
    lines.push(g.close + (!until ? '' : core.startsWith('hard') ? ` ราว${until} ทุกอย่างจะค่อยๆ คลี่คลาย` : ` พรนี้จะอยู่กับ${g.u}ไปจนถึง${until}`))
    const from = planet ? `ดูจาก: ดาว${STAR[planet]}${core === 'win' ? 'อยู่ตำแหน่งที่ดีต่อ' : verb(house(planet))}${refName}ของคุณ` : `ดูจาก: ดาวพฤหัส เสาร์ ราหู ช่วงนี้ไม่ได้กระทบ${refName}ของคุณ`
    const why = guard ? guard[1] : g === SKANDA_STANDIN
      ? 'พระขันธกุมารคือเทพประจำวันอังคาร ภาพพระศิวะอุ้มพระพิฆเนศคือพระบิดาและพระเชษฐาขององค์ท่าน'
      : `${g.name}คือ${ownWhy} องค์ท่านจึงเป็นองค์ที่หนุนคุณที่สุดในช่วงนี้`
    return { image: g.image, deity: g.name, lines, from, why, hasTime }
  }
  window.Oracle = { read, _text: { GOD, CORE, CARE } }   // _text ใช้ทำใบตรวจสำนวน
})()
