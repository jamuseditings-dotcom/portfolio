import * as T from './vendor/three.module.min.js';
const keys={Highlight:'highlight',Midtone:'midtone',Shadow:'shadow',Ink:'ink','Rim colour':'rimColor','Light direction':'key','Shadow threshold':'shadowThreshold','Highlight threshold':'highlightThreshold','Hatch frequency':'frequency','Hatch thickness':'thickness','Hatch angle':'angle','Hatch opacity':'opacity','Crosshatch':'crosshatch','Grain amount':'grain','Rim width':'rimWidth','Rim strength':'rimStrength'};
export function createInkMaterial(d,map){
 const uniforms={};for(const [k,n] of Object.entries(keys)){const v=d.params[k];uniforms[n]={value:Array.isArray(v)?new T.Vector3(...v.slice(0,3)):v};}
 uniforms.portrait={value:map||null};uniforms.hasPortrait={value:!!map};uniforms.textureWeight={value:d.textureSlot===1?1-d.textureMix:d.textureMix||0};
 return new T.ShaderMaterial({uniforms,toneMapped:true,vertexShader:`
#include <common>
#include <skinning_pars_vertex>
varying vec3 artPosition,artNormal,artViewNormal,artView;varying vec2 artUV;
void main(){
 #include <skinbase_vertex>
 #include <beginnormal_vertex>
 #include <skinnormal_vertex>
 vec3 transformed=vec3(position);
 #include <skinning_vertex>
 artPosition=vec3(transformed.x,-transformed.z,transformed.y);
 artNormal=vec3(objectNormal.x,-objectNormal.z,objectNormal.y);
 artViewNormal=normalMatrix*objectNormal;
 vec4 mv=modelViewMatrix*vec4(transformed,1.);artView=-mv.xyz;artUV=uv;
 gl_Position=projectionMatrix*mv;
}`,fragmentShader:`
uniform vec3 highlight,midtone,shadow,ink,rimColor,key;
uniform float shadowThreshold,highlightThreshold,frequency,thickness,angle,opacity,crosshatch,grain,rimWidth,rimStrength,textureWeight;
uniform sampler2D portrait;uniform bool hasPortrait;
varying vec3 artPosition,artNormal,artViewNormal,artView;varying vec2 artUV;
float stripe(float x){float w=abs(sin(x*frequency*3.141592653589793));float aa=max(fwidth(w),.001);return 1.-smoothstep(thickness-aa,thickness+aa,w);}
void main(){
 float shade=dot(normalize(artNormal),key/max(length(key),.000001))*.5+.5;
 float dark=1.-step(shadowThreshold,shade),lit=step(highlightThreshold,shade);
 vec3 paint=mix(mix(midtone,shadow,dark),highlight,lit);
 float c=cos(angle),s=sin(angle),u=artPosition.x*c+artPosition.z*s,v=artPosition.z*c-artPosition.x*s;
 paint=mix(paint,ink,max(stripe(u)*(1.-lit),stripe(v)*dark*crosshatch)*opacity);
 paint=mix(paint,ink,(sin(dot(artPosition,vec3(173.,291.,127.)))+1.)*.5*grain);
 float facing=abs(dot(normalize(artViewNormal),normalize(artView)));
 paint=mix(paint,rimColor,(1.-step(rimWidth,facing))*rimStrength);
 if(hasPortrait)paint=mix(paint,texture2D(portrait,artUV).rgb,textureWeight);
 gl_FragColor=vec4(paint,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`});
}
export async function makePCMaterials(meta){
 const textures=new Map();await Promise.all([...new Set(Object.values(meta.materials).map(d=>d.texture).filter(Boolean))].map(async file=>{const t=await new T.TextureLoader().loadAsync('assets/pc-new/'+file);t.colorSpace=T.SRGBColorSpace;t.flipY=false;t.anisotropy=4;textures.set(file,t);}));const result=new Map();
 for(const [name,d] of Object.entries(meta.materials)){
  const map=textures.get(d.texture);let m;
  if(d.kind==='jamu')m=createInkMaterial(d,map);
  else if(d.kind==='character')m=new T.MeshBasicMaterial({map,color:0xffffff});
  else if(d.kind==='outline')m=new T.MeshBasicMaterial({color:new T.Color().fromArray(d.base),side:T.FrontSide});
  else if(d.rgb){
   const {ramp,offset,strength}=d.rgb,f=v=>Number(v).toFixed(8),color=c=>`vec3(${c.slice(0,3).map(f).join(',')})`;
   const paint=ramp?`float t=clamp(rgbUV.x,0.,1.);vec3 rainbow=${color(ramp[0][1])};`+ramp.slice(1).map((r,i)=>`rainbow=mix(rainbow,${color(r[1])},clamp((t-${f(ramp[i][0])})/${f(r[0]-ramp[i][0])},0.,1.));`).join(''):`float hue=atan(rgbPosition.y,rgbPosition.x)/6.28318530718+.5+${f(offset)};vec3 rainbow=clamp(abs(fract(hue+vec3(0.,.6666667,.3333333))*6.-3.)-1.,0.,1.);`;
   m=new T.MeshBasicMaterial({color:0xffffff});m.onBeforeCompile=s=>{s.vertexShader='varying vec3 rgbPosition;varying vec2 rgbUV;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nrgbPosition=vec3(position.x,-position.z,position.y);rgbUV=uv;');s.fragmentShader='varying vec3 rgbPosition;varying vec2 rgbUV;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+paint+`diffuseColor.rgb=rainbow*${f(strength)};`);};m.customProgramCacheKey=()=>name;
  }else if(d.legacyParams?.['Color 1'])m=new T.MeshBasicMaterial({color:new T.Color().fromArray(d.legacyParams['Color 1'])});
  else m=new T.MeshBasicMaterial({map:map||null,color:map?0xffffff:new T.Color().fromArray(d.base),transparent:(d.alpha??1)<1,opacity:d.alpha??1});
  if(m.transparent)m.depthWrite=false;if(m.opacity===0)m.visible=false;m.toneMapped=true;m.name=name;m.userData.textureFile=d.texture||null;result.set(name,m);
 }return result;
}
