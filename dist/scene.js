export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const mix=(a,b,t)=>a+(b-a)*t;
export const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
// Six authored SVG cels, played in a loop. No procedural replacement flames.
const celSequence=[0,1,2,3,4,5];
function drawFlamingMark(ctx,meteor,frames,x,y,unit,time,settled,reduced){
 const frame=reduced||settled||!frames?meteor:frames[celSequence[Math.floor(Math.max(0,time)*12)%6]];
 ctx.drawImage(frame,x,y,5000*unit,5000*unit);
}
const fract=n=>n-Math.floor(n);
const stars=Array.from({length:106},(_,i)=>({x:fract(Math.sin(i*127.1+17)*43758.5453),y:fract(Math.sin(i*311.7+81)*18539.13),size:i%17===0?4.6:i%7===0?1.7:.55+(i%3)*.3,phase:i*1.37}));
function drawStarfield(ctx,f,time,age,reduced){
 const k=Math.min(f.w/850,f.h/550),pulse=reduced||age<0?0:Math.exp(-age*5)*Math.sin(Math.min(age/.4,1)*Math.PI);
 ctx.save();
 for(const star of stars){
  // Lower contrast directly behind the wordmark leaves its silhouette clear.
  const quiet=star.x>.2&&star.x<.82&&star.y>.28&&star.y<.66?.32:1;
  const twinkle=reduced?1:.8+.2*Math.sin(time*.7+star.phase);
  const dx=star.x-.3,dy=star.y-.35,d=Math.hypot(dx,dy)||1;
  const px=f.x+star.x*f.w+dx/d*pulse*18*k,py=f.y+star.y*f.h+dy/d*pulse*18*k;
  const size=star.size*Math.max(.6,k);
  ctx.globalAlpha=(star.size>3?.75:.5)*quiet*twinkle;ctx.fillStyle=star.size>3?'#fcbf10':'#ffeeba';
  if(star.size>3){ctx.beginPath();ctx.moveTo(px,py-size*1.5);ctx.lineTo(px+size*.22,py-size*.2);ctx.lineTo(px+size,py);ctx.lineTo(px+size*.2,py+size*.25);ctx.lineTo(px,py+size*1.5);ctx.lineTo(px-size*.2,py+size*.2);ctx.lineTo(px-size,py);ctx.lineTo(px-size*.2,py-size*.2);ctx.closePath();ctx.fill();}
  else ctx.fillRect(px,py,size,size*.8);
 }
 // A pair of scuffed yellow strips: the same tape language as the page below.
 ctx.globalAlpha=.55;ctx.translate(f.x+f.w*.075,f.y+f.h*.82);ctx.rotate(-.22);ctx.fillStyle='#fcbf10';
 for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(i*12*k,0);ctx.lineTo(i*12*k+7*k,-2*k);ctx.lineTo(i*12*k+5*k,47*k);ctx.lineTo(i*12*k-2*k,45*k);ctx.closePath();ctx.fill();}
 ctx.restore();
}
function drawLetterReveal(ctx,assets,x,y,unit,age,reduced){
 if(reduced||age>=1.24||!assets.letterFrames){ctx.drawImage(assets.letters,x,y,5000*unit,5000*unit);return;}
 const centers=[1070,1860,2880,3930];
 for(let i=0;i<4;i++){
  const t=clamp((age-i*.11)/.90);if(!t)continue;
  // A continuous damped spring with zero initial velocity and a small overshoot.
  const spring=v=>1-Math.exp(-7*v)*(Math.cos(8*v)+.875*Math.sin(8*v));
  const ease=spring(t)/spring(1),cx=x+centers[i]*unit,cy=y+3061*unit;
  ctx.save();ctx.beginPath();ctx.rect(x,y+1820*unit,5000*unit,1260*unit);ctx.clip();
  ctx.translate(cx,cy+(1-ease)*880*unit);ctx.rotate((1-ease)*(i%2?-.045:.045));
  ctx.scale(1,.94+.06*ease);ctx.globalAlpha=smooth(t/.25);
  ctx.drawImage(assets.letterFrames[i],x-cx,y-cy,5000*unit,5000*unit);ctx.restore();
 }
}
export function layout(w,h,p){
 const z=smooth((p-.46)/.42),mobile=w/h<1.05;
 const initialScale=Math.max(w/710,h/346)*1.015;
 const finalScale=mobile?w/1250:Math.min(w/1659,h/948)*.99;
 const scale=Math.exp(mix(Math.log(initialScale),Math.log(finalScale),z));
 const finalX=mobile?w*.5-870*finalScale:(w-1659*finalScale)/2;
 const finalY=mobile?h*.30:Math.max(h*.075,h-948*finalScale);
 const cx=mix(w/2,finalX+686*finalScale,z),cy=mix(h/2,finalY+443*finalScale,z);
 const x=cx-686*scale,y=cy-443*scale;
 const screen={x:x+331*scale,y:y+271*scale,w:710*scale,h:346*scale};
 const fw=Math.min(w,screen.w),fh=Math.min(h,screen.h);
 const frame={x:cx-fw/2,y:cy-fh/2,w:fw,h:fh};
 return{z,mobile,scale,x,y,screen,frame};
}
export function drawScene(ctx,assets,{width:w,height:h,progress:p,landingAge:age=(p-.205)/.135*1.24,elapsed:time,reduced=false}){
 const {desk,planet,letters,meteor}=assets;
 const {z,mobile,scale,x,y,screen,frame:f}=layout(w,h,p);
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#080808';ctx.fillRect(0,0,w,h);
 ctx.save();ctx.globalAlpha=smooth(z/.13);ctx.globalCompositeOperation='screen';ctx.drawImage(desk,x,y,1659*scale,948*scale);ctx.restore();
 // The screen is a tracked aperture in the illustration. Its lower right edge follows the shoulder.
 ctx.save();ctx.beginPath();ctx.moveTo(screen.x,screen.y);ctx.lineTo(screen.x+screen.w,screen.y);ctx.lineTo(screen.x+screen.w,screen.y+screen.h*.72);ctx.lineTo(screen.x+screen.w*.893,screen.y+screen.h);ctx.lineTo(screen.x,screen.y+screen.h);ctx.closePath();ctx.clip();
 ctx.fillStyle='#080808';ctx.fillRect(screen.x,screen.y,screen.w,screen.h);
 drawStarfield(ctx,f,time,age,reduced);
 const settle=1-(1-clamp((p-.035)/.17))**3,intro=reduced||p>.06?1:1-(1-clamp(time/1.05))**3;
 const unit=Math.min(f.w*.89/3724,f.h*.54/2334);
 const logoCx=f.x+f.w*.5,logoCy=f.y+f.h*(mobile?.36:.43);
 const baseX=logoCx-2500*unit,baseY=logoCy-1894*unit;
 const atmosphere=reduced?1:smooth((age-.45)/1);
 const planetAlpha=Math.max(smooth((p-.285)/.12),atmosphere);
 ctx.save();ctx.globalAlpha=planetAlpha;ctx.globalCompositeOperation='screen';const size=Math.max(f.w*.70,f.h*.59);ctx.drawImage(planet,f.x+f.w*.55,f.y+f.h*.65,size,size);ctx.restore();
 // One orbit, not a field of decoration. It lives inside the same monitor artwork.
 ctx.save();ctx.globalAlpha=Math.max(smooth((p-.26)/.12),atmosphere)*.72;ctx.strokeStyle='#fcbf10';ctx.lineWidth=Math.max(.6,Math.min(2,f.w*.0016));ctx.beginPath();ctx.ellipse(logoCx,f.y+f.h*.28,f.w*.45,f.h*.105,-.23,0,Math.PI*2);ctx.stroke();ctx.restore();
 const endX=baseX+1380*unit,endY=baseY+1590*unit;
 const restX=f.x+f.w*(mobile?.43:.48),restY=f.y+f.h*.33;
 const hitX=mix(f.x+f.w+160,restX,intro),hitY=mix(f.y-200,restY,intro);
 const coreX=mix(hitX,endX,settle),coreY=mix(hitY,endY,settle);
 const mx=(coreX-endX)/unit,my=(coreY-endY)/unit;
 // The mark and type share a short recoil, while the monitor aperture stays fixed.
 const kick=reduced||age<0?0:Math.sin(age*30)*Math.exp(-age*10)*(1-smooth((p-.42)/.04));
 ctx.save();ctx.translate(0,kick*65*unit);
 drawLetterReveal(ctx,assets,baseX,baseY,unit,age,reduced);
 drawFlamingMark(ctx,meteor,assets.flameFrames,baseX+mx*unit,baseY+my*unit,unit,time,p>=.205,reduced);
 ctx.restore();
 // One expanding, broken ink ring at contact; no full-screen flash.
 if(age>0&&age<.65&&!reduced){
  const life=age/.65,radius=(260+760*(1-(1-life)**3))*unit;
  ctx.save();ctx.globalAlpha=(1-life)**2*.7;ctx.strokeStyle='#fcbf10';ctx.lineWidth=Math.max(.7,unit*12*(1-life));
  for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(endX,endY+260*unit,radius,radius*.32,-.17,i*1.3,i*1.3+.78);ctx.stroke();}
  for(let i=0;i<8;i++){const angle=i*2.399,near=radius*.8,far=near+(1-life)*110*unit;ctx.beginPath();ctx.moveTo(endX+Math.cos(angle)*near,endY+Math.sin(angle)*near*.6);ctx.lineTo(endX+Math.cos(angle)*far,endY+Math.sin(angle)*far*.6);ctx.stroke();}
  ctx.restore();
 }
 // The only hero copy. It scales with the screen during the pullback.
 ctx.save();ctx.globalAlpha=Math.max(smooth((p-.33)/.08),smooth((age-1.1)/.35));ctx.fillStyle='#ffeeba';ctx.textAlign='left';const font=Math.max(3,Math.min(15,f.w*.029));ctx.font=`${font}px monospace`;
 const baseline=logoCy+(3061-1894)*unit+font*2.6;
 ctx.fillText('Visual designer. Moving ideas.',f.x+f.w*.085,baseline);
 ctx.strokeStyle='#ffeeba';ctx.lineWidth=Math.max(.6,font*.08);const ax=f.x+f.w*.09,ay=Math.max(baseline+font*3,f.y+f.h*.71),len=font*2.6;
 ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax,ay+len);ctx.lineTo(ax-font*.4,ay+len-font*.5);ctx.moveTo(ax,ay+len);ctx.lineTo(ax+font*.4,ay+len-font*.5);ctx.stroke();ctx.restore();ctx.restore();
}
