"""Narration (en-IN-PrabhatNeural) + Sanskrit sūtra lines (hi-IN-MadhurNeural, Devanagari, -18% rate) via edge-tts.
Run: ~/.cache/edge-tts-venv/bin/python tts.py   (cached by hash; edit text and re-run to refresh only changed clips)"""
import json, os, re, hashlib, asyncio, unicodedata, edge_tts
R = os.path.dirname(os.path.abspath(__file__)); os.chdir(R)
NV, VV = 'en-IN-PrabhatNeural', 'hi-IN-MadhurNeural'
os.makedirs('audio', exist_ok=True)
def say(t):
    """Make IAST diacritics speakable for an English-Indian voice."""
    t = t.replace('ch', 'CHH').replace('c', 'ch').replace('CHH', 'chh')
    for a, b in [('jñ', 'gy'), ('ś', 'sh'), ('ṣ', 'sh'), ('ṅ', 'n'), ('ñ', 'n'), ('ṛ', 'ri'), ('ṃ', 'm'), ('ḥ', 'h'), ('ṭ', 't'), ('ḍ', 'd'), ('ṇ', 'n'), ('ā', 'a'), ('ī', 'i'), ('ū', 'u'), ('Ś', 'Sh'), ('Ā', 'A'), ('Ū', 'U')]:
        t = t.replace(a, b)
    t = re.sub(r'\bone, one, one\b', 'one one one', t)
    return unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode()
N = json.load(open('narration.json', encoding='utf-8')); S = json.load(open('data/sutras.json', encoding='utf-8'))
jobs = [(f'n_{k}', say(t), NV, '+0%') for k, t in N.items()] + [('s_' + k.replace('.', '_'), v['dev'], VV, '-18%') for k, v in S.items()]
async def main():
    n = 0
    for name, text, voice, rate in jobs:
        h = hashlib.md5(f'{text}|{voice}|{rate}'.encode()).hexdigest()[:8]; out = f'audio/{name}.{h}.mp3'
        if os.path.exists(out): continue
        for f in os.listdir('audio'):
            if f.startswith(name + '.'): os.remove('audio/' + f)
        for attempt in range(4):
            try:
                await asyncio.wait_for(edge_tts.Communicate(text, voice, rate=rate).save(out + '.part'), timeout=60)
                os.replace(out + '.part', out); n += 1; print(name, flush=True); break
            except Exception as e:
                print('retry', name, attempt, type(e).__name__, flush=True)
                if os.path.exists(out + '.part'): os.remove(out + '.part')
        else: print('FAILED', name, flush=True)
    print('DONE', n, 'new clips of', len(jobs))
asyncio.run(main())
