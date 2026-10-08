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

# id: (spoken IAST with word spaces, [chips 'surface|gloss'], paraphrase)
S = {}
def s(i, iast, chips, tr, tag=''): S[i] = {'iast': iast, 'chips': [c.split('|', 1) for c in chips], 'tr': tr, 'tag': tag}

s('1.1.1', 'pramāṇaprameyasaṃśayaprayojanadṛṣṭāntasiddhāntāvayavatarkanirṇayavādajalpavitaṇḍāhetvābhāsacchalajātinigrahasthānānāṃ tattvajñānāt niḥśreyasādhigamaḥ',
  ['pramāṇa|means of valid knowledge','prameya|object of knowledge','saṃśaya|doubt','prayojana|purpose','dṛṣṭānta|example','siddhānta|established tenet','avayava|member of an argument','tarka|hypothetical reasoning','nirṇaya|ascertainment','vāda|discussion','jalpa|wrangling','vitaṇḍā|cavilling','hetvābhāsa|fallacious reason','chala|quibble','jāti|futile rejoinder','nigrahasthāna|ground of defeat','tattvajñānāt|from true knowledge of these','niḥśreyasādhigamaḥ|attainment of the highest good'],
  'From true knowledge of these sixteen topics comes the attainment of the highest good.')
s('1.1.2', 'duḥkhajanmapravṛttidoṣamithyājñānānām uttarottarāpāye tadanantarāpāyāt apavargaḥ',
  ['duḥkha|pain','janma|birth','pravṛtti|activity','doṣa|fault','mithyājñānānām|of false cognitions (the five, in this order)','uttarottara-apāye|when each later member goes','tad-anantara-apāyāt|the one just before it goes too','apavargaḥ|release'],
  'Of pain, birth, activity, fault and false cognition: as each later one departs, the one before it departs, and so there is release.')
s('1.1.3', 'pratyakṣānumānopamānaśabdāḥ pramāṇāni',
  ['pratyakṣa|perception','anumāna|inference','upamāna|analogy','śabdāḥ|verbal testimony','pramāṇāni|are the means of valid knowledge'],
  'Perception, inference, analogy and testimony are the means of valid knowledge.')
s('1.1.4', 'indriyārthasannikarṣotpannaṃ jñānam avyapadeśyam avyabhicāri vyavasāyātmakaṃ pratyakṣam',
  ['indriya|sense organ','artha|object','sannikarṣotpannam|born of the contact','jñānam|cognition','avyapadeśyam|not verbally designated','avyabhicāri|not erring','vyavasāyātmakam|determinate in nature','pratyakṣam|is perception'],
  'Perception is cognition born of contact between a sense and its object, not tied to a word, non-erring, and determinate.')
s('1.1.5', 'atha tatpūrvakaṃ trividham anumānaṃ pūrvavat śeṣavat sāmānyatodṛṣṭaṃ ca',
  ['atha|now','tatpūrvakam|preceded by that (perception)','trividham|threefold','anumānam|inference','pūrvavat|like the earlier (cause to effect)','śeṣavat|with the remainder (effect to cause)','sāmānyatodṛṣṭam|seen from general likeness','ca|and'],
  'Then inference, which is preceded by perception, is of three kinds: pūrvavat, śeṣavat and sāmānyatodṛṣṭa.')
s('1.1.6', 'prasiddhasādharmyāt sādhyasādhanam upamānam',
  ['prasiddha|well known','sādharmyāt|from similarity','sādhya|what is to be established','sādhanam|establishing','upamānam|analogy'],
  'Analogy establishes what is to be known through similarity to something well known.')
s('1.1.7', 'āptopadeśaḥ śabdaḥ',
  ['āpta|a reliable person','upadeśaḥ|instruction','śabdaḥ|is verbal testimony'],
  'The instruction of a reliable person is verbal testimony.')
