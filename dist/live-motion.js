import * as T from './vendor/three.module.min.js';
// Ambient time and scroll pose are intentionally independent.
export function createAmbientMotion(source,clips){
 const tracks=clips.flatMap(c=>c.tracks),fans=tracks.filter(t=>/^Object_528/.test(t.name)),body=tracks.filter(t=>!/^Object_528|^FANS|^Camera/.test(t.name));
 const pose=new T.AnimationMixer(source),spin=new T.AnimationMixer(source);
 if(body.length)pose.clipAction(new T.AnimationClip('Scroll pose',-1,body)).play();
 if(fans.length)spin.clipAction(new T.AnimationClip('Always spinning',-1,fans)).play();
 const fingers=[],wrists=[],bones=[],baseline=new Map();source.traverse(o=>{if(!o.isBone)return;bones.push(o);if(/Hand(Index|Middle|Ring|Pinky)[123]$/.test(o.name))fingers.push(o);if(/(Left|Right)Hand$/.test(o.name))wrists.push(o);});
 const head=source.getObjectByName('mixamorigHead'),spine=source.getObjectByName('mixamorigSpine2');
 return {fingers,wrists,fans,update(time,relax=0,reduced=false){
  for(const bone of bones)if(baseline.has(bone))bone.quaternion.copy(baseline.get(bone));
  pose.setTime((88+relax*60)/24);spin.setTime(reduced?0:time);
  for(const bone of bones)baseline.set(bone,bone.quaternion.clone());
  if(reduced)return;
  const typing=1-relax*.85;
  fingers.forEach((bone,i)=>{const pulse=Math.max(0,Math.sin(time*(8.5+(i%3)*.7)+i*1.83));bone.rotation.z+=pulse*pulse*.14*typing;});
  wrists.forEach((bone,i)=>{bone.rotation.x+=Math.sin(time*5.2+i*2.2)*.012*typing;});
  if(head){head.rotation.y+=Math.sin(time*.7)*.018;head.rotation.z+=Math.sin(time*.43)*.008;}
  if(spine)spine.rotation.x+=Math.sin(time*1.4)*.005;
 }};
}
