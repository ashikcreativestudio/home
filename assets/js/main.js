/* Ashik Creative Studio — মূল স্ক্রিপ্ট (হোম পেজ) */

/* ============ আপনার তথ্য এখানে বদলান ============ */
const AW = window.ACWP || {};
const CONFIG = { phone: AW.whatsapp || '', fb: AW.facebook || '', videoId: AW.videoId || '', stats: AW.stats || [], testimonials: AW.testimonials || [], works: AW.works || [] };
const CATS = {all:'সবগুলো', social:'সোশ্যাল মিডিয়া', video:'ভিডিও ও VFX', graphics:'গ্রাফিক্স ডিজাইন', marketing:'মার্কেটিং'};
const SERVICES = [
  {t:'সোশ্যাল মিডিয়া সমাধান', te:'Social Media Solutions', cat:'social', ic:'📱', c:'#1877f2', li:['সোশ্যাল মিডিয়া সমস্যা ও সমাধান','মনিটাইজেশন সেটআপ ও গাইডলাইন','পে-আউট সেটআপ (AdSense, FB, YouTube)','Facebook Monetization & Growth']},
  {t:'ভিডিও গ্রাফিক্স ও VFX', te:'Video Graphics & VFX', cat:'video', ic:'🎬', c:'#e11d2e', li:['Promotional Video & Ad Video','Social Media Video Content','Motion Graphics Design','VFX & Special Effects']},
  {t:'গ্রাফিক্স ডিজাইন', te:'Graphics Design', cat:'graphics', ic:'🎨', c:'#ff9f0a', li:['প্রফেশনাল গ্রাফিক্স ডিজাইন','পোস্টার, ব্যানার, লিফলেট','লোগো ও Brand Design','YouTube Thumbnail & Channel Art']},
  {t:'ডিজিটাল মার্কেটিং', te:'Digital Marketing', cat:'marketing', ic:'📈', c:'#16a34a', li:['ডিজিটাল মার্কেটিং ও টিপস','SEO ও কনটেন্ট তৈরির পরামর্শ','নিরাপত্তা ও সঠিক সেটআপ টিপস','Business Advertisement']},
  {t:'এডিটিং ও AI Tools', te:'Editing & AI Tools', cat:'video', ic:'🤖', c:'#7c3aed', li:['ভিডিও এডিটিং ও থাম্বনেইল ডিজাইন','AI Tools ব্যবহারের গাইড','কনটেন্ট তৈরির সহায়তা','এবং আরও অনেক কিছু...']},
  {t:'সরাসরি সহায়তা', te:'Direct Support', cat:'social', ic:'☎️', c:'#25d366', li:['অনলাইনে যোগাযোগ','ফোনে সমাধান','সরাসরি এসে পরামর্শ','24/7 সাপোর্ট']}
];
const FAQ = [
  ['আপনার সেবার মূল্য কেমন?','আমি সবার সামর্থ্যের মধ্যে স্বল্প মূল্যে কাজ করি। কাজের ধরন অনুযায়ী মূল্য WhatsApp এ জানানো হয়।'],
  ['কীভাবে যোগাযোগ করব?','WhatsApp ('+AW.phoneDisplay+'), সরাসরি ফোন, Facebook Profile অথবা সরাসরি এসে দেখা করতে পারেন।'],
  ['কোন কোন কাজ করেন?','সোশ্যাল মিডিয়া সমস্যা সমাধান, মনিটাইজেশন ও পে-আউট সেটআপ, গ্রাফিক্স ডিজাইন, ভিডিও এডিটিং, VFX, মোশন গ্রাফিক্স ও ডিজিটাল মার্কেটিং টিপস।'],
  ['কাজ শেষ হতে কতক্ষণ লাগে?','কাজের ধরনের উপর নির্ভর করে। প্রয়োজন জানালে আমি আগেই সময় জানিয়ে দেব এবং দ্রুত সমাধানের চেষ্টা করি।'],
  ['কাজের পর সাপোর্ট পাব?','হ্যাঁ, কাজের পরও কোনো সমস্যা হলে যোগাযোগ করতে পারবেন।']
];

