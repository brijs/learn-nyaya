"""Builds data/sutras.json (curated, word-glossed sūtras) and data/corpus.json (all sūtras, IAST + Devanagari) from the GRETIL parse.
Run: python3 gen_sutras.py   (idempotent). Sūtra IAST comes from data/nyayasutra.gretil.json; glosses and paraphrases are ours."""
import json, os, re
R = os.path.dirname(os.path.abspath(__file__)); os.chdir(R)
CORPUS = json.load(open('data/nyayasutra.gretil.json', encoding='utf-8'))

CM = {'k':'क','kh':'ख','g':'ग','gh':'घ','ṅ':'ङ','c':'च','ch':'छ','j':'ज','jh':'झ','ñ':'ञ','ṭ':'ट','ṭh':'ठ','ḍ':'ड','ḍh':'ढ','ṇ':'ण','t':'त','th':'थ','d':'द','dh':'ध','n':'न','p':'प','ph':'फ','b':'ब','bh':'भ','m':'म','y':'य','r':'र','l':'ल','v':'व','ś':'श','ṣ':'ष','s':'स','h':'ह'}
VM = {'a':('अ',''),'ā':('आ','ा'),'i':('इ','ि'),'ī':('ई','ी'),'u':('उ','ु'),'ū':('ऊ','ू'),'ṛ':('ऋ','ृ'),'ṝ':('ॠ','ॄ'),'e':('ए','े'),'ai':('ऐ','ै'),'o':('ओ','ो'),'au':('औ','ौ')}
def to_dev(src):
    s = src.replace('-', '').replace("'", 'ऽ').replace('ṁ','ṃ'); toks = []; i = 0
    while i < len(s):
        two, one = s[i:i+2], s[i]
        if two in ('ai','au'): toks.append(('V', two)); i += 2
        elif len(two) == 2 and two in CM: toks.append(('C', two)); i += 2
        elif one in CM: toks.append(('C', one)); i += 1
        elif one in VM: toks.append(('V', one)); i += 1
        elif one == 'ṃ': toks.append(('M', 'ं')); i += 1
        elif one == 'ḥ': toks.append(('M', 'ः')); i += 1
        else: toks.append(('O', one)); i += 1
    out = []; k = 0
    while k < len(toks):
        t, v = toks[k]
        if t == 'C':
            nx = toks[k+1] if k+1 < len(toks) else None
            if nx and nx[0] == 'V': out.append(CM[v] + VM[nx[1]][1]); k += 1
            else: out.append(CM[v] + '्')
        elif t == 'V': out.append(VM[v][0])
        else: out.append(v)
        k += 1
    return ''.join(out)


import sys; sys.path.insert(0, os.path.join(R, 'tools'))
from slp import iast_to_slp, slp_to_iast, load as load_dp
DP = {r[0]: r for r in load_dp()}
GANA = {'01':'bhvādi','02':'adādi','03':'juhotyādi','04':'divādi','05':'svādi','06':'tudādi','07':'rudhādi','08':'tanādi','09':'kryādi','10':'curādi'}
# token -> (dhātupāṭha code, English sense[, slp override for the check])
ROOTS = {
 'mā':('02.0057','to measure'),'śī':('02.0026','to lie, rest'),'yuj':('07.0007','to join, yoke'),'dṛś':('01.1143','to see'),
 'sidh':('04.0089','to be accomplished'),'sidh²':('01.0049','to ward off, repel'),'sādh':('05.0019','to accomplish'),'yu':('02.0027','to join, mix'),
 'tark':('10.0311','to reason, conjecture'),'nī':('01.1049','to lead'),'vad':('01.1164','to speak'),'jalp':('01.0464','to prattle, speak'),
 'hi':('05.0012','to impel, set going'),'bhās':('01.0711','to shine, appear'),'jan':('04.0044','to be born, arise'),'grah':('09.0071','to seize, grasp'),
 'sthā':('01.1077','to stand'),'jñā':('09.0043','to know'),'gam':('01.1137','to go'),'vṛj':('07.0024','to turn away, avoid'),'vṛt':('01.0862','to turn, proceed'),
 'duṣ':('04.0082','to be spoiled'),'i':('02.0040','to go'),'śiṣ':('10.0349','to leave over'),'śiṣ²':('07.0014','to distinguish'),'at':('01.0038','to move constantly'),
 'śṝ':('09.0021','to crumble, break'),'budh':('04.0068','to awake, understand'),'man':('04.0073','to think'),'phal':('01.0608','to bear fruit'),'iṣ':('06.0078','to wish'),
 'dviṣ':('02.0003','to hate'),'yat':('01.0030','to strive'),'liṅg':('10.0267','to mark, paint','lig'),'pad':('04.0065','to go, step'),'labh':('01.1130','to obtain'),
 'īkṣ':('01.0694','to look'),'mṛś':('06.0161','to touch, consider'),'kṛ':('08.0010','to do, make'),'ūh':('01.0735','to consider, infer'),'dhṛ':('01.1047','to hold'),
 'rudh':('07.0001','to obstruct, oppose'),'vac':('02.0058','to speak'),'cint':('10.0002','to think','cit'),'car':('01.0640','to move, practise'),'han':('02.0002','to strike'),
 'kḷp':('01.0866','to be fit, arrange','kfp'),'dhā':('03.0011','to place, hold'),'hṛ':('01.1046','to carry'),'kāś':('01.0734','to shine'),'dīp':('04.0045','to blaze'),
 'spṛś':('06.0158','to touch'),'rakṣ':('01.0746','to guard'),'ruh':('01.0995','to grow, sprout'),'āp':('05.0016','to obtain'),'diś':('06.0003','to point out'),
 'so':('04.0042','to end, settle'),'bhū':('01.0001','to be, become'),'hā':('03.0009','to leave'),'vṛ':('01.1083','to cover'),'kṛṣ':('01.1145','to draw'),
}
def _norm(s): return s.replace('zW','sT').replace('z','s').replace('R','n')
# id: (spoken IAST with word spaces, [chips 'surface|gloss|build'], paraphrase, tag, explanation)
S = {}
def s(i, iast, chips, tr, ex, tag=''):
    S[i] = {'iast': iast, 'chips': [c.split('|', 2) + [''] * (3 - len(c.split('|', 2))) for c in chips], 'tr': tr, 'tag': tag, 'ex': ex}

