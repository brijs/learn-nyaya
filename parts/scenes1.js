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
   items:[it('pramāṇa','means of knowing','a','Scene 4.'),it('prameya','object of knowing','a','Scene 6.'),it('saṃśaya','doubt','b','Scene 7.'),it('prayojana','purpose','b','Scene 7.'),it('dṛṣṭānta','example','b','Scene 7 and 8.'),it('siddhānta','established tenet','b','Scene 7.'),
    it('avayava','members of an argument','c','Scene 8.'),it('tarka','hypothetical reasoning','c','Scene 7.'),it('nirṇaya','ascertainment','c','Scene 7.'),
    it('vāda','discussion','d','Scene 10.'),it('jalpa','wrangling','d','Scene 10.'),it('vitaṇḍā','cavilling','d','Scene 10.'),it('hetvābhāsa','faulty reasons','d','Scene 11.'),it('chala','quibble','d','Scene 12.'),it('jāti','futile rejoinder','d','Scene 15.'),it('nigrahasthāna','ground of defeat','d','Scene 15.')],
   hint:'Tap a topic, then tap the family it belongs to. Each reply tells you which scene covers it.',right:'That is where it belongs.',
   onDone:()=>X.react('All sixteen placed. Now we study them in order.','happy')});
  X.$('#n3-card',root).innerHTML=X.sutraCard('1.1.1',{title:'The compound, word by word'});
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
