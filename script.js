const $=(q,ctx=document)=>ctx.querySelector(q);
const $$=(q,ctx=document)=>[...ctx.querySelectorAll(q)];

// Hero reveal + gently unstable estimate
setTimeout(()=>$('.hero').classList.add('revealed'),1100);
const heroCount=$('#heroCount');
const heroValues=['1 ?','2 ?','17 ?','???','1 ?','≥ 1'];
let hv=0;
setInterval(()=>{hv=(hv+1)%heroValues.length;heroCount.textContent=heroValues[hv]},2400);

// Actual science toggle
$('#scienceToggle').addEventListener('click',e=>{
  const on=!document.body.classList.contains('science-on');
  document.body.classList.toggle('science-on',on);
  e.currentTarget.setAttribute('aria-pressed',String(on));
  e.currentTarget.textContent=`ACTUAL SCIENCE: ${on?'ON':'OFF'}`;
});

// Herd experiment
$$('#herdChoices button').forEach(btn=>btn.addEventListener('click',()=>{
  $$('#herdChoices button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const count=btn.dataset.count;
  $('#herdResponse').textContent=count==='?'?'Committee notes: strategically cautious.':`Recorded observation: ${count} apparent horse${count==='1'?'':'s'}.`;
  $('#herdChallenge').classList.remove('hidden');
}));
$('#sameHorseBtn').addEventListener('click',()=>{
  $('#herdStage').classList.toggle('questioned');
  $('#modelCompare').classList.remove('hidden');
  $('#sameHorseBtn').textContent=$('#herdStage').classList.contains('questioned')?'Identity certainty successfully destroyed.':'Are you sure these aren\'t the same horse?';
});

// Mirror experiment
let mirrors=2;
function renderMirrors(){
  $$('.reflection').forEach((el,i)=>el.style.display=i<mirrors?'block':'none');
  $$('.mirror-plane').forEach((el,i)=>el.style.display=i<mirrors?'block':'none');
  $('#mirrorCount').textContent=mirrors;
  $('#observedHorses').textContent=1+mirrors;
  $('#mirrorInfra').textContent=mirrors;
  const simplicity=Math.max(12,78-mirrors*10);
  $('#simplicityBar').style.width=simplicity+'%';
  $('#simplicityText').textContent=simplicity>60?'Plausibly simple':simplicity>35?'Dubious':'Architecturally alarming';
}
$('#mirrorPlus').addEventListener('click',()=>{mirrors=Math.min(6,mirrors+1);renderMirrors()});
$('#mirrorMinus').addEventListener('click',()=>{mirrors=Math.max(0,mirrors-1);renderMirrors()});
renderMirrors();

// Sighting registry
const sightings=[
  {id:'001',place:'Wyoming, USA',time:'10:43 AM',coat:'Chestnut'},
  {id:'002',place:'Kentucky, USA',time:'11:16 AM',coat:'Black'},
  {id:'003',place:'Normandy, France',time:'3:41 PM',coat:'Gray'},
  {id:'004',place:'Victoria, Australia',time:'8:12 PM',coat:'Bay'},
  {id:'005',place:'Hokkaido, Japan',time:'9:05 PM',coat:'Chestnut'},
  {id:'006',place:'Alberta, Canada',time:'11:53 PM',coat:'Bay'}
];
const calls={};
const sightingList=$('#sightingsList');
sightings.forEach(s=>{
  const el=document.createElement('article');el.className='sighting';
  el.innerHTML=`<div class="sighting-id">H-${s.id}</div><div><h4>${s.place}</h4><p>${s.time} · ${s.coat} · visual confidence 81%</p></div><div class="sighting-actions"><button data-call="new">New horse</button><button data-call="same">Same horse</button></div>`;
  el.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
    calls[s.id]=b.dataset.call;
    el.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));
    updateSightings();
  }));
  sightingList.append(el);
});
function updateSightings(){
  const values=Object.values(calls), n=values.filter(x=>x==='new').length, same=values.filter(x=>x==='same').length, unresolved=sightings.length-values.length;
  // Begin with one acknowledged horse; each "new" adds one. Same calls reduce confidence slightly.
  const estimate=Math.max(.5,1+n-(same*.05));
  $('#personalHorseCount').textContent=estimate.toFixed(1);$('#newCalls').textContent=n;$('#sameCalls').textContent=same;$('#unresolvedCalls').textContent=unresolved;
}