s('1.1.9', 'ātmaśarīrendriyārthabuddhimanaḥpravṛttidoṣapretyabhāvaphaladuḥkhāpavargāḥ tu prameyam',
  ['ātman|self','śarīra|body','indriya|senses','artha|objects','buddhi|cognition','manas|mind','pravṛtti|activity','doṣa|fault','pretyabhāva|rebirth','phala|fruit','duḥkha|pain','apavargāḥ|release','tu|but (marks the list)','prameyam|the object of knowledge'],
  'The objects of valid knowledge are: self, body, senses, objects, cognition, mind, activity, fault, rebirth, fruit, pain and release.')
s('1.1.10', 'icchādveṣaprayatnasukhaduḥkhajñānāni ātmanaḥ liṅgam iti',
  ['icchā|desire','dveṣa|aversion','prayatna|effort','sukha|pleasure','duḥkha|pain','jñānāni|cognitions','ātmanaḥ|of the self','liṅgam|mark, sign','iti|thus'],
  'Desire, aversion, effort, pleasure, pain and cognition are the marks of the self.')
s('1.1.16', 'yugapat jñānānutpattiḥ manasaḥ liṅgam',
  ['yugapat|at one time','jñāna-anutpattiḥ|non-arising of cognitions','manasaḥ|of the mind','liṅgam|mark, sign'],
  'That cognitions do not arise at the same moment is the mark of the mind.')
s('1.1.23', 'samānānekadharmopapatteḥ vipratipatteḥ upalabdhyanupalabdhyavyavasthātaḥ ca viśeṣāpekṣaḥ vimarśaḥ saṃśayaḥ',
  ['samāna-aneka-dharma-upapatteḥ|from a common property, or from several (uncommon) properties','vipratipatteḥ|from conflicting opinions','upalabdhi-anupalabdhi-avyavasthātaḥ|from irregularity of perception and of non-perception','ca|and','viśeṣa-apekṣaḥ|wanting a distinguishing feature','vimarśaḥ|wavering','saṃśayaḥ|is doubt'],
  'Doubt is a wavering that looks for a distinguishing feature, arising from a common property, an uncommon property, conflicting opinions, or irregularity in perceiving or not perceiving.')
s('1.1.32', 'pratijñāhetūdāharaṇopanayanigamanāni avayavāḥ',
  ['pratijñā|thesis','hetu|reason','udāharaṇa|example','upanaya|application','nigamanāni|conclusion','avayavāḥ|are the members'],
  'Thesis, reason, example, application and conclusion are the members of an argument.')
s('1.1.33', 'sādhyanirdeśaḥ pratijñā',
  ['sādhya|what is to be established','nirdeśaḥ|statement','pratijñā|is the thesis'],
  'Stating what is to be established is the thesis.')
s('1.1.34', 'udāharaṇasādharmyāt sādhyasādhanaṃ hetuḥ',
  ['udāharaṇa|example','sādharmyāt|from similarity','sādhya-sādhanam|establishing the sādhya','hetuḥ|is the reason'],
  'The reason establishes what is to be established through similarity to the example.')
s('1.1.35', 'tathā vaidharmyāt',
  ['tathā|likewise','vaidharmyāt|from dissimilarity'],
  'Likewise through dissimilarity.')
s('1.1.36', 'sādhyasādharmyāt taddharmabhāvī dṛṣṭāntaḥ udāharaṇam',
  ['sādhya-sādharmyāt|from similarity to the sādhya','tad-dharma-bhāvī|having that property','dṛṣṭāntaḥ|an instance','udāharaṇam|is the example'],
  'An instance that shares the property of the sādhya, through similarity to it, is the example.')
s('1.1.37', 'tadviparyayāt vā viparītam',
  ['tad-viparyayāt|from the reverse of that','vā|or','viparītam|the opposite (example)'],
  'Or, from the reverse, the opposite kind of example.')
