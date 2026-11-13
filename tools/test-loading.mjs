import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const code=fs.readFileSync(new URL('../dist/loading.js',import.meta.url),'utf8');
function run(){
 const timers=[],listeners={},classes=new Set(['is-loading']),content=[{},{}];let removed=false,reloaded=false;
 const loader={setAttribute(k,v){this[k]=v;},classList:{add:c=>classes.add(c)},remove(){removed=true;}};
 const help={hidden:true},retry={addEventListener:(n,fn)=>listeners.retry=fn};
 const nodes={'site-loader':loader,'loader-help':help,'loader-retry':retry};
 vm.runInNewContext(code,{document:{getElementById:id=>nodes[id],querySelectorAll:()=>content,body:{classList:{remove:c=>classes.delete(c)}}},window:{addEventListener:(n,fn)=>listeners[n]=fn},setTimeout:(fn,ms)=>(timers.push({fn,ms}),timers.length),clearTimeout:i=>timers[i-1].cleared=true,location:{reload:()=>reloaded=true}});
 assert.ok(content.every(e=>e.inert));assert.equal(help.hidden,true);
 timers[0].fn();assert.equal(help.hidden,false);listeners.retry();assert.equal(reloaded,true);
 listeners['jamu:ready']();assert.ok(content.every(e=>!e.inert));assert.ok(!classes.has('is-loading'));assert.ok(classes.has('is-done'));assert.equal(loader['aria-hidden'],'true');assert.equal(timers[0].cleared,true);
 timers[1].fn();assert.equal(removed,true);listeners['jamu:ready']();assert.equal(timers.length,2);
}
run();
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'),app=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
assert.ok(html.includes('src="assets/mark.svg"'));assert.ok(html.includes('prefers-reduced-motion:reduce'));assert.ok(html.includes('#site-loader{display:none!important}'));
assert.ok(app.includes(".finally(()=>{"));assert.ok(app.includes("new Event('jamu:ready')"));
console.log('PASS: loader waits, delayed retry, ready dismissal, inert cleanup, reduced-motion/noscript hooks, fallback finally path.');
