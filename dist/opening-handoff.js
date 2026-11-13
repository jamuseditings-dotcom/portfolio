import * as T from './vendor/three.module.min.js';

export function openingOpacity(progress){
 const t=T.MathUtils.clamp((progress-.16)/.018,0,1);
 return 1-t*t*(3-2*t);
}

// Project the SAME canvas through the opening camera onto the curved panel.
// Homogeneous coordinates avoid perspective/triangle interpolation distortion.
export function createOpeningHandoff(screen,texture){
 const original=screen.material;
 const projection=new T.Matrix4();
 const material=new T.ShaderMaterial({
  uniforms:{openingMap:{value:texture},openingProjection:{value:projection}},
  side:T.DoubleSide,toneMapped:false,
  vertexShader:`uniform mat4 openingProjection;varying vec4 openingClip;
   void main(){vec4 world=modelMatrix*vec4(position,1.);openingClip=openingProjection*world;gl_Position=projectionMatrix*viewMatrix*world;}`,
  fragmentShader:`uniform sampler2D openingMap;varying vec4 openingClip;
   void main(){vec2 uv=openingClip.xy/openingClip.w*.5+.5;
    vec2 bounded=clamp(uv,0.,1.);vec3 c=texture2D(openingMap,bounded).rgb;
    float outside=max(max(-uv.x,uv.x-1.),max(-uv.y,uv.y-1.));
    c=mix(c,vec3(.002428,.002125,.001821),smoothstep(0.,.08,outside));
    gl_FragColor=vec4(c,1.);
    #include <colorspace_fragment>
   }`
 });
 screen.material=material;
 return {calibrate(camera){projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);},dispose(){screen.material=original;material.dispose();}};
}
