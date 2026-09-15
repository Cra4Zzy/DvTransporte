/* DV Transporte — progressive enhancement, no framework or CDN dependency. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
const menu=$('.menu-toggle'), nav=$('#navigation');
function closeMenu(){nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');if(menu)menu.innerHTML='Menü <span aria-hidden="true">＋</span>';}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.innerHTML=open?'Schließen <span aria-hidden="true">−</span>':'Menü <span aria-hidden="true">＋</span>';});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
const serviceButtons=$$('[data-service]');
serviceButtons.forEach(button=>button.addEventListener('click',()=>{const index=button.dataset.service;serviceButtons.forEach(b=>{const active=b===button;b.setAttribute('aria-expanded',String(active));$('.service-symbol',b).textContent=active?'−':'+';$('#'+b.getAttribute('aria-controls')).hidden=!active;});$$('[data-service-image]').forEach(f=>f.hidden=f.dataset.serviceImage!==index);}));
const slider=$('[data-gallery-slider]');
if(slider){
 const slides=$$('[data-gallery-slide]',slider),prev=$('[data-gallery-prev]',slider),next=$('[data-gallery-next]',slider),current=$('[data-gallery-current]',slider),progress=$('[data-gallery-progress]',slider),dots=$$('[data-gallery-to]',slider);let active=0,timer,touchStartX=0;
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function setFocusable(slide,enabled){$$('a,button',slide).forEach(el=>{if(enabled)el.removeAttribute('tabindex');else el.setAttribute('tabindex','-1');});}
 function go(index,direction){const target=(index+slides.length)%slides.length;if(target===active)return;slider.dataset.direction=direction||(target>active?'next':'prev');slides[active].classList.remove('is-active');slides[active].setAttribute('aria-hidden','true');setFocusable(slides[active],false);active=target;slides[active].classList.add('is-active');slides[active].setAttribute('aria-hidden','false');setFocusable(slides[active],true);if(current)current.textContent=String(active+1).padStart(2,'0');if(progress)progress.style.width=((active+1)/slides.length*100)+'%';dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===active)));}
 function stop(){if(timer){clearInterval(timer);timer=undefined;}}
 function start(){if(reducedMotion||slides.length<2||document.hidden)return;stop();timer=setInterval(()=>go(active+1,'next'),6500);}
 prev?.addEventListener('click',()=>{go(active-1,'prev');start();});next?.addEventListener('click',()=>{go(active+1,'next');start();});dots.forEach((dot,i)=>dot.addEventListener('click',()=>{go(i,i<active?'prev':'next');start();}));
 slider.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(active+1,'next');start();}if(e.key==='ArrowLeft'){e.preventDefault();go(active-1,'prev');start();}});
 slider.addEventListener('mouseenter',stop);slider.addEventListener('mouseleave',start);slider.addEventListener('focusin',stop);slider.addEventListener('focusout',e=>{if(!slider.contains(e.relatedTarget))start();});
 slider.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX;stop();},{passive:true});slider.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchStartX;if(Math.abs(delta)>45)go(active+(delta<0?1:-1),delta<0?'next':'prev');start();},{passive:true});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 slides.forEach((slide,i)=>{slide.setAttribute('aria-hidden',String(i!==0));setFocusable(slide,i===0);});if(progress)progress.style.width=(100/slides.length)+'%';start();
}

const lightbox=$('.lightbox'),gallery=$$('[data-lightbox]');let activeImage=0,lastTrigger;
function showImage(index){activeImage=(index+gallery.length)%gallery.length;const item=gallery[activeImage],photo=$('figure img',lightbox);photo.src=item.href;photo.alt=item.dataset.caption;$('figcaption',lightbox).textContent=`${item.dataset.caption} — ${activeImage+1} / ${gallery.length}`;}
if(lightbox&&typeof lightbox.showModal==='function'){
 gallery.forEach((item,i)=>item.addEventListener('click',e=>{e.preventDefault();lastTrigger=item;showImage(i);lightbox.showModal();document.body.style.overflow='hidden';}));
 $('.lightbox-close',lightbox).addEventListener('click',()=>lightbox.close());$('.lightbox-prev',lightbox).addEventListener('click',()=>showImage(activeImage-1));$('.lightbox-next',lightbox).addEventListener('click',()=>showImage(activeImage+1));
 lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});lightbox.addEventListener('close',()=>{document.body.style.overflow='';lastTrigger?.focus();});lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showImage(activeImage+1);}if(e.key==='ArrowLeft'){e.preventDefault();showImage(activeImage-1);}});
}
const reduce=matchMedia('(prefers-reduced-motion: reduce)');const progress=$('.scroll-progress');let frame;
function syncScroll(){frame=undefined;const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.transform=`scaleX(${max>0?Math.max(0,Math.min(1,scrollY/max)):0})`;}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(syncScroll);},{passive:true});addEventListener('resize',syncScroll);syncScroll();
if('IntersectionObserver'in window&&!reduce.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal-in');observer.unobserve(entry.target);}}),{threshold:.12});$$('.section-heading,.fleet-copy,.owner-copy,.service-detail>div,.company-story>div,.gallery-slider').forEach(e=>observer.observe(e));}
const params=new URLSearchParams(location.search),form=$('form'),feedback=$('.form-feedback');
if(form){const select=$('[name=vehicle]',form);if(/^[0-2]$/.test(params.get('leistung')||''))select.selectedIndex=Number(params.get('leistung'));
if(params.has('sent')||params.has('error')){const note=document.createElement('p');note.className='notice '+(params.has('sent')?'notice--success':'notice--error');note.setAttribute('role','status');note.textContent=params.has('sent')?'Ihre Anfrage wurde an den Mailserver übergeben. Vielen Dank!':'Die Anfrage konnte nicht versendet werden. Bitte schreiben Sie an info@dvtransporte.de oder rufen Sie uns an.';form.before(note);}
form.addEventListener('submit',e=>{if(location.protocol==='file:'){e.preventDefault();feedback.textContent='In der lokalen Vorschau ist kein Serverversand möglich. Nutzen Sie „per E-Mail schreiben“ oder öffnen Sie die Website auf Ihrem Webspace.';return;}const button=$('[type=submit]',form);button.disabled=true;button.textContent='Wird gesendet …';});
}
})();
// Restore submit controls when returning through the browser's back/forward cache.
addEventListener('pageshow',()=>{const button=document.querySelector('form button[type="submit"]');if(button){button.disabled=false;button.textContent='Anfrage senden';}});
