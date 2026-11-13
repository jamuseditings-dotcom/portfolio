import * as T from './vendor/three.module.min.js';
import {bindSuppliedTextures} from './live-texture-bindings.js?v=texture-links-2';
const f=v=>Number(v).toFixed(7),v3=c=>`vec3(${c.slice(0,3).map(f).join(',')})`;
const textureLoader=new T.TextureLoader();
export async function makeLiveMaterials(meta){
 meta=bindSuppliedTextures(meta);
 const textures=new Map();await Promise.all([...new Set(Object.values(meta.materials).map(m=>m.texture).filter(Boolean))].map(async name=>{const t=await textureLoader.loadAsync('assets/live/'+name);t.colorSpace=T.SRGBColorSpace;t.flipY=false;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;textures.set(name,t);}));
 const result=new Map();
 for(const [name,d] of Object.entries(meta.materials)){
  const map=textures.get(d.texture),p=d.params;let m;
  if(d.group==='Fast_SpiderVerse_Lines'){
   m=new T.MeshLambertMaterial({color:0xffffff,map:map||null});
   m.onBeforeCompile=s=>{
    // Register the image through Three's native map/UV path. Apply it at the
    // existing overlay stage, not twice or as a change to the light bands.
    s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>','');
    s.vertexShader='varying vec3 artPosition;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nartPosition=position;');
    s.fragmentShader=`varying vec3 artPosition;
float artHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float artNoise(vec3 p){vec3 i=floor(p),u=fract(p);u=u*u*(3.-2.*u);return mix(mix(mix(artHash(i),artHash(i+vec3(1,0,0)),u.x),mix(artHash(i+vec3(0,1,0)),artHash(i+vec3(1,1,0)),u.x),u.y),mix(mix(artHash(i+vec3(0,0,1)),artHash(i+vec3(1,0,1)),u.x),mix(artHash(i+vec3(0,1,1)),artHash(i+vec3(1,1,1)),u.x),u.y),u.z);}
vec3 artOverlay(vec3 a,vec3 b){return mix(2.*a*b,1.-2.*(1.-a)*(1.-b),step(vec3(.5),a));}
`+s.fragmentShader;
    // Port of authored Fast_SpiderVerse_Lines: wave -> threshold bands -> noise soft-light -> texture overlay -> facing rim.
    s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',`
float illumination=dot(reflectedLight.directDiffuse+reflectedLight.indirectDiffuse,vec3(.2126,.7152,.0722))*.8;
vec3 coord=artPosition;
float wavePhase=(coord.x+coord.y+coord.z)*${f(p['Line Scale']*20)}+${f(p['Line Wobble'])}*artNoise(coord*8.);
float wave=.5+.5*sin(wavePhase);
float aa=max(fwidth(wavePhase),.01);wave=mix(wave,.5,smoothstep(1.5,6.,aa));
float bands=illumination+(wave-.5)*${f(p['Line Thickness / Spread'])};
vec3 paint=mix(${v3(p['2. Base Color'])},${v3(p['1. Highlight Color'])},step(${f(p['Highlight Threshold'])},bands));
paint=mix(paint,${v3(p['3. Midtone Color'])},1.-step(${f(p['Midtone Threshold'])},bands));
paint=mix(paint,${v3(p['4. Shadow Color'])},1.-step(${f(p['Shadow Threshold'])},bands));
float grain=artNoise(coord*${f(p['Grunge Scale'])});
vec3 soft=(1.-2.*grain)*paint*paint+2.*grain*paint;
paint=mix(paint,soft,${f(p['Subtle Grunge Strength'])});
${map?`vec3 tex=texture2D(map,vMapUv).rgb;paint=mix(paint,artOverlay(paint,tex),${f(p['Custom Texture Overlay'])});`:''}
float facing=1.-abs(dot(normalize(normal),normalize(vViewPosition)));
float rim=step(.72,pow(facing,${f(Math.max(.1,1-p['Rim Width']))}))*clamp(illumination,0.,1.);
outgoingLight=mix(paint,${v3(p['6. Rim Color'])},rim);
#include <opaque_fragment>`);
   };m.customProgramCacheKey=()=>name;
  }else if(name==='BODY')m=new T.MeshStandardMaterial({map,color:0xffffff,roughness:.47,metalness:0});
  else if(name.includes('Ink_Outline')||name==='BLK')m=new T.MeshBasicMaterial({color:0x010101,side:T.FrontSide});
  else if(name.startsWith('RGB Glow')||name==='PC_RGB_Fan_Simple'){
   m=new T.MeshBasicMaterial({color:0xffffff,toneMapped:false});m.onBeforeCompile=s=>{s.vertexShader='varying vec3 rgbPos;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nrgbPos=position;');s.fragmentShader='varying vec3 rgbPos;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nvec3 rainbow=.55+.45*cos((rgbPos.x+rgbPos.y+rgbPos.z)*25.+vec3(0.,2.094,4.188));diffuseColor.rgb=mix(rainbow,vec3(1.),.20);');};
  }else if(name==='emison')m=new T.MeshStandardMaterial({color:0xffd867,emissive:new T.Color().fromArray(d.emission),emissiveIntensity:d.emissionStrength});
  else if(p['Outline Color']){
   m=new T.MeshLambertMaterial({color:new T.Color().fromArray(p['Color 1'])});m.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',`float facing=1.-abs(dot(normalize(normal),normalize(vViewPosition)));outgoingLight=mix(outgoingLight,${v3(p['Outline Color'])},smoothstep(.94,.985,facing));\n#include <opaque_fragment>`);};
  }else if(['Material.094','Material.098','Material.101','Material.003','Material.006'].includes(name))m=new T.MeshPhysicalMaterial({color:0x292929,roughness:.25,metalness:.1,transparent:true,opacity:.15,depthWrite:false});
  else m=new T.MeshStandardMaterial({color:new T.Color().fromArray(d.base),map,roughness:d.roughness,metalness:d.metallic});
  m.name=name;m.userData.textureFile=d.texture||null;result.set(name,m);
 }return result;
}
