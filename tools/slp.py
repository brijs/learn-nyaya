"""IAST <-> SLP1 helpers and dhātupāṭha lookup (data: ashtadhyayi/data-raw/vidyut_dhatupatha.tsv, copied to data/dhatupatha.tsv)."""
import re, csv, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
I2S = {'ai':'E','au':'O','kh':'K','gh':'G','ch':'C','jh':'J','ṭh':'W','ḍh':'Q','th':'T','dh':'D','ph':'P','bh':'B',
 'ā':'A','ī':'I','ū':'U','ṛ':'f','ṝ':'F','ḷ':'x','ṃ':'M','ḥ':'H','ṅ':'N','ñ':'Y','ṭ':'w','ḍ':'q','ṇ':'R','ś':'S','ṣ':'z'}
def iast_to_slp(s):
    out = []; i = 0
    while i < len(s):
        if s[i:i+2] in I2S: out.append(I2S[s[i:i+2]]); i += 2
        elif s[i] in I2S: out.append(I2S[s[i]]); i += 1
        else: out.append(s[i]); i += 1
    return ''.join(out)
S2I = {'A':'ā','I':'ī','U':'ū','f':'ṛ','F':'ṝ','x':'ḷ','M':'ṃ','H':'ḥ','N':'ṅ','Y':'ñ','w':'ṭ','q':'ḍ','R':'ṇ','S':'ś','z':'ṣ','E':'ai','O':'au','K':'kh','G':'gh','C':'ch','J':'jh','W':'ṭh','Q':'ḍh','T':'th','D':'dh','P':'ph','B':'bh'}
def slp_to_iast(s): return ''.join(S2I.get(c, c) for c in s)
def load():
    rows = []
    for r in csv.DictReader(open(os.path.join(R, 'data/dhatupatha.tsv'), encoding='utf-8'), delimiter='\t'):
        base = re.sub(r'[~\\^#]', '', r['dhatu']); rows.append((r['code'], r['dhatu'], base, r['artha']))
    return rows
