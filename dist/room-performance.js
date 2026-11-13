// The native opening stays full-resolution/full-rate. Only the small room monitor is budgeted.
export function monitorPlan(progress,width,height,dpr=1){
 if(progress<.30)return {width,height,dpr:Math.min(dpr,2),interval:0,native:true,visible:true};
 const scale=Math.min(1,1280/Math.max(width,height));
 return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale)),dpr:1,interval:1/30,native:false,visible:progress<.53||progress>.85};
}
export function createRoomResolution(width,height,dpr=1){
 const initial=Math.min(dpr,1.5,Math.sqrt(2100000/(width*height)));
 let ratio=initial,slow=0,cooldown=18;
 return {get ratio(){return ratio;},sample(dt){
  if(cooldown>0){cooldown--;return false;}
  if(dt<=0||dt>.15)return false;
  slow=dt>1/32?slow+1:Math.max(0,slow-2);
  if(slow<18||ratio<=initial*.75+.001)return false;
  ratio=Math.max(initial*.75,ratio-.1);slow=0;cooldown=180;return true;
 }};
}