s('1.1.1', 'pramāṇaprameyasaṃśayaprayojanadṛṣṭāntasiddhāntāvayavatarkanirṇayavādajalpavitaṇḍāhetvābhāsacchalajātinigrahasthānānāṃ tattvajñānāt niḥśreyasādhigamaḥ',
  ['pramāṇa|means of valid knowledge|pra + √mā + ana (lyuṭ): “that by which one measures”','prameya|object of knowledge|pra + √mā + ya (yat): “what is to be measured”, ā→e','saṃśaya|doubt|sam + √śī + a: “lying between two”, wavering','prayojana|purpose|pra + √yuj + ana (lyuṭ): “what one is engaged toward”','dṛṣṭānta|example|dṛṣṭa (√dṛś + ta: “seen”) + anta (“end”): a settled, seen instance','siddhānta|established tenet|siddha (√sidh + ta: “accomplished”) + anta: the accomplished end','avayava|member of an argument|ava + √yu + a: a “joined” part (usual derivation)','tarka|hypothetical reasoning|√tark + a (ghañ): “to conjecture, reason”','nirṇaya|ascertainment|nis + √nī + a: “leading out to a conclusion” (n→ṇ)','vāda|discussion|√vad + a (ghañ): “speaking”','jalpa|wrangling|√jalp + a (ghañ): “prattling, speaking”','vitaṇḍā|cavilling|vi + taṇḍā: derivation uncertain; sense “carping”','hetvābhāsa|fallacious reason|hetu (√hi + tu: “what impels”) + ābhāsa (ā + √bhās + a: “semblance”)','chala|quibble|chala “disguise, trickery” (traditionally from a root chal; not in the dhātupāṭha)','jāti|futile rejoinder|√jan + ti (ktin): “birth, kind”','nigrahasthāna|ground of defeat|nigraha (ni + √grah + a: “restraint”) + sthāna (√sthā + ana: “place”)','tattvajñānāt|from true knowledge of these|tattva (tad + tva: “that-ness”) + jñāna (√jñā + ana) + abl. -āt','niḥśreyasādhigamaḥ|attainment of the highest good|niḥśreyasa (nis + śreyas “better”: “beyond the good”) + adhigama (adhi + √gam + a)'],
  'From true knowledge of these sixteen topics comes the attainment of the highest good.',
  'It lists the whole syllabus in one compound (the uddeśa, the naming) and states the payoff: the highest good comes from truly knowing these sixteen topics. The rest of the text defines and examines them.')
s('1.1.2', 'duḥkhajanmapravṛttidoṣamithyājñānānām uttarottarāpāye tadanantarāpāyāt apavargaḥ',
  ['duḥkha|pain|duḥ (“bad”) + kha (“space”): traditional etymology, “a bad axle-hole”','janma|birth|√jan + man: “being born”','pravṛtti|activity|pra + √vṛt + ti (ktin): “setting in motion”','doṣa|fault|√duṣ + a (ghañ): “a spoiling, flaw”','mithyājñānānām|of false cognitions|mithyā (“falsely”) + jñāna (√jñā + ana) + gen. pl. -ām','uttarottara-apāye|when each later member goes|uttara-uttara (“each later”) + apāya (apa + √i + a: “going away”) + loc. -e','tad-anantara-apāyāt|the one just before it goes too|tad + an-antara (“with no gap”) + apāya + abl. -āt','apavargaḥ|release|apa + √vṛj + a (ghañ): “turning away”, final release'],
  'Of pain, birth, activity, fault and false cognition: as each later one departs, the one before it departs, and so there is release.',
  'A chain of causes read backwards. False cognition produces faults (desire, aversion, delusion); faults drive activity; activity leads to birth; birth is where pain lives. Remove the root, and each result goes in turn, ending in apavarga.')
s('1.1.3', 'pratyakṣānumānopamānaśabdāḥ pramāṇāni',
  ['pratyakṣa|perception|prati + akṣa (“sense organ, eye”): “before the sense”','anumāna|inference|anu + √mā + ana (lyuṭ): “measuring after”','upamāna|analogy|upa + √mā + ana (lyuṭ): “measuring near, likening”','śabdāḥ|verbal testimony|śabda “sound, word” + nom. pl. -āḥ','pramāṇāni|are the means of valid knowledge|pramāṇa (pra + √mā + ana) + nom. pl. neuter -āni'],
  'Perception, inference, analogy and testimony are the means of valid knowledge.',
  'States the four sources of valid knowledge. The text goes on to define each of them (1.1.4 to 1.1.7), and adhyāya 2 defends them against objections.')
