import {drawScene} from './scene.js?v=authored-eevee-2';
const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)},ids=['megaverse','aavaasaa','caliber'];
function load(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error(`Could not load ${src}`));i.src=src;});}
function warp(ctx,image,quad){
 if(quad.some(p=>p[2]<=.01||Math.abs(p[0])>1e5||Math.abs(p[1])>1e5))return;
 const [a,b,c,d]=quad,dx1=b[0]-c[0],dx2=d[0]-c[0],sx=a[0]-b[0]+c[0]-d[0],dy1=b[1]-c[1],dy2=d[1]-c[1],sy=a[1]-b[1]+c[1]-d[1],det=dx1*dy2-dx2*dy1;
 if(Math.abs(det)<1e-8)return;
 const g=(sx*dy2-dx2*sy)/det,h=(dx1*sy-sx*dy1)/det,A=b[0]-a[0]+g*b[0],B=d[0]-a[0]+h*d[0],D=b[1]-a[1]+g*b[1],E=d[1]-a[1]+h*d[1];
 const point=(u,v)=>{const q=g*u+h*v+1;return [(A*u+B*v+a[0])/q,(D*u+E*v+a[1])/q]};
 function tri(uv){
  const p=uv.map(v=>point(...v)),s=uv.map(v=>[v[0]*image.width,v[1]*image.height]),den=s[0][0]*(s[1][1]-s[2][1])+s[1][0]*(s[2][1]-s[0][1])+s[2][0]*(s[0][1]-s[1][1]);
  const coeff=k=>[(p[0][k]*(s[1][1]-s[2][1])+p[1][k]*(s[2][1]-s[0][1])+p[2][k]*(s[0][1]-s[1][1]))/den,(p[0][k]*(s[2][0]-s[1][0])+p[1][k]*(s[0][0]-s[2][0])+p[2][k]*(s[1][0]-s[0][0]))/den,(p[0][k]*(s[1][0]*s[2][1]-s[2][0]*s[1][1])+p[1][k]*(s[2][0]*s[0][1]-s[0][0]*s[2][1])+p[2][k]*(s[0][0]*s[1][1]-s[1][0]*s[0][1]))/den];
  const x=coeff(0),y=coeff(1),cx=(p[0][0]+p[1][0]+p[2][0])/3,cy=(p[0][1]+p[1][1]+p[2][1])/3;
  const edgeDistance=Math.min(...p.map(([px,py],i)=>{const [qx,qy]=p[(i+1)%3];return Math.abs((qx-px)*(cy-py)-(qy-py)*(cx-px))/(Math.hypot(qx-px,qy-py)||1)}));
  const expansion=1+.9/Math.max(edgeDistance,.1);
  const expanded=p.map(([px,py])=>[cx+(px-cx)*expansion,cy+(py-cy)*expansion]);
  ctx.save();ctx.beginPath();expanded.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.closePath();ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(image,0,0);ctx.restore();
 }
 ctx.save();ctx.beginPath();quad.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.clip();
 for(let y=0;y<8;y++)for(let x=0;x<12;x++){const u=x/12,v=y/8,U=(x+1)/12,V=(y+1)/8;tri([[u,v],[U,v],[U,V]]);tri([[u,v],[U,V],[u,V]]);}ctx.restore();
}
function inside(p,q){let result=false;for(let i=0,j=q.length-1;i<q.length;j=i++){const a=q[i],b=q[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])result=!result;}return result;}
export async function createStudio(canvas,assets,onProject,onAbout,onContact){
 const response=await fetch('assets/studio/rendered-scene.json?v=authored-eevee-2');if(!response.ok)throw new Error('Scene manifest unavailable');
 const meta=await response.json(),frames=meta.frames,ctx=canvas.getContext('2d',{alpha:false});
 const works=await Promise.all(ids.map(async id=>{const img=await load(`assets/${id}.webp`),c=document.createElement('canvas');c.width=1280;c.height=720;const x=c.getContext('2d');x.fillStyle='#080808';x.fillRect(0,0,1280,720);const scale=Math.min(1280/img.width,720/img.height);x.drawImage(img,(1280-img.width*scale)/2,(720-img.height*scale)/2,img.width*scale,img.height*scale);return c;}));
 const phone=document.createElement('canvas');phone.width=512;phone.height=1024;const pc=phone.getContext('2d');
 pc.fillStyle='#10110f';pc.fillRect(0,0,512,1024);pc.fillStyle='#fcbf10';pc.fillRect(0,80,512,8);pc.font='20px monospace';pc.fillText('JAMU / CONTACT',40,145);pc.font='bold 78px Arial';pc.fillText('LET’S',35,300);pc.fillText('TALK.',35,385);pc.fillStyle='#ffeeba';pc.font='26px monospace';pc.fillText('Visual design',40,480);pc.fillText('Motion + 3D',40,522);pc.fillStyle='#fcbf10';pc.fillRect(30,620,452,100);pc.fillStyle='#080808';pc.font='bold 27px Arial';pc.fillText('ganijamu@gmail.com',51,680);pc.fillStyle='#aaa48f';pc.font='22px monospace';pc.fillText('Hyderabad, India',40,825);pc.fillStyle='#ffeeba';pc.fillText('Tap to say hello ↗',40,905);
 const display=document.createElement('canvas');display.width=1280;display.height=700;const dc=display.getContext('2d');
 const overlay=document.createElement('canvas');overlay.width=1280;overlay.height=720;const oc=overlay.getContext('2d');
 const cache=new Map(),pending=new Set(),failed=new Map();let queue=[],running=0,w=1,h=1,dpr=1,state=null,current=0,desired=0,disposed=false;
 const nearest=p=>{let lo=0,hi=frames.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(frames[mid].p<p)lo=mid+1;else hi=mid;}return lo>0&&Math.abs(frames[lo-1].p-p)<Math.abs(frames[lo].p-p)?lo-1:lo;};
 async function loadFrame(i){const f=frames[i],[image,mask]=await Promise.all([load(`assets/studio/frames/${f.file}`),f.mask?load(`assets/studio/frames/${f.mask}`):null]);return {image,mask};}
 await Promise.all([0,nearest(.35)].map(async i=>cache.set(i,await loadFrame(i))));
 function trim(){const max=w<700?14:24;if(cache.size<=max)return;for(const k of [...cache.keys()].sort((a,b)=>Math.abs(b-desired)-Math.abs(a-desired))){if(k===current||k===desired)continue;cache.delete(k);if(cache.size<=max)break;}}
 function pump(){while(running<3&&queue.length&&!disposed){const i=queue.shift();if(cache.has(i)||pending.has(i)||Date.now()<(failed.get(i)||0))continue;pending.add(i);running++;loadFrame(i).then(img=>{if(!disposed)cache.set(i,img);trim();}).catch(()=>failed.set(i,Date.now()+5000)).finally(()=>{pending.delete(i);running--;pump();});}}
 function request(i){desired=i;queue=[i,...Array.from({length:8},(_,n)=>i+n+1),...Array.from({length:4},(_,n)=>i-n-1)].filter(k=>k>=0&&k<frames.length&&!cache.has(k)&&!pending.has(k));pump();}
 function resize(width,height){w=width;h=height;dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 function render(p,time,landingAge,reduced){
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#080808';ctx.fillRect(0,0,w,h);
  const active=p>=.59&&p<=.63?0:p>=.69&&p<=.73?1:p>=.79&&p<=.81?2:-1;
  state={active,aboutVisible:(p>=.34&&p<.49)||(p>.885&&p<.92),contactVisible:p>=.975,aboutPoint:{x:.7,y:.35},projectQuads:[],phoneQuad:[],personBounds:null};
  if(p<.16){drawScene(ctx,assets,{width:w,height:h,progress:Math.min(p/.16*.43,.43),landingAge,elapsed:time,reduced});request(0);return state;}
  const target=nearest(p);request(target);current=cache.has(target)?target:[...cache.keys()].sort((a,b)=>Math.abs(a-target)-Math.abs(b-target))[0];
  const f=frames[current],frame=cache.get(current),mobileScale=Math.min(w/1000,h/720),phoneScale=Math.min(w/440,h*.76/720);
  p=f.p;state.active=p>=.59&&p<=.63?0:p>=.69&&p<=.73?1:p>=.79&&p<=.81?2:-1;
  state.aboutVisible=(p>=.34&&p<.49)||(p>.885&&p<.92);state.contactVisible=p>=.975;
  const scale=w/h<1?mobileScale+(phoneScale-mobileScale)*smooth((p-.91)/.075):Math.max(w/1280,h/720),rw=1280*scale,rh=720*scale,ox=(w-rw)/2,oy=(h-rh)/2;
  ctx.drawImage(frame.image,ox,oy,rw,rh);const quad=q=>q.map(v=>[ox+v[0]*rw,oy+v[1]*rh,v[2]]);
  state.projectQuads=f.projects.map(q=>quad([q[3],q[2],q[1],q[0]]));state.phoneQuad=quad(f.phone);
  if(p>.49&&p<.91)for(let i=0;i<3;i++)warp(ctx,works[i],state.projectQuads[i]);
  if(p>.90)warp(ctx,phone,state.phoneQuad);
  if(p<.50||(p>.885&&p<.93)){
   dc.fillStyle='#080808';dc.fillRect(0,0,1280,700);drawScene(dc,assets,{width:1280,height:700,progress:.43,landingAge:Math.max(2,landingAge),elapsed:time,reduced});
   oc.clearRect(0,0,1280,720);warp(oc,display,f.screen.map(v=>[v[0]*1280,v[1]*720,v[2]]));
   if(frame.mask){oc.globalCompositeOperation='destination-out';oc.drawImage(frame.mask,0,0,1280,720);oc.globalCompositeOperation='source-over';}else if(p>.215)oc.clearRect(0,0,1280,720);
   ctx.drawImage(overlay,ox,oy,rw,rh);
  }
  const head=quad([f.head])[0];state.aboutPoint={x:head[0]/w,y:(head[1]+.15*rh)/h};state.personBounds=[head[0]-.13*rw,head[1],head[0]+.23*rw,head[1]+.7*rh];return state;
 }
 function pick(e){if(!state)return null;const r=canvas.getBoundingClientRect(),p=[(e.clientX-r.left)*w/r.width,(e.clientY-r.top)*h/r.height];
  if(state.contactVisible&&inside(p,state.phoneQuad))return 'contact';if(state.active>=0&&inside(p,state.projectQuads[state.active]))return ids[state.active];
  if(state.aboutVisible&&state.personBounds){const [a,b,c,d]=state.personBounds;if(p[0]>=a&&p[0]<=c&&p[1]>=b&&p[1]<=d)return 'about';}return null;
 }
 let down=null;const move=e=>canvas.style.cursor=pick(e)?'pointer':'default',press=e=>down=[e.clientX,e.clientY],cancel=()=>down=null,release=e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>8){down=null;return;}down=null;const hit=pick(e);if(hit==='about')onAbout();else if(hit==='contact')onContact();else if(hit)onProject(hit);};
 canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',press);canvas.addEventListener('pointercancel',cancel);canvas.addEventListener('pointerup',release);
 return {resize,render,dispose(){disposed=true;cache.clear();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',press);canvas.removeEventListener('pointercancel',cancel);canvas.removeEventListener('pointerup',release);}};
}
