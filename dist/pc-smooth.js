import * as T from './vendor/three.module.min.js';
// Shade smooth only. No vertex, UV, bone-weight, silhouette or texture changes.
export function smoothCharacter(source){
 let count=0;source.traverse(o=>{if(!o.isSkinnedMesh||!['BODY','JAMU Ink'].includes(o.material.name)||o.geometry.userData.characterSmooth)return;
  const g=o.geometry,p=g.attributes.position,index=g.index,skin=g.attributes.skinIndex,weights=g.attributes.skinWeight,groups=new Map(),keys=[];
  for(let i=0;i<p.count;i++){let key=[p.getX(i),p.getY(i),p.getZ(i)].map(n=>Math.round(n*1e6)).join(',');if(skin&&weights)key+=':'+Array.from({length:4},(_,j)=>skin.getComponent(i,j)+','+Math.round(weights.getComponent(i,j)*1e6)).join(';');keys[i]=key;if(!groups.has(key))groups.set(key,new T.Vector3());}
  const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),normal=new T.Vector3();
  for(let i=0;i<(index?.count||p.count);i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);a.fromBufferAttribute(p,ids[0]);b.fromBufferAttribute(p,ids[1]);c.fromBufferAttribute(p,ids[2]);normal.crossVectors(b.sub(a),c.sub(a));for(const id of ids)groups.get(keys[id]).add(normal);}
  const values=new Float32Array(p.count*3);for(let i=0;i<p.count;i++)groups.get(keys[i]).clone().normalize().toArray(values,i*3);
  g.setAttribute('normal',new T.BufferAttribute(values,3));g.userData.characterSmooth=true;count++;
 });return count;
}