/* ============ helpers ============ */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const waLink=(msg='')=>`https://wa.me/${CONFIG.phone}`+(msg?`?text=${encodeURIComponent(msg)}`:'');
$$('[data-wa]').forEach(a=>{a.href=waLink('আসসালামু আলাইকুম, আমি আপনার ওয়েবসাইট থেকে যোগাযোগ করছি।');a.target='_blank';a.rel='noopener'});
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.i);toast.i=setTimeout(()=>t.classList.remove('show'),2200)};
$('#yr').textContent=new Date().getFullYear();
$('#qr').src=AW.qr||'';
addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('off'),500));

/* ============ theme + language ============ */
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
function setTheme(d){document.body.classList.toggle('dark',d);$('#theme').textContent=d?'☀️':'🌙';store.set('theme',d?'dark':'light')}
setTheme(store.get('theme')==='dark');
$('#theme').onclick=()=>setTheme(!document.body.classList.contains('dark'));
$$('[data-en]').forEach(e=>e.dataset.bn=e.innerHTML);
let lang=store.get('lang')||'bn';
function setLang(l){lang=l;$$('[data-en]').forEach(e=>e.innerHTML=l==='en'?e.dataset.en:e.dataset.bn);
  document.documentElement.lang=l;$('#lang').textContent=l==='en'?'বাং':'EN';store.set('lang',l);renderServices();renderWorks()}
$('#lang').onclick=()=>setLang(lang==='bn'?'en':'bn');

