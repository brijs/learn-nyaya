/* Engine: audio, captions, lip-sync, guide, progress, sūtra cards, widgets, corpus browser.
   Globals injected by build.py: SUT (curated sūtras), ROOTS (verified dhātus), CORPUS (all sūtras), NARR, AUDIO (scene clips), SAUDIO (sūtra clips) */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const LEVELS=['Jijñāsu (the curious)','Pramātā (the knower)','Tārkika (the reasoner)','Vādin (the debater)','Naiyāyika (the logician)'];
const RANKS=['Jijñāsu · seeker','Pramātā · knower','Tārkika · reasoner','Vādin · debater','Naiyāyika · logician'];
const BAND=['#c9b27a','#6a8f5a','#2f5f9e','#b5481e','#d4a017'];
const S={idx:0,sound:false,muted:false,auto:false,seen:new Set(),quizPassed:false,level:0};
const SCENES=window.SCENES=[]; const au=new Audio(), vau=new Audio(); au.preload=vau.preload='auto';
let ctx=null,analyser=null,buf=null,blinkT=0,capW=[],capCum=[],capTotal=0,wobble=false;

/* ---------- audio + lip sync ---------- */
function wire(a){
  try{ if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)(); analyser=ctx.createAnalyser(); analyser.fftSize=512; buf=new Uint8Array(analyser.fftSize); analyser.connect(ctx.destination);}
    if(!a._wired){ctx.createMediaElementSource(a).connect(analyser); a._wired=true;}
    if(ctx.state==='suspended') ctx.resume();
  }catch(e){wobble=true;}
}
function mouthLoop(){
  const m=$('#mouth'); let open=0;
  const playing=(!au.paused&&!au.ended)||(!vau.paused&&!vau.ended);
  if(playing){
    if(analyser&&!wobble){analyser.getByteTimeDomainData(buf);let s=0;for(const v of buf){const d=(v-128)/128;s+=d*d;} open=Math.min(1,Math.sqrt(s/buf.length)*5);} else open=.4+.4*Math.sin(Date.now()/90);
  }
  if(m) m.setAttribute('ry',(1.5+open*9).toFixed(2));
  if(!au.paused&&capTotal) litCaption(au.currentTime/(au.duration||1));
  requestAnimationFrame(mouthLoop);
}
function blink(){const e=$$('#char .eye');e.forEach(x=>x.setAttribute('ry','.6'));setTimeout(()=>e.forEach(x=>x.setAttribute('ry','5')),130);blinkT=setTimeout(blink,2200+Math.random()*3000);}

/* ---------- caption ---------- */
function setCaption(text){
  const cap=$('#cap'); cap.innerHTML=''; capW=[]; capCum=[]; let acc=0;
  text.split(/\s+/).forEach((w,i,arr)=>{const sp=document.createElement('span');sp.textContent=w;cap.appendChild(sp);cap.appendChild(document.createTextNode(i<arr.length-1?' ':''));capW.push(sp);acc+=w.length+1;capCum.push(acc);});
  capTotal=acc;
}
function litCaption(p){const t=p*capTotal;capW.forEach((s,i)=>{s.className=capCum[i]<=t?'on':(capCum[i-1]||0)<=t?'cur':'';});}
function react(t,mood){const r=$('#react');r.textContent=t||'';if(mood)setMood(mood);}
function setMood(m){const c=$('#char');if(c)c.dataset.mood=m||'neutral';}

