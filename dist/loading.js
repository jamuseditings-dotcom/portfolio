// Small independent boot script: the fire remains visible while scene assets load.
(()=>{
 const loader=document.getElementById('site-loader');
 if(!loader)return;
 const content=[...document.querySelectorAll('main,.header')];
 content.forEach(el=>el.inert=true);
 let finished=false;
 const slowTimer=setTimeout(()=>{
  if(finished)return;
  document.getElementById('loader-help').hidden=false;
 },45000);
 document.getElementById('loader-retry').addEventListener('click',()=>location.reload());
 window.addEventListener('jamu:ready',()=>{
  if(finished)return;finished=true;clearTimeout(slowTimer);
  content.forEach(el=>el.inert=false);
  document.body.classList.remove('is-loading');
  loader.setAttribute('aria-hidden','true');loader.classList.add('is-done');
  setTimeout(()=>loader.remove(),300);
 },{once:true});
})();