s('1.1.4', 'indriyārthasannikarṣotpannaṃ jñānam avyapadeśyam avyabhicāri vyavasāyātmakaṃ pratyakṣam',
  ['indriya|sense organ|indra (“lord”: the self) + iya: “belonging to the lord (self)”','artha|object|“aim, object, meaning” (traditionally from the root ṛ “to reach”; derivation uncertain)','sannikarṣotpannam|born of the contact|sannikarṣa (sam + ni + √kṛṣ + a: “drawing close”) + utpanna (ut + √pad + na: “arisen”)','jñānam|cognition|√jñā + ana (lyuṭ): “knowing”','avyapadeśyam|not verbally designated|a + vi + apa + √diś + ya (ṇyat): “not to be pointed out (by a word)”','avyabhicāri|not erring|a + vy-abhi + √car + in (ṇini): “not wandering off”','vyavasāyātmakam|determinate in nature|vyavasāya (vi + ava + √so + a: “settling, determination”) + ātmaka (ātman + ka): “having it as its nature”','pratyakṣam|is perception|prati + akṣa: “before the sense”'],
  'Perception is cognition born of contact between a sense and its object, not tied to a word, non-erring, and determinate.',
  'Four conditions define perception: it arises from contact of a sense with its object; it is not merely verbal; it does not err; and it is determinate. Each phrase excludes a wrong case, such as hallucination (which errs) or a bare word (which is not born of contact).')
s('1.1.5', 'atha tatpūrvakaṃ trividham anumānaṃ pūrvavat śeṣavat sāmānyatodṛṣṭaṃ ca',
  ['atha|now|indeclinable: “now, then”','tatpūrvakam|preceded by that (perception)|tad + pūrva + ka: “having that as antecedent”','trividham|threefold|tri + vidha (“kind”)','anumānam|inference|anu + √mā + ana: “measuring after”','pūrvavat|like the earlier (cause to effect)|pūrva (“earlier”) + vat (taddhita): “having/like the earlier”','śeṣavat|with the remainder (effect to cause)|śeṣa (√śiṣ + a: “what is left over”) + vat','sāmānyatodṛṣṭam|seen from general likeness|sāmānya (“generality”) + tas (“from”) + dṛṣṭa (√dṛś + ta: “seen”)','ca|and|indeclinable'],
  'Then inference, which is preceded by perception, is of three kinds: pūrvavat, śeṣavat and sāmānyatodṛṣṭa.',
  'Inference comes after perception: you perceive a sign, then infer what it points to. Three types are named; commentators illustrate them with clouds to rain (cause to effect), a flooded river to rain upstream (effect to cause), and the sun’s motion (general likeness). Readings differ.')
s('1.1.6', 'prasiddhasādharmyāt sādhyasādhanam upamānam',
  ['prasiddha|well known|pra + √sidh + ta: “well established”','sādharmyāt|from similarity|sa (“same”) + dharma + ya (ṣyañ): “sameness of property” + abl. -āt','sādhya|what is to be established|√sādh + ya (ṇyat): “to be accomplished”','sādhanam|establishing|√sādh + ana (lyuṭ): “accomplishing, means”','upamānam|analogy|upa + √mā + ana: “likening”'],
  'Analogy establishes what is to be known through similarity to something well known.',
  'You know something well; you are told a new thing resembles it; later you recognise the new thing from that likeness. The classic case is the cow and the gavaya.')
s('1.1.7', 'āptopadeśaḥ śabdaḥ',
  ['āpta|a reliable person|√āp + ta (kta): “one who has attained (the truth)”','upadeśaḥ|instruction|upa + √diś + a (ghañ): “pointing out, teaching”','śabdaḥ|is verbal testimony|śabda “sound, word” + nom. sg.'],
  'The instruction of a reliable person is verbal testimony.',
  'Testimony counts as knowledge only when it comes from a reliable person (āpta), who knows the matter and speaks it truly.')
s('1.1.9', 'ātmaśarīrendriyārthabuddhimanaḥpravṛttidoṣapretyabhāvaphaladuḥkhāpavargāḥ tu prameyam',
  ['ātman|self|√at + man (uṇādi): “that which moves constantly” (traditional)','śarīra|body|√śṝ + īra: “that which wears away”','indriya|senses|indra (the self) + iya','artha|objects|“aim, object” (derivation uncertain)','buddhi|cognition|√budh + ti (ktin): “awakening, understanding”','manas|mind|√man + as (asun): “the thinking (organ)”','pravṛtti|activity|pra + √vṛt + ti (ktin)','doṣa|fault|√duṣ + a (ghañ)','pretyabhāva|rebirth|pretya (pra + √i + ya: “having departed”) + bhāva (√bhū + a: “becoming”)','phala|fruit|√phal + a: “to bear fruit”','duḥkha|pain|duḥ + kha','apavargāḥ|release|apa + √vṛj + a (ghañ) + nom. pl. -āḥ','tu|but (marks the list)|indeclinable','prameyam|the object of knowledge|pra + √mā + ya (yat)'],
  'The objects of valid knowledge are: self, body, senses, objects, cognition, mind, activity, fault, rebirth, fruit, pain and release.',
  'The twelve things worth knowing, in the order the text defines them next (1.1.10 to 1.1.22). The list begins with the self and ends with release.')
s('1.1.10', 'icchādveṣaprayatnasukhaduḥkhajñānāni ātmanaḥ liṅgam iti',
  ['icchā|desire|√iṣ + ā (śa): “wishing”','dveṣa|aversion|√dviṣ + a (ghañ): “hating”','prayatna|effort|pra + √yat + na (naṅ): “striving”','sukha|pleasure|su (“good”) + kha (“space”)','duḥkha|pain|duḥ + kha','jñānāni|cognitions|√jñā + ana (lyuṭ) + nom. pl. -āni','ātmanaḥ|of the self|ātman + gen. sg. -aḥ','liṅgam|mark, sign|√liṅg + a: “that which marks”','iti|thus|indeclinable'],
  'Desire, aversion, effort, pleasure, pain and cognition are the marks of the self.',
  'The self cannot be seen, so it is inferred from marks that need a conscious subject: wanting, disliking, trying, feeling pleasure and pain, and knowing.')