/* ---------- narration ---------- */
function speak(id){
  const text=NARR[id]||''; setCaption(text); document.body.classList.toggle('silent',!S.sound);
  au.pause(); vau.pause(); $('#nextBtn').classList.remove('pulse');
  if(S.sound&&!S.muted&&AUDIO[id]){ au.src=AUDIO[id]; wire(au); au.currentTime=0; au.play().catch(()=>{litCaption(1);}); }
  else litCaption(S.sound?0:1);
}
au.addEventListener('ended',()=>{litCaption(1);$('#nextBtn').classList.add('pulse'); if(S.auto&&S.idx<SCENES.length-1) setTimeout(()=>{if(au.ended)go(S.idx+1);},1800);});
function stopAll(){au.pause();vau.pause();$$('.sline.playing').forEach(x=>x.classList.remove('playing'));litCaption(1);}
function playSutra(id,el){
  const src=SAUDIO['s_'+id.replace(/\./g,'_')];
  if(!src||!S.sound||S.muted){react(S.sound?'(muted)':'Audio is off. Re-enter with sound to hear the sūtra.');return Promise.resolve();}
  au.pause(); vau.pause(); vau.src=src; wire(vau); vau.currentTime=0;
  $$('.sline.playing').forEach(x=>x.classList.remove('playing')); if(el)el.classList.add('playing');
  return new Promise(res=>{const done=()=>{vau.removeEventListener('ended',done);vau.removeEventListener('pause',done);if(el)el.classList.remove('playing');res();};vau.addEventListener('ended',done);vau.addEventListener('pause',done);vau.play().catch(done);});
}

/* ---------- sūtra card ---------- */
const ROOT_RE=/√([^\s,+():;“”.]+)/g;
function buildHtml(txt){return esc(txt).replace(ROOT_RE,(m,t)=>`<button class="rootlink" data-root="${esc(t)}" aria-label="Root ${esc(t)}">√${esc(t.replace(/[²¹³]/g,''))}</button>`);}
function rootCard(t){
  const r=ROOTS[t]; if(!r)return '';
  return `<div class="rcard"><b>√${esc(r.iast)}</b> <span class="dev">${esc(r.dev)}</span> · <i>${esc(r.en)}</i><br><span class="gnote">dhātupāṭha ${r.gana}.${r.num} (${esc(r.ganaName)} gaṇa): “${esc(r.entry)}”, meaning “${esc(r.sa)}”</span> <button class="btn small" data-rootidx="${esc(t)}">All words from this root</button></div>`;
}
function sutraCard(id,opts){
  opts=opts||{}; const u=SUT[id]; if(!u)return `<p class="gnote">Sūtra ${esc(id)} not curated.</p>`;
  const tag=u.tag?`<span class="badge tagb">${esc(u.tag)}</span>`:'';
  return `<article class="card sut" data-sid="${esc(id)}"><div class="chead"><span class="vid">NS ${esc(id)}</span>${tag}${opts.title?`<h3>${esc(opts.title)}</h3>`:'<h3></h3>'}</div>
  <div class="sline"><button class="play" data-splay="${esc(id)}" aria-label="Play sūtra ${esc(id)}">▶</button><div><div class="dev sdev">${esc(u.dev)}</div><div class="iast">${esc(u.iast)}</div></div></div>
  <div class="chips">${u.chips.map((c,j)=>`<button class="wchip" aria-pressed="false" data-sw="${esc(id)}:${j}"><span class="wt">${esc(c[0])}</span></button>`).join('')}</div>
  <div class="wdetail" aria-live="polite">Tap any word to see its meaning, how it is built, and its root.</div>
  <p class="meaning"><b>In plain words:</b> ${esc(u.tr)} <span class="gnote">(our paraphrase)</span></p>
  <p class="exp"><b>How to read it:</b> ${esc(u.ex)}</p>
  <details class="tbl"><summary>Word-by-word table: meaning, build, root</summary><table class="wt"><tr><th>Word</th><th>Meaning</th><th>Build and root</th></tr>${u.chips.map(c=>`<tr><td class="iast">${esc(c[0])}</td><td>${esc(c[1])}</td><td>${buildHtml(c[2])}</td></tr>`).join('')}</table></details></article>`;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  if(b.dataset.sw){const [id,j]=b.dataset.sw.split(':');const card=b.closest('.card');$$('.wchip',card).forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');const c=SUT[id].chips[+j];
    $('.wdetail',card).innerHTML=`<span class="iast big">${esc(c[0])}</span> <b>=</b> ${esc(c[1])}`+(c[2]?`<div class="bld"><b>Build:</b> ${buildHtml(c[2])}</div>`:'')+(c[3]&&c[3].length?c[3].map(rootCard).join(''):'');}
  else if(b.dataset.splay){playSutra(b.dataset.splay,b.closest('.sline'));}
  else if(b.dataset.root){openBrowser(null,b.dataset.root);}
  else if(b.dataset.rootidx){openBrowser(null,b.dataset.rootidx);}
  else if(b.dataset.gosid){openBrowser(b.dataset.gosid);}
});

