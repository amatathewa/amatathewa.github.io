// ภาษาไทย / English หน้าวอลเปเปอร์ (ลูกค้าต่างชาติขอ 19 พ.ย. 2569) · ใช้ค่าเดียวกับหน้าแรก localStorage 'amt-lang'
// ข้อความคงที่ในหน้า: ใส่ data-en ที่ตัวแท็ก · ข้อความที่ shop.js / oracle.js สร้าง: ใช้ T(ไทย, อังกฤษ) และ EN_TXT ด้านล่าง
// รอบแรกยังไม่แปลคำอธิบาย 55 คู่เลข (ณัทกรเลือก 19 พ.ย.) · เปลี่ยนภาษาแล้วโหลดหน้าใหม่ เพราะข้อความส่วนใหญ่สร้างตอนคำนวณ
;(function () {
  let lang = 'th'
  try {
    const q = new URLSearchParams(location.search).get('lang')
    if (q === 'en' || q === 'th') { lang = q; localStorage.setItem('amt-lang', q) }
    else if (localStorage.getItem('amt-lang') === 'en') lang = 'en'
  } catch (e) {}
  const EN = lang === 'en'
  window.AMT_EN = EN
  window.T = (th, en) => (EN ? en : th)

  const STAR = { 1: 'Sun', 2: 'Moon', 3: 'Mars', 4: 'Mercury', 5: 'Jupiter', 6: 'Venus', 7: 'Saturn', 8: 'Rahu', 9: 'Ketu', 0: 'Uranus' }
  const STAR_TH = { 'อาทิตย์': 1, 'จันทร์': 2, 'อังคาร': 3, 'พุธ': 4, 'พฤหัส': 5, 'ศุกร์': 6, 'เสาร์': 7, 'ราหู': 8, 'เกตุ': 9, 'มฤตยู': 0 }
  const SIGN = { 'เมษ': 'Aries', 'พฤษภ': 'Taurus', 'เมถุน': 'Gemini', 'กรกฎ': 'Cancer', 'สิงห์': 'Leo', 'กันย์': 'Virgo', 'ตุลย์': 'Libra', 'พิจิก': 'Scorpio', 'ธนู': 'Sagittarius', 'มังกร': 'Capricorn', 'กุมภ์': 'Aquarius', 'มีน': 'Pisces' }
  const DAY = { 'อาทิตย์': 'Sunday', 'จันทร์': 'Monday', 'อังคาร': 'Tuesday', 'พุธกลางวัน': 'Wednesday (daytime)', 'พุธกลางคืน': 'Wednesday (night)', 'พฤหัสบดี': 'Thursday', 'ศุกร์': 'Friday', 'เสาร์': 'Saturday' }
  const ROLE = { 'ศรี': 'Sri (fortune)', 'มนตรี': 'Montri (patron)', 'เดช': 'Det (power)', 'กาลกิณี': 'Kalakini (misfortune)' }
  const DIGNITY = { 'มหาอุจ': 'Maha-uch', 'เกษตรบดี': 'Kaset', 'มหาจักร': 'Maha-chak', 'ราชาโชค': 'Racha-chok', 'อุจจาวิลาส': 'Utcha-wilat', 'ประกิณโชค': 'Prakin-chok' }
  const LABEL = { wealth: 'Wealth and luck', charm: 'Charm and love', flow: 'A smooth life', fame: 'Reputation and work', extra: 'Supporting pair' }
  const LABEL_TH = { 'ทรัพย์และโชค': 'wealth', 'เสน่ห์ ความรัก': 'charm', 'ชีวิตราบรื่น': 'flow', 'ชื่อเสียง การงาน': 'fame', 'คู่เสริม': 'extra' }
  const S = '(อาทิตย์|จันทร์|อังคาร|พุธ|พฤหัส|ศุกร์|เสาร์|ราหู|เกตุ|มฤตยู)'
  const st = th => STAR[STAR_TH[th]] || th
  const base = b => {
    let m
    if ((m = b.match(new RegExp('^ดาว' + S + 'เป็นดาว(ศรี|เดช|มนตรี)ของคุณ$')))) return `${st(m[1])} is your ${ROLE[m[2]]} planet`
    if ((m = b.match(new RegExp('^ดาว' + S + 'เป็นเจ้าเรือนลัคนาของคุณ$')))) return `${st(m[1])} rules your ascendant`
    return null
  }
  // ที่มาของเลขแต่ละคู่ (calc.js สร้างเป็นภาษาไทย) แปลตามแม่แบบ ถ้าไม่ตรงแม่แบบไหนคืนภาษาไทยเดิม
  const why = s => {
    let m
    if ((m = s.match(new RegExp('^(.+?) คู่ดาว' + S + 'ที่(ได้[^ ]*(?: [^ ]+)*?)? ?(ดาวที่แข็งที่สุดในดวง|ดาวแข็งอันดับรองในดวง)$')))) {
      const b = base(m[1]); if (!b) return s
      const pos = m[3] ? ` (${m[3].replace(/^ได้/, '').split(' ').map(x => DIGNITY[x] || x).join(', ')})` : ''
      return `${b}, paired with ${st(m[2])}${pos} — ${m[4] === 'ดาวที่แข็งที่สุดในดวง' ? 'the strongest planet in your chart' : 'one of the next-strongest planets in your chart'}`
    }
    if ((m = s.match(new RegExp('^ดาว' + S + 'กุมดาว' + S + 'จริงในดวง ที่ราศี(.+)$')))) return `${st(m[1])} sits together with ${st(m[2])} in your birth chart, in ${SIGN[m[3]] || m[3]}`
    if ((m = s.match(new RegExp('^ดาว' + S + 'เป็นดาว(ศรี|เดช|มนตรี) คู่ดาว' + S + 'ซึ่งเป็นดาว(ศรี|เดช|มนตรี)ของคุณ$')))) return `${st(m[1])} is your ${ROLE[m[2]]} planet, paired with ${st(m[3])}, your ${ROLE[m[4]]} planet`
    if ((m = s.match(/^คู่มาตรฐานเรื่อง(.+)ในคลังคู่เลขมงคล ไม่ขัดกับเลขกาลกิณีของคุณ$/))) return `A standard “${(LABEL[LABEL_TH[m[1]]] || m[1]).toLowerCase()}” pair from the lucky-pair collection, with no clash against your misfortune number`
    if (s === 'คู่มาตรฐานในคลังคู่เลขมงคล ไม่ขัดกับเลขกาลกิณีของคุณ') return 'A standard pair from the lucky-pair collection, with no clash against your misfortune number'
    return s
  }

  window.EN_TXT = {
    STAR, SIGN, DAY, LABEL, why, star: n => STAR[n] || '',
    day: th => DAY[th] || th,
    MONTH: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    WORD: { 'มั่งคั่ง': 'Wealth', 'เมตตา': 'Kindness', 'รุ่งเรือง': 'Prosperity', 'สำเร็จ': 'Success', 'มั่นคง': 'Stability', 'ร่มเย็น': 'Peaceful home', 'ราบรื่น': 'Smooth path', 'โชคดี': 'Good luck', 'สงบสุข': 'Serenity' },
    MOTIVE: {
      wealth: 'Keep it where you see it every time you pick up your phone — a reminder of your money goals.',
      charm: 'A reminder about love and how you carry yourself with the people around you.',
      flow: 'A reminder to live calmly, with elders and mentors supporting you.',
      fame: 'A reminder of the work and reputation you want to reach.',
      extra: 'A backup pair from the same chart. You can use it instead of a main pair.',
    },
    FRAME_NOTE: {
      mountain: 'Like a mountain standing firm — stability and success in your career.',
      plain: 'Calm and steady, like someone who has reached their goal — success in life and work.',
      lotus: 'Like lotus petals slowly opening — growing wealth.',
      heart: 'Like a lotus at the heart — beauty and charm in love.',
      none: 'The deity alone, with no number grid.',
    },
    FRAME: { mountain: 'Mountain', plain: 'Plain', lotus: 'Lotus petals', heart: 'Lotus heart' },
    ROWS: [
      ['Top row', 'Work and reputation', 'The top row is like the first impression people have of us, so it holds the numbers for work and reputation.'],
      ['Middle row', 'Yourself and love', 'The middle row is like our heart, so it holds the numbers for ourselves and our relationships.'],
      ['Bottom row', 'Money and stability', 'The bottom row is like the foundation of a house that must be solid, so it holds the numbers for money and building a life.'],
    ],
    ROW_STAR: {
      fame: { 1: 'Respected for your skill, with a chance to lead', 2: 'Colleagues are fond of you and help one another', 3: 'Hard-working and bold, undaunted by tough jobs', 4: 'A skilled negotiator whose words get things done', 5: 'Trusted by seniors who guide you at work', 6: 'Your work pleases clients, who want to come back', 7: 'Patient and genuine, building a name from skill gathered over time', 8: 'Quick-witted, finding a way forward when problems arise', 9: 'You notice details and see angles others miss' },
      charm: { 1: 'Self-assured, someone your partner can rely on', 2: 'Gentle, caring about the little things for your loved one', 3: 'You love wholeheartedly and dare to show your feelings', 4: 'Easy to talk to — anything can be said between you', 5: 'Reasonable in love, accepted by elders', 6: 'Charming and comfortable to be around', 7: 'Serious about relationships, not one to walk away easily', 8: 'Intriguing — the more people know you, the closer they want to be', 9: 'A deep bond that feels close even when apart' },
      wealth: { 1: 'Earning through position, duty and reputation', 2: 'Someone is there to help with money when you need it', 3: 'A diligent earner, using strength and skill to make income', 4: 'Good at trade — you know how to talk and negotiate', 5: 'You think before spending and know how to plan and save', 6: 'Earning from what you love, spending to live well', 7: 'Saving little by little, slowly building wealth', 8: 'Finding new channels, earning in ways others don’t', 9: 'Often receiving unexpected help with money' },
    },
    DEITY: {
      'ganesha-mouse': 'Ganesha with his mouse', 'ganesha-face': 'Ganesha, close-up', 'shiva-ganesha': 'Shiva holding baby Ganesha', 'shiva-moon': 'Shiva on the mountain peak', 'shiva-face': 'Shiva, close-up',
      'lakshmi-flame': 'Lakshmi with a lamp', 'lakshmi-face': 'Lakshmi, close-up', 'parvati-ganesha': 'Parvati holding Ganesha', 'parvati-himalaya': 'Parvati in the Himalayas', 'parvati-face': 'Parvati, close-up',
      'saraswati-swan': 'Saraswati with her swan', 'saraswati-face': 'Saraswati, close-up', 'vishnu-serene': 'Vishnu in stillness', 'vishnu-garuda': 'Vishnu riding Garuda', 'vishnu-conch': 'Vishnu holding the conch',
      'vishnu-serpent': 'Vishnu on the serpent Ananta', 'vishnu-blessing': 'Vishnu giving blessings', 'brahma-lotus': 'Brahma holding a lotus', 'brahma-face': 'Brahma, close-up', 'trimurti-face': 'Trimurti, close-up',
      'trishakti-peak': 'Tridevi on the mountain peak', 'trishakti-lean': 'Tridevi, three goddesses together', 'skanda-peacock': 'Skanda riding a peacock', 'skanda-face': 'Skanda, close-up', 'skanda-six': 'Skanda with six faces',
    },
    PROV: {
      'กระบี่': 'Krabi', 'กรุงเทพมหานคร': 'Bangkok', 'กาญจนบุรี': 'Kanchanaburi', 'กาฬสินธุ์': 'Kalasin', 'กำแพงเพชร': 'Kamphaeng Phet', 'ขอนแก่น': 'Khon Kaen', 'จันทบุรี': 'Chanthaburi', 'ฉะเชิงเทรา': 'Chachoengsao',
      'ชลบุรี': 'Chonburi', 'ชัยนาท': 'Chai Nat', 'ชัยภูมิ': 'Chaiyaphum', 'ชุมพร': 'Chumphon', 'เชียงราย': 'Chiang Rai', 'เชียงใหม่': 'Chiang Mai', 'ตรัง': 'Trang', 'ตราด': 'Trat', 'ตาก': 'Tak',
      'นครนายก': 'Nakhon Nayok', 'นครปฐม': 'Nakhon Pathom', 'นครพนม': 'Nakhon Phanom', 'นครราชสีมา': 'Nakhon Ratchasima', 'นครศรีธรรมราช': 'Nakhon Si Thammarat', 'นครสวรรค์': 'Nakhon Sawan', 'นนทบุรี': 'Nonthaburi',
      'นราธิวาส': 'Narathiwat', 'น่าน': 'Nan', 'บึงกาฬ': 'Bueng Kan', 'บุรีรัมย์': 'Buriram', 'ปทุมธานี': 'Pathum Thani', 'ประจวบคีรีขันธ์': 'Prachuap Khiri Khan', 'ปราจีนบุรี': 'Prachinburi', 'ปัตตานี': 'Pattani',
      'พระนครศรีอยุธยา': 'Phra Nakhon Si Ayutthaya', 'พะเยา': 'Phayao', 'พังงา': 'Phang Nga', 'พัทลุง': 'Phatthalung', 'พิจิตร': 'Phichit', 'พิษณุโลก': 'Phitsanulok', 'เพชรบุรี': 'Phetchaburi', 'เพชรบูรณ์': 'Phetchabun',
      'แพร่': 'Phrae', 'ภูเก็ต': 'Phuket', 'มหาสารคาม': 'Maha Sarakham', 'มุกดาหาร': 'Mukdahan', 'แม่ฮ่องสอน': 'Mae Hong Son', 'ยโสธร': 'Yasothon', 'ยะลา': 'Yala', 'ร้อยเอ็ด': 'Roi Et', 'ระนอง': 'Ranong',
      'ระยอง': 'Rayong', 'ราชบุรี': 'Ratchaburi', 'ลพบุรี': 'Lopburi', 'ลำปาง': 'Lampang', 'ลำพูน': 'Lamphun', 'เลย': 'Loei', 'ศรีสะเกษ': 'Sisaket', 'สกลนคร': 'Sakon Nakhon', 'สงขลา': 'Songkhla', 'สตูล': 'Satun',
      'สมุทรปราการ': 'Samut Prakan', 'สมุทรสงคราม': 'Samut Songkhram', 'สมุทรสาคร': 'Samut Sakhon', 'สระแก้ว': 'Sa Kaeo', 'สระบุรี': 'Saraburi', 'สิงห์บุรี': 'Sing Buri', 'สุโขทัย': 'Sukhothai', 'สุพรรณบุรี': 'Suphan Buri',
      'สุราษฎร์ธานี': 'Surat Thani', 'สุรินทร์': 'Surin', 'หนองคาย': 'Nong Khai', 'หนองบัวลำภู': 'Nong Bua Lamphu', 'อ่างทอง': 'Ang Thong', 'อำนาจเจริญ': 'Amnat Charoen', 'อุดรธานี': 'Udon Thani',
      'อุตรดิตถ์': 'Uttaradit', 'อุทัยธานี': 'Uthai Thani', 'อุบลราชธานี': 'Ubon Ratchathani',
    },
    PAIR_NOTE: 'The detailed meaning of each pair is in Thai for now. Below you can see where each number comes from and what it is for.',
  }

  // ---------- ข้อความคงที่ในหน้า ----------
  const d = document
  if (EN) {
    d.documentElement.lang = 'en'
    d.title = 'Auspicious Wallpapers from Your Birth Date · Hindu Deities in Chinese Ink | AMATATHEWA'
    const md = d.querySelector('meta[name=description]')
    if (md) md.content = 'Free reading from your birth date, with a Hindu deity wallpaper in Chinese ink and lucky numbers based on Thai astrology. 25 designs, free preview.'
    d.querySelectorAll('[data-en]').forEach(n => { n.innerHTML = n.getAttribute('data-en') })
    d.querySelectorAll('[data-en-ph]').forEach(n => { n.placeholder = n.getAttribute('data-en-ph') })
    d.querySelectorAll('[data-en-aria]').forEach(n => { n.setAttribute('aria-label', n.getAttribute('data-en-aria')) })
    d.querySelectorAll('[data-en-hide]').forEach(n => { n.hidden = true })
    d.querySelectorAll('[data-en-show]').forEach(n => { n.hidden = false })
  }
  const b = d.getElementById('langBtn')
  if (b) {
    b.textContent = EN ? 'ไทย' : 'EN'
    b.setAttribute('aria-label', EN ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English')
    b.onclick = () => {
      try { localStorage.setItem('amt-lang', EN ? 'th' : 'en') } catch (e) {}
      const u = new URL(location.href); u.searchParams.delete('lang'); u.hash = ''
      location.replace(u.href)
    }
  }
})()
