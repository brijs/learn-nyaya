"""Builds the single-file explainer. Usage: python3 build.py"""
import json, os, base64, re
R = os.path.dirname(os.path.abspath(__file__)); os.chdir(R)
def j(o): return json.dumps(o, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
sut = json.load(open('data/sutras.json', encoding='utf-8')); corpus = json.load(open('data/corpus.json', encoding='utf-8')); roots = json.load(open('data/roots.json', encoding='utf-8')); narr = json.load(open('narration.json', encoding='utf-8'))
def uri(p): return 'data:audio/mpeg;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
A, SA = {}, {}
if os.path.isdir('audio'):
    for f in sorted(os.listdir('audio')):
        m = re.match(r'(n|s)_(.+?)\.[0-9a-f]{8}\.mp3$', f)
        if not m: continue
        (A if m.group(1) == 'n' else SA).__setitem__(m.group(1) + '_' + m.group(2) if m.group(1) == 's' else m.group(2), uri('audio/' + f))
head = open('parts/head.html', encoding='utf-8').read().replace('/*__CSS__*/', open('parts/base.css', encoding='utf-8').read() + '\n' + open('parts/nyaya.css', encoding='utf-8').read())
body = open('parts/body.html', encoding='utf-8').read()
js = ''.join('<script>\n' + open('parts/' + f, encoding='utf-8').read() + '\n</script>\n' for f in ('engine.js', 'scenes1.js', 'scenes2.js', 'scenes3.js'))
html = head + body + '<script>\nconst SUT=' + j(sut) + ';\nconst ROOTS=' + j(roots) + ';\nconst CORPUS=' + j(corpus) + ';\nconst NARR=' + j(narr) + ';\nconst AUDIO=' + j(A) + ';\nconst SAUDIO=' + j(SA) + ';\n</script>\n' + js + '</body></html>'
os.makedirs('dist', exist_ok=True); os.makedirs('docs', exist_ok=True)
for p in ('dist/learn-nyaya.html', 'docs/index.html'): open(p, 'w', encoding='utf-8').write(html)
open('docs/.nojekyll', 'w').close()
print('built', len(html) // 1024, 'KB;', len(A), 'narration clips,', len(SA), 'sutra clips')