s('1.1.16', 'yugapat jñānānutpattiḥ manasaḥ liṅgam',
  ['yugapat|at one time|indeclinable: “at the same time”','jñāna-anutpattiḥ|non-arising of cognitions|jñāna (√jñā + ana) + an (“not”) + ut-patti (ut + √pad + ti)','manasaḥ|of the mind|manas (√man + as) + gen. sg. -aḥ','liṅgam|mark, sign|√liṅg + a'],
  'That cognitions do not arise at the same moment is the mark of the mind.',
  'We cannot attend to two things at one instant. Nyāya concludes there is an internal organ, the mind, that lets in one cognition at a time.')
s('1.1.23', 'samānānekadharmopapatteḥ vipratipatteḥ upalabdhyanupalabdhyavyavasthātaḥ ca viśeṣāpekṣaḥ vimarśaḥ saṃśayaḥ',
  ['samāna-aneka-dharma-upapatteḥ|from a common property, or from several (uncommon) properties|samāna “same, common”; aneka (an + eka: “not one”); dharma (√dhṛ + ma: “what upholds”, property); upapatti (upa + √pad + ti: “occurrence”)','vipratipatteḥ|from conflicting opinions|vi + prati + √pad + ti (ktin): “conflicting understanding”','upalabdhi-anupalabdhi-avyavasthātaḥ|from irregularity of perception and non-perception|upalabdhi (upa + √labh + ti: “perceiving”); an-upalabdhi; a-vyavasthā (vi + ava + √sthā + a: “settled order”) + tas (“from”)','ca|and|indeclinable','viśeṣa-apekṣaḥ|wanting a distinguishing feature|viśeṣa (vi + √śiṣ² + a: “distinction”) + apekṣa (apa + √īkṣ + a: “looking for”)','vimarśaḥ|wavering|vi + √mṛś + a (ghañ): “considering, weighing”','saṃśayaḥ|is doubt|sam + √śī + a'],
  'Doubt is a wavering that looks for a distinguishing feature, arising from a common property, an uncommon property, conflicting opinions, or irregularity in perceiving or not perceiving.',
  'Doubt is not just ignorance. It is a back-and-forth between alternatives, kept alive because something is shared between them (a tall shape that could be a post or a person) and nothing yet separates them.')
s('1.1.32', 'pratijñāhetūdāharaṇopanayanigamanāni avayavāḥ',
  ['pratijñā|thesis|prati + √jñā + ā (aṅ): “solemn declaration”','hetu|reason|√hi + tu: “what impels”','udāharaṇa|example|ud + ā + √hṛ + ana (lyuṭ): “bringing forward (an instance)”','upanaya|application|upa + √nī + a: “bringing near”','nigamanāni|conclusion|ni + √gam + ana (lyuṭ): “drawing down (to a conclusion)”','avayavāḥ|are the members|ava + √yu + a + nom. pl. -āḥ'],
  'Thesis, reason, example, application and conclusion are the members of an argument.',
  'The members of a full, communicable argument. Nyāya wants all five; other schools accept fewer.')
s('1.1.33', 'sādhyanirdeśaḥ pratijñā',
  ['sādhya|what is to be established|√sādh + ya (ṇyat)','nirdeśaḥ|statement|nis + √diś + a (ghañ): “pointing out”','pratijñā|is the thesis|prati + √jñā + ā'],
  'Stating what is to be established is the thesis.',
  'The thesis names the subject and what is claimed of it: “the hill has fire.”')
s('1.1.34', 'udāharaṇasādharmyāt sādhyasādhanaṃ hetuḥ',
  ['udāharaṇa|example|ud + ā + √hṛ + ana','sādharmyāt|from similarity|sa + dharma + ya (ṣyañ) + abl. -āt','sādhya-sādhanam|establishing the sādhya|√sādh + ya; √sādh + ana','hetuḥ|is the reason|√hi + tu'],
  'The reason establishes what is to be established through similarity to the example.',
  'The reason links the subject to the target through what the example shows: “because of smoke”, as in the kitchen.')
s('1.1.35', 'tathā vaidharmyāt',
  ['tathā|likewise|indeclinable: “so, likewise”','vaidharmyāt|from dissimilarity|vi + dharma + ya (ṣyañ): “difference of property” + abl. -āt'],
  'Likewise through dissimilarity.',
  'The same reason can be shown from the other side: where the target is absent the reason is absent too, as in a lake.')
s('1.1.36', 'sādhyasādharmyāt taddharmabhāvī dṛṣṭāntaḥ udāharaṇam',
  ['sādhya-sādharmyāt|from similarity to the sādhya|√sādh + ya; sa + dharma + ya + abl.','tad-dharma-bhāvī|having that property|tad + dharma + bhāvin (√bhū + in): “becoming/having”','dṛṣṭāntaḥ|an instance|dṛṣṭa (√dṛś + ta) + anta','udāharaṇam|is the example|ud + ā + √hṛ + ana'],
  'An instance that shares the property of the sādhya, through similarity to it, is the example.',
  'The example is a familiar instance where the target and reason both occur, so everyone agrees: the kitchen has fire and smoke.')
s('1.1.37', 'tadviparyayāt vā viparītam',
  ['tad-viparyayāt|from the reverse of that|vi-pari + √i + a (ac): “turning about, reversal” + abl.','vā|or|indeclinable','viparītam|the opposite (example)|vi + pari + √i + ta (kta): “turned about”'],
  'Or, from the reverse, the opposite kind of example.',
  'The opposite kind of example is a case lacking the property of the target (and the reason), such as a lake.')
