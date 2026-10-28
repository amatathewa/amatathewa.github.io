# ขึ้นเว็บ: คัดลอกหน้าเว็บจาก fortune-web → ใส่เลขรุ่นกันมือถือจำของเก่า → commit + push
# ใช้: python ขึ้นเว็บ.py "ข้อความบอกว่าแก้อะไร"
import io, os, re, shutil, subprocess, sys, time
sys.stdout.reconfigure(encoding='utf-8')
SITE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(SITE, '..', 'fortune-web', 'tarot')
V = time.strftime('%Y%m%d%H%M')
for name in os.listdir(os.path.join(SRC, 'web')):
    if not name.endswith(('.html', '.js')) or name.startswith('__') or '.bak' in name:
        continue
    s = io.open(os.path.join(SRC, 'web', name), encoding='utf-8').read()
    if name == 'index.html':
        s = s.replace("const V='';", "const V='%s';" % V)
    s = re.sub(r'src="(flow\.js|\.\./js/cards-data\.js)"', lambda m: 'src="%s?v=%s"' % (m.group(1), V), s)
    io.open(os.path.join(SITE, 'tarot', 'web', name), 'w', encoding='utf-8', newline='').write(s)
shutil.copy(os.path.join(SRC, 'js', 'cards-data.js'), os.path.join(SITE, 'tarot', 'js', 'cards-data.js'))
msg = (sys.argv[1] if len(sys.argv) > 1 else 'อัปเดตเว็บ') + ' (รุ่น ' + V + ')\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>'
g = ['git', '-C', SITE, '-c', 'user.name=AMATATHEWA', '-c', 'user.email=amatathewa.official@gmail.com']
subprocess.run(g + ['add', '-A'], check=True)
subprocess.run(g + ['commit', '-q', '-m', msg])
subprocess.run(['git', '-C', SITE, 'push', '-q'], check=True)
print('ขึ้นเว็บแล้ว รุ่น', V)