// Coat explanation picker
$$('#colorExplanations button').forEach(btn=>btn.addEventListener('click',()=>{
  $$('#colorExplanations button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const verdicts={
    'Multiple horses':'Committee response: alarmingly straightforward.',
    'Rapid repainting':'Committee response: requires an industrial drying protocol.',
    'Lighting':'Committee response: plausible until the horse walks indoors.',
    'Seasonal skins':'Committee response: no skins recovered.',
    'Zebras with a skin condition':'Committee response: referred to dermatology.'
  };
  $('#pickedExplanation').textContent=verdicts[btn.textContent];
}));

// Induction proof
let proofStep=0;
$('#proofNext').addEventListener('click',()=>{
  if(proofStep<3){proofStep++;$$('.proof-step').forEach((x,i)=>x.classList.toggle('active',i===proofStep));}
  if(proofStep===3){$('#proofNext').classList.add('hidden');$('#checkMath').classList.remove('hidden');}
});
$('#checkMath').addEventListener('click',()=>{$('#proofError').classList.remove('hidden');$('#checkMath').textContent='The math has been checked.'});

// Counter theory lab
const theories=[
  {id:'single',name:'One Horse Theory',count:'H = 1',quote:'Every horse sighting throughout history depicts one extremely mobile horse.',problem:'Simultaneous sightings',burden:'Extreme velocity',visual:'🐎',class:'',note:'MODEL REQUIRES PERFECT GLOBAL HORSE SCHEDULING'},
  {id:'mirror',name:'Mirror Horse Theory',count:'H = 1',quote:'One horse, lots of mirrors. The apparent population is reflective infrastructure.',problem:'Nobody remembers installing them',burden:'Mirrors',visual:'🐎',class:'mirror-visual',note:'REFLECTION DENSITY: CRITICAL'},
  {id:'half',name:'Half-Horse Theory',count:'H = 0.5',quote:'You never see both sides of a horse simultaneously. The unseen half may be unnecessary.',problem:'Turning around',burden:'Selective geometry',visual:'🐎',class:'half-visual',note:'OBSERVED HORSE QUANTITY: 0.50'},
  {id:'flat',name:'Flat Horse Theory',count:'DEPTH = 0',quote:'Perhaps horses are flat and only appear three-dimensional from privileged viewing angles.',problem:'90° observation',burden:'Dimension loss',visual:'🐎',class:'flat-visual',note:'ROTATIONAL TEST IN PROGRESS'},
  {id:'zero',name:'Zero Horse Theory',count:'TRUE H = 0–1',quote:'There is one ideal Horseness. Observed horses are merely imperfect appearances.',problem:'No access to the True Horse',burden:'Plato',visual:'🐎',class:'cave-visual',note:'CAVE PROJECTION STATUS: ONGOING'},
  {id:'chariot',name:'Big Chariot Theory',count:'H = CLASSIFIED',quote:'Horses are projections maintained by Big Chariot and Gates to preserve transportation power.',problem:'Evidence',burden:'Red string',visual:'🐎',class:'conspiracy-visual',note:'FOLLOW THE OATS'},
  {id:'swamp',name:'Swamp Gas Theory',count:'H = ?',quote:'Swamp gas.',problem:'Everything',burden:'No elaboration',visual:'☁️',class:'',note:'7 PEER ENDORSEMENTS; NO FURTHER DETAIL'}
];
const tabs=$('#theoryTabs'),display=$('#theoryDisplay');
theories.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t.name;b.setAttribute('role','tab');b.addEventListener('click',()=>selectTheory(i));tabs.append(b)});
function selectTheory(i){
  const t=theories[i];$$('#theoryTabs button').forEach((b,j)=>b.classList.toggle('active',i===j));
  display.innerHTML=`<div class="theory-copy"><p class="eyebrow">Competing model ${String(i+1).padStart(2,'0')}</p><h3>${t.name}</h3><span class="theory-count">${t.count}</span><blockquote>${t.quote}</blockquote><div class="theory-stats"><div><span>Primary problem</span><strong>${t.problem}</strong></div><div><span>Explanatory burden</span><strong>${t.burden}</strong></div></div></div><div class="theory-visual ${t.class}"><div class="conspiracy-lines"></div><div class="big-emoji">${t.visual}</div><div class="visual-note">${t.note}</div></div>`;
}
selectTheory(0);