s('1.1.38', 'udāharaṇāpekṣaḥ tathā iti upasaṃhāraḥ na tathā iti vā sādhyasya upanayaḥ',
  ['udāharaṇa-apekṣaḥ|depending on the example|udāharaṇa; apekṣa (apa + √īkṣ + a: “looking to”)','tathā iti|“so it is”|tathā “so” + iti “thus”','upasaṃhāraḥ|drawing together|upa + sam + √hṛ + a (ghañ)','na tathā iti|“it is not so”|na “not” + tathā + iti','vā|or|indeclinable','sādhyasya|regarding the sādhya|√sādh + ya + gen. sg. -sya','upanayaḥ|is the application|upa + √nī + a'],
  'Depending on the example, saying “so it is” or “not so” about the subject is the application.',
  'The application ties the subject back to the example: “and this hill is likewise smoky”, or in the negative form, “not so”.')
s('1.1.39', 'hetvapadeśāt pratijñāyāḥ punarvacanaṃ nigamanam',
  ['hetu-apadeśāt|from citing the reason|hetu (√hi + tu) + apadeśa (apa + √diś + a: “citing”) + abl.','pratijñāyāḥ|of the thesis|pratijñā + gen. sg. -āyāḥ','punar-vacanam|restating|punar “again” + vacana (√vac + ana: “saying”)','nigamanam|is the conclusion|ni + √gam + ana'],
  'Restating the thesis after the reason has been cited is the conclusion.',
  'The conclusion restates the thesis, now supported by reason and example.')
s('1.1.40', 'avijñātatattve arthe kāraṇopapattitaḥ tattvajñānārtham ūhaḥ tarkaḥ',
  ['avijñāta-tattve arthe|about a thing whose truth is not known|a + vi + √jñā + ta (“not known”) + tattva (tad + tva) + artha + loc. -e','kāraṇa-upapattitaḥ|on the strength of causal considerations|kāraṇa (√kṛ + ana: “cause”) + upapatti (upa + √pad + ti) + tas (“from”)','tattva-jñāna-artham|for the sake of knowing the truth|tattva + jñāna (√jñā + ana) + artha (“purpose”)','ūhaḥ|supposition|√ūh + a (ghañ): “considering, inferring”','tarkaḥ|is tarka|√tark + a'],
  'Tarka is a supposition, made on causal grounds about a thing whose truth is not yet known, in order to reach knowledge of the truth.',
  'Tarka is not itself proof. It is a probing supposition that tests an alternative (“suppose it were so; then absurdity follows”), and so helps reach the truth.')
s('1.1.41', 'vimṛśya pakṣapratipakṣābhyām arthāvadhāraṇaṃ nirṇayaḥ',
  ['vimṛśya|having considered|vi + √mṛś + ya (lyap): “having weighed”','pakṣa-pratipakṣābhyām|with thesis and counter-thesis|pakṣa “side” + prati-pakṣa; instr. dual -ābhyām','artha-avadhāraṇam|settling the matter|artha + ava + √dhṛ + ana (lyuṭ, causative): “fixing”','nirṇayaḥ|is ascertainment|nis + √nī + a'],
  'Having weighed it with thesis and counter-thesis, settling the matter is ascertainment.',
  'Ascertainment comes after weighing both sides, not from assertion alone.')
s('1.2.1', 'pramāṇatarkasādhanopālambhaḥ siddhāntāviruddhaḥ pañcāvayavopapannaḥ pakṣapratipakṣaparigrahaḥ vādaḥ',
  ['pramāṇa-tarka-sādhana-upālambhaḥ|proving and refuting by pramāṇa and tarka|pramāṇa; tarka; sādhana (√sādh + ana); upālambha (upa + ā + √labh + a: “censure, refutation”)','siddhānta-aviruddhaḥ|not contradicting the tenet|siddhānta; a + vi + √rudh + ta: “not opposed”','pañca-avayava-upapannaḥ|furnished with the five members|pañca “five” + avayava + upa + √pad + na: “endowed with”','pakṣa-pratipakṣa-parigrahaḥ|taking up a thesis and its counter-thesis|pakṣa; prati-pakṣa; pari + √grah + a (ghañ): “taking up”','vādaḥ|is vāda, discussion|√vad + a (ghañ)'],
  'Vāda: proving and refuting by pramāṇa and tarka, within the accepted tenet, with the five members, taking a thesis and counter-thesis.',
  'Vāda is the honest debate: both sides can state and prove a thesis, the five members are used, and the accepted doctrine is not contradicted.')
s('1.2.2', 'yathoktopapannaḥ chalajātinigrahasthānasādhanopālambhaḥ jalpaḥ',
  ['yathā-ukta-upapannaḥ|having the features just stated|yathā “as” + ukta (√vac + ta: “said”) + upa + √pad + na','chala-jāti-nigrahasthāna|quibble, futile rejoinder, ground of defeat|chala; jāti (√jan + ti); nigrahasthāna (ni + √grah + a; √sthā + ana)','sādhana-upālambhaḥ|used for proving and refuting|√sādh + ana; upa + ā + √labh + a','jalpaḥ|is jalpa|√jalp + a (ghañ)'],
  'Jalpa has those same features but proves and refutes also by chala, jāti and nigrahasthāna.',
  'Jalpa allows the debater to win by any permitted means: chala, jāti and nigrahasthāna become tools.')
s('1.2.3', 'saḥ pratipakṣasthāpanāhīnaḥ vitaṇḍā',
  ['saḥ|that (jalpa)|tad, nom. sg. masc.','pratipakṣa-sthāpanā-hīnaḥ|lacking the establishing of a counter-thesis|pratipakṣa; sthāpanā (√sthā + ṇic + yuc + ā: “establishing”); hīna (√hā + na: “deprived of”)','vitaṇḍā|is vitaṇḍā|vi + taṇḍā: derivation uncertain'],
  'That same, without establishing a counter-thesis of one’s own, is vitaṇḍā.',
  'Vitaṇḍā is jalpa stripped of any thesis of one’s own: it only criticises.')
