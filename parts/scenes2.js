/* Scenes 9-11: Tārkika and Vādin levels (the Logic lab and the first Sabhā scenes) */
(function(){
const SC=window.SCENES, E=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- 7. How an inquiry unfolds ---------- */
SC.push({id:'s07',level:2,mood:'think',title:'How an inquiry unfolds',
html:`<p class="lead">Sūtras 1.1.23 to 1.1.41 define the stages. Put them in order on the old puzzle: something tall stands by the road at dusk.</p>
<div id="n7-ord"></div><div class="sec">What causes the doubt?</div><div id="n7-sort"></div><div id="n7-cards"></div>`,
init(root,X){
  X.orderer(X.$('#n7-ord',root),{slotLabel:'The inquiry, in order',hint:'Tap the stages in the order they occur.',wrong:'Think about what has to be in place first.',seed:11,
    done:'This is the path from doubt to ascertainment.',
    items:[{label:'saṃśaya',sub:'doubt',say:'A tall shape at dusk: post or person? Nothing you can see tells them apart.'},
           {label:'prayojana',sub:'purpose',say:'You want to know, because you are deciding whether to ask it for directions.'},
           {label:'dṛṣṭānta, siddhānta',sub:'shared ground',say:'Both of you accept that posts stay still and people can move.'},
           {label:'avayava',sub:'the argument',say:'“It is a person: it moved, and a post does not move.”'},
           {label:'tarka',sub:'reductio',say:'“Suppose it were a post. Then it could not have moved. But it moved, so that supposition is absurd.”'},
           {label:'nirṇaya',sub:'ascertainment',say:'Settled: a person.'}],
    onDone:()=>X.react('Doubt settled by weighing both sides.','happy')});
  const it=(l,b,why)=>({label:l,b,why});
  X.sorter(X.$('#n7-sort',root),{buckets:[{id:'a',label:'A common property',sub:'samāna-dharma'},{id:'b',label:'Conflicting opinions',sub:'vipratipatti'},{id:'c',label:'Irregular perception',sub:'upalabdhy-avyavasthā'},{id:'d',label:'Irregular non-perception',sub:'anupalabdhy-avyavasthā'}],
   items:[it('A tall dark shape at dusk: post or person?','a','Both share the shape; nothing yet separates them.'),
          it('Two physicians give opposite advice.','b','Conflicting opinions leave you in doubt.'),
          it('Shimmering “water” on the road: sometimes real, sometimes a mirage.','c','Perceiving something is sometimes reliable, sometimes not.'),
          it('You cannot find your keys: absent, or merely hidden?','d','Not perceiving happens in both cases.')],
   hint:'Sūtra 1.1.23 gives five sources of doubt; this exercise uses four. The fifth is an uncommon property (aneka-dharma).'});
  X.$('#n7-cards',root).innerHTML=X.sutraCard('1.1.23',{title:'Doubt'})+`<details class="tbl"><summary>Tarka and ascertainment (1.1.40, 1.1.41)</summary>${X.sutraCard('1.1.40')}${X.sutraCard('1.1.41')}</details>`;
}});

/* ---------- 8. The five limbs ---------- */
SC.push({id:'s08',level:2,mood:'happy',title:'Logic lab I: the five limbs',
html:`<p class="lead">Sūtra 1.1.32 names five members. Arrange them, then flip the example from positive to negative (1.1.34 to 1.1.38).</p>
<div id="n8-ord"></div><div class="sec">The argument in full</div>
<div class="row2"><button class="btn small" id="n8-pos" aria-pressed="true">Positive example (sādharmya)</button><button class="btn small" id="n8-neg" aria-pressed="false">Negative example (vaidharmya)</button></div>
<table class="wt arg" id="n8-tab"></table><p class="gnote">Textbook forms of the example and the application vary between authors; this is the classic hill-and-smoke version.</p><div id="n8-cards"></div>`,
init(root,X){
  X.orderer(X.$('#n8-ord',root),{slotLabel:'The five members',hint:'Tap the members in order.',seed:3,wrong:'Which member comes before this one?',
   items:[{label:'pratijñā',sub:'thesis',say:'parvato vahnimān: the hill has fire.'},{label:'hetu',sub:'reason',say:'dhūmāt: because it has smoke.'},{label:'udāharaṇa',sub:'example',say:'wherever there is smoke, there is fire, as in a kitchen.'},{label:'upanaya',sub:'application',say:'and this hill is so (smoky).'},{label:'nigamana',sub:'conclusion',say:'therefore it has fire.'}],
   onDone:()=>X.react('Five members, one argument.','happy')});
  const tab=X.$('#n8-tab',root); let neg=false;
  const draw=()=>{const R=[['pratijñā','parvato vahnimān','The hill has fire.'],['hetu','dhūmāt','Because it has smoke.'],
    neg?['udāharaṇa','yatra vahnir nāsti tatra dhūmo nāsti, yathā hradaḥ','Where there is no fire there is no smoke, as in a lake.']:['udāharaṇa','yo yo dhūmavān sa sa vahnimān, yathā mahānasaḥ','Whatever has smoke has fire, as the kitchen hearth.'],
    neg?['upanaya','na tathā cāyam','And this hill is not like that (the lake).']:['upanaya','tathā cāyam','And this hill is so (smoky).'],['nigamana','tasmād vahnimān','Therefore it has fire.']];
    tab.innerHTML=`<tr><th>Member</th><th>Sanskrit</th><th>English</th></tr>`+R.map((r,i)=>`<tr class="${(i===2||i===3)?'chg':''}"><td><b>${r[0]}</b></td><td class="iast">${E(r[1])}</td><td>${E(r[2])}</td></tr>`).join('');};
  draw();
  const set=n=>{neg=n;X.$('#n8-pos',root).setAttribute('aria-pressed',!n);X.$('#n8-neg',root).setAttribute('aria-pressed',n);draw();X.react(n?'The same hill, argued from difference: the lake lacks both smoke and fire.':'Argued from similarity: the kitchen has both.','think');};
  X.$('#n8-pos',root).onclick=()=>set(false); X.$('#n8-neg',root).onclick=()=>set(true);
  X.$('#n8-cards',root).innerHTML=X.sutraCard('1.1.32',{title:'The five members'})+`<details class="tbl"><summary>Each member defined (1.1.33 to 1.1.39)</summary>${['1.1.33','1.1.34','1.1.35','1.1.36','1.1.37','1.1.38','1.1.39'].map(i=>X.sutraCard(i)).join('')}</details>`;
}});

/* ---------- 9. Vyāpti lab ---------- */
const WORLD=[['kitchen hearth',{smoke:1,fire:1,hot:1}],['forest fire on a hill',{smoke:1,fire:1,hot:1}],['incense stick',{smoke:1,fire:1,hot:1}],['red-hot iron ball',{fire:1,hot:1}],['oil lamp',{fire:1,hot:1}],['lake',{water:1}],['river',{water:1}],['hot spring',{water:1,hot:1}],['stone cave',{}],['ice block',{water:1}]];
SC.push({id:'s09',level:2,mood:'think',title:'Logic lab II: vyāpti as containment',
html:`<p class="lead">An inference works when the reason is <b>pervaded</b> by the target: every place with the reason has the target. Choose both, and look for a counterexample.</p>
<div class="row2"><label>Reason (hetu) <select id="n9-h" aria-label="Reason"></select></label><label>Target (sādhya) <select id="n9-p" aria-label="Target"></select></label><button class="btn small" id="n9-add">Add a hypothetical counterexample</button><button class="btn small" id="n9-reset">Reset world</button></div>
<div class="world" id="n9-world" aria-live="polite"></div><div class="legend"><span class="k both"></span>reason and target <span class="k counter"></span>reason without target (counterexample) <span class="k neg"></span>neither <span class="k extra"></span>target without reason</div>
<div class="cdet" id="n9-ver" aria-live="polite"></div>
<div class="sec">Three marks of a good reason (Dignāga’s trairūpya)</div>
<div class="row2"><label><input type="checkbox" id="n9-pk" checked> The hill has the reason</label></div><ol class="tri" id="n9-tri"></ol>
<p class="gnote">Ten places never prove a universal rule. Nyāya adds tarka (1.1.40): if there could be smoke without fire, the smoke would be without a cause, which is absurd. Dignāga, a Buddhist logician of around the 5th to 6th century CE, framed the three marks above.</p>`,
init(root,X){
  const props=['smoke','fire','hot','water']; let world=WORLD.map(w=>({n:w[0],p:w[1]})); let added=false;
  const hs=X.$('#n9-h',root), ps=X.$('#n9-p',root);
  props.forEach(p=>{hs.add(new Option(p,p));ps.add(new Option(p,p));}); hs.value='smoke'; ps.value='fire';
  const redraw=()=>{
    const H=hs.value,P=ps.value, W=X.$('#n9-world',root); let both=[],counter=[],neg=[],extra=[];
    W.innerHTML=world.map(o=>{const h=!!o.p[H],p=!!o.p[P];const c=h&&p?'both':h?'counter':p?'extra':'neg';(({both,counter,neg,extra})[c]).push(o.n);return `<div class="obj ${c}"><b>${E(o.n)}</b><small>${Object.keys(o.p).join(', ')||'nothing'}</small></div>`;}).join('');
    const v=X.$('#n9-ver',root);
    if(H===P) v.innerHTML='<p>Reason and target are the same property. Choose two different ones.</p>';
    else if(!both.length&&!counter.length) v.innerHTML=`<p class="bad">No place in this world has ${H}. There is nothing to test the reason on.</p>`;
    else if(counter.length) v.innerHTML=`<h4 class="bad">${H} is not pervaded by ${P}</h4><p>Counterexample${counter.length>1?'s':''}: <b>${counter.map(E).join(', ')}</b> — has ${H} but not ${P}. One is enough to break the pervasion.</p>`;
    else v.innerHTML=`<h4 class="ok">In this world, every ${H} place has ${P}</h4><p>Positive example (sādharmya): <b>${E(both[0])}</b>. Negative example (vaidharmya, lacks both): <b>${neg.length?E(neg[0]):'none yet'}</b>.</p>`;
    const pk=X.$('#n9-pk',root).checked, t3=[[`The hill has ${H} (pakṣa-dharmatā)`,pk],[`${H} is found where ${P} is found (sapakṣa)`,both.length>0],[`${H} is absent wherever ${P} is absent (all vipakṣa)`,counter.length===0]];
    X.$('#n9-tri',root).innerHTML=t3.map(x=>`<li class="${x[1]?'ok':'bad'}">${x[1]?'✓':'✗'} ${E(x[0])}</li>`).join('')+`<li class="verdict">${t3.every(x=>x[1])&&H!==P?`<span class="ok">All three hold: conclude the hill has ${P}.</span>`:'<span class="bad">No safe conclusion.</span>'}</li>`;
    if(H!==P&&!counter.length&&both.length&&pk)X.react('Pervaded, and present on the hill: the inference stands.','happy'); else if(counter.length)X.react('A counterexample. The rule does not hold.','alert');
  };
  hs.onchange=ps.onchange=X.$('#n9-pk',root).onchange=redraw;
  X.$('#n9-add',root).onclick=()=>{if(!added){world.push({n:'a smoky place with no fire (hypothetical)',p:{smoke:1}});added=true;}redraw();};
  X.$('#n9-reset',root).onclick=()=>{world=WORLD.map(w=>({n:w[0],p:w[1]}));added=false;hs.value='smoke';ps.value='fire';redraw();};
  redraw();
}});

/* ---------- 10. Three kinds of discussion ---------- */
SC.push({id:'s10',level:3,mood:'neutral',title:'Sabhā I: vāda, jalpa, vitaṇḍā',
html:`<p class="lead">Sūtras 1.2.1 to 1.2.3 define three kinds of debate. Which one is each move?</p><div id="n10-sort"></div>
<table class="wt cmp"><tr><th></th><th>vāda</th><th>jalpa</th><th>vitaṇḍā</th></tr><tr><td>States its own thesis</td><td>yes</td><td>yes</td><td>no</td></tr><tr><td>Proof and tarka, five members, within the tenet</td><td>yes</td><td>yes</td><td>attack only</td></tr><tr><td>Chala, jāti, nigrahasthāna as tools</td><td>not among its tools</td><td>yes</td><td>yes</td></tr></table><p class="gnote">Read from 1.2.1 to 1.2.3. Later authors add what each is for; the tradition says jalpa and vitaṇḍā guard the truth (4.2.50, scene 16).</p><div id="n10-cards"></div>`,
init(root,X){
  const it=(l,b,why)=>({label:l,b,why});
  X.sorter(X.$('#n10-sort',root),{buckets:[{id:'v',label:'vāda',sub:'discussion'},{id:'j',label:'jalpa',sub:'wrangling'},{id:'t',label:'vitaṇḍā',sub:'cavilling'}],
   items:[it('Two seekers examine a doubt together, with proof and tarka, within the accepted tenet.','v','1.2.1.'),
          it('A debater wins a point by catching the opponent in a quibble about wording.','j','Chala is a tool of jalpa (1.2.2).'),
          it('A debater only attacks, and never states a thesis of their own.','t','1.2.3: jalpa without establishing a counter-thesis.'),
          it('Each side states a thesis and builds a five-membered argument to find the truth.','v','1.2.1: pañcāvayava, pakṣa and pratipakṣa.'),
          it('A debater uses a futile rejoinder to unsettle the opponent, while also defending their own thesis.','j','Jāti is a tool of jalpa, with a thesis of one’s own.'),
          it('A heckler says: “I claim nothing. I only say you are wrong.”','t','No counter-thesis: vitaṇḍā.')],
   onDone:()=>X.react('Truth-seeking, victory-seeking, and mere objecting.','happy')});
  X.$('#n10-cards',root).innerHTML=['1.2.1','1.2.2','1.2.3'].map(i=>X.sutraCard(i)).join('');
}});

/* ---------- 11. Hetvābhāsa lab ---------- */
SC.push({id:'s11',level:3,mood:'alert',title:'Logic lab III: five bad reasons',
html:`<p class="lead">Sūtra 1.2.4 lists five defective reasons. The examples are standard or illustrative; read the reason, name its defect, or call it sound.</p><div id="n11-sort"></div>
<table class="wt cmp"><caption>The sūtra’s five, and the later textbook name usually paired with each</caption><tr><th>1.2.4</th><th>Defect</th><th>Later name</th></tr>
<tr><td>savyabhicāra</td><td>deviates: the reason also occurs where the target does not</td><td>savyabhicāra / anaikāntika</td></tr><tr><td>viruddha</td><td>proves the opposite of the target</td><td>viruddha</td></tr><tr><td>prakaraṇasama</td><td>keeps the question itself alive</td><td>satpratipakṣa</td></tr><tr><td>sādhyasama</td><td>needs proof as much as the target does</td><td>asiddha</td></tr><tr><td>kālātīta</td><td>comes too late: the target is already contradicted</td><td>bādhita</td></tr></table>
<p class="gnote">The pairing is the traditional one; how exactly the sūtra’s kālātīta and prakaraṇasama map to the later scheme is debated.</p><div id="n11-cards"></div>`,
init(root,X){
  const it=(l,b,why,hint)=>({label:l,b,why,hint});
  X.sorter(X.$('#n11-sort',root),{buckets:[{id:'sv',label:'savyabhicāra',sub:'deviating'},{id:'vi',label:'viruddha',sub:'contradictory'},{id:'pr',label:'prakaraṇasama',sub:'balancing'},{id:'sa',label:'sādhyasama',sub:'no clearer than the target'},{id:'ka',label:'kālātīta',sub:'too late'},{id:'ok',label:'Sound reason',sub:'no defect'}],
   items:[it('The hill has fire, because it has smoke (as in the kitchen).','ok','Pervaded, present in the hill, no counterexample.','Is there a place with smoke and no fire?'),
          it('Sound is eternal, because it is knowable.','sv','Knowable things include both eternal and non-eternal ones, so the reason deviates (1.2.5).','Does “knowable” pick out only eternal things?'),
          it('This bird is white, because it is a bird.','sv','Birds are white and not white: the reason is inconclusive.','Does “bird” settle the colour?'),
          it('Sound is eternal, because it is produced.','vi','Whatever is produced is non-eternal: the reason proves the opposite (1.2.6).','What does being produced normally prove?'),
          it('The hill has fire, because it has water.','vi','Water is incompatible with fire.','What does water usually prove about fire?'),
          it('Sound is eternal because no property of non-eternal things is seen in it; the opponent says it is non-eternal because no property of eternal things is seen in it.','pr','The same kind of reason works for both sides, so the question stays open (1.2.7).','Can the opponent use the same kind of reason?'),
          it('The shadow is a substance, because it moves.','sa','That the shadow “moves” is as doubtful as the claim itself (1.2.8).','Is the reason any more established than the claim?'),
          it('Fire is cold, because it is a substance.','ka','Perception already contradicts the claim; the reason arrives too late (1.2.9, later bādhita).','Is the claim already refuted by direct experience?')],
   hint:'Tap an argument, then the defect. Choose “Sound reason” if there is none.',
   onDone:()=>X.react('A good reason is in the locus, pervaded, and not already contradicted.','happy')});
  X.$('#n11-cards',root).innerHTML=X.sutraCard('1.2.4',{title:'The list'})+`<details class="tbl"><summary>Each defect defined (1.2.5 to 1.2.9)</summary>${['1.2.5','1.2.6','1.2.7','1.2.8','1.2.9'].map(i=>X.sutraCard(i)).join('')}</details>`;
}});
})();
