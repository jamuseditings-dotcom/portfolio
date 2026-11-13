import * as T from './vendor/three.module.min.js';

// Character alone uses an image; room maps are intentionally not loaded.
export async function makeLiveMaterials(meta){
 const portrait=await new T.TextureLoader().loadAsync('assets/live/ME-DIFFUSE.jpg');
 portrait.colorSpace=T.SRGBColorSpace;portrait.flipY=false;portrait.anisotropy=4;
 const result=new Map();
 for(const name of Object.keys(meta.materials)){
  let m;
  if(name==='BODY'||name==='dress'){
   m=new T.MeshBasicMaterial({map:portrait,color:0xffffff,toneMapped:false,side:T.DoubleSide});
   m.userData.textureFile='ME-DIFFUSE.jpg';m.userData.character=true;
  }else if(name.includes('Outline')||name==='BLK'){
   m=new T.MeshBasicMaterial({color:0x090a0c,toneMapped:false});
  }else if(name.startsWith('RGB Glow')||name==='PC_RGB_Fan_Simple'||name==='emison'||name==='light'){
   m=new T.MeshBasicMaterial({color:0xffcf24,toneMapped:false});
  }else if(['Material.094','Material.098','Material.101','Material.003','Material.006'].includes(name)){
   m=new T.MeshBasicMaterial({color:0x737970,transparent:true,opacity:.12,depthWrite:false,toneMapped:false});
  }else{
   const color=name==='table_Web_Diffuse'?0xcfb661:name==='wall_Web_Diffuse'?0x858477:name==='Door'?0xbfa445:name==='Frame'?0x34362f:0x67685e;
   m=new T.MeshLambertMaterial({color,toneMapped:false});
   m.userData.hatch=true;
   m.onBeforeCompile=s=>{
    s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>',`
float lightValue=dot(reflectedLight.directDiffuse+reflectedLight.indirectDiffuse,vec3(.2126,.7152,.0722));
float shade=clamp(lightValue*2.0,0.0,1.0);
float band=shade>.65?1.0:(shade>.25?.62:.29);
vec2 paper=gl_FragCoord.xy;
float lineA=abs(fract((paper.x+paper.y)*.105)-.5);
float lineB=abs(fract((paper.x-paper.y)*.105)-.5);
float inkA=1.-smoothstep(.065,.17,lineA);
float inkB=1.-smoothstep(.055,.16,lineB);
float ink=max(inkA*(1.-smoothstep(.42,.72,shade)),inkB*(1.-smoothstep(.08,.3,shade)));
vec3 paint=diffuseColor.rgb*band;
paint=mix(paint,vec3(.006,.007,.008),ink*.83);
float edge=1.-abs(dot(normalize(normal),normalize(vViewPosition)));
outgoingLight=mix(paint,vec3(.006,.007,.008),smoothstep(.88,.97,edge));
#include <opaque_fragment>`);
   };
   m.customProgramCacheKey=()=> 'jamu-flat-hatch-v1';
  }
  m.name=name;result.set(name,m);
 }
 return result;
}