s('1.2.4', 'savyabhicāraviruddhaprakaraṇasamasādhyasamakālātītāḥ hetvābhāsāḥ',
  ['savyabhicāra|deviating|sa + vyabhicāra (vi + abhi + √car + a: “deviation”): “having deviation”','viruddha|contradictory|vi + √rudh + ta: “opposed”','prakaraṇasama|balancing the question|prakaraṇa (pra + √kṛ + ana: “topic”) + sama “equal”','sādhyasama|as unproven as the sādhya|sādhya (√sādh + ya) + sama','kālātītāḥ|out of time|kāla “time” + atīta (ati + √i + ta: “gone beyond”)','hetvābhāsāḥ|are fallacious reasons|hetu (√hi + tu) + ābhāsa (ā + √bhās + a)'],
  'The deviating, contradictory, question-balancing, sādhya-equal and out-of-time reasons are the hetvābhāsas.',
  'Five ways a reason can fail while looking like a reason: it deviates, contradicts, leaves the question as it was, is as unproven as the target, or comes out of time. Note the “-sama” naming: “equal to” the question, “equal to” the sādhya.')
s('1.2.5', 'anaikāntikaḥ savyabhicāraḥ',
  ['anaikāntikaḥ|not one-sided, inconclusive|an + ekānta (eka + anta: “one-sided”) + ika (ṭhak)','savyabhicāraḥ|is the deviating reason|sa + vi + abhi + √car + a'],
  'The inconclusive reason is the deviating one (savyabhicāra).',
  'A reason present both where the target is and where it is not proves nothing. “Knowable, therefore eternal” is the stock case, since knowable includes non-eternal things.')
s('1.2.6', 'siddhāntam abhyupetya tadvirodhī viruddhaḥ',
  ['siddhāntam|a tenet|siddha (√sidh + ta) + anta + acc. sg. -m','abhyupetya|having accepted|abhi + upa + √i + ya (lyap)','tad-virodhī|contradicting it|tad + vi + √rudh + in (ṇini): “opposing”','viruddhaḥ|is the contradictory reason|vi + √rudh + ta'],
  'A reason that contradicts the very tenet one has accepted is viruddha.',
  'A reason that contradicts the doctrine the speaker himself accepts, and so proves the opposite of what he wants.')
s('1.2.7', 'yasmāt prakaraṇacintā saḥ nirṇayārtham apadiṣṭaḥ prakaraṇasamaḥ',
  ['yasmāt|from which|yad (relative pronoun), abl. sg.','prakaraṇa-cintā|the question itself stays under consideration|prakaraṇa; cintā (√cint + ā: “thinking”)','saḥ|that|tad, nom. sg.','nirṇaya-artham|for the sake of settling|nis + √nī + a; artha “purpose”','apadiṣṭaḥ|cited|apa + √diś + ta (kta): “pointed out, cited”','prakaraṇasamaḥ|is prakaraṇasama|prakaraṇa + sama “equal”'],
  'A reason cited to settle a question, from which the question itself remains live, is prakaraṇasama.',
  'A reason that leaves the question exactly where it was: the same sort of reason can be given for the opposite.')
s('1.2.8', 'sādhyāviśiṣṭaḥ sādhyatvāt sādhyasamaḥ',
  ['sādhya-aviśiṣṭaḥ|no different from the sādhya|sādhya; a + vi + √śiṣ² + ta: “not distinguished”','sādhyatvāt|because it too needs establishing|sādhya + tva (“-ness”) + abl. -āt','sādhyasamaḥ|is sādhyasama|sādhya + sama “equal”'],
  'A reason no different from the sādhya, since it too needs to be established, is sādhyasama.',
  'A reason that needs proving just as much as the thesis, so it settles nothing.')
s('1.2.9', 'kālātyayāpadiṣṭaḥ kālātītaḥ',
  ['kāla-atyaya-apadiṣṭaḥ|cited after the time has passed|kāla; atyaya (ati + √i + a: “passing by”); apadiṣṭa (apa + √diś + ta)','kālātītaḥ|is kālātīta|kāla + atīta (ati + √i + ta)'],
  'A reason cited after its time has lapsed is kālātīta.',
  'A reason presented after its moment has passed. Tradition links this with the later bādhita, a reason whose conclusion is already contradicted by a stronger means of knowledge.')
s('1.2.10', 'vacanavighātaḥ arthavikalpopapattyā chalam',
  ['vacana-vighātaḥ|obstructing a statement|vacana (√vac + ana: “statement”) + vi-ghāta (vi + √han + a: “striking down”)','artha-vikalpa-upapattyā|by supposing a different meaning|artha; vikalpa (vi + √kḷp + a: “alternative”); upapatti (upa + √pad + ti) + instr. -yā','chalam|is chala, quibble|chala “trickery”'],
  'Obstructing a statement by supposing a different meaning for it is chala.',
  'Chala is not an error of fact. It twists the meaning of a statement in order to refute something the speaker did not say.')
s('1.2.11', 'tat trividham vākchalaṃ sāmānyacchalam upacāracchalaṃ ca iti',
  ['tat|that|tad, nom. sg. neuter','trividham|threefold|tri + vidha “kind”','vāk-chalam|quibble on wording|vāc “speech” + chala','sāmānya-chalam|quibble by over-generalising|sāmānya (“generality”) + chala','upacāra-chalam|quibble on figurative use|upacāra (upa + √car + a: “figurative usage”) + chala','ca iti|and so|indeclinables'],
  'It is threefold: quibble on wording, on generality, and on figurative use.',
  'Three ways of twisting: through the wording (vāk), by over-generalising (sāmānya), or by taking figurative use (upacāra) literally.')