s('1.1.38', 'udāharaṇāpekṣaḥ tathā iti upasaṃhāraḥ na tathā iti vā sādhyasya upanayaḥ',
  ['udāharaṇa-apekṣaḥ|depending on the example','tathā iti|“so it is”','upasaṃhāraḥ|drawing together','na tathā iti|“it is not so”','vā|or','sādhyasya|regarding the sādhya','upanayaḥ|is the application'],
  'Depending on the example, saying “so it is” or “not so” about the subject is the application.')
s('1.1.39', 'hetvapadeśāt pratijñāyāḥ punarvacanaṃ nigamanam',
  ['hetu-apadeśāt|from citing the reason','pratijñāyāḥ|of the thesis','punar-vacanam|restating','nigamanam|is the conclusion'],
  'Restating the thesis after the reason has been cited is the conclusion.')
s('1.1.40', 'avijñātatattve arthe kāraṇopapattitaḥ tattvajñānārtham ūhaḥ tarkaḥ',
  ['avijñāta-tattve arthe|about a thing whose truth is not known','kāraṇa-upapattitaḥ|on the strength of causal considerations','tattva-jñāna-artham|for the sake of knowing the truth','ūhaḥ|supposition','tarkaḥ|is tarka'],
  'Tarka is a supposition, made on causal grounds about a thing whose truth is not yet known, in order to reach knowledge of the truth.')
s('1.1.41', 'vimṛśya pakṣapratipakṣābhyām arthāvadhāraṇaṃ nirṇayaḥ',
  ['vimṛśya|having considered','pakṣa-pratipakṣābhyām|with thesis and counter-thesis','artha-avadhāraṇam|settling the matter','nirṇayaḥ|is ascertainment'],
  'Having weighed it with thesis and counter-thesis, settling the matter is ascertainment.')
s('1.2.1', 'pramāṇatarkasādhanopālambhaḥ siddhāntāviruddhaḥ pañcāvayavopapannaḥ pakṣapratipakṣaparigrahaḥ vādaḥ',
  ['pramāṇa-tarka-sādhana-upālambhaḥ|proving and refuting by pramāṇa and tarka','siddhānta-aviruddhaḥ|not contradicting the tenet','pañca-avayava-upapannaḥ|furnished with the five members','pakṣa-pratipakṣa-parigrahaḥ|taking up a thesis and its counter-thesis','vādaḥ|is vāda, discussion'],
  'Vāda: proving and refuting by pramāṇa and tarka, within the accepted tenet, with the five members, taking a thesis and counter-thesis.')
s('1.2.2', 'yathoktopapannaḥ chalajātinigrahasthānasādhanopālambhaḥ jalpaḥ',
  ['yathā-ukta-upapannaḥ|having the features just stated','chala-jāti-nigrahasthāna|quibble, futile rejoinder, ground of defeat','sādhana-upālambhaḥ|used for proving and refuting','jalpaḥ|is jalpa'],
  'Jalpa has those same features but proves and refutes also by chala, jāti and nigrahasthāna.')
s('1.2.3', 'saḥ pratipakṣasthāpanāhīnaḥ vitaṇḍā',
  ['saḥ|that (jalpa)','pratipakṣa-sthāpanā-hīnaḥ|lacking the establishing of a counter-thesis','vitaṇḍā|is vitaṇḍā'],
  'That same, without establishing a counter-thesis of one’s own, is vitaṇḍā.')
s('1.2.4', 'savyabhicāraviruddhaprakaraṇasamasādhyasamakālātītāḥ hetvābhāsāḥ',
  ['savyabhicāra|deviating','viruddha|contradictory','prakaraṇasama|balancing the question','sādhyasama|as unproven as the sādhya','kālātītāḥ|out of time','hetvābhāsāḥ|are fallacious reasons'],
  'The deviating, contradictory, question-balancing, sādhya-equal and out-of-time reasons are the hetvābhāsas.')
s('1.2.5', 'anaikāntikaḥ savyabhicāraḥ',
  ['anaikāntikaḥ|not one-sided, inconclusive','savyabhicāraḥ|is the deviating reason'],
  'The inconclusive reason is the deviating one (savyabhicāra).')