/* ---------- reusable widgets ---------- */
function shuffle(a,seed){a=a.slice();let s=seed||7;for(let i=a.length-1;i>0;i--){s=(s*9301+49297)%233280;const j=Math.floor(s/233280*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function quiz(root,qs,onDone){
  let i=0,score=0;
  const draw=()=>{
    if(i>=qs.length){root.innerHTML=`<p><b>Score: ${score} / ${qs.length}</b></p>`;onDone&&onDone(score,qs.length);return;}
    const q=qs[i];root.innerHTML=`<p class="sec">Question ${i+1} of ${qs.length}</p><p><b>${q.q}</b></p>`+q.o.map((o,k)=>`<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')+`<div class="expl" aria-live="polite"></div>`;
    $$('.opt',root).forEach(bt=>bt.onclick=()=>{
      const k=+bt.dataset.k; $$('.opt',root).forEach(x=>x.disabled=true); $$('.opt',root)[q.a].classList.add('right'); if(k!==q.a)bt.classList.add('wrong'); else score++;
      $('.expl',root).innerHTML=`<p class="${k===q.a?'ok':'bad'}">${k===q.a?'Correct.':'Not quite.'}</p><p>${q.e}</p><button class="btn small" id="qn">${i+1<qs.length?'Next question':'See result'}</button>`;
      react(k===q.a?'Well reasoned.':'Good try. Read the note.',k===q.a?'happy':'think'); $('#qn',root).onclick=()=>{i++;draw();};
    });
  };
  draw();
}
/* sorter: tap an item, then tap the bucket it belongs to. items:[{id,label,sub,b}], buckets:[{id,label,sub}] */
function sorter(root,cfg){
  const items=cfg.items.map((x,i)=>({...x,i,done:false})); let sel=null,ok=0,miss=0;
  root.innerHTML=`<div class="srt"><div class="srt-pool" role="list" aria-label="Items to sort"></div><div class="srt-bk">${cfg.buckets.map(b=>`<div class="bucket" data-b="${esc(b.id)}"><button class="bhead" data-bk="${esc(b.id)}"><b>${esc(b.label)}</b>${b.sub?`<small>${esc(b.sub)}</small>`:''}</button><div class="bin"></div></div>`).join('')}</div><p class="gcap srt-msg" aria-live="polite">${cfg.hint||'Tap an item, then tap the group it belongs to.'}</p></div>`;
  const pool=$('.srt-pool',root), msg=$('.srt-msg',root);
  const drawPool=()=>{pool.innerHTML='';items.filter(x=>!x.done).forEach(x=>{const t=document.createElement('button');t.className='tile'+(sel===x?' sel':'');t.setAttribute('role','listitem');t.innerHTML=`<span class="wd">${x.label}</span>${x.sub?`<span class="wt">${x.sub}</span>`:''}`;t.onclick=()=>{sel=sel===x?null:x;drawPool();};pool.appendChild(t);});};
  drawPool();
  $$('.bhead',root).forEach(h=>h.onclick=()=>{
    if(!sel){msg.textContent='Pick an item first.';return;}
    const bid=h.dataset.bk, bin=$('.bucket[data-b="'+bid+'"] .bin',root);
    if(sel.b===bid){sel.done=true;ok++;const c=document.createElement('span');c.className='mini';c.innerHTML=sel.label;bin.appendChild(c);msg.innerHTML='<span class="ok">Yes.</span> '+(sel.why||'');react(cfg.right||'Well placed.','happy');sel=null;drawPool();
      if(items.every(x=>x.done)){msg.innerHTML=`<span class="ok">All placed.</span> ${miss?miss+' slip'+(miss>1?'s':'')+' on the way.':'Clean sweep.'}`;cfg.onDone&&cfg.onDone(miss);}}
    else{miss++;h.classList.add('shake');setTimeout(()=>h.classList.remove('shake'),400);msg.innerHTML='<span class="bad">Not there.</span> '+(sel.hint||'Think about the sūtra’s definition.');react('Look again.','think');}
  });
}
/* orderer: tap items in the correct order. items in correct order; shown shuffled */
function orderer(root,cfg){
  const items=cfg.items.map((x,i)=>({...x,i,used:false})); let next=0,miss=0;
  root.innerHTML=`<div class="ord"><div class="srt-pool"></div><p class="sec">${cfg.slotLabel||'Your order'}</p><ol class="slotlist"></ol><p class="gcap ord-msg" aria-live="polite">${cfg.hint||'Tap the pieces in the right order.'}</p></div>`;
  const pool=$('.srt-pool',root), list=$('.slotlist',root), msg=$('.ord-msg',root);
  const draw=()=>{pool.innerHTML='';shuffle(items,cfg.seed||5).filter(x=>!x.used).forEach(x=>{const t=document.createElement('button');t.className='tile';t.innerHTML=`<span class="wd">${x.label}</span>${x.sub?`<span class="wt">${x.sub}</span>`:''}`;t.onclick=()=>{
      if(x.i===next){x.used=true;next++;const li=document.createElement('li');li.innerHTML=`<b>${x.label}</b>${x.sub?` <span class="gnote">${x.sub}</span>`:''}${x.say?`<div class="gnote">${x.say}</div>`:''}`;list.appendChild(li);msg.innerHTML='<span class="ok">Yes.</span>';react('Right step.','happy');draw();if(next===items.length){msg.innerHTML=`<span class="ok">Complete.</span> ${cfg.done||''}`;cfg.onDone&&cfg.onDone(miss);}}
      else{miss++;t.classList.add('shake');setTimeout(()=>t.classList.remove('shake'),400);msg.innerHTML='<span class="bad">Not yet.</span> '+(cfg.wrong||'Something else comes first.');react('Check the order.','think');}};pool.appendChild(t);});};
  draw();
}
function tabs(root,names,fns){
  const bar=document.createElement('div');bar.className='tabs';bar.setAttribute('role','tablist');
  const panels=names.map(()=>{const d=document.createElement('div');d.hidden=true;return d;});
  names.forEach((n,i)=>{const b=document.createElement('button');b.setAttribute('role','tab');b.textContent=n;b.setAttribute('aria-selected','false');
    b.onclick=()=>{$$('button',bar).forEach(x=>x.setAttribute('aria-selected','false'));b.setAttribute('aria-selected','true');panels.forEach(p=>p.hidden=true);panels[i].hidden=false;if(!panels[i].dataset.ready){panels[i].dataset.ready=1;fns[i](panels[i]);}};bar.appendChild(b);});
  root.appendChild(bar);panels.forEach(p=>root.appendChild(p));$$('button',bar)[0].click();
}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2600);}
function setAccessory(){const lv=S.quizPassed?4:Math.min(S.level,4); const sh=$('#band'); if(sh)sh.setAttribute('fill',BAND[lv]);
  $('#rank').textContent=RANKS[lv]; $('#rankSub').textContent='Level: '+LEVELS[Math.min(S.level,4)]; }

/* ---------- navigation ---------- */
function render(){
  const sc=SCENES[S.idx]; const st=$('#stage'); S.seen.add(S.idx);
  st.innerHTML=`<section class="scene" aria-labelledby="stt"><h2 id="stt">${S.idx+1}. ${esc(sc.title)}</h2>${sc.html}</section>`;
  sc.init&&sc.init($('.scene',st),EX);
  $$('#dots button').forEach((d,i)=>{d.className=(i===S.idx?'cur ':'')+(S.seen.has(i)?'seen':'');d.setAttribute('aria-current',i===S.idx?'step':'false');});
  $('#backBtn').disabled=S.idx===0; $('#nextBtn').disabled=S.idx===SCENES.length-1;
  react('',sc.mood||'neutral'); speak(sc.id); window.scrollTo({top:0,behavior:'smooth'});
}
function go(n){
  n=Math.max(0,Math.min(SCENES.length-1,n)); if(n===S.idx&&$('#stage').children.length)return; S.idx=n;
  const lv=SCENES[n].level; if(lv>S.level){S.level=lv;const c=$('#char');c.classList.remove('bow');void c.offsetWidth;c.classList.add('bow');toast('Level up: '+LEVELS[lv]);}
  setAccessory(); render();
}
document.addEventListener('keydown',e=>{
  if(!$('#sb').hidden&&e.key==='Escape'){$('#sb').hidden=true;return;}
  const sc=SCENES[S.idx]; if(sc&&sc.onKey&&sc.onKey(e))return;
  if(/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||''))||(sc&&sc.captureArrows)||!$('#sb').hidden)return;
  if(e.key==='ArrowRight')go(S.idx+1); else if(e.key==='ArrowLeft')go(S.idx-1);
});

/* ---------- full-text browser (all sūtras of the edition) + roots index ---------- */
const AHN=[['1.1','Adhyāya 1, āhnika 1'],['1.2','Adhyāya 1, āhnika 2'],['2.1','Adhyāya 2, āhnika 1'],['2.2','Adhyāya 2, āhnika 2'],['3.1','Adhyāya 3, āhnika 1'],['3.2','Adhyāya 3, āhnika 2'],['4.1','Adhyāya 4, āhnika 1'],['4.2','Adhyāya 4, āhnika 2'],['5.1','Adhyāya 5, āhnika 1'],['5.2','Adhyāya 5, āhnika 2']];
let sbA='1.1', sbMode='s', sbRoot=null;
const srt=(a,b)=>{const x=a.split('.').map(Number),y=b.split('.').map(Number);return x[0]-y[0]||x[1]-y[1]||x[2]-y[2];};
function sbDraw(){
  const q=($('#sbq').value||'').trim().toLowerCase();
  $('#sbmS').setAttribute('aria-pressed',sbMode==='s'); $('#sbmR').setAttribute('aria-pressed',sbMode==='r');
  if(sbMode==='s'){
    const ids=Object.keys(CORPUS).filter(k=>k.startsWith(sbA+'.')||q).sort(srt);
    const rows=ids.filter(k=>!q||k.startsWith(q)||CORPUS[k][0].toLowerCase().includes(q)||CORPUS[k][1].includes(q)).slice(0,q?60:400);
    $('#sbtabs').innerHTML=AHN.map(a=>`<button class="btn small" data-ah="${a[0]}" aria-pressed="${a[0]===sbA&&!q}" title="${a[1]}">${a[0]}</button>`).join('');
    $('#sblist').innerHTML=rows.length?rows.map(k=>`<div class="sbrow"><span class="vid">${k}</span> ${SAUDIO['s_'+k.replace(/\./g,'_')]?`<button class="play mini-play" data-splay="${k}" aria-label="Play ${k}">▶</button>`:''}${SUT[k]?`<span class="badge tagb">decoded</span>`:''}<div class="dev">${esc(CORPUS[k][1])}</div><div class="iast">${esc(CORPUS[k][0])}</div>${SUT[k]?`<details class="tbl"><summary>Meaning and roots</summary>${sutraCard(k)}</details>`:''}</div>`).join(''):'<p class="gnote">No sūtra matches.</p>';
  } else {
    $('#sbtabs').innerHTML=`<p class="gnote" style="margin:0">Roots (dhātus) found in the ${Object.keys(SUT).length} decoded sūtras, each checked against the dhātupāṭha.</p>`;
    const keys=Object.keys(ROOTS).filter(k=>!q||k.toLowerCase().includes(q)||ROOTS[k].en.includes(q)||ROOTS[k].dev.includes(q)||ROOTS[k].uses.some(u=>u[1].toLowerCase().includes(q))).sort((a,b)=>a.localeCompare(b,'sa'));
    const first=sbRoot&&keys.includes(sbRoot)?[sbRoot,...keys.filter(k=>k!==sbRoot)]:keys;
    $('#sblist').innerHTML=first.map(k=>{const r=ROOTS[k],ws=[...new Set(r.uses.map(u=>u[0]+'|'+u[1]))].map(x=>x.split('|'));
      return `<div class="sbrow rootrow${k===sbRoot?' hl':''}" id="rt-${esc(k)}"><b>√${esc(r.iast)}</b> <span class="dev">${esc(r.dev)}</span> · <i>${esc(r.en)}</i><br><span class="gnote">dhātupāṭha ${r.gana}.${r.num} (${esc(r.ganaName)}): “${esc(r.entry)}”, “${esc(r.sa)}”</span><div class="chips">${ws.map(w=>`<button class="wchip" data-gosid="${esc(w[0])}"><span class="wt">${esc(w[1].split(' ')[0].split('|')[0])}</span> <small>${esc(w[0])}</small></button>`).join('')}</div></div>`;}).join('')||'<p class="gnote">No root matches.</p>';
    if(sbRoot){const el=$('#rt-'+CSS.escape(sbRoot));el&&el.scrollIntoView({block:'start'});}
  }
}
function openBrowser(id,root){
  $('#sb').hidden=false;
  if(root){sbMode='r';sbRoot=root;$('#sbq').value='';}
  else{sbMode='s';sbRoot=null;if(id&&CORPUS[id]){sbA=id.split('.').slice(0,2).join('.');$('#sbq').value='';}}
  sbDraw(); if(!root)$('#sbq').focus();
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.ah){sbA=b.dataset.ah;$('#sbq').value='';sbDraw();}});

/* ---------- boot ---------- */
const CHAR=`<svg id="char" viewBox="0 0 200 230" role="img" aria-label="Akṣapāda, your guide" data-mood="neutral"><g class="bob">
<path id="band" d="M20 230 C24 175 60 160 100 160 C140 160 176 175 180 230Z" fill="#c9b27a" stroke="#3a2a15" stroke-width="3"/>
<path d="M100 160 L100 230" stroke="#3a2a15" stroke-width="2" opacity=".5"/>
<rect x="88" y="138" width="24" height="26" rx="8" fill="#c88c55" stroke="#3a2a15" stroke-width="3"/>
<ellipse cx="100" cy="92" rx="52" ry="58" fill="#dca66c" stroke="#3a2a15" stroke-width="3"/>
<path d="M48 84 C46 36 154 36 152 84 C142 54 58 54 48 84Z" fill="#efeadd" stroke="#3a2a15" stroke-width="3"/>
<path d="M72 66 L128 66" stroke="#b5481e" stroke-width="4" stroke-linecap="round"/><path d="M78 73 L122 73" stroke="#b5481e" stroke-width="3" stroke-linecap="round"/>
<g class="brow browL"><path d="M64 86 Q78 77 92 86" fill="none" stroke="#8a7a68" stroke-width="5" stroke-linecap="round"/></g>
<g class="brow"><path d="M108 86 Q122 77 136 86" fill="none" stroke="#8a7a68" stroke-width="5" stroke-linecap="round"/></g>
<circle cx="78" cy="99" r="12" fill="none" stroke="#3a2a15" stroke-width="2.5"/><circle cx="122" cy="99" r="12" fill="none" stroke="#3a2a15" stroke-width="2.5"/><path d="M90 99 L110 99" stroke="#3a2a15" stroke-width="2.5"/>
<ellipse class="eye" cx="78" cy="99" rx="5" ry="5" fill="#2a1a0a"/><ellipse class="eye" cx="122" cy="99" rx="5" ry="5" fill="#2a1a0a"/>
<path d="M98 104 Q94 116 100 120" fill="none" stroke="#3a2a15" stroke-width="3" stroke-linecap="round"/>
<path d="M54 120 C56 172 144 172 146 120 C140 140 124 150 100 150 C76 150 60 140 54 120Z" fill="#efeadd" stroke="#3a2a15" stroke-width="3"/>
<path d="M76 126 Q100 116 124 126 Q112 136 100 132 Q88 136 76 126Z" fill="#efeadd" stroke="#3a2a15" stroke-width="2.5"/>
<ellipse id="mouth" cx="100" cy="140" rx="9" ry="2" fill="#5a1d10" stroke="#3a2a15" stroke-width="2"/>
<circle cx="100" cy="84" r="3.2" fill="#b5481e"/></g></svg>`;
function boot(){
  $('#charWrap').innerHTML=CHAR; const dots=$('#dots');
  SCENES.forEach((s,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`Scene ${i+1}: ${s.title}`);b.title=`${i+1}. ${s.title}`;b.onclick=()=>go(i);dots.appendChild(b);});
  $('#backBtn').onclick=()=>go(S.idx-1); $('#nextBtn').onclick=()=>go(S.idx+1);
  $('#replay').onclick=()=>speak(SCENES[S.idx].id); $('#stop').onclick=stopAll;
  $('#mute').onclick=e=>{S.muted=!S.muted;e.currentTarget.setAttribute('aria-pressed',S.muted);if(S.muted)stopAll();};
  $('#auto').onclick=e=>{S.auto=!S.auto;e.currentTarget.setAttribute('aria-pressed',S.auto);};
  $('#fx').onclick=e=>{const off=document.body.classList.toggle('fx-off');e.currentTarget.setAttribute('aria-pressed',off);};
  $('#theme').onclick=()=>{const d=document.documentElement;const dark=d.dataset.theme==='dark'||(d.dataset.theme!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);d.dataset.theme=dark?'light':'dark';};
  $('#sutraBtn').onclick=()=>openBrowser(); $('#sbx').onclick=()=>{$('#sb').hidden=true;}; $('#sbq').oninput=sbDraw;
  $('#sbmS').onclick=()=>{sbMode='s';sbRoot=null;sbDraw();}; $('#sbmR').onclick=()=>{sbMode='r';sbRoot=null;sbDraw();};
  const enter=snd=>{S.sound=snd;$('#intro').style.display='none';if(snd){try{ctx||wire(au);}catch(e){}}document.body.classList.toggle('silent',!snd);if(!snd){$('#mute').disabled=true;}setAccessory();render();};
  $('#enterSound').onclick=()=>enter(true); $('#enterSilent').onclick=()=>enter(false);
  blink(); mouthLoop();
}
window.addEventListener('DOMContentLoaded',boot);
const EX=window.EX={$,$$,esc,tabs,ROOTS,rootCard,react,setMood,toast,quiz,sorter,orderer,shuffle,sutraCard,playSutra,openBrowser,go,S,SCENES,SUT,CORPUS,quizPassed:()=>{S.quizPassed=true;setAccessory();}};
})();