/* ============ header, progress, scrollspy, top ============ */
const hdr=$('#hdr'),top_=$('#top');
addEventListener('scroll',()=>{
  hdr.classList.toggle('scrolled',scrollY>40);top_.classList.toggle('show',scrollY>600);
  const h=document.documentElement;$('#progress').style.width=(scrollY/(h.scrollHeight-h.clientHeight)*100)+'%';
},{passive:true});
top_.onclick=()=>scrollTo({top:0,behavior:'smooth'});
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('.lk').forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('section[id]').forEach(s=>spy.observe(s));
const menu=$('#menu'),menuOv=$('#menuOv');
const setMenu=o=>{menu.classList.toggle('open',o);menuOv.classList.toggle('show',o);document.body.classList.toggle('menu-lock',o);$('#burger').setAttribute('aria-expanded',o)};
$('#burger').onclick=()=>setMenu(!menu.classList.contains('open'));
$('#menuX').onclick=()=>setMenu(false);menuOv.onclick=()=>setMenu(false);
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
$$('.menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
/* ডেস্কটপ: অর্ডার ড্রপডাউন */
const dd=$('#ddOrder');
if(dd){
  const ddBtn=dd.querySelector('.dd-btn');
  const setDD=o=>{dd.classList.toggle('open',o);ddBtn.setAttribute('aria-expanded',o)};
  ddBtn.addEventListener('click',e=>{e.stopPropagation();setDD(!dd.classList.contains('open'))});
  dd.addEventListener('mouseleave',()=>setDD(false));
  document.addEventListener('click',e=>{if(!dd.contains(e.target))setDD(false)});
  addEventListener('keydown',e=>{if(e.key==='Escape')setDD(false)});
  dd.querySelectorAll('.dd-item').forEach(a=>a.addEventListener('click',()=>setDD(false)));
}

/* ============ reveal + glow + tilt ============ */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const reveal=()=>$$('.rv:not(.in)').forEach((el,i)=>{el.style.transitionDelay=(i%4)*80+'ms';io.observe(el)});
addEventListener('mousemove',e=>{const g=$('#glow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
function tilt(root){$$(root).forEach(c=>{
  c.onmousemove=e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-8px)`};
  c.onmouseleave=()=>c.style.transform='';})}

/* ============ hero slider ============ */
(function(){
  const sl=$$('#hslider .hs'),dots=$('#hdots'),fill=$('#hfill');let i=0,tm,t0,raf,paused=false,D=7000;
  sl.forEach((_,k)=>{const b=document.createElement('b');b.onclick=()=>go(k,true);dots.appendChild(b)});
  function go(n,manual){i=(n+sl.length)%sl.length;sl.forEach((s,k)=>s.classList.toggle('on',k===i));[...dots.children].forEach((b,k)=>b.classList.toggle('on',k===i));t0=performance.now()}
  function tick(now){if(!paused){const p=Math.min((now-t0)/D,1);fill.style.width=p*100+'%';if(p>=1)go(i+1)}else t0=now-(parseFloat(fill.style.width)||0)/100*D;raf=requestAnimationFrame(tick)}
  $('#hp').onclick=()=>go(i-1);$('#hn').onclick=()=>go(i+1);
  const hero=$('#home');hero.onmouseenter=()=>paused=true;hero.onmouseleave=()=>paused=false;
  let sx=0;hero.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
  hero.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)go(i+(d<0?1:-1))});
  addEventListener('keydown',e=>{if(scrollY<innerHeight){if(e.key==='ArrowRight')go(i+1);if(e.key==='ArrowLeft')go(i-1)}});
  document.addEventListener('visibilitychange',()=>paused=document.hidden);
  go(0);raf=requestAnimationFrame(tick);
})();

/* ============ typewriter ============ */
(function(){const words=['Social Media Solutions','Graphics Design','Video Editing & VFX','Motion Graphics','Monetization Setup'];
  const t=$('#typed');let w=0,c=0,del=false;
  (function type(){const cur=words[w];t.textContent=cur.substring(0,c);
    if(!del&&c<cur.length){c++;setTimeout(type,90)}else if(!del){del=true;setTimeout(type,1300)}
    else if(c>0){c--;setTimeout(type,45)}else{del=false;w=(w+1)%words.length;setTimeout(type,300)}})();})();

/* ============ particles ============ */
(function(){const cv=$('#particles'),cx=cv.getContext('2d');let P=[];
  const size=()=>{cv.width=cv.offsetWidth;cv.height=cv.offsetHeight};size();addEventListener('resize',size);
  const cols=['#ffd60a','#3fa9ff','#ffffff','#ff5a36'];
  for(let i=0;i<55;i++)P.push({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*3+1,dx:(Math.random()-.5)*.6,dy:(Math.random()-.5)*.6,c:cols[i%4]});
  (function draw(){cx.clearRect(0,0,cv.width,cv.height);
    P.forEach((p,i)=>{p.x+=p.dx;p.y+=p.dy;if(p.x<0||p.x>cv.width)p.dx*=-1;if(p.y<0||p.y>cv.height)p.dy*=-1;
      cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fillStyle=p.c;cx.globalAlpha=.7;cx.fill();
      for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<110){cx.globalAlpha=(1-d/110)*.25;cx.strokeStyle='#8fc4ff';cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}});
    requestAnimationFrame(draw)})();})();

/* ============ stats counter ============ */
(function(){const box=$('#stats');if(!CONFIG.stats.length){$('#statsBox').classList.add('hide');return}
  CONFIG.stats.forEach(s=>{box.insertAdjacentHTML('beforeend',`<div class="stat"><b data-n="${s.n}" data-s="${s.suf}">0${s.suf}</b><span>${s.l}</span></div>`)});
  const o=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;o.unobserve(e.target);
    const n=+e.target.dataset.n,suf=e.target.dataset.s;let v=0;const st=Math.max(1,n/40);
    const iv=setInterval(()=>{v=Math.min(n,v+st);e.target.textContent=Math.round(v)+suf;if(v>=n)clearInterval(iv)},40)}),{threshold:.6});
  $$('.stat b').forEach(b=>o.observe(b));})();

/* ============ services (filter + search + order) ============ */
let curCat='all';
function renderFilters(box,cb,list){box.innerHTML='';Object.entries(list).forEach(([k,v])=>{const b=document.createElement('button');b.className='chip'+(k===cb.cur()?' on':'');b.textContent=v;b.onclick=()=>{cb.set(k);renderFilters(box,cb,list)};box.appendChild(b)})}
function renderServices(){
  renderFilters($('#filters'),{cur:()=>curCat,set:k=>{curCat=k;renderServices()}},CATS);
  const q=$('#q').value.trim().toLowerCase();
  const list=SERVICES.filter(s=>(curCat==='all'||s.cat===curCat)&&(!q||(s.t+s.te+s.li.join(' ')).toLowerCase().includes(q)));
  $('#svc').innerHTML=list.map((s,i)=>`<div class="card" style="--c:${s.c}"><div class="ic">${s.ic}</div><h3>${lang==='en'?s.te:s.t}</h3><ul>${s.li.map(x=>`<li>${x}</li>`).join('')}</ul><button class="ord" data-i="${SERVICES.indexOf(s)}">${lang==='en'?'Order →':'অর্ডার করুন →'}</button></div>`).join('');
  $('#noRes').classList.toggle('hide',list.length>0);
  $$('.ord').forEach(b=>b.onclick=()=>openOrder(SERVICES[b.dataset.i].t));
  tilt('#svc .card');
}
$('#q').oninput=renderServices;
$('#sv').innerHTML=SERVICES.map(s=>`<option>${s.t}</option>`).join('')+'<option>অন্যান্য</option>';

/* ============ modals ============ */
function openOrder(t){const sv=SERVICES.find(x=>x.t===t);if(window.Shop&&sv)Shop.focusCat(sv.cat);document.getElementById('shop').scrollIntoView({behavior:'smooth'})}
$$('[data-close]').forEach(b=>b.onclick=()=>b.closest('.ov').classList.remove('show'));
$$('.ov').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('show')}));
addEventListener('keydown',e=>{if(e.key==='Escape')$$('.ov').forEach(o=>o.classList.remove('show'))});

/* ============ works carousel ============ */
let wCat='all';
function renderWorks(){
  const wc={all:'সবগুলো',social:'সোশ্যাল মিডিয়া',video:'ভিডিও ও VFX',graphics:'গ্রাফিক্স ডিজাইন'};
  renderFilters($('#wfilters'),{cur:()=>wCat,set:k=>{wCat=k;renderWorks()}},wc);
  const list=CONFIG.works.filter(w=>wCat==='all'||w.cat===wCat);
  $('#wtrack').innerHTML=list.map((w,i)=>`<div class="work" data-i="${CONFIG.works.indexOf(w)}" style="background-image:url('${w.img}'),linear-gradient(160deg,${w.g})"><div class="big">${w.ic}</div><div class="cap"><small>${w.cat.toUpperCase()}</small><h3>${lang==='en'?w.te:w.t}</h3></div></div>`).join('');
  $('#wtrack').scrollLeft=0;
  $$('.work').forEach(el=>el.onclick=()=>{if(moved)return;const w=CONFIG.works[el.dataset.i];const lb=$('#lb');
    lb.style.backgroundImage=`url('${w.img}'),linear-gradient(160deg,${w.g})`;lb.innerHTML=`<button class="x" data-close>×</button><div class="cap" style="width:100%;padding:20px;background:linear-gradient(transparent,#000a)"><h3>${w.ic} ${lang==='en'?w.te:w.t}</h3></div>`;
    lb.querySelector('.x').onclick=()=>$('#lbo').classList.remove('show');$('#lbo').classList.add('show')});
}
let moved=false;
(function(){const tr=$('#wtrack');let down=false,sx=0,sl=0;
  tr.addEventListener('mousedown',e=>{down=true;moved=false;sx=e.pageX;sl=tr.scrollLeft;tr.classList.add('drag')});
  addEventListener('mouseup',()=>{down=false;tr.classList.remove('drag');setTimeout(()=>moved=false,50)});
  tr.addEventListener('mousemove',e=>{if(!down)return;const d=e.pageX-sx;if(Math.abs(d)>5)moved=true;tr.scrollLeft=sl-d});
  const step=()=>tr.clientWidth*.7;
  $('#wp').onclick=()=>tr.scrollBy({left:-step(),behavior:'smooth'});
  $('#wn').onclick=()=>{if(tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-10)tr.scrollTo({left:0,behavior:'smooth'});else tr.scrollBy({left:step(),behavior:'smooth'})};
  let hov=false;tr.onmouseenter=()=>hov=true;tr.onmouseleave=()=>hov=false;
  setInterval(()=>{if(!hov&&!down&&!document.hidden)$('#wn').click()},5000);})();

/* ============ before / after ============ */
$('#barng').oninput=e=>{const v=e.target.value;$('.ba .aft').style.clipPath=`inset(0 0 0 ${v}%)`;$('#bahd').style.left=v+'%'};

/* ============ video ============ */
if(CONFIG.videoId){$('#videoSec').classList.remove('hide');$('#vid').innerHTML=`<iframe src="https://www.youtube.com/embed/${CONFIG.videoId}" title="Video" allowfullscreen loading="lazy"></iframe>`}

/* ============ testimonials slider ============ */
(function(){const T=CONFIG.testimonials;if(!T.length)return;$('#tstSec').classList.remove('hide');
  $('#tst').innerHTML=T.map((t,i)=>`<div class="tcard${i?'':' on'}"><div class="st">${'★'.repeat(t.stars||5)}</div><p>“${t.text}”</p><b>- ${t.name}</b></div>`).join('');
  const cs=$$('.tcard');let i=0;const go=n=>{i=(n+cs.length)%cs.length;cs.forEach((c,k)=>c.classList.toggle('on',k===i))};
  $('#tp').onclick=()=>go(i-1);$('#tn').onclick=()=>go(i+1);setInterval(()=>go(i+1),6000);})();

/* ============ FAQ ============ */
$('#faqList').innerHTML=FAQ.map(f=>`<div class="fq rv"><button>${f[0]}</button><div class="a">${f[1]}</div></div>`).join('');
$$('.fq button').forEach(b=>b.onclick=()=>{const p=b.parentElement,o=p.classList.contains('open');$$('.fq').forEach(x=>x.classList.remove('open'));if(!o)p.classList.add('open')});

/* ============ contact: form, copy, share, dial ============ */
$('#ms').oninput=e=>$('#cn').textContent=e.target.value.length;
$('#form').onsubmit=e=>{e.preventDefault();const n=$('#nm');n.classList.remove('err');
  if(!n.value.trim()){n.classList.add('err');n.focus();return toast('অনুগ্রহ করে নাম লিখুন')}
  const m=`আসসালামু আলাইকুম, আমি ${n.value.trim()}।\nসার্ভিস: ${$('#sv').value}`+($('#ph').value?`\nফোন: ${$('#ph').value}`:'')+($('#ms').value?`\nবিস্তারিত: ${$('#ms').value}`:'');
  if(window.DB)DB.createMessage({name:n.value.trim(),phone:$('#ph').value.trim(),service:$('#sv').value,text:$('#ms').value.trim()}).catch(function(){});
  open(waLink(m),'_blank');toast('WhatsApp খোলা হচ্ছে...')};
$$('[data-copy]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();
  (navigator.clipboard?navigator.clipboard.writeText(b.dataset.copy):Promise.reject()).then(()=>toast('নম্বর কপি হয়েছে ✔')).catch(()=>toast(b.dataset.copy))});
$('#dialBtn').onclick=()=>$('#dial').classList.toggle('open');
$('#shareBtn').onclick=()=>{const d={title:'Ashik Creative Studio',text:'সোশ্যাল মিডিয়া, গ্রাফিক্স ও ভিডিও সার্ভিস',url:location.href};
  if(navigator.share)navigator.share(d).catch(()=>{});else{(navigator.clipboard?navigator.clipboard.writeText(location.href):Promise.reject()).then(()=>toast('লিংক কপি হয়েছে ✔')).catch(()=>toast(location.href))}};

/* init */
renderServices();renderWorks();reveal();if(lang==='en')setLang('en');

(function(){
 var l=document.getElementById('legalBtn'),o=document.getElementById('legalOv');
 if(l&&o)l.onclick=function(e){e.preventDefault();o.classList.add('show')};
 if(AW.baBefore&&AW.baAfter){var n=0;[AW.baBefore,AW.baAfter].forEach(function(u){var i=new Image();i.onload=function(){if(++n===2)document.getElementById('baSec').classList.remove('hide')};i.src=u});}
})();