s('1.2.6', 'siddhāntam abhyupetya tadvirodhī viruddhaḥ',
  ['siddhāntam|a tenet','abhyupetya|having accepted','tad-virodhī|contradicting it','viruddhaḥ|is the contradictory reason'],
  'A reason that contradicts the very tenet one has accepted is viruddha.')
s('1.2.7', 'yasmāt prakaraṇacintā saḥ nirṇayārtham apadiṣṭaḥ prakaraṇasamaḥ',
  ['yasmāt|from which','prakaraṇa-cintā|the question itself stays under consideration','saḥ|that','nirṇaya-artham|for the sake of settling','apadiṣṭaḥ|cited','prakaraṇasamaḥ|is prakaraṇasama'],
  'A reason cited to settle a question, from which the question itself remains live, is prakaraṇasama.')
s('1.2.8', 'sādhyāviśiṣṭaḥ sādhyatvāt sādhyasamaḥ',
  ['sādhya-aviśiṣṭaḥ|no different from the sādhya','sādhyatvāt|because it too needs establishing','sādhyasamaḥ|is sādhyasama'],
  'A reason no different from the sādhya, since it too needs to be established, is sādhyasama.')
s('1.2.9', 'kālātyayāpadiṣṭaḥ kālātītaḥ',
  ['kāla-atyaya-apadiṣṭaḥ|cited after the time has passed','kālātītaḥ|is kālātīta'],
  'A reason cited after its time has lapsed is kālātīta.')
s('1.2.10', 'vacanavighātaḥ arthavikalpopapattyā chalam',
  ['vacana-vighātaḥ|obstructing a statement','artha-vikalpa-upapattyā|by supposing a different meaning','chalam|is chala, quibble'],
  'Obstructing a statement by supposing a different meaning for it is chala.')
s('1.2.11', 'tat trividham vākchalaṃ sāmānyacchalam upacāracchalaṃ ca iti',
  ['tat|that','trividham|threefold','vāk-chalam|quibble on wording','sāmānya-chalam|quibble by over-generalising','upacāra-chalam|quibble on figurative use','ca iti|and so'],
  'It is threefold: quibble on wording, on generality, and on figurative use.')
s('1.2.12', 'aviśeṣābhihite arthe vaktuḥ abhiprāyāt arthāntarakalpanā vākchalam',
  ['aviśeṣa-abhihite arthe|when a word with several senses is used','vaktuḥ abhiprāyāt|apart from the speaker’s intention','artha-antara-kalpanā|imagining another meaning','vāk-chalam|is vākchala'],
  'When a word with more than one sense is used, imagining a meaning other than the speaker intended is vākchala.')
s('1.2.13', 'sambhavataḥ arthasya atisāmānyayogāt asambhūtārthakalpanā sāmānyacchalam',
  ['sambhavataḥ arthasya|of a thing that is possible','ati-sāmānya-yogāt|by stretching the generality too far','asambhūta-artha-kalpanā|imagining an impossible meaning','sāmānya-chalam|is sāmānyacchala'],
  'Taking a possible statement and stretching its generality to read an impossible meaning into it is sāmānyacchala.')
s('1.2.14', 'dharmavikalpanirdeśe arthasadbhāvapratiṣedhaḥ upacāracchalam',
  ['dharma-vikalpa-nirdeśe|when a word is used in a transferred sense','artha-sadbhāva-pratiṣedhaḥ|denying it by taking it literally','upacāra-chalam|is upacāracchala'],
  'When a word is used figuratively, denying the statement by insisting on the literal sense is upacāracchala.')
s('1.2.18', 'sādharmyavaidharmyābhyāṃ pratyavasthānaṃ jātiḥ',
  ['sādharmya-vaidharmyābhyām|by similarity or dissimilarity','pratyavasthānam|a counter-position','jātiḥ|is jāti'],
  'A counter-position taken merely on similarity or dissimilarity is jāti, a futile rejoinder.')