s('1.2.12', 'aviśeṣābhihite arthe vaktuḥ abhiprāyāt arthāntarakalpanā vākchalam',
  ['aviśeṣa-abhihite arthe|when a word with several senses is used|a + viśeṣa; abhihita (abhi + √dhā + ta: “said”); artha + loc. -e','vaktuḥ abhiprāyāt|apart from the speaker’s intention|vaktṛ (√vac + tṛ: “speaker”) gen.; abhi + pra + √i + a: “intention” + abl.','artha-antara-kalpanā|imagining another meaning|artha; antara “other”; kalpanā (√kḷp + ṇic + yuc + ā: “imagining”)','vāk-chalam|is vākchala|vāc + chala'],
  'When a word with more than one sense is used, imagining a meaning other than the speaker intended is vākchala.',
  'The standard illustration is “navakambalo ’yaṃ māṇavakaḥ”: nava means both “new” and “nine”, so the quibbler objects “he has only one blanket, not nine.”')
s('1.2.13', 'sambhavataḥ arthasya atisāmānyayogāt asambhūtārthakalpanā sāmānyacchalam',
  ['sambhavataḥ arthasya|of a thing that is possible|sam + √bhū + at (śatṛ): “being possible” + gen.','ati-sāmānya-yogāt|by stretching the generality too far|ati “excess” + sāmānya + yoga (√yuj + a: “connection”) + abl.','asambhūta-artha-kalpanā|imagining an impossible meaning|a + sam + √bhū + ta; artha; kalpanā (√kḷp + ṇic + yuc)','sāmānya-chalam|is sāmānyacchala|sāmānya + chala'],
  'Taking a possible statement and stretching its generality to read an impossible meaning into it is sāmānyacchala.',
  'The speaker says something reasonable about a class; the quibbler stretches it to cover a member it was never meant to include.')
s('1.2.14', 'dharmavikalpanirdeśe arthasadbhāvapratiṣedhaḥ upacāracchalam',
  ['dharma-vikalpa-nirdeśe|when a word is used in a transferred sense|dharma; vikalpa (vi + √kḷp + a); nirdeśa (nis + √diś + a) + loc. -e','artha-sadbhāva-pratiṣedhaḥ|denying it by taking it literally|artha; sat-bhāva (sat + √bhū + a: “existence”); prati-ṣedha (prati + √sidh² + a: “warding off, denial”)','upacāra-chalam|is upacāracchala|upacāra (upa + √car + a) + chala'],
  'When a word is used figuratively, denying the statement by insisting on the literal sense is upacāracchala.',
  'The speaker uses a word figuratively (“the platforms shout” for “the people on them”); the quibbler insists on the literal sense and denies it.')
s('1.2.18', 'sādharmyavaidharmyābhyāṃ pratyavasthānaṃ jātiḥ',
  ['sādharmya-vaidharmyābhyām|by similarity or dissimilarity|sa + dharma + ya; vi + dharma + ya; instr. dual -ābhyām','pratyavasthānam|a counter-position|prati + ava + √sthā + ana (lyuṭ): “taking a counter-stand”','jātiḥ|is jāti|√jan + ti (ktin)'],
  'A counter-position taken merely on similarity or dissimilarity is jāti, a futile rejoinder.',
  'A jāti looks like a refutation but rests on a bare likeness or unlikeness, without the pervasion (vyāpti) that real refutation would need.')
s('1.2.19', 'vipratipattiḥ apratipattiḥ ca nigrahasthānam',
  ['vipratipattiḥ|wrong understanding|vi + prati + √pad + ti (ktin)','apratipattiḥ|non-understanding|a + prati + √pad + ti: “non-comprehension”','ca|and|indeclinable','nigrahasthānam|is a ground of defeat|ni + √grah + a (“restraint”) + sthāna (√sthā + ana: “place”)'],
  'Misunderstanding and non-understanding are grounds of defeat.',
  'A debater loses if he misunderstands the matter or fails to understand it at all. This is the general statement; 5.2.1 lists 22 types.')
s('2.1.8', 'pratyakṣādīnām aprāmāṇyaṃ traikālyāsiddheḥ',
  ['pratyakṣa-ādīnām|of perception and the rest|pratyakṣa (prati + akṣa); ādi “beginning, and so on”; gen. pl. -ām','aprāmāṇyam|are not valid means (the objector says)|a + pramāṇa + ya (ṣyañ): “non-validity”','traikālya-asiddheḥ|because the three times cannot be made to work|traikālya (tri + kāla + ya: “the three times”) + a + √sidh + ti (ktin): “non-establishment”'],
  'Objector: perception and the rest are not valid means, because they fail in all three times: before, after or together with their objects.',
  'The objector’s claim: a means of knowledge would have to stand in some time-relation to its object (before, after or together), and none of these works. Nyāya states the objection in its own text before answering it.', 'pūrvapakṣa')
s('2.1.13', 'sarvapramāṇapratiṣedhāt ca pratiṣedhānupapattiḥ',
  ['sarva-pramāṇa-pratiṣedhāt|since it rejects every pramāṇa|sarva “all” + pramāṇa + prati-ṣedha (prati + √sidh² + a) + abl.','ca|and|indeclinable','pratiṣedha-anupapattiḥ|the rejection itself cannot be established|pratiṣedha; an-upapatti (an + upa + √pad + ti): “untenability”'],
  'Reply: by rejecting every pramāṇa, the objector’s own rejection is left with nothing to establish it.',
  'The reply: to reject every pramāṇa, the objector must himself rely on one; so the rejection undoes itself.', 'siddhānta')
