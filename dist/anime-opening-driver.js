import {createOpening} from './anime-opening.js?v=anime-4';
// The host owns scrolling and RAF; this adapter prevents fast scrolling skipping entry/impact.
export function createOpeningDriver(canvas){
 const opening=createOpening(canvas);let driven=0,lastTime=null,settledSince=null;
 function reset(){opening.reset();driven=0;lastTime=null;settledSince=null;}
 return {
  resize(w,h,aspect,pixelRatio=1){opening.resize(w,h,pixelRatio);opening.setTuning({viewportAspect:aspect});},
  render(time,progress,reduced=false){
   if(lastTime!==null&&time<lastTime)reset();
   const dt=lastTime===null?1/60:Math.max(.001,Math.min(.05,time-lastTime));lastTime=time;
   const requested=Math.max(0,Math.min(1,progress/.16));
   const target=opening.getState().entryReady?requested:Math.min(requested,.19);
   // Match the supplied demo's responsive damping, preserving scroll surges.
   driven+=(target-driven)*Math.min(1,dt*12);
   if(Math.abs(target-driven)<.0005)driven=target;
   opening.render({elapsed:time,progress:driven,deltaTime:dt,reducedMotion:reduced});
   const state=opening.getState();if(state.settled){settledSince??=time;}else settledSince=null;
   return state;
  },
  getState(){return {...opening.getState(),revealReady:settledSince!==null&&lastTime-settledSince>=.25};},
  reset,dispose:()=>opening.dispose()
 };
}
