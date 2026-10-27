// ค่ากลางของทุกหน้าในขั้นตอนเปิดไพ่ · สำรับ + ค่าที่ส่งข้ามหน้า (deck sp rev major) อยู่ในที่อยู่หน้าเว็บ
const GH='https://raw.githubusercontent.com/amatathewa/tarot-collections/main/';
const DECKS={
  '1909':{name:'อมตเทวา ทาโรต์ 1909',sub:'ภาพวาดคลาสสิกปี 1909',back:GH+'rider-waite-1909/back.webp',face:id=>`${GH}rider-waite-1909/${id}.webp`,marble:'../ภาพพื้นหลัง/marble-1909-blur.jpg'},
  'sns': {name:'Strength & Sorcery',sub:'ต้นฉบับอมตเทวา รุ่นแรก',back:GH+'sns-deck/79.webp',face:id=>`${GH}sns-deck/${id}.webp`,marble:'../ภาพพื้นหลัง/marble-sns-blur.jpg'}};
// ชื่อตำแหน่งไพ่แต่ละ Spread (10 = เซลติกครอส)
const SPREADS={'1':['ไพ่ของคุณ'],'2':['ทางเลือกที่ 1','ทางเลือกที่ 2'],'3':['อดีต','ปัจจุบัน','อนาคต'],'4':['สถานการณ์','สิ่งที่ควรทำ','อุปสรรค','ผลลัพธ์'],'5':['แก่นกลาง','อุปสรรค','คำแนะนำ','รากฐาน','ผลลัพธ์'],
  '10':['ตัวตน','สถานการณ์ปัจจุบัน','สิ่งที่มุ่งหวัง','คนรัก/คนใกล้ตัว','อดีตล่าสุด','สิ่งที่กำลังจะเกิดขึ้น','ปัญหาและแนวทางแก้ไข','สภาพแวดล้อม','จิตใต้สำนึก','ผลลัพธ์']};

const Q=new URLSearchParams(location.search);
const ST={deck:DECKS[Q.get('deck')]?Q.get('deck'):'1909',sp:SPREADS[Q.get('sp')]?Q.get('sp'):'3',rev:Q.get('rev')==='1'?'1':'0',major:Q.get('major')==='1'?'1':'0'};
const D=DECKS[ST.deck];
document.documentElement.style.setProperty('--back',`url("${D.back}")`);
// ไปหน้าถัดไป พร้อมค่าทั้งหมด (+ ค่าเพิ่มเฉพาะหน้า)
// อยู่ในกรอบ index.html: ให้กรอบเตรียมฉากถัดไปไว้ข้างหลังจนพร้อม แล้วค่อยสลับ (ไม่มีจังหวะล้างจอ = ไม่กระพริบ)
const IN_SHELL=window.parent!==window;
// hand = [ชิ้นที่จะเลื่อน, ชิ้นที่ใช้วัดขนาด/จุดกลาง]: ฉากถัดไปบอกตำแหน่งที่ต้องไป → เลื่อนสำรับไปรอที่นั่นก่อน แล้วค่อยสลับฉาก
let handoff=null;
function go(page,extra,hand){const u=page+'?'+new URLSearchParams({...ST,...extra});
  if(IN_SHELL){handoff=hand||null;parent.postMessage({go:u,hand:!!hand},location.origin)}else location.href=u}
function moveTo([el,anchor],t){
  const a=anchor.getBoundingClientRect(),e=el.getBoundingClientRect(),cx=a.left+a.width/2,cy=a.top+a.height/2;
  el.style.transformOrigin=`${cx-e.left}px ${cy-e.top}px`;
  // ขยับเองทีละเฟรมด้วยตัวจับเวลา (แอนิเมชันของเบราว์เซอร์ที่สั่งจากข้อความข้ามฉาก ค้างที่ "รอเริ่ม" บนมือถือ)
  const dx=t.x-cx,dy=t.y-cy,sc=t.w/anchor.offsetWidth,D=650,t0=performance.now();
  const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
  return new Promise(r=>{(function step(){const k=Math.min(1,(performance.now()-t0)/D),q=ease(k);
    el.style.transform=`translate(${dx*q}px,${dy*q}px) rotate(${t.a*q}deg) scale(${1+(sc-1)*q})`;
    if(k<1)setTimeout(step,16);else setTimeout(r,30)})()});
}
// ไพ่หลายใบ: ทำตัวลอยทับไพ่จริง แล้วขยับเองทีละเฟรมไปยังช่องของหน้าผล (ใบละจังหวะ) · แสงทองรอบไพ่ค่อยๆ หาย
function moveCards(cards,rects){
  const D=750,GAP=cards.length>5?45:80,ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
  const cl=cards.map((c,i)=>{const r=c.getBoundingClientRect(),g=getComputedStyle(c),w=c.offsetWidth,h=c.offsetHeight,cx=r.left+r.width/2,cy=r.top+r.height/2,a=+c.dataset.a||0,t=rects[i];
    const e=document.createElement('div');
    e.style.cssText=`position:fixed;z-index:50;left:${cx-w/2}px;top:${cy-h/2}px;width:${w}px;height:${h}px;border-radius:7%/4.2%;background:${g.backgroundImage} center/cover;box-shadow:${g.boxShadow};transform:rotate(${a}deg);transition:box-shadow .6s`;
    document.body.appendChild(e);c.style.visibility='hidden';
    return{e,a,dx:t.x-cx,dy:t.y-cy,sx:t.w/w,sy:t.h/h,d:i*GAP}});
  cl.forEach(o=>setTimeout(()=>{o.e.style.boxShadow='0 24px 60px rgba(0,0,0,.7)'},o.d));
  const t0=performance.now(),end=(cl.length-1)*GAP+D;
  return new Promise(r=>{(function step(){const now=performance.now()-t0;
    cl.forEach(o=>{const q=ease(Math.max(0,Math.min(1,(now-o.d)/D)));
      o.e.style.transform=`translate(${o.dx*q}px,${o.dy*q}px) rotate(${o.a*(1-q)}deg) scale(${1+(o.sx-1)*q},${1+(o.sy-1)*q})`});
    if(now<end)setTimeout(step,16);else setTimeout(r,30)})()});
}
if(IN_SHELL)addEventListener('message',e=>{const d=e.data;if(e.origin!==location.origin||!d||!d.moveTo||!handoff)return;
  (Array.isArray(d.moveTo)?moveCards(handoff.cards,d.moveTo):moveTo(handoff,d.moveTo)).then(()=>parent.postMessage({moved:1},location.origin))});
// บอกกรอบว่าฉากนี้พร้อมขึ้นจอ: ภาพ+ฟอนต์โหลดครบ (หน้าผลที่มาจากหน้าเลือกไพ่ ต้องรอไพ่วางที่เดิมครบด้วย)
if(IN_SHELL){
  const loaded=new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r));
  const flyReady=new Promise(r=>{const c=()=>{const h=document.documentElement;if((!h.classList.contains('fromPick')||h.classList.contains('ready')))r();else setTimeout(c,30)};c()});
  Promise.race([Promise.all([loaded,document.fonts.ready,flyReady]),new Promise(r=>setTimeout(r,3000))])
    .then(()=>setTimeout(()=>parent.postMessage({ready:1},location.origin),80));
}