s('2.1.19', 'na pradīpaprakāśasiddhivat tatsiddheḥ',
  ['na|no|indeclinable: “not”','pradīpa-prakāśa-siddhi-vat|like the establishing of a lamp’s light|pradīpa (pra + √dīp + a: “lamp”); prakāśa (pra + √kāś + a: “light”); siddhi (√sidh + ti); vat “like”','tat-siddheḥ|since that is established (in the same way)|tad + siddhi (√sidh + ti) + abl. -eḥ'],
  'No: it is established just as a lamp’s light is, which both shows other things and is itself known.',
  'Another reply: a means of knowledge is itself known and also shows other things, as a lamp’s light is seen and also shows a pot.', 'siddhānta')
s('3.1.1', 'darśanasparśanābhyām ekārthagrahaṇāt',
  ['darśana-sparśanābhyām|by seeing and by touching|darśana (√dṛś + ana: “seeing”); sparśana (√spṛś + ana: “touching”); instr. dual -ābhyām','eka-artha-grahaṇāt|since one and the same object is grasped|eka “one” + artha + grahaṇa (√grah + ana: “grasping”) + abl.'],
  'Since one and the same object is grasped by seeing and by touching (there is a single knower, the self, apart from the separate senses).',
  'Seeing and touching are different senses with different domains. Yet one person says “I touch what I saw.” So there must be a single subject, apart from the senses, who grasps both.', 'the argument')
s('3.1.2', 'na viṣayavyavasthānāt',
  ['na|not so (the objector says)|indeclinable','viṣaya-vyavasthānāt|because each sense has its own fixed domain|viṣaya “sphere, domain (of a sense)”; vyavasthāna (vi + ava + √sthā + ana: “fixing”) + abl.'],
  'Objector: not so, because each sense has its own fixed domain.',
  'The objection: each sense has its own fixed domain, so why posit a further knower?', 'objection')
s('3.1.3', 'tadvyavasthānāt eva ātmasadbhāvāt apratiṣedhaḥ',
  ['tad-vyavasthānāt eva|from that very fixing of domains|tad + vyavasthāna (vi + ava + √sthā + ana) + abl.; eva “just”','ātma-sadbhāvāt|because the self exists|ātman (√at + man) + sat-bhāva (sat + √bhū + a: “existence”) + abl.','apratiṣedhaḥ|there is no refutation|a + prati-ṣedha (prati + √sidh² + a: “denial”)'],
  'Reply: that very fixing of domains shows there is a self that brings them together, so the argument stands.',
  'The reply: the fixing of domains is exactly why a single knower is needed, to bring the separate domains together.', 'reply')
s('4.2.50', 'tattvādhyavasāyasaṃrakṣaṇārthaṃ jalpavitaṇḍe bījaprarohasaṃrakṣaṇārthaṃ kaṇṭakaśākhāvaraṇavat',
  ['tattva-adhyavasāya-saṃrakṣaṇa-artham|for guarding the ascertainment of truth|tattva (tad + tva); adhyavasāya (adhi + ava + √so + a: “resolve”); saṃrakṣaṇa (sam + √rakṣ + ana: “guarding”); artha “purpose”','jalpa-vitaṇḍe|jalpa and vitaṇḍā|jalpa (√jalp + a); vitaṇḍā; nom. dual -e','bīja-praroha-saṃrakṣaṇa-artham|for protecting the sprouting of seeds|bīja “seed”; praroha (pra + √ruh + a: “sprouting”); saṃrakṣaṇa; artha','kaṇṭaka-śākhā-āvaraṇa-vat|like a fence of thorny branches|kaṇṭaka “thorn”; śākhā “branch”; āvaraṇa (ā + √vṛ + ana: “covering, fence”); vat “like”'],
  'Jalpa and vitaṇḍā are for guarding the ascertainment of truth, as a fence of thorny branches protects sprouting seeds.',
  'Jalpa and vitaṇḍā are justified by the work they do: like a thorny fence round a seedling, they protect the truth from attack.')

ROOT_USES = {}
ROOT_RE = re.compile(r'√([^\s,+():;“”.]+)')
out = {}
for k, v in S.items():
    assert k in CORPUS, k
    v['dev'] = to_dev(v['iast']); v['corpus'] = CORPUS[k]
    for ch in v['chips']:
        toks = []
        for t in ROOT_RE.findall(ch[2]):
            assert t in ROOTS, f'{k}: unknown root token {t}'
            if t not in toks: toks.append(t)
            ROOT_USES.setdefault(t, []).append([k, ch[0]])
        ch.append(toks)
    out[k] = v
json.dump(out, open('data/sutras.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# roots.json: verified against the dhātupāṭha
roots = {}
for t, spec in ROOTS.items():
    if t not in ROOT_USES: continue
    code, en = spec[0], spec[1]; base = re.sub(r'[²¹³]', '', t); slp = spec[2] if len(spec) > 2 else iast_to_slp(base)
    c, raw, clean, artha = DP[code]
    assert _norm(slp) in _norm(clean) or _norm(slp) in _norm(raw), f'{t}: {slp} not found in dhātupāṭha {code} {raw}'
    uses = []; seen = set()
    for sid, w in ROOT_USES[t]:
        if (sid, w) not in seen: seen.add((sid, w)); uses.append([sid, w])
    roots[t] = {'iast': base, 'dev': to_dev(base), 'code': code, 'gana': int(code[:2]), 'ganaName': GANA[code[:2]], 'num': int(code[3:]),
                'entry': slp_to_iast(re.sub(r'[~\\^#]', '', raw)), 'sa': slp_to_iast(artha), 'en': en, 'uses': uses}
json.dump(roots, open('data/roots.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

def clean(t): return re.sub(r'\s+', ' ', t).strip().rstrip('.')
full = {k: [clean(v), to_dev(clean(v))] for k, v in CORPUS.items()}
json.dump(full, open('data/corpus.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'curated sutras;', len(full), 'corpus sutras;', len(roots), 'roots verified against the dhātupāṭha')