// Identity test
const pairs=[
  {a:'🐎',b:'🐎',ac:'variant-a',bc:'variant-a',truth:'same',note:'Same rendering. Strong case for identity.'},
  {a:'🐎',b:'🐎',ac:'variant-a',bc:'variant-b',truth:'different',note:'Color treatment differs. Single Horse theorists request lighting data.'},
  {a:'🐴',b:'🐎',ac:'variant-c',bc:'variant-c',truth:'different',note:'Different depiction. Philosophical identity remains annoyingly unresolved.'},
  {a:'🐎',b:'🐎',ac:'variant-d',bc:'variant-d',truth:'unknown',note:'The Institute declines to overclaim.'},
  {a:'🐴',b:'🐴',ac:'variant-a',bc:'variant-a',truth:'same',note:'Visually indistinguishable in this highly controlled emoji protocol.'}
];
let pairIndex=0,answers=[];
function renderPair(){
  const p=pairs[pairIndex];$('#identityStep').textContent=`Pair ${pairIndex+1} of ${pairs.length}`;$('#identityProgress').style.width=((pairIndex+1)/pairs.length*100)+'%';
  $('#identityPair').innerHTML=`<div class="identity-horse ${p.ac}"><span>SIGHTING A</span>${p.a}</div><div class="identity-horse ${p.bc}"><span>SIGHTING B</span>${p.b}</div>`;
}
$$('.identity-choices button').forEach(b=>b.addEventListener('click',()=>{
  answers.push(b.dataset.answer);const p=pairs[pairIndex];
  if(pairIndex<pairs.length-1){pairIndex++;renderPair();}else{
    const distinct=answers.filter(a=>a==='different').length;const uncertain=answers.filter(a=>a==='unknown').length;
    $('.identity-choices').classList.add('hidden');$('#identityPair').classList.add('hidden');$('#identityResult').classList.remove('hidden');
    $('#identityResult').innerHTML=`<strong>RESULT:</strong> You declared ${distinct} pair${distinct===1?'':'s'} to contain different horses and refused judgment ${uncertain} time${uncertain===1?'':'s'}. Under One Horse Theory, all ${distinct} declarations are considered administrative errors.`;
  }
}));
renderPair();