s('1.2.19', 'vipratipattiḥ apratipattiḥ ca nigrahasthānam',
  ['vipratipattiḥ|wrong understanding','apratipattiḥ|non-understanding','ca|and','nigrahasthānam|is a ground of defeat'],
  'Misunderstanding and non-understanding are grounds of defeat.')
s('2.1.8', 'pratyakṣādīnām aprāmāṇyaṃ traikālyāsiddheḥ',
  ['pratyakṣa-ādīnām|of perception and the rest','aprāmāṇyam|are not valid means (the objector says)','traikālya-asiddheḥ|because the three times cannot be made to work'],
  'Objector: perception and the rest are not valid means, because they fail in all three times: before, after or together with their objects.', 'pūrvapakṣa')
s('2.1.13', 'sarvapramāṇapratiṣedhāt ca pratiṣedhānupapattiḥ',
  ['sarva-pramāṇa-pratiṣedhāt|since it rejects every pramāṇa','ca|and','pratiṣedha-anupapattiḥ|the rejection itself cannot be established'],
  'Reply: by rejecting every pramāṇa, the objector’s own rejection is left with nothing to establish it.', 'siddhānta')
s('2.1.19', 'na pradīpaprakāśasiddhivat tatsiddheḥ',
  ['na|no','pradīpa-prakāśa-siddhi-vat|like the establishing of a lamp’s light','tat-siddheḥ|since that is established (in the same way)'],
  'No: it is established just as a lamp’s light is, which both shows other things and is itself known.', 'siddhānta')
s('3.1.1', 'darśanasparśanābhyām ekārthagrahaṇāt',
  ['darśana-sparśanābhyām|by seeing and by touching','eka-artha-grahaṇāt|since one and the same object is grasped'],
  'Since one and the same object is grasped by seeing and by touching (there is a single knower, the self, apart from the separate senses).', 'the argument')
s('3.1.2', 'na viṣayavyavasthānāt',
  ['na|not so (the objector says)','viṣaya-vyavasthānāt|because each sense has its own fixed domain'],
  'Objector: not so, because each sense has its own fixed domain.', 'objection')
s('3.1.3', 'tadvyavasthānāt eva ātmasadbhāvāt apratiṣedhaḥ',
  ['tad-vyavasthānāt eva|from that very fixing of domains','ātma-sadbhāvāt|because the self exists','apratiṣedhaḥ|there is no refutation'],
  'Reply: that very fixing of domains shows there is a self that brings them together, so the argument stands.', 'reply')
s('4.2.50', 'tattvādhyavasāyasaṃrakṣaṇārthaṃ jalpavitaṇḍe bījaprarohasaṃrakṣaṇārthaṃ kaṇṭakaśākhāvaraṇavat',
  ['tattva-adhyavasāya-saṃrakṣaṇa-artham|for guarding the ascertainment of truth','jalpa-vitaṇḍe|jalpa and vitaṇḍā','bīja-praroha-saṃrakṣaṇa-artham|for protecting the sprouting of seeds','kaṇṭaka-śākhā-āvaraṇa-vat|like a fence of thorny branches'],
  'Jalpa and vitaṇḍā are for guarding the ascertainment of truth, as a fence of thorny branches protects sprouting seeds.')
# (long lists: 5.1.1 and 5.2.1 are shown from the corpus directly in the scene, not word-glossed here)

out = {}
for k, v in S.items():
    assert k in CORPUS, k
    v['dev'] = to_dev(v['iast'])
    v['corpus'] = CORPUS[k]
    out[k] = v
json.dump(out, open('data/sutras.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# Full corpus for the in-app browser: id -> [iast, dev]
def clean(t): return re.sub(r'\s+', ' ', t).strip().rstrip('.')
full = {k: [clean(v), to_dev(clean(v).replace(' ', ' '))] for k, v in CORPUS.items()}
json.dump(full, open('data/corpus.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(out), 'curated sutras;', len(full), 'corpus sutras')
print(out['1.1.4']['dev']); print(out['1.1.1']['dev'][:80]); print(out['4.2.50']['dev'])
