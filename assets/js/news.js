(()=>{'use strict';
const grid=document.getElementById('news-list');if(!grid)return;
const section=document.getElementById('aktuelles'),filters=section.querySelector('.news-filters');
const items=(Array.isArray(window.DV_NEWS?.items)?window.DV_NEWS.items:[]).filter(x=>x&&x.published!==false&&typeof x.title==='string');
if(!items.length){section.hidden=true;return;}
const safeImage=name=>typeof name==='string'&&/^[a-zA-Z0-9_-]+\.(webp|png|jpe?g)$/.test(name)?'./assets/images/'+name:null;
const safeLink=value=>typeof value==='string'&&/^(index\.html|unternehmen\/index\.html|leistungen\/index\.html|kontakt\/index\.html)([?#][a-zA-Z0-9_=&%-]*)?$/.test(value)?'./'+value:null;
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
function draw(category='Alle'){
 grid.replaceChildren();
 items.filter(item=>category==='Alle'||item.category===category).forEach(item=>{
 const article=node('article','news-card');const src=safeImage(item.image);
 if(src){const image=node('img','news-image');image.src=src;image.alt=item.imageAlt||'';image.loading='lazy';image.decoding='async';article.append(image);}
 const content=node('div','news-content'),meta=node('div','news-meta');meta.append(node('span','label',item.category||'Neuigkeiten'));
 if(/^\d{4}-\d{2}-\d{2}$/.test(item.date||'')){const d=new Date(item.date+'T12:00:00');if(!Number.isNaN(d.getTime())){const time=node('time','',new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d));time.dateTime=item.date;meta.append(time);}}
 content.append(meta,node('h3','',item.title),node('p','',item.text||''));
 const href=safeLink(item.link);if(href){const a=node('a','text-link',item.linkLabel||'Mehr erfahren');a.href=href;const arrow=node('span','','↗');arrow.setAttribute('aria-hidden','true');a.append(arrow);content.append(a);}
 article.append(content);grid.append(article);
 });
 filters.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.textContent===category)));
}
const categories=[...new Set(items.map(item=>item.category||'Neuigkeiten'))];
if(categories.length>1){filters.hidden=false;['Alle',...categories].forEach(category=>{const button=node('button','',category);button.type='button';button.addEventListener('click',()=>draw(category));filters.append(button);});}
draw();
})();
