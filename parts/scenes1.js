/* Scenes 1-6: Jijñāsu and Pramātā levels */
(function(){
const SC=window.SCENES, E=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- 1. Welcome: the map ---------- */
const AH=[
 ['1.1','Adhyāya 1 · āhnika 1','The syllabus and its definitions: the sixteen topics, from pramāṇa to nirṇaya.'],
 ['1.2','Adhyāya 1 · āhnika 2','Three kinds of discussion, the faulty reasons, quibbles, and the first words on futile rejoinders and defeat.'],
 ['2.1','Adhyāya 2 · āhnika 1','Doubt examined; the pramāṇas in general, and perception, inference, analogy and testimony put to the test.'],
 ['2.2','Adhyāya 2 · āhnika 2','Whether there are more pramāṇas, the long debate on the eternity of sound, and what a word refers to.'],
 ['3.1','Adhyāya 3 · āhnika 1','The self, the body, the senses and their objects.'],
 ['3.2','Adhyāya 3 · āhnika 2','Cognition: momentary or lasting; and the mind.'],
 ['4.1','Adhyāya 4 · āhnika 1','Activity and faults, rebirth, rival theories of causes, fruit, pain and release.'],
 ['4.2','Adhyāya 4 · āhnika 2','True knowledge: parts and wholes, atoms, the outer world, and how to protect the truth.'],
 ['5.1','Adhyāya 5 · āhnika 1','Jāti: the futile rejoinders (24 named).'],
 ['5.2','Adhyāya 5 · āhnika 2','Nigrahasthāna: the grounds of defeat (22 named).']];
SC.push({id:'s01',level:0,mood:'happy',title:'Welcome: the map of the Nyāya-sūtra',
html:`<p class="lead">The oldest surviving Nyāya text, attributed to Akṣapāda Gautama: five adhyāyas, each in two āhnikas. Dating is uncertain: estimates run from the 6th century BCE to the 2nd century CE (Wikipedia) or c. 200 CE (IEP). Tap each part of the map.</p>
<div class="amap" id="n1-map" role="group" aria-label="The ten āhnikas"></div>
<div class="cdet" id="n1-det" aria-live="polite"><p>Pick an āhnika to see what it covers.</p></div>
<p class="gnote">Sūtra counts come from the GRETIL e-text used here (unproofed, 533 sūtras). Editions count about 528 to 539.</p>`,
init(root,X){
  const map=X.$('#n1-map',root), det=X.$('#n1-det',root), seen=new Set(); const cnt={}; Object.keys(X.CORPUS).forEach(k=>{const a=k.split('.').slice(0,2).join('.');cnt[a]=(cnt[a]||0)+1;});
  AH.forEach(a=>{const b=document.createElement('button');b.className='atile';b.setAttribute('aria-pressed','false');b.innerHTML=`<b>${a[0]}</b><small>${cnt[a[0]]} sūtras</small>`;
    b.onclick=()=>{seen.add(a[0]);X.$$('.atile',root).forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');b.classList.add('seen');
      det.innerHTML=`<h4>${a[1]} · ${cnt[a[0]]} sūtras</h4><p>${E(a[2])}</p><button class="btn small" data-open="${a[0]}.1">Read these sūtras</button>`;
      X.$('[data-open]',det).onclick=e=>X.openBrowser(e.currentTarget.dataset.open);
      X.react(seen.size===10?'You hold the whole map. Now we walk it.':`${seen.size} of 10 parts seen.`,seen.size===10?'happy':'neutral');};
    map.appendChild(b);});
}});

/* ---------- 2. The chain to liberation ---------- */
SC.push({id:'s02',level:0,mood:'think',title:'Why logic? The chain to liberation',
html:`<p class="lead">Sūtras 1.1.1 and 1.1.2 give Nyāya its purpose. Each link below arises from the next one to its right. Which one do you break?</p>
<div class="chain" id="n2-chain" role="group" aria-label="Chain of causes"></div>
<p class="gcap" id="n2-msg" aria-live="polite">Tap a link to remove it.</p>
<div class="row2"><button class="btn small" id="n2-reset">Reset the chain</button></div>
<div id="n2-cards"></div>`,
init(root,X){
  const L=[['duḥkha','pain'],['janma','birth'],['pravṛtti','activity'],['doṣa','fault'],['mithyājñāna','false cognition']];
  const ch=X.$('#n2-chain',root), msg=X.$('#n2-msg',root);
  const draw=()=>{ch.innerHTML='';L.forEach((l,i)=>{const b=document.createElement('button');b.className='link';b.dataset.i=i;b.innerHTML=`<b>${l[0]}</b><small>${l[1]}</small>`;ch.appendChild(b);if(i<L.length-1){const a=document.createElement('span');a.className='arr';a.textContent='←';a.setAttribute('aria-hidden','true');ch.appendChild(a);}});
    const end=document.createElement('div');end.className='link end';end.id='n2-end';end.innerHTML='<b>apavarga</b><small>release</small>';ch.appendChild(end);
    X.$$('.link[data-i]',ch).forEach(b=>b.onclick=()=>hit(+b.dataset.i));};
  const hit=i=>{
    if(i<4){const b=X.$$('.link[data-i]',ch)[i];b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);msg.innerHTML=`<span class="bad">It grows back.</span> ${L[i][0]} arises from the link to its right, and that is still there. Go to the root.`;X.react('Cut at the root.','think');return;}
    msg.innerHTML='<span class="ok">The root is gone.</span> Fault loses its ground, then activity, then birth, then pain. This is the “uttarottara-apāya” of 1.1.2: each later member goes, and the one before it goes too.';X.react('Release follows.','happy');
    for(let k=4;k>=0;k--) setTimeout(()=>{const b=X.$$('.link[data-i]',ch)[k];b.classList.add('gone');},(4-k)*550);
    setTimeout(()=>X.$('#n2-end',root).classList.add('lit'),5*550);};
  draw(); X.$('#n2-reset',root).onclick=()=>{draw();msg.textContent='Tap a link to remove it.';};
  X.$('#n2-cards',root).innerHTML=X.sutraCard('1.1.1',{title:'The promise'})+X.sutraCard('1.1.2',{title:'The chain'});
}});

/* ---------- 3. The sixteen padārthas ---------- */
SC.push({id:'s03',level:0,mood:'neutral',title:'The sixteen padārthas',
html:`<p class="lead">Sūtra 1.1.1 is one compound word naming sixteen topics. Sort them into four families. These families are a study aid, not the sūtra’s own grouping.</p><div id="n3-sort"></div><div id="n3-card"></div>`,
init(root,X){
  const it=(l,s,b,why)=>({label:l,sub:s,b,why});
  X.sorter(X.$('#n3-sort',root),{buckets:[{id:'a',label:'Knowing',sub:'the means and the object'},{id:'b',label:'Opening an inquiry',sub:'what starts and frames it'},{id:'c',label:'Building and settling',sub:'argument and its test'},{id:'d',label:'The debate arena',sub:'kinds of debate, faults, tricks'}],
   items:[it('pramāṇa','means of knowing','a','Scene 6.'),it('prameya','object of knowing','a','Scene 8.'),it('saṃśaya','doubt','b','Scene 9.'),it('prayojana','purpose','b','Scene 9.'),it('dṛṣṭānta','example','b','Scene 9 and 10.'),it('siddhānta','established tenet','b','Scene 9.'),
    it('avayava','members of an argument','c','Scene 10.'),it('tarka','hypothetical reasoning','c','Scene 9.'),it('nirṇaya','ascertainment','c','Scene 9.'),
    it('vāda','discussion','d','Scene 12.'),it('jalpa','wrangling','d','Scene 12.'),it('vitaṇḍā','cavilling','d','Scene 12.'),it('hetvābhāsa','faulty reasons','d','Scene 13.'),it('chala','quibble','d','Scene 14.'),it('jāti','futile rejoinder','d','Scene 17.'),it('nigrahasthāna','ground of defeat','d','Scene 17.')],
   hint:'Tap a topic, then tap the family it belongs to. Each reply tells you which scene covers it.',right:'That is where it belongs.',
   onDone:()=>X.react('All sixteen placed. Now we study them in order.','happy')});
  X.$('#n3-card',root).innerHTML=X.sutraCard('1.1.1',{title:'The compound, word by word'});
}});

/* ---------- 3a. Method: name, define, examine (and no pratyāhāras) ---------- */
SC.push({id:'m1',level:0,mood:'neutral',title:'How the text is built: name, define, examine',
html:`<p class="lead">If you know Pāṇini, you know a text that compresses rules with codes: pratyāhāras such as “ac” and “hal” built from the Śiva-sūtras, and marker letters (anubandhas). The Nyāya-sūtra has <b>none of that</b>. It is written in plain, compact Sanskrit: long compound words and a few naming habits. What it has instead is a <b>method</b>.</p>
<div class="cdet"><h4>Three moves (uddeśa, lakṣaṇa, parīkṣā)</h4><p><b>Uddeśa</b>, naming: list the topic. <b>Lakṣaṇa</b>, defining: say what marks it. <b>Parīkṣā</b>, examining: test the definition against objections. Vātsyāyana’s commentary describes the whole śāstra this way. Adhyāya 1 mostly names and defines; adhyāyas 2 to 5 mostly examine.</p></div>
<div class="sec">Which move is each sūtra?</div><div id="m1-sort"></div>
<div class="sec">Reading tip: the defined word comes last</div>
<p>In a definition sūtra, everything before the last word describes it. In 1.1.4 the last word is <i>pratyakṣam</i>, “perception”. Try three.</p><div id="m1-quiz"></div><div id="m1-card"></div>`,
init(root,X){
  const it=(l,sub,b,why)=>({label:l,sub,b,why});
  X.sorter(X.$('#m1-sort',root),{buckets:[{id:'u',label:'uddeśa',sub:'naming'},{id:'l',label:'lakṣaṇa',sub:'defining'},{id:'p',label:'parīkṣā',sub:'examining'}],
   items:[it('1.1.3 pratyakṣānumānopamānaśabdāḥ pramāṇāni','names the four pramāṇas','u','It lists; the next sūtras define each.'),
          it('1.1.9 ātmaśarīra…apavargāḥ tu prameyam','names the twelve prameyas','u','A list again.'),
          it('1.1.4 indriyārtha… pratyakṣam','defines perception','l','It says what marks perception.'),
          it('1.1.7 āptopadeśaḥ śabdaḥ','defines testimony','l','Definition, with the defined word last.'),
          it('2.1.8 pratyakṣādīnām aprāmāṇyaṃ traikālyāsiddheḥ','objects to the pramāṇas','p','A test of the definitions.'),
          it('3.1.1 darśanasparśanābhyām ekārthagrahaṇāt','argues for the self','p','Examining the first prameya.')],
   hint:'Tap a sūtra, then its move.',onDone:()=>X.react('Name, define, examine.','happy')});
  X.quiz(X.$('#m1-quiz',root),[
   {q:'In 1.1.33, “sādhyanirdeśaḥ pratijñā”, which word is being defined?',o:['sādhya','nirdeśaḥ','pratijñā'],a:2,e:'The defined term comes last: pratijñā, the thesis.'},
   {q:'In 1.1.40, “avijñātatattve arthe … ūhaḥ tarkaḥ”, which word is defined?',o:['ūhaḥ','arthe','tarkaḥ'],a:2,e:'Tarka is the defined term, last in the sūtra.'},
   {q:'In 1.2.8, “sādhyāviśiṣṭaḥ sādhyatvāt sādhyasamaḥ”, which word is defined?',o:['sādhyatvāt','sādhyasamaḥ','sādhyāviśiṣṭaḥ'],a:1,e:'Sādhyasama, last: “a reason no different from the sādhya”.'}],
   (sc,n)=>X.react(sc===n?'You read definitions the way the text writes them.':'Look to the last word.',sc===n?'happy':'think'));
  X.$('#m1-card',root).innerHTML=X.sutraCard('1.1.4',{title:'A definition sūtra'});
}});

/* ---------- 3b. Reading the words: compounds, suffixes, roots, -sama ---------- */
const CMP=[
 ['indriyārthasannikarṣotpannam','tatpuruṣa: “born of the contact of sense and object”',[['indriya','sense'],['artha','object'],['sannikarṣa','contact'],['utpannam','born of']]],
 ['pratyakṣānumānopamānaśabdāḥ','dvandva: an “and” list of four',[['pratyakṣa','perception'],['anumāna','inference'],['upamāna','analogy'],['śabdāḥ','testimony']]],
 ['duḥkhajanmapravṛttidoṣamithyājñānānām','dvandva: an “and” list of five links',[['duḥkha','pain'],['janma','birth'],['pravṛtti','activity'],['doṣa','fault'],['mithyājñānānām','of false cognition']]],
 ['tattvajñānārtham','tatpuruṣa chain: “for the sake of knowledge of the truth”',[['tattva','truth'],['jñāna','knowledge'],['artham','for the sake of']]],
 ['pakṣapratipakṣābhyām','dvandva: “thesis and counter-thesis”',[['pakṣa','thesis'],['pratipakṣa','counter-thesis'],['ābhyām','by (dual)']]]];
const SAMA={'sādharmya':'similarity','vaidharmya':'dissimilarity','utkarṣa':'raising (adding a property)','apakarṣa':'lowering (removing a property)','varṇya':'what is to be described (the subject)','avarṇya':'what is not to be described (the example)','vikalpa':'alternative','sādhya':'what is to be proved','prāpti':'reaching','aprāpti':'not reaching','prasaṅga':'an undesired consequence','pratidṛṣṭānta':'a counter-example','anutpatti':'non-production','saṃśaya':'doubt','prakaraṇa':'the question under discussion','hetu':'reason','arthāpatti':'implication','aviśeṣa':'non-distinction','upapatti':'tenability','upalabdhi':'perception','anupalabdhi':'non-perception','nitya':'eternal','anitya':'non-eternal','kārya':'product, effect'};
SC.push({id:'m2',level:0,mood:'think',title:'Reading the words: compounds, suffixes and roots',
html:`<p class="lead">A Nyāya sūtra is built from compounds, from verbal roots (<b>dhātus</b>) and from suffixes. Every sūtra card in this guide shows each word’s meaning and its build, with the root marked <span class="rootlink" style="pointer-events:none">√</span>; tap one to open its dhātupāṭha entry.</p><div id="m2-tabs"></div>`,
init(root,X){
  X.tabs(X.$('#m2-tabs',root),['Compounds','Suffixes','Roots (dhātus)','The “-sama” names'],[
   p=>{ p.innerHTML=`<p>Sūtras string words together without spaces. Pick a compound and put its parts in order.</p><label>Compound <select id="m2-c">${CMP.map((c,i)=>`<option value="${i}">${c[0]}</option>`).join('')}</select></label><p class="gnote" id="m2-k"></p><div id="m2-o"></div><p class="gnote">Dvandva = “A and B and C”. Tatpuruṣa = “X of / for / from Y”.</p>`;
     const draw=()=>{const c=CMP[+X.$('#m2-c',p).value];X.$('#m2-k',p).textContent='Type: '+c[1];X.orderer(X.$('#m2-o',p),{slotLabel:c[0],items:c[2].map(x=>({label:x[0],sub:x[1]})),seed:+X.$('#m2-c',p).value+3,hint:'Tap the parts in the order they appear.',wrong:'Which part comes first in the word?',done:'That is the compound, part by part.',onDone:()=>X.react('Compound opened.','happy')});};
     X.$('#m2-c',p).onchange=draw;draw(); },
   p=>{ p.innerHTML=`<p>Two families of suffix do most of the work. <b>Kṛt</b> suffixes make nouns from roots (-ana, -ti, -ta). <b>Taddhita</b> suffixes are added to nouns (-vat, -tva, -ika). The negative prefix is <i>a-</i> or <i>an-</i>. Sort these words by the suffix doing the work.</p><div id="m2-s"></div>`;
     const it=(l,sub,b,why)=>({label:l,sub,b,why});
     X.sorter(X.$('#m2-s',p),{buckets:[{id:'vat',label:'-vat',sub:'“like / having”'},{id:'tva',label:'-tva',sub:'“-ness”'},{id:'ana',label:'-ana',sub:'act, means (lyuṭ)'},{id:'ti',label:'-ti',sub:'act, state (ktin)'},{id:'ta',label:'-ta',sub:'“done” (kta)'},{id:'neg',label:'a- / an-',sub:'“not”'}],
      items:[it('pūrvavat','like the earlier','vat','pūrva + vat.'),it('śeṣavat','with the remainder','vat','śeṣa + vat.'),it('sādhyatvāt','because it is sādhya','tva','sādhya + tva + abl.'),it('tattva','that-ness','tva','tad + tva.'),
             it('pramāṇa','means of measuring','ana','pra + √mā + ana.'),it('sādhana','means of accomplishing','ana','√sādh + ana.'),it('darśana','seeing','ana','√dṛś + ana.'),it('anumāna','measuring after','ana','Careful: the “an” is anu (“after”); the suffix is the -ana at the end.'),
             it('pravṛtti','activity','ti','pra + √vṛt + ti.'),it('upalabdhi','perceiving','ti','upa + √labh + ti.'),it('siddha','accomplished','ta','√sidh + ta.'),it('ukta','said','ta','√vac + ta.'),
             it('avyabhicāri','not erring','neg','a + vyabhicāri.'),it('apratipatti','non-understanding','neg','a + pratipatti.')],hint:'Tap a word, then its suffix family.',onDone:()=>X.react('Suffixes spotted.','happy')}); },
   p=>{ p.innerHTML=`<p>A <b>dhātu</b> is a verbal root, listed with a class (gaṇa) and a meaning in the <b>dhātupāṭha</b>. Roots in this text come from ${Object.keys(X.ROOTS).length} entries, each checked against that list. Tap a root.</p><div class="pgrid" id="m2-r"></div><div id="m2-rd"></div>`;
     Object.keys(X.ROOTS).sort((a,b)=>a.localeCompare(b,'sa')).forEach(k=>{const r=X.ROOTS[k],b=document.createElement('button');b.className='ptile';b.innerHTML=`<b>√${X.esc(r.iast)}</b><small>${X.esc(r.en)}</small>`;b.onclick=()=>{X.$$('.ptile',p).forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');X.$('#m2-rd',p).innerHTML=X.rootCard(k);};X.$('#m2-r',p).appendChild(b);}); },
   p=>{ p.innerHTML=`<p>The reasons that fail and the rejoinders in adhyāya 5 share a naming code: <b>X-sama</b>, “equal to X”. The name tells you what the move leans on. Pick one.</p><label>Name <select id="m2-n"><option value="prakaraṇa">prakaraṇa-sama</option><option value="sādhya">sādhya-sama</option>${Object.keys(SAMA).filter(k=>k!=='prakaraṇa'&&k!=='sādhya').map(k=>`<option value="${k}">${k}-sama</option>`).join('')}</select></label><div class="cdet" id="m2-nd" aria-live="polite"></div><p class="gnote">The sūtras themselves only list the names (1.2.4 and 5.1.1) and then define them one by one. The glosses of the first part are the plain meanings of the words.</p>`;
     const d=()=>{const k=X.$('#m2-n',p).value;X.$('#m2-nd',p).innerHTML=`<p><b>${k}-sama</b> = <b>${k}</b> (${X.esc(SAMA[k])}) + <b>sama</b> (“equal, on a par”).</p><p>A move named after what it leans on: ${X.esc(SAMA[k])}.</p>`;};X.$('#m2-n',p).onchange=d;d(); }]);
}});

/* ---------- 4. The four pramāṇas ---------- */
SC.push({id:'s04',level:1,mood:'think',title:'Four pramāṇas',
html:`<p class="lead">Sūtra 1.1.3 names four means of valid knowledge. Which one is at work in each case?</p><div id="n4-sort"></div><div id="n4-cards"></div>`,
init(root,X){
  const it=(l,b,why)=>({label:l,b,why});
  X.sorter(X.$('#n4-sort',root),{buckets:[{id:'pra',label:'pratyakṣa',sub:'perception'},{id:'anu',label:'anumāna',sub:'inference'},{id:'upa',label:'upamāna',sub:'analogy'},{id:'sab',label:'śabda',sub:'testimony'}],
   items:[it('You see a red apple on the table.','pra','Sense-contact with the object (1.1.4).'),
          it('You see smoke on a hill and conclude there is fire.','anu','Knowledge that follows perception, via a sign (1.1.5).'),
          it('Told “a gavaya is like a cow”, you later meet such an animal and know it is a gavaya.','upa','Establishing through similarity to something well known (1.1.6).'),
          it('A trusted physician tells you which herb treats a fever.','sab','Instruction of a reliable person (1.1.7).'),
          it('You hear a bell ring behind you.','pra','Ear in contact with sound.'),
          it('The river is swollen and muddy, so you conclude it rained upstream.','anu','Inference from effect to cause.'),
          it('Told “a lime is like a small lemon”, you spot one in the market and know it.','upa','Same pattern as the gavaya.'),
          it('A reliable guide says the bridge is closed, so you turn back.','sab','Testimony of a reliable person.')],
   onDone:()=>X.react('Four doors to knowledge. Keep the definitions close.','happy')});
  X.$('#n4-cards',root).innerHTML=X.sutraCard('1.1.3')+X.sutraCard('1.1.4',{title:'Perception, defined'})+`<details class="tbl"><summary>Analogy and testimony (1.1.6, 1.1.7)</summary>${X.sutraCard('1.1.6')}${X.sutraCard('1.1.7')}</details>`;
}});

/* ---------- 5. Three kinds of anumāna ---------- */
SC.push({id:'s05',level:1,mood:'think',title:'Three kinds of inference',
html:`<p class="lead">Sūtra 1.1.5 divides inference into three. The sūtra gives only the names; the examples below follow the commentarial tradition, and readings differ.</p><div id="n5-sort"></div><div id="n5-card"></div>`,
init(root,X){
  const it=(l,b,why)=>({label:l,b,why});
  X.sorter(X.$('#n5-sort',root),{buckets:[{id:'p',label:'pūrvavat',sub:'from a seen cause to an unseen effect'},{id:'s',label:'śeṣavat',sub:'from a seen effect to an unseen cause'},{id:'g',label:'sāmānyatodṛṣṭa',sub:'from general likeness, no direct cause-effect'}],
   items:[it('Dark, heavy clouds gather, so it will rain.','p','Cause seen (clouds), effect inferred (rain).'),
          it('A flame is held to dry straw, so the straw will burn.','p','Cause seen, effect inferred.'),
          it('The river is muddy and swollen, so it rained upstream.','s','Effect seen, cause inferred.'),
          it('Wet footprints lead in from the rain, so someone walked in.','s','Effect seen, cause inferred.'),
          it('We see the sun in different places at different times, so it moves.','g','Like a person seen elsewhere who must have moved: an inference from general observation.'),
          it('We see the moon in different positions over the night, so it moves.','g','Same pattern as the sun.')],
   onDone:()=>X.react('Three patterns. Notice the direction of the cause.','happy')});
  X.$('#n5-card',root).innerHTML=X.sutraCard('1.1.5')+`<p class="gnote">Other readings exist: the sūtra’s own sense of “pūrvavat” and “śeṣavat” was debated by the commentators. Treat these as a first map.</p>`;
}});

/* ---------- 6. The twelve prameyas ---------- */
const PRM=[['ātman','self','1.1.10','Marks of the self: desire, aversion, effort, pleasure, pain, cognition.'],
 ['śarīra','body','1.1.11','The seat of action, the senses and the objects.'],
 ['indriya','senses','1.1.12','Nose, tongue, eye, skin and ear, arising from the elements.'],
 ['artha','objects','1.1.14','Smell, taste, colour, touch and sound: the objects of those senses.'],
 ['buddhi','cognition','1.1.15','Buddhi, upalabdhi and jñāna: not different in meaning.'],
 ['manas','mind','1.1.16','Marked by the non-arising of simultaneous cognitions.'],
 ['pravṛtti','activity','1.1.17','The undertaking of speech, thought and body.'],
 ['doṣa','fault','1.1.18','Characterised by impelling (to activity).'],
 ['pretyabhāva','rebirth','1.1.19','Re-arising (punarutpatti).'],
 ['phala','fruit','1.1.20','The result produced by activity and fault.'],
 ['duḥkha','pain','1.1.21','Characterised by affliction.'],
 ['apavarga','release','1.1.22','Complete freedom from that (pain).']];
SC.push({id:'s06',level:1,mood:'neutral',title:'The twelve prameyas',
html:`<p class="lead">Sūtra 1.1.9 lists what is worth knowing. Tap each to read its defining sūtra, then take the five-question check.</p>
<div class="pgrid" id="n6-grid" role="group" aria-label="Twelve prameyas"></div><div class="cdet" id="n6-det" aria-live="polite"><p>Tap a prameya.</p></div><div id="n6-card"></div><div class="sec">Check yourself</div><div id="n6-quiz"></div>`,
init(root,X){
  const g=X.$('#n6-grid',root), det=X.$('#n6-det',root), seen=new Set();
  PRM.forEach(p=>{const b=document.createElement('button');b.className='ptile';b.setAttribute('aria-pressed','false');b.innerHTML=`<b>${p[0]}</b><small>${p[1]}</small>`;
    b.onclick=()=>{seen.add(p[0]);X.$$('.ptile',root).forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');b.classList.add('seen');
      det.innerHTML=`<h4>${p[0]} · ${p[1]} · NS ${p[2]}</h4><p class="iast">${E(X.CORPUS[p[2]][0])}</p><p>${E(p[3])}</p>`;X.react(seen.size===12?'All twelve seen. Try the check.':'',seen.size===12?'happy':'neutral');};
    g.appendChild(b);});
  X.$('#n6-card',root).innerHTML=X.sutraCard('1.1.9',{title:'The list'})+X.sutraCard('1.1.10',{title:'Marks of the self'})+X.sutraCard('1.1.16',{title:'The mark of the mind'});
  X.quiz(X.$('#n6-quiz',root),[
   {q:'“Complete freedom from that (pain)” defines…',o:['pretyabhāva','apavarga','phala','doṣa'],a:1,e:'1.1.22: tad-atyanta-vimokṣaḥ apavargaḥ.'},
   {q:'“Re-arising” (punarutpatti) defines…',o:['pretyabhāva','pravṛtti','janma-vāda','apavarga'],a:0,e:'1.1.19: punarutpattiḥ pretyabhāvaḥ.'},
   {q:'“Characterised by impelling” describes which prameya?',o:['duḥkha','phala','doṣa','buddhi'],a:2,e:'1.1.18: pravartanā-lakṣaṇāḥ doṣāḥ.'},
   {q:'“The seat of action, the senses and the objects” is…',o:['ātman','śarīra','manas','indriya'],a:1,e:'1.1.11: ceṣṭā-indriya-artha-āśrayaḥ śarīram.'},
   {q:'“Cognitions do not arise at once” is the mark of…',o:['the self','the senses','the mind','the body'],a:2,e:'1.1.16: yugapat-jñāna-anutpattiḥ manasaḥ liṅgam.'}],
   (s,n)=>X.react(s===n?'Perfect. The self is known by its marks.':'Review the tiles and try again.',s===n?'happy':'think'));
}});
})();