// Peer review
const reviews=[
  {cat:'alt',user:'nozendk',score:34,label:'Methodological concern',text:'I think we need to hear both sides of the argument.'},
  {cat:'alt philosophy',user:'exkingzog',score:32,label:'Geometric objection',text:'You never see both sides of the horse simultaneously, so there may, in fact, be only half a horse.'},
  {cat:'alt',user:'nozendk',score:10,label:'Dimensional objection',text:'Or maybe — brace yourself — horses are actually flat?'},
  {cat:'single',user:'frivolous_squid',score:17,label:'Mathematical objection',text:'Theorem: any group of n horses are all actually the same horse.'},
  {cat:'single',user:'created4this',score:36,label:'Parsimony argument',text:'One horse, lots of mirrors. Its the simplest explanation given we know that there is only one horse.'},
  {cat:'support',user:'KeithMyArthe',score:8,label:'Empirical support',text:'I\'ve seen horses that are different colors, and on the same day so no drying time in between sightings.'},
  {cat:'single philosophy',user:'Glinth',score:2,label:'Platonic revision',text:'There is only one true, ideal horse. All other horses we see are mere shadows of the one True Horse.'},
  {cat:'alt',user:'Cassius-Tain',score:2,label:'Institutional conspiracy',text:'Horses aren\'t real and any perceived horse is just a projection of Big Chariot and Gates to keep their power.'},
  {cat:'support',user:'sporbywg',score:2,label:'Comparative assessment',text:'It\'s more comprehensive than the single horse theory.'},
  {cat:'support',user:'IanDOsmond',score:1,label:'Historical application',text:'It would explain how the entire Trojan army fit inside a horse. An army is bigger than a horse. But what if there were two horses?'},
  {cat:'alt',user:'boneskull',score:2,label:'Semiotic intervention',text:'There are no horses. There are only animals which signify horseness.'},
  {cat:'unhelpful',user:'DolphinSweater',score:17,label:'No useful information',text:'I already know about it.'},
  {cat:'unhelpful',user:'Loud-Fairy03',score:2,label:'Outside reviewer\'s field',text:'That doesn’t have anything to do with rocks so idk.'},
  {cat:'alt',user:'aescula',score:2,label:'Linguistic objection',text:'Nonsense! My vote on this theory is a firm neigh.'},
  {cat:'single',user:'paraworldblue',score:4,label:'Cosmological objection',text:'There have been countless experiments proving that there\'s only one horse and that it transcends all time and space.'}
];
const peerGrid=$('#peerGrid');
reviews.forEach(r=>{const a=document.createElement('article');a.className='peer-card';a.dataset.cat=r.cat;a.innerHTML=`<div class="classification">${r.label}</div><blockquote>“${r.text}”</blockquote><div class="peer-meta"><span>${r.user}</span><strong>${r.score} endorsements</strong></div>`;peerGrid.append(a)});
$$('#peerFilters button').forEach(b=>b.addEventListener('click',()=>{
  $$('#peerFilters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;
  $$('.peer-card').forEach(card=>card.classList.toggle('hidden-card',f!=='all'&&!card.dataset.cat.split(' ').includes(f)));
}));

// Model builder
const horseRange=$('#horseRange');
function horseLabel(v){v=Number(v);if(v<8)return '0';if(v<20)return '½';if(v<34)return '1';if(v<52)return '2';if(v<68)return '8';if(v<85)return '32';return '∞'}
function updateModel(){
  const h=horseLabel(horseRange.value);$('#horseRangeValue').textContent=h;$('#certHorseCount').textContent=h;
  const tp=$('#teleport').checked,mir=$('#mirrors').checked,depth=$('#depth').checked,plato=$('#plato').checked,char=$('#chariot').checked,swamp=$('#swamp').checked;
  let name='Moderate Multiplicist',desc='You accept multiple horses while remaining appropriately nervous about the exact number.';
  if(h==='0') {name='Equine Nihilist';desc='You reject horse existence outright. This raises serious pasture-accounting questions.'}
  else if(h==='½'){name='Half-Horse Realist';desc='You recognize one visible side and decline to speculate about the other.'}
  else if(h==='1'&&mir){name='Reflective Singularist';desc='You accept one horse plus a strategically alarming quantity of mirrors.'}
  else if(h==='1'&&tp){name='Hypermobile Singularist';desc='One horse exists. It is simply having an extremely busy day.'}
  else if(plato){name='Platonic Equinist';desc='Observed horses are secondary to the deeper and inaccessible Form of Horse.'}
  else if(char){name='Chariot Skeptic';desc='The horse question cannot be separated from the transportation-industrial complex.'}
  else if(swamp){name='Atmospheric Horse Agnostic';desc='You have introduced swamp gas. The committee has stopped taking notes.'}
  else if(h==='∞'){name='Maximal Multiplicist';desc='You have abandoned population limits. Every sighting may demand a fresh horse.'}
  else if(h==='2'){name='Minimal Multiplicist';desc='You require exactly enough horses to make the theory controversial.'}
  $('#modelName').textContent=name;$('#modelDescription').textContent=desc;
  let burden=20+(tp?22:0)+(mir?14:0)+(!depth?18:0)+(plato?10:0)+(char?20:0)+(swamp?15:0);
  $('#physicsBurden').textContent=burden<35?'Low':burden<60?'Medium':'Concerning';
  $('#platosRequired').textContent=plato?'1.0':'0.0';
  let cred=Math.max(7,92-burden-(h==='0'?22:0)-(h==='∞'?14:0));
  $('#credibilityBar').style.width=cred+'%';$('#credibilityText').textContent=cred+'%';
}
[horseRange,...$$('#modelForm input[type=checkbox]')].forEach(i=>i.addEventListener('input',updateModel));updateModel();
$('#copyModel').addEventListener('click',async()=>{
  const text=`My Multiple Horse Theory classification: ${$('#modelName').textContent}. Estimated horse count: ${$('#certHorseCount').textContent}. ${$('#modelDescription').textContent}`;
  try{await navigator.clipboard.writeText(text);$('#copyStatus').textContent='Theory copied to clipboard.'}catch{ $('#copyStatus').textContent=text; }
});

// Final verdict animation
let verdictRun=false;
$('#runVerdict').addEventListener('click',()=>{
  const herd=$('#finalHerd');herd.innerHTML='';verdictRun=true;let i=0;const total=32;
  $('#runVerdict').disabled=true;
  const timer=setInterval(()=>{i++;const s=document.createElement('span');s.textContent='🐎';s.style.animationDelay=(Math.random()*.18)+'s';herd.append(s);$('#finalCounter').textContent=i;$('#pluralS').textContent=i===1?'':'s';if(i>=total){clearInterval(timer);setTimeout(()=>{$('#finalCounter').textContent='31?';$('#runVerdict').disabled=false;$('#runVerdict').textContent='Run observation again'},700)}},70);
});

// reveal animation on scroll
const revealEls=$$('.section-heading,.quote-card,.formal-card,.lab-card,.theory-lab,.identity-card,.model-certificate');
revealEls.forEach(el=>el.style.opacity='0');
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.transition='opacity .7s ease, transform .7s ease';e.target.style.opacity='1';e.target.style.transform='translateY(0)';io.unobserve(e.target)}}),{threshold:.12});
revealEls.forEach(el=>{el.style.transform='translateY(14px)';io.observe(el)});
