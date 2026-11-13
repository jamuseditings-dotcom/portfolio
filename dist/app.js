import {drawScene,clamp,mix,smooth} from './scene.js?v=authored-eevee-2';
const $=s=>document.querySelector(s),stage=$('.stage'),story=$('.story'),canvas=$('#story-canvas');
const ctx=canvas.getContext('2d'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let reduced=motion.matches,progress=0,target=0,width=0,height=0,assets=null,start=0,last=0,raf=0,visible=true,landedAt=null,studio=null,skipOpening=false;
const scrollBehavior=()=>reduced?'instant':'smooth';
const staticMode=()=>reduced||!studio;
function measure(){target=clamp(-story.getBoundingClientRect().top/Math.max(1,story.offsetHeight-height));}
function resize(){width=stage.clientWidth||innerWidth;height=stage.clientHeight||innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);studio?.resize(width,height);measure();schedule();}
function schedule(){if(!raf&&assets&&visible&&!document.hidden&&!staticMode())raf=requestAnimationFrame(render);}
function applyMode(){document.body.classList.toggle('desk-settled',staticMode());story.hidden=staticMode();$('#static-journey').hidden=!staticMode();if(staticMode()){cancelAnimationFrame(raf);raf=0;}resize();}
function goTo(name,instant=false){
 if(staticMode()){(name==='contact'?$('#fallback-contact'):name==='work'?$('#fallback-work'):$('#static-journey')).scrollIntoView({behavior:instant?'instant':scrollBehavior()});return;}
 const stops={top:0,desk:.4,work:.61,contact:.995};const p=stops[name]??0;
 // Direct navigation intentionally bypasses the opening hold.
 if(name!=='top'){landedAt=performance.now()-2000;skipOpening=true;}else skipOpening=false;
 if(instant)progress=p;
 scrollTo({top:p*(story.offsetHeight-height),behavior:instant?'instant':scrollBehavior()});measure();schedule();
}
function render(now){
 raf=0;const delta=Math.min(50,now-(last||now));last=now;
 const opening=studio.getOpeningState();
 const revealing=!skipOpening&&progress<=.17&&target>.16&&!opening.revealReady;
 const visualTarget=revealing?Math.min(target,.16):target;
 progress=mix(progress,visualTarget,1-Math.exp(-delta/175));if(Math.abs(progress-visualTarget)<.0001)progress=visualTarget;
 if(progress>.2)skipOpening=false;
 const elapsed=Math.max(0,(now-start)/1000);if(progress<.061&&!skipOpening)landedAt=null;if(progress>=.0763&&landedAt===null)landedAt=now;
 const state=studio.render(progress,elapsed,landedAt===null?-1:(now-landedAt)/1000,false);
 document.body.classList.toggle('desk-settled',progress>=.35);
 $('.reveal-caption').textContent=progress>.81?'Back to the desk.':progress<.35?'Behind the screen.':'Room to think.';
 $('.reveal-caption').style.opacity=progress>.81?smooth((progress-.81)/.03)*(1-smooth((progress-.92)/.025)):smooth((progress-.27)/.06)*(1-smooth((progress-.51)/.03));
 $('.progress-line i').style.transform=`scaleX(${progress})`;
 $('#scroll-label').textContent=progress>.975?'Back to the start':progress>.78?'Say hello':progress>.55?'Next work':progress>.35?'Explore the studio':progress>.15?'Behind the screen':'Scroll';
 const wallButton=$('#wall-project');wallButton.hidden=state.active<0;
 if(state.active>=0){wallButton.dataset.project=['megaverse','aavaasaa','caliber'][state.active];wallButton.textContent=['View MEGAverse ↗','View Aavaasaa ↗','View Caliber ↗'][state.active];}
 const person=$('#person-link'),point=state.aboutPoint;person.hidden=!state.aboutVisible||point.x<.07||point.x>.93||point.y<.13||point.y>.85;
 if(!person.hidden){person.style.left=point.x*100+'%';person.style.top=point.y*100+'%';}
 $('#phone-contact').hidden=!state.contactVisible;schedule();
}
async function loadImage(src){const image=new Image();image.src=src;await image.decode();return image;}
async function initStudio(){if(studio||reduced)return;try{const {createStudio}=await import('./pc-portfolio.js?v=pc-main-11');studio=await createStudio($('#studio-canvas'),assets,id=>openProject(id,$('#wall-project')),()=>{location.href='about.html';},()=>{location.href='mailto:ganijamu@gmail.com';});stage.classList.add('has-studio');}catch(error){console.warn('Using accessible static portfolio:',error);}}
const sceneFiles=['desk-halftone.webp','planet-halftone.webp','letters-layer.svg','flame-1.svg',...Array.from({length:6},(_,i)=>`flame-${i+1}.svg`),...'jamu'.split('').map(n=>`letter-${n}.svg`)];
Promise.all(sceneFiles.map(n=>loadImage('assets/'+n))).then(async images=>{
 assets={desk:images[0],planet:images[1],letters:images[2],meteor:images[3],flameFrames:images.slice(4,10),letterFrames:images.slice(10,14)};
 await initStudio();start=performance.now();stage.classList.add('ready');applyMode();
 if(location.hash)goTo(location.hash.slice(1),true);
}).catch(()=>{applyMode();}).finally(()=>{
 // Let the first ready scene/fallback frame paint beneath the loading cover.
 requestAnimationFrame(()=>requestAnimationFrame(()=>window.dispatchEvent(new Event('jamu:ready'))));
});
addEventListener('resize',resize,{passive:true});addEventListener('scroll',()=>{measure();schedule();},{passive:true});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){last=0;schedule();}else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'80px'}).observe(story);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else{last=0;schedule();}});
motion.addEventListener('change',async e=>{reduced=e.matches;if(assets)await initStudio();applyMode();});
for(const link of document.querySelectorAll('a[href^="#"]'))link.addEventListener('click',e=>{e.preventDefault();const name=link.hash.slice(1);if(name==='top'){target=progress=0;landedAt=null;start=performance.now();}history.replaceState(null,'','#'+name);goTo(name);});
addEventListener('hashchange',()=>goTo(location.hash.slice(1)));
$('#advance').addEventListener('click',()=>{if(target>.975){target=progress=0;landedAt=null;start=performance.now();goTo('top',true);return;}const stops=[.14,.4,.49,.61,.71,.80,.995];const next=stops.find(p=>p>target+.015)??1;scrollTo({top:next*(story.offsetHeight-height),behavior:scrollBehavior()});});
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('ganijamu@gmail.com');$('#copy-email').textContent='Copied';$('#copy-status').textContent='Email copied';}catch{$('#copy-status').textContent='Copy ganijamu@gmail.com or use the email link.';}});
const projects={megaverse:{title:'MEGAverse',category:'IDENTITY / MOTION',image:'assets/megaverse.webp',alt:'MEGAverse neon star wreath title concept',description:'A retro neon identity exploring pink and blue light, metallic stars and the energy of entertainment.'},aavaasaa:{title:'Aavaasaa',category:'VISUAL STORYTELLING',image:'assets/aavaasaa.webp',alt:'Illustrated riverside viewing deck for Aavaasaa',description:'Warm colours, architectural spaces and everyday moments. An illustration exploring a quieter way to tell a lifestyle story.'},caliber:{title:'Caliber / 25 Years',category:'EDITORIAL',image:'assets/caliber.webp',alt:'Caliber 25 Years book cover concept',description:'An anniversary coffee table book concept, bringing the 25-year milestone together with painterly colour.'}};
const dialog=$('#project-dialog');let lastFocus=null;
function openProject(id,source){const p=projects[id];if(!p)return;lastFocus=source;$('#dialog-image').src=p.image;$('#dialog-image').alt=p.alt;$('#dialog-title').textContent=p.title;$('#dialog-category').textContent=p.category;$('#dialog-description').textContent=p.description;dialog.showModal();dialog.scrollTop=0;document.body.classList.add('no-scroll');}
for(const button of document.querySelectorAll('[data-project]'))button.addEventListener('click',()=>openProject(button.dataset.project,button));
$('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});dialog.addEventListener('close',()=>{document.body.classList.remove('no-scroll');lastFocus?.focus({preventScroll:true});});
resize();
