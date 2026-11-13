import * as T from './vendor/three.module.min.js';

// Linear HDR bloom, composited before the existing AgX display transform.
// The original material colours and packed images are left untouched.
export function createPCGlow(renderer){
 const options={type:T.HalfFloatType,depthBuffer:false,minFilter:T.LinearFilter,magFilter:T.LinearFilter};
 const base=new T.WebGLRenderTarget(1,1,{...options,depthBuffer:true,samples:2});
 const bright=new T.WebGLRenderTarget(1,1,options),ping=bright.clone(),soft=bright.clone();
 const widePing=bright.clone(),wide=bright.clone();
 const camera=new T.OrthographicCamera(-1,1,1,-1,0,1),scene=new T.Scene();
 const vertexShader='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
 const material=(uniforms,fragmentShader,toneMapped=false)=>new T.ShaderMaterial({uniforms,vertexShader,fragmentShader,depthTest:false,depthWrite:false,toneMapped});
 const extract=material({source:{value:base.texture}},`varying vec2 vUv;uniform sampler2D source;void main(){vec3 c=texture2D(source,vUv).rgb;float peak=max(c.r,max(c.g,c.b));float gate=smoothstep(.7,1.5,peak);gl_FragColor=vec4(c*gate,1.);}`);
 const blur=material({source:{value:bright.texture},stepSize:{value:new T.Vector2()}},`varying vec2 vUv;uniform sampler2D source;uniform vec2 stepSize;void main(){vec3 c=texture2D(source,vUv).rgb*.227027;c+=(texture2D(source,vUv+stepSize*1.384615).rgb+texture2D(source,vUv-stepSize*1.384615).rgb)*.316216;c+=(texture2D(source,vUv+stepSize*3.230769).rgb+texture2D(source,vUv-stepSize*3.230769).rgb)*.070270;gl_FragColor=vec4(c,1.);}`);
 const composite=material({source:{value:base.texture},glow:{value:soft.texture},wideGlow:{value:wide.texture},pixelSize:{value:new T.Vector2(1,1)},strength:{value:.16},treatment:{value:1},aberration:{value:1},vibrance:{value:.07}},`varying vec2 vUv;uniform sampler2D source,glow,wideGlow;uniform vec2 pixelSize;uniform float strength,treatment,aberration,vibrance;void main(){vec2 radial=vUv-.5;vec2 shift=radial*dot(radial,radial)*3.2*pixelSize*aberration;vec3 baseColor=vec3(texture2D(source,clamp(vUv+shift,0.,1.)).r,texture2D(source,vUv).g,texture2D(source,clamp(vUv-shift,0.,1.)).b);vec3 bloom=mix(texture2D(glow,vUv).rgb,texture2D(wideGlow,vUv).rgb,.4);vec3 combined=baseColor+bloom*strength;float luma=dot(combined,vec3(.2126,.7152,.0722));float saturation=(max(combined.r,max(combined.g,combined.b))-min(combined.r,min(combined.g,combined.b)))/max(max(combined.r,max(combined.g,combined.b)),.0001);combined=mix(vec3(luma),combined,1.+vibrance*(1.-clamp(saturation,0.,1.)));gl_FragColor=vec4(max(combined,vec3(0.)),1.);
 #include <tonemapping_fragment>
 // The reveal uniform also gates the complete display treatment. At zero,
 // bypass exposure, AgX, bloom and vibrance; only linear-to-sRGB remains.
 gl_FragColor.rgb=mix(baseColor,gl_FragColor.rgb,treatment);
 #include <colorspace_fragment>
 }`,true);
 const quad=new T.Mesh(new T.PlaneGeometry(2,2),extract);scene.add(quad);
 function pass(mat,target){quad.material=mat;renderer.setRenderTarget(target);renderer.render(scene,camera);}
 return {
  setSize(w,h){base.setSize(w,h);composite.uniforms.pixelSize.value.set(1/w,1/h);for(const target of [bright,ping,soft])target.setSize(Math.max(1,Math.ceil(w/4)),Math.max(1,Math.ceil(h/4)));for(const target of [widePing,wide])target.setSize(Math.max(1,Math.ceil(w/8)),Math.max(1,Math.ceil(h/8)));},
  setEnabled(enabled){composite.uniforms.strength.value=enabled?.16:0;},
  setStrength(value){composite.uniforms.strength.value=value;},
  setTreatment(value){composite.uniforms.treatment.value=value;},
  setReveal(value){composite.uniforms.aberration.value=value;composite.uniforms.vibrance.value=.07*value;},
  render(world,view){
   const mapping=renderer.toneMapping;renderer.toneMapping=T.NoToneMapping;renderer.setRenderTarget(base);renderer.render(world,view);
   pass(extract,bright);blur.uniforms.source.value=bright.texture;blur.uniforms.stepSize.value.set(2/bright.width,0);pass(blur,ping);
   blur.uniforms.source.value=ping.texture;blur.uniforms.stepSize.value.set(0,2/bright.height);pass(blur,soft);
   blur.uniforms.source.value=soft.texture;blur.uniforms.stepSize.value.set(3/wide.width,0);pass(blur,widePing);
   blur.uniforms.source.value=widePing.texture;blur.uniforms.stepSize.value.set(0,3/wide.height);pass(blur,wide);
   renderer.toneMapping=mapping;pass(composite,null);
  }
 };
}
