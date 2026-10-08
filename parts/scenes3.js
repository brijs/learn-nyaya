/* Scenes 14-17: Vādin and Naiyāyika levels */
(function(){
const SC=window.SCENES, E=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const tabs=(root,X,names,fns)=>X.tabs(root,names,fns);

/* ---------- 12. Chala ---------- */
SC.push({id:'s12',level:3,mood:'alert',title:'Sabhā II: chala, the quibble',
html:`<p class="lead">Sūtra 1.2.10: chala blocks a statement by supposing a different meaning. Sort each exchange; some objections are simply fair.</p><div id="n12-sort"></div><div id="n12-cards"></div>`,
init(root,X){
  const it=(l,b,why,hint)=>({label:l,b,why,hint});
  X.sorter(X.$('#n12-sort',root),{buckets:[{id:'v',label:'vākchala',sub:'plays on the wording'},{id:'s',label:'sāmānyacchala',sub:'over-stretches a general statement'},{id:'u',label:'upacāracchala',sub:'takes figurative speech literally'},{id:'f',label:'Fair objection',sub:'no chala'}],
   items:[it('“This boy has a new (nava) blanket.” — “Nine (nava) blankets? He has only one!”','v','The word has two senses; the quibbler picks the one the speaker did not intend (1.2.12).','Is the speaker’s meaning being twisted by a word with two senses?'),
          it('“Meet me at the bank.” — “Which riverbank? You told me yesterday you were going to the shop.”','v','A word with two senses, read against the speaker’s intention.','Look for a word with more than one sense.'),
          it('“A scholar can solve this puzzle.” — “So the scholar who died last year can too?”','s','A possible general statement stretched until it says something impossible (1.2.13).','Is a general claim being stretched past what was meant?'),
          it('“A student of this school can learn grammar.” — “Even a newborn enrolled today?”','s','Same stretch of generality.','Is a general claim being stretched past what was meant?'),
          it('“The platforms are shouting.” — “Platforms are wood. They cannot shout!”','u','Figurative use (the people on the platforms shout) is denied by insisting on the literal sense (1.2.14).','Is a figure of speech being taken literally?'),
          it('“The village is on the Ganges.” — “A village cannot stand in the river!”','u','The word “on” is used for “on the bank”; the literal reading is forced.','Is a figure of speech being taken literally?'),
          it('“All swans are white.” — “Here is a black swan.”','f','A counterexample to the claim as stated: a fair objection.','Does the objector attack what was actually said?'),
          it('“The hill has fire because of smoke.” — “Is that smoke or fog?”','f','A question about whether the reason is established: a fair objection.','Is the objector asking something about the actual argument?')],
   onDone:()=>X.react('A quibble moves the meaning, not the truth.','happy')});
  X.$('#n12-cards',root).innerHTML=X.sutraCard('1.2.10')+X.sutraCard('1.2.11')+`<details class="tbl"><summary>The three kinds (1.2.12 to 1.2.14)</summary>${['1.2.12','1.2.13','1.2.14'].map(i=>X.sutraCard(i)).join('')}</details><p class="gnote">The new/nine blanket pun and the “platforms shout” line are standard illustrations in the commentarial tradition (the sūtras themselves give only definitions). The other exchanges are ours.</p>`;
}});

/* ---------- 13. Adhyāya 2: the pramāṇas on trial ---------- */
SC.push({id:'s13',level:3,mood:'think',title:'Adhyāya 2: the pramāṇas on trial',
html:`<p class="lead">Nyāya states the objection against itself, then answers it. You take the side of the siddhānta (the defender). Which sūtras are objection and which are reply follows the traditional commentary; the e-text’s own labels differ in places.</p><div class="dlg" id="n13-dlg" aria-live="polite"></div><div id="n13-cards"></div>`,
init(root,X){
  const steps=[
   {obj:['Objector (pūrvapakṣa), NS 2.1.8 to 2.1.11','A pramāṇa makes its object known. Either it exists before the object, or after, or together with it. Before: it has nothing to establish. After: the object was known without it. Together: neither can establish the other. So the pramāṇas are not established.'],
    opts:[['“Then I give up: nothing can be known.”',0,'That surrenders too soon, and it would also give up your own argument.'],
          ['“By rejecting every pramāṇa you leave your own rejection with nothing to establish it.” (2.1.13)',1,'Yes: a denial of all pramāṇas cannot itself be established.'],
          ['“Pramāṇas do not need any defence.”',0,'Nyāya answers objections; it does not wave them away.']],card:'2.1.13'},
   {obj:['Objector again, NS 2.1.17','Suppose a pramāṇa is established by another pramāṇa. Then that one needs another, and so on without end.'],
    opts:[['“A pramāṇa is known as a lamp’s light is: it shows other things and is itself known.” (2.1.19)',1,'Yes: 2.1.19 compares the pramāṇa to a lamp’s light.'],
          ['“Yes, it goes on forever, so you win.”',0,'The siddhānta answers; it does not concede.'],
          ['“Only perception needs no proof.”',0,'That is not the reply the sūtra gives.']],card:'2.1.19'}];
  const dlg=X.$('#n13-dlg',root); let k=0;
  const show=()=>{const s=steps[k];dlg.insertAdjacentHTML('beforeend',`<div class="bubble a"><b>${E(s.obj[0])}</b><br>${E(s.obj[1])}</div><div class="opts" id="n13-o${k}">${s.opts.map((o,i)=>`<button class="opt" data-i="${i}">${E(o[0])}</button>`).join('')}</div>`);
    X.$$('#n13-o'+k+' .opt',dlg).forEach(b=>b.onclick=()=>{const o=s.opts[+b.dataset.i];
      if(o[1]){X.$$('#n13-o'+k+' .opt',dlg).forEach(x=>x.disabled=true);b.classList.add('right');dlg.insertAdjacentHTML('beforeend',`<div class="bubble b"><b>You (siddhānta)</b><br>${E(o[0])}<br><span class="ok">${E(o[2])}</span></div>`);X.react('Well answered.','happy');k++;if(k<steps.length)show();else dlg.insertAdjacentHTML('beforeend','<div class="cdet"><p><b>The pattern:</b> state the objection in full, answer it, and let the pramāṇas stand because denying them all is self-defeating and because a means of knowledge can be known in the course of knowing, like a lamp.</p></div>');}
      else{b.classList.add('wrong');b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400);X.react(o[2],'think');}});};
  show();
  X.$('#n13-cards',root).innerHTML=X.sutraCard('2.1.8')+X.sutraCard('2.1.13')+X.sutraCard('2.1.19');
}});

/* ---------- 14. Adhyāyas 3-4 ---------- */
SC.push({id:'s14',level:3,mood:'neutral',title:'Adhyāyas 3 and 4: the self, the mind, and the way out',
html:`<p class="lead">Three arguments from the middle of the text. Open each tab.</p><div id="n14-tabs"></div>`,
init(root,X){
  tabs(X.$('#n14-tabs',root),X,['The self (3.1)','The mind (1.1.16)','The way out (4.1 and 4.2)'],[
   p=>{ const sense=[['eye','sight','colour'],['skin','touch','hardness'],['ear','hearing','sound'],['nose','smell','fragrance'],['tongue','taste','flavour']];
     p.innerHTML=`<p>Sūtra 3.1.1: one and the same object is grasped by seeing and by touching. Each sense has its own domain. Tap a sense.</p><div class="senses" id="n14-s"></div><div class="cdet" id="n14-d" aria-live="polite"><p>A pot sits before you.</p></div><button class="btn primary" id="n14-who" disabled>Who knows “the pot I saw is the pot I touch”?</button><div class="selfc" id="n14-self" hidden><b>ātman</b><small>the single knower</small></div>${X.sutraCard('3.1.1')}${X.sutraCard('3.1.2')}${X.sutraCard('3.1.3')}`;
     const seen=new Set(), d=X.$('#n14-d',p), who=X.$('#n14-who',p);
     sense.forEach(s=>{const b=document.createElement('button');b.className='sensebtn';b.innerHTML=`<b>${s[0]}</b>`;b.onclick=()=>{seen.add(s[0]);b.classList.add('seen');d.innerHTML=`<p>The ${s[0]} grasps only ${s[2]}. It cannot grasp what the other senses grasp.</p>`;if(seen.has('eye')&&seen.has('skin'))who.disabled=false;};X.$('#n14-s',p).appendChild(b);});
     who.onclick=()=>{X.$('#n14-self',p).hidden=false;d.innerHTML='<p>The eye cannot touch and the skin cannot see. Yet you recognise one pot. So there is a single knower behind the senses: the self. The objector (3.1.2) says each sense has its own fixed domain; the reply (3.1.3) is that this very fixing of domains is why a unifying self is needed.</p>';X.react('One object, two senses, one knower.','happy');}; },
   p=>{ p.innerHTML=`<p>Sūtra 1.1.16: that cognitions do not arise at one time is the mark of the mind. Picture the mind as a gate that lets one thing through at a time.</p><div class="row2"><button class="btn primary" id="n14-go">Send sight and sound together</button></div><div class="gate" id="n14-gate" aria-live="polite"><div class="lane"><span class="sig" id="n14-sg">sight</span></div><div class="mnd">manas</div><div class="lane"><span class="sig" id="n14-sn">sound</span></div></div><p class="gcap" id="n14-m"></p><p class="gnote">This is a model of what the sūtra claims, not an experiment.</p>${X.sutraCard('1.1.16')}`;
     X.$('#n14-go',p).onclick=()=>{const a=X.$('#n14-sg',p),b=X.$('#n14-sn',p),m=X.$('#n14-m',p);a.className='sig go';b.className='sig wait';m.textContent='Sight reaches the mind first…';setTimeout(()=>{a.className='sig done';b.className='sig go';m.textContent='…and only then sound. Two cognitions, one after the other, though they feel together.';},1500);setTimeout(()=>{b.className='sig done';},3000);X.react('Quickly, but in sequence.','think');}; },
   p=>{ const R=[['4.1.3','Faults fall into three groups: desire, aversion and delusion.'],['4.1.10','Rebirth follows if the self is not perishing.'],['4.1.19','Is God the material cause? Rival views are examined.'],['4.1.22','Is everything accidental? Examined and answered.'],['4.1.37','Is everything void? Examined and answered.'],['4.1.44','The fruit of action.'],['4.1.55','Pain.'],['4.1.59','Release (apavarga).'],['4.2.4','Whole and parts.'],['4.2.18','Atoms.'],['4.2.26','The outer world, defended against denial.'],['4.2.50','Protecting the truth.']];
     p.innerHTML=`<p>Adhyāya 4 follows the chain of scene 2 to its end, and then asks how truth is kept safe. Tap a topic to open its sūtras. (Section titles are editorial headings in the e-text.)</p><div class="pgrid" id="n14-r"></div>${X.sutraCard('4.2.50',{title:'The thorn fence'})}<p class="gnote">That is why jalpa and vitaṇḍā, which look like pure combat, are justified: they guard the sprouting truth.</p>`;
     R.forEach(r=>{const b=document.createElement('button');b.className='ptile';b.innerHTML=`<b>NS ${r[0]}</b><small>${E(r[1])}</small>`;b.onclick=()=>X.openBrowser(r[0]);X.$('#n14-r',p).appendChild(b);}); }]);
}});

/* ---------- 15. Jāti and nigrahasthāna ---------- */
const JATI=['sādharmya-sama','vaidharmya-sama','utkarṣa-sama','apakarṣa-sama','varṇya-sama','avarṇya-sama','vikalpa-sama','sādhya-sama','prāpti-sama','aprāpti-sama','prasaṅga-sama','pratidṛṣṭānta-sama','anutpatti-sama','saṃśaya-sama','prakaraṇa-sama','ahetu-sama','arthāpatti-sama','aviśeṣa-sama','upapatti-sama','upalabdhi-sama','anupalabdhi-sama','nitya-sama','anitya-sama','kārya-sama'];
const NIG=[['pratijñāhāni','abandoning one’s own thesis'],['pratijñāntara','shifting to another thesis'],['pratijñāvirodha','thesis contradicts the reason'],['pratijñāsannyāsa','disowning the thesis'],['hetvantara','bringing in a different reason'],['arthāntara','wandering to an irrelevant matter'],['nirarthaka','meaningless sounds'],['avijñātārtha','unintelligible even to the audience'],['apārthaka','incoherent sequence of words'],['aprāptakāla','members stated in the wrong order'],['nyūna','lacking a member'],['adhika','having an extra member'],['punarukta','repetition'],['ananubhāṣaṇa','failing to restate the opponent’s words'],['ajñāna','not understanding the opponent'],['apratibhā','having no reply'],['vikṣepa','breaking off on a pretext'],['matānujñā','admitting the opponent’s point as one’s own'],['paryanuyojyopekṣaṇa','failing to notice a fault in oneself'],['niranuyojyānuyoga','faulting the faultless'],['apasiddhānta','contradicting one’s own tenet'],['hetvābhāsa','a faulty reason (scene 13)']];
SC.push({id:'s15',level:4,mood:'alert',title:'Sabhā III: jāti and nigrahasthāna',
html:`<p class="lead">Adhyāya 5: 5.1.1 lists the jātis, 5.2.1 the grounds of defeat. Names come from the sūtras; one-line glosses are paraphrased from the tradition.</p>
<div class="sec">24 jātis (5.1.1)</div><div class="chipwall" id="n15-j"></div>
<div class="cdet"><h4>What a jāti looks like</h4><p><b>Thesis:</b> sound is non-eternal, because it is produced, like a pot.</p><button class="btn small" id="n15-rj">Show the rejoinder</button><div id="n15-r" hidden><p><b>Rejoinder (sādharmya-sama, 5.1.2):</b> sound also resembles space in being formless, and space is eternal; so sound is eternal.</p><p><b>Why it is a jāti:</b> it rests on a bare similarity, with no pervasion (vyāpti) from “formless” to “eternal”. The defender asks for that pervasion and exposes the gap.</p></div></div>
<div class="sec">22 grounds of defeat (5.2.1): tap one</div><div class="chipwall" id="n15-n"></div><div class="cdet" id="n15-nd" aria-live="polite"><p>Tap a name.</p></div>
<div class="sec">Which ground of defeat is it?</div><div id="n15-sort"></div><div id="n15-cards"></div>`,
init(root,X){
  X.$('#n15-j',root).innerHTML=JATI.map((j,i)=>`<span class="cw">${i+1}. ${E(j)}</span>`).join('');
  X.$('#n15-rj',root).onclick=e=>{X.$('#n15-r',root).hidden=false;e.currentTarget.hidden=true;X.react('Similarity alone is not proof.','think');};
  const nw=X.$('#n15-n',root), nd=X.$('#n15-nd',root);
  NIG.forEach((n,i)=>{const b=document.createElement('button');b.className='cw btnlike';b.setAttribute('aria-pressed','false');b.textContent=`${i+1}. ${n[0]}`;b.onclick=()=>{X.$$('.cw',nw).forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');nd.innerHTML=`<p><b>${E(n[0])}</b>: ${E(n[1])}.</p>`;};nw.appendChild(b);});
  const it=(l,b,why)=>({label:l,b,why});
  X.sorter(X.$('#n15-sort',root),{buckets:[{id:'ph',label:'pratijñāhāni'},{id:'pa',label:'pratijñāntara'},{id:'ha',label:'hetvantara'},{id:'ar',label:'arthāntara'},{id:'pu',label:'punarukta'},{id:'ap',label:'apratibhā'}],
   items:[it('Told that the property also holds in his own example, the debater concedes it, and so gives up his thesis.','ph','5.2.2.'),
          it('Cornered, the debater quietly changes what he claims.','pa','5.2.3.'),
          it('Cornered, the debater offers a different reason in place of the first.','ha','5.2.6.'),
          it('Asked about the hill, the debater starts on the history of the kitchen.','ar','Irrelevant matter.'),
          it('The debater says the same thing again, word for word.','pu','Repetition.'),
          it('The debater has nothing to say in answer.','ap','No reply.')],
   hint:'Tap a losing move, then its name.',onDone:()=>X.react('Now you know how debates are lost.','happy')});
  X.$('#n15-cards',root).innerHTML=`<p class="sec">Sūtras</p>`+X.sutraCard('1.2.18')+X.sutraCard('1.2.19')+`<p class="gnote">5.1.2 (IAST): ${E(X.CORPUS['5.1.2'][0])}<br>5.2.2 (IAST): ${E(X.CORPUS['5.2.2'][0])}</p><button class="btn small" data-o="5.1.1">Read adhyāya 5 in the sūtra browser</button>`;
  X.$('[data-o]',root).onclick=e=>X.openBrowser(e.currentTarget.dataset.o);
}});

/* ---------- 16. Navya-Nyāya and comparisons ---------- */
SC.push({id:'s16',level:4,mood:'think',title:'Navya-Nyāya, and how it compares',
html:`<p class="lead">An orientation, not a course. Navya-Nyāya is a large technical literature; here are its place in time, a comparison, and one concept you can try.</p><div id="n16-tabs"></div>`,
init(root,X){
  tabs(X.$('#n16-tabs',root),X,['Timeline','Compare','Absence (abhāva)'],[
   p=>{ const T=[['Nyāya-sūtra','c. 200 CE (IEP); estimates range from the 6th c. BCE to the 2nd c. CE','Akṣapāda Gautama: the root text.'],['Vātsyāyana','c. 450 CE (IEP); 5th to 6th c. (Wikipedia)','Nyāya-bhāṣya, the earliest surviving commentary.'],['Uddyotakara','c. 600 CE','Nyāya-vārttika, a sub-commentary defending Nyāya.'],['Vācaspati Miśra','c. 900 CE','Tātparyaṭīkā, a sub-sub-commentary.'],['Udayana','c. 975 CE (10th c.)','Tātparya-pariśuddhi and Nyāya-kusumāñjali.'],['Gaṅgeśa','c. 1325 CE (IEP); 13th to 14th c.','Tattvacintāmaṇi: the start of Navya-Nyāya, the “new” school.']];
     p.innerHTML=`<div class="tl" id="n16-t"></div><div class="cdet" id="n16-td" aria-live="polite"><p>Tap a name.</p></div><p class="gnote">All dates are scholarly estimates, and sources differ. Do not read them as certain.</p>`;
     T.forEach((t,i)=>{const b=document.createElement('button');b.className='ptile';b.innerHTML=`<b>${E(t[0])}</b><small>${E(t[1].split(';')[0])}</small>`;b.onclick=()=>{X.$$('.ptile',p).forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');X.$('#n16-td',p).innerHTML=`<h4>${E(t[0])}</h4><p>${E(t[1])}</p><p>${E(t[2])}</p>`;};X.$('#n16-t',p).appendChild(b);}); },
   p=>{ p.innerHTML=`<div class="row2"><button class="btn small" id="n16-a" aria-pressed="false">Show the Aristotelian rewrite</button></div>
     <table class="wt arg"><tr><th>Nyāya (five members)</th><th id="n16-h2">Aristotelian syllogism</th></tr>
     <tr><td>1. Thesis: the hill has fire</td><td class="ar">(announced in the conclusion)</td></tr><tr><td>2. Reason: because of smoke</td><td class="ar">(the middle term)</td></tr><tr><td>3. Example: whatever has smoke has fire, as in the kitchen</td><td class="ar">Major premise: All smoky things are fiery. (no instance is cited)</td></tr><tr><td>4. Application: this hill is so</td><td class="ar">Minor premise: This hill is smoky.</td></tr><tr><td>5. Conclusion: therefore it has fire</td><td class="ar">Conclusion: So this hill is fiery.</td></tr></table>
     <ul class="cmpl"><li>Nyāya states the thesis first and cites a witnessing instance (dṛṣṭānta) inside the argument.</li><li>The reason is judged by where it sits relative to target and non-target: Dignāga’s three marks (scene 11).</li><li>Nyāya studies fallacies as defects of the reason (scene 13), where Aristotle’s fallacies are mostly of form and language.</li></ul><p class="gnote">This is a classroom comparison, not an equivalence: scholars stress that the systems differ in structure.</p>`;
     const ar=X.$$('.ar',p); ar.forEach(c=>c.style.visibility='hidden'); X.$('#n16-a',p).onclick=e=>{const on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',on);ar.forEach(c=>c.style.visibility=on?'visible':'hidden');e.currentTarget.textContent=on?'Hide the Aristotelian rewrite':'Show the Aristotelian rewrite';}; },
   p=>{ p.innerHTML=`<p>Navya-Nyāya gives absence (abhāva) careful structure: every absence has a <b>pratiyogin</b> (the thing that is absent) and an <b>anuyogin</b> (the locus where it is absent). Build one, then sort four kinds of absence.</p>
     <div class="row2"><label>Absent (pratiyogin) <select id="n16-x"><option>a pot</option><option>fire</option><option>a cloth</option></select></label><label>Locus (anuyogin) <select id="n16-y"><option>the floor</option><option>the lake</option><option>the room</option></select></label></div><div class="cdet" id="n16-ab" aria-live="polite"></div><div id="n16-so"></div>
     <p class="gnote">Scholars (Ingalls, Matilal and others) describe Navya-Nyāya as a formal system that works with cognitions more than propositions, rarely uses quantifiers, and has structures such as avacchedakatā (delimitation) that first-order logic does not reproduce directly. Read Ingalls’ <i>Materials for the Study of Navya-Nyāya Logic</i> and Matilal’s <i>The Navya-Nyāya Doctrine of Negation</i> for the real thing.</p>`;
     const draw=()=>{const x=X.$('#n16-x',p).value,y=X.$('#n16-y',p).value;X.$('#n16-ab',p).innerHTML=`<p>“There is no ${E(x.replace(/^an? /,''))} on ${E(y)}.”</p><p>An absence whose <b>pratiyogin</b> is <b>${E(x)}</b> and whose <b>anuyogin</b> is <b>${E(y)}</b>.</p>`;};
     X.$('#n16-x',p).onchange=X.$('#n16-y',p).onchange=draw;draw();
     const it=(l,b,why)=>({label:l,b,why});
     X.sorter(X.$('#n16-so',p),{buckets:[{id:'pr',label:'prāgabhāva',sub:'prior absence'},{id:'dh',label:'dhvaṃsābhāva',sub:'absence after destruction'},{id:'at',label:'atyantābhāva',sub:'absolute absence'},{id:'an',label:'anyonyābhāva',sub:'mutual absence (difference)'}],
      items:[it('The pot, before the potter has made it.','pr','It will exist later, so the absence has an end.'),it('The pot, after it is smashed.','dh','It had a beginning in the smashing.'),it('Fire in the water of a lake, at all times.','at','Never present there.'),it('A pot is not a cloth.','an','The difference between two things.')],
      hint:'Four classical kinds of absence.',onDone:()=>X.react('Four absences, each with its own logic.','happy')}); }]);
}});

/* ---------- 17. Free play + final quiz ---------- */
const WORLD=[['kitchen hearth',{smoke:1,fire:1,hot:1}],['forest fire on a hill',{smoke:1,fire:1,hot:1}],['incense stick',{smoke:1,fire:1,hot:1}],['red-hot iron ball',{fire:1,hot:1}],['oil lamp',{fire:1,hot:1}],['lake',{water:1}],['river',{water:1}],['hot spring',{water:1,hot:1}],['stone cave',{}],['ice block',{water:1}]];
const SHEET=`NYĀYA-SŪTRA CHEAT SHEET (our summary; check the sūtra numbers in the browser)
Shape: 5 adhyāyas × 2 āhnikas (533 sūtras in the GRETIL e-text; editions differ).
Goal (1.1.1-2): true knowledge of 16 topics → niḥśreyasa. Chain: duḥkha ← janma ← pravṛtti ← doṣa ← mithyājñāna.
16 padārthas: pramāṇa, prameya, saṃśaya, prayojana, dṛṣṭānta, siddhānta, avayava, tarka, nirṇaya, vāda, jalpa, vitaṇḍā, hetvābhāsa, chala, jāti, nigrahasthāna.
4 pramāṇas (1.1.3): pratyakṣa, anumāna, upamāna, śabda.
Pratyakṣa (1.1.4): sense-object contact, non-verbal, non-erring, determinate.
Anumāna (1.1.5): pūrvavat, śeṣavat, sāmānyatodṛṣṭa.
12 prameyas (1.1.9): ātman, śarīra, indriya, artha, buddhi, manas, pravṛtti, doṣa, pretyabhāva, phala, duḥkha, apavarga.
5 avayavas (1.1.32): pratijñā, hetu, udāharaṇa, upanaya, nigamana. Example by similarity (1.1.34) or dissimilarity (1.1.35).
Good reason: in the locus, pervaded by the target (vyāpti), not contradicted.
3 kathās (1.2.1-3): vāda (truth, five members), jalpa (adds chala/jāti/nigrahasthāna), vitaṇḍā (no own thesis).
5 hetvābhāsas (1.2.4): savyabhicāra, viruddha, prakaraṇasama, sādhyasama, kālātīta. Later: savyabhicāra, viruddha, satpratipakṣa, asiddha, bādhita.
3 chalas (1.2.11): vākchala, sāmānyacchala, upacāracchala.
Adhyāya 2: pramāṇas defended (2.1.13: denying all pramāṇas is self-defeating; 2.1.19: like a lamp).
Adhyāya 3: the self (3.1.1: one object seen and touched), cognition, mind (1.1.16).
Adhyāya 4: faults, rebirth, rival theories, pain, release; 4.2.50: jalpa and vitaṇḍā guard truth like a thorn fence round seedlings.
Adhyāya 5: 24 jātis (5.1.1), 22 nigrahasthānas (5.2.1).
Navya-Nyāya: from Gaṅgeśa (c. 13th-14th c.); abhāva: pratiyogin and anuyogin; 4 kinds of absence.`;
SC.push({id:'s17',level:4,mood:'happy',title:'Free play and final quiz',
html:`<p class="lead">Build your own inference, then take the quiz. Pass with 8 of 10 to be named Naiyāyika and unlock the cheat sheet.</p><div id="n17-tabs"></div>`,
init(root,X){
  tabs(X.$('#n17-tabs',root),X,['Workbench','Final quiz','Cheat sheet'],[
   p=>{ const props=['smoke','fire','hot','water'];
     p.innerHTML=`<p>Choose a locus (pakṣa), a reason (hetu) and a target (sādhya). The workbench checks the reason against a small world (scene 11). It is a toy: it knows the world’s facts exactly.</p><div class="row2"><label>Locus <select id="n17-k"></select></label><label>Reason <select id="n17-h"></select></label><label>Target <select id="n17-p"></select></label></div><div class="cdet" id="n17-v" aria-live="polite"></div><table class="wt arg" id="n17-t"></table>`;
     const k=X.$('#n17-k',p),h=X.$('#n17-h',p),t=X.$('#n17-p',p); WORLD.forEach((w,i)=>k.add(new Option(w[0],i))); props.forEach(q=>{h.add(new Option(q,q));t.add(new Option(q,q));}); h.value='smoke';t.value='fire';k.value=1;
     const run=()=>{const loc=WORLD[+k.value], H=h.value,P=t.value; const hp=WORLD.filter(w=>w[1][H]&&w[1][P]), hn=WORLD.filter(w=>w[1][H]&&!w[1][P]), nn=WORLD.filter(w=>!w[1][H]&&!w[1][P]); let verdict,cls='bad',name='';
       if(H===P){verdict='Choose two different properties.';name='';}
       else if(!loc[1][H]){name='the reason is not established in the locus (the sūtra’s sādhyasama kind; later asiddha)';verdict=`The ${loc[0]} does not have ${H}.`;}
       else if(!loc[1][P]){name='kālātīta (later bādhita)';verdict=`The ${loc[0]} plainly lacks ${P}: the target is contradicted already.`;}
       else if(hn.length&&!hp.length){name='viruddha';verdict=`Every ${H} place here lacks ${P}: the reason proves the opposite.`;}
       else if(hn.length){name='savyabhicāra';verdict=`${H} also occurs without ${P}: ${hn.map(w=>w[0]).join(', ')}.`;}
       else{cls='ok';name='sound';verdict=`In this world every ${H} place has ${P}. The inference stands.`;}
       X.$('#n17-v',p).innerHTML=`<h4 class="${cls}">${name?E(name[0].toUpperCase()+name.slice(1)):'Check your choices'}</h4><p>${E(verdict)}</p>`;
       X.$('#n17-t',p).innerHTML=(cls==='ok')?`<tr><th>Member</th><th>Statement</th></tr><tr><td>pratijñā</td><td>The ${E(loc[0])} has ${P}.</td></tr><tr><td>hetu</td><td>Because it has ${H}.</td></tr><tr><td>udāharaṇa</td><td>Whatever has ${H} has ${P}, as the ${E(hp[0][0])}; what lacks ${P} lacks ${H}, as the ${E(nn[0]?nn[0][0]:'—')}.</td></tr><tr><td>upanaya</td><td>This ${E(loc[0])} has ${H}.</td></tr><tr><td>nigamana</td><td>Therefore it has ${P}.</td></tr>`:'';
       if(cls==='ok')X.react('A sound inference, in five members.','happy'); };
     [k,h,t].forEach(s=>s.onchange=run); run(); },
   p=>{ p.innerHTML='<div id="n17-qz"></div><div class="cdet" id="n17-res" hidden></div>';
     const Q=[
      {q:'How many pramāṇas does sūtra 1.1.3 name?',o:['Three','Four','Five','Sixteen'],a:1,e:'Pratyakṣa, anumāna, upamāna, śabda.'},
      {q:'Pūrvavat inference moves…',o:['from a seen cause to an unseen effect','from a seen effect to an unseen cause','from a word to its meaning','from doubt to certainty'],a:0,e:'Clouds to rain is the classic illustration.'},
      {q:'In the five-member argument, which member comes first?',o:['Hetu','Udāharaṇa','Pratijñā','Nigamana'],a:2,e:'The thesis is stated first (1.1.33), then the reason.'},
      {q:'In the lab, “fire, therefore smoke” failed because of…',o:['the lake','the red-hot iron ball','the kitchen hearth','the cave'],a:1,e:'Fire without smoke: a counterexample breaks the pervasion.'},
      {q:'A reason that proves the opposite of the target is…',o:['savyabhicāra','viruddha','kālātīta','prakaraṇasama'],a:1,e:'Viruddha (1.2.6).'},
      {q:'Which kind of discussion states no thesis of its own?',o:['Vāda','Jalpa','Vitaṇḍā','Nirṇaya'],a:2,e:'1.2.3: vitaṇḍā lacks the establishing of a counter-thesis.'},
      {q:'Reading “new blanket” as “nine blankets” to trap the speaker is…',o:['vākchala','sāmānyacchala','upacāracchala','a fair objection'],a:0,e:'A word with two senses read against the speaker’s intention (1.2.12).'},
      {q:'According to 4.2.50, jalpa and vitaṇḍā are like…',o:['a lamp','a thorn fence round seedlings','a bridge','a scale'],a:1,e:'They guard the ascertainment of truth.'},
      {q:'How many nigrahasthānas does 5.2.1 name?',o:['16','22','24','12'],a:1,e:'Twenty-two (jātis number twenty-four).'},
      {q:'In the smoke-and-fire inference, smoke is pervaded by…',o:['water','fire','the hill','nothing'],a:1,e:'Wherever there is smoke there is fire (vyāpti).'}];
     X.quiz(X.$('#n17-qz',p),Q,(s,n)=>{const r=X.$('#n17-res',p);r.hidden=false;
       if(s>=8){X.quizPassed();r.innerHTML=`<h4 class="ok">${s}/${n}: you are a Naiyāyika.</h4><p>The cheat sheet is unlocked.</p>`;X.toast('Rank: Naiyāyika');X.react('Well reasoned. The sūtras are yours to keep studying.','happy');X.S.unlocked=true;const cb=X.$('#n17-cs',root);if(cb)cb.disabled=false;}
       else{r.innerHTML=`<h4 class="bad">${s}/${n}: eight are needed.</h4><p>Revisit the scenes and try again.</p><button class="btn small" id="n17-retry">Retry</button>`;X.$('#n17-retry',p).onclick=()=>{p.dataset.ready='';p.innerHTML='';p.dataset.ready=1;X.$$('[role=tab]',root)[1].click();};} }); },
   p=>{ p.innerHTML=`<p class="gnote" id="n17-lock">Pass the quiz to unlock.</p><pre class="sheet" id="n17-sheet" tabindex="0"></pre><button class="btn primary" id="n17-cs" disabled>Copy the cheat sheet</button>`;
     const open=()=>{X.$('#n17-sheet',p).textContent=X.S.unlocked?SHEET:'(locked)';X.$('#n17-lock',p).hidden=!!X.S.unlocked;X.$('#n17-cs',p).disabled=!X.S.unlocked;};open();
     X.$('#n17-cs',p).onclick=()=>{try{navigator.clipboard.writeText(SHEET);X.react('Copied.','happy');}catch(e){X.react('Select the text and copy it.','neutral');}};
     X.$$('[role=tab]',root)[2].addEventListener('click',open); }]);
}});
})();
