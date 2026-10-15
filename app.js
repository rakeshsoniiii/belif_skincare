const products = [
 {id:'anti-acne-gel',name:'Anti Acne Gel',category:'skin',type:'FACE CARE',description:'Explore Anti Acne Gel from Belif Skincare by Nazia. Ask about the complete ingredients and how it fits your routine.'},
 {id:'glow-brightening-lotion',name:'Glow & Brightening Lotion',category:'skin',type:'BODY CARE',description:'Discover Belif’s Glow & Brightening Body Lotion. Contact Nazia for available sizes and formulation details.'},
 {id:'onion-bhringraj-hair-mask',name:'Onion & Bhringraj Hair Mask',category:'hair',type:'HAIR RITUAL',description:'Belif’s public listing mentions onion, bhringraj, aloe vera, fenugreek and hibiscus. Ask Nazia for the complete current formulation and directions.'},
 {id:'kojic-night-cream',name:'Kojic Night Cream',category:'skin',type:'EVENING CARE',description:'Featured on @belif_skincare. Explore this evening-care product with Nazia and confirm its ingredients and directions.'},
 {id:'herbal-hair-powder',name:'Herbal Hair Powder',category:'hair',type:'HAIR CARE',description:'Explore Belif’s herbal hair powder. Ask Nazia about preparation, ingredients and current availability.'},
 {id:'handmade-soaps',name:'Handmade Soaps',category:'skin',type:'BATH & BODY',missing:true,description:'Discover the handmade soap selection. Ask Nazia about current variants and product photographs.'},
 {id:'custom-gift-hampers',name:'Custom Gift Hampers',category:'gifts',type:'THOUGHTFUL GIFTING',missing:true,description:'Create a custom gift hamper with Nazia. Share the occasion and preferred products to explore the available options.'}
];
const enquiry = name => 'https://wa.me/919145562289?text='+encodeURIComponent('Hi Nazia! I would like to know more about '+name+'. Please share the available options and details.');
const imagePath=(p,type)=>`images/products/${p.id}/${type}.webp`;
const escapeHTML=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function ProductImageSwitcher(p){
 const front=p.missing?`<div class="image-placeholder"><span>${p.category==='gifts'?'✧':'❧'}</span><b>${p.name}</b><small>Ask Nazia for current photos</small></div>`:`<img class="front-image" src="${imagePath(p,'front')}" alt="${p.name} — supplied concept artwork" width="1200" height="1200" loading="lazy" decoding="async">`;
 // Unapproved graphic claims stay out of storefront copy. The supplied artwork is available in the explicitly labelled concept gallery.
 return `<div class="image-switcher" id="image-${p.id}"><button class="image-open" data-product="${p.id}" aria-label="View ${escapeHTML(p.name)} gallery">${front}<span class="info-overlay" id="info-${p.id}" aria-hidden="true"><small>BELIF • BY NAZIA</small><strong>${p.name}</strong><span>${p.description}</span><b>Explore full details ↗</b></span></button></div><button class="info-toggle" aria-controls="image-${p.id}" aria-describedby="info-${p.id}" aria-pressed="false" data-info="${p.id}">Quick Info <span>＋</span></button>`;
}
function ProductCard(p){return `<article class="product reveal" data-id="${p.id}" data-category="${p.category}">${ProductImageSwitcher(p)}<div class="product-meta"><p>${p.type}</p><h3><button class="product-title" data-product="${p.id}">${p.name}</button></h3><a class="product-enquire" href="${enquiry(p.name)}" target="_blank" rel="noopener">Enquire on WhatsApp <span>↗</span></a></div></article>`}
document.querySelector('#products').innerHTML=products.map(ProductCard).join('');
document.querySelectorAll('[data-enquiry]').forEach(a=>{a.href=enquiry(a.dataset.enquiry);a.target='_blank';a.rel='noopener'});
let category='all';
function filterProducts(){const search=document.querySelector('#product-search').value.trim().toLowerCase();let count=0;document.querySelectorAll('.product').forEach(card=>{const p=products.find(p=>p.id===card.dataset.id);card.hidden=!(category==='all'||p.category===category)||!p.name.toLowerCase().includes(search);if(!card.hidden){count++;card.classList.add('visible')}});document.querySelector('#filter-status').textContent=count+' products shown';document.querySelector('#no-results')?.remove();if(!count)document.querySelector('#products').insertAdjacentHTML('afterend','<p id="no-results">No matching rituals. Try another search or category.</p>')}
function setCategory(value){category=value;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});filterProducts()}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.filter)));
document.querySelectorAll('[data-category-link]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#product-search').value='';setCategory(a.dataset.categoryLink)}));
document.querySelector('#product-search').addEventListener('input',filterProducts);
document.querySelectorAll('[data-info]').forEach(b=>b.addEventListener('click',()=>{const open=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(open));b.innerHTML=open?'Show product <span>−</span>':'Quick Info <span>＋</span>';document.getElementById('image-'+b.dataset.info).classList.toggle('info-open',open)}));
const dialog=document.querySelector('#product-dialog');let currentProduct,galleryIndex=0;
function renderGallery(){const gallery=document.querySelector('.gallery');gallery.hidden=currentProduct.missing;if(currentProduct.missing)return;const type=galleryIndex?'info':'front',im=document.querySelector('#gallery-image');im.src=imagePath(currentProduct,type);im.alt=currentProduct.name+(galleryIndex?' — supplied information concept, claims unverified':' — supplied packaging concept');document.querySelector('#gallery-caption').textContent=galleryIndex?'Information artwork • ingredients and claims awaiting brand approval':'Front artwork • concept packaging, not verified product photography';document.querySelector('#gallery-thumbs').innerHTML=['front','info'].map((t,i)=>`<button data-thumb="${i}" aria-label="${i?'Information concept':'Front artwork'}" aria-pressed="${galleryIndex===i}"><img src="${imagePath(currentProduct,t)}" alt="" width="70" height="70"></button>`).join('');document.querySelector('#gallery-zoom').classList.remove('zoomed');document.querySelector('#gallery-zoom').setAttribute('aria-pressed','false')}
document.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>{currentProduct=products.find(p=>p.id===b.dataset.product);galleryIndex=0;document.querySelector('#dialog-title').textContent=currentProduct.name;document.querySelector('#dialog-description').textContent=currentProduct.description;document.querySelector('#dialog-link').href=enquiry(currentProduct.name);renderGallery();dialog.showModal()}));
document.querySelector('#gallery-thumbs').addEventListener('click',e=>{const b=e.target.closest('[data-thumb]');if(b){galleryIndex=Number(b.dataset.thumb);renderGallery()}});
function advanceGallery(){galleryIndex=1-galleryIndex;renderGallery()}
document.querySelector('#gallery-prev').addEventListener('click',advanceGallery);document.querySelector('#gallery-next').addEventListener('click',advanceGallery);
dialog.addEventListener('keydown',e=>{if(!currentProduct.missing&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();advanceGallery()}});
document.querySelector('#gallery-zoom').addEventListener('click',e=>{const b=e.currentTarget;b.setAttribute('aria-pressed',String(b.classList.toggle('zoomed')))});
document.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.querySelectorAll('.front-image').forEach(im=>im.addEventListener('error',()=>{im.hidden=true;im.parentElement.insertAdjacentHTML('afterbegin','<span class="image-placeholder">Photo unavailable · open details</span>')},{once:true}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),motion=document.querySelector('#motion');let paused=reduced.matches;
function setMotion(){document.body.classList.toggle('paused',paused);motion.textContent=paused?'Enable motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));document.dispatchEvent(new CustomEvent('belif-motion',{detail:{paused}}))}setMotion();motion.addEventListener('click',()=>{paused=!paused;setMotion()});reduced.addEventListener('change',()=>{paused=reduced.matches;setMotion()});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));if(!reduced.matches)document.body.classList.add('motion-enabled');
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--progress',(max?scrollY/max*100:0)+'%')},{passive:true});

// Reel Video Playback, Sound Controls, and Reduced-Motion Support
const heroVideo = document.querySelector('#hero-video');
const videoToggle = document.querySelector('#video-toggle');
const soundToggle = document.querySelector('#sound-toggle');

if (heroVideo) {
  let userPaused = false;
  function syncVideoButton() {
    if (videoToggle) {
      videoToggle.classList.toggle('paused', heroVideo.paused);
      videoToggle.setAttribute('aria-label', heroVideo.paused ? 'Play hero video' : 'Pause hero video');
      videoToggle.setAttribute('title', heroVideo.paused ? 'Play video' : 'Pause video');
    }
  }
  function playHero() {
    heroVideo.play().catch(syncVideoButton);
  }
  if (videoToggle) {
    videoToggle.addEventListener('click', () => {
      userPaused = !heroVideo.paused;
      if (userPaused) heroVideo.pause();
      else playHero();
    });
  }
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      soundToggle.classList.toggle('unmuted', !heroVideo.muted);
      soundToggle.setAttribute('aria-pressed', String(!heroVideo.muted));
      soundToggle.setAttribute('aria-label', heroVideo.muted ? 'Unmute hero video' : 'Mute hero video');
      soundToggle.setAttribute('title', heroVideo.muted ? 'Unmute audio' : 'Mute audio');
    });
  }
  heroVideo.addEventListener('play', syncVideoButton);
  heroVideo.addEventListener('pause', syncVideoButton);
  document.addEventListener('belif-motion', e => {
    if (e.detail.paused) heroVideo.pause();
    else if (!userPaused) playHero();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) heroVideo.pause();
    else if (!paused && !userPaused) playHero();
  });
  heroVideo.addEventListener('error', () => {
    if (videoToggle) videoToggle.hidden = true;
    if (soundToggle) soundToggle.hidden = true;
    heroVideo.setAttribute('aria-label', 'Brand video unavailable; product poster shown');
  });
  if (!paused) playHero();
  syncVideoButton();

  // Carousel indicator dots
  const dots = document.querySelectorAll('.reel-dot');
  if (dots.length) {
    let activeDot = 0;
    setInterval(() => {
      if (!heroVideo.paused) {
        dots[activeDot]?.classList.remove('active');
        activeDot = (activeDot + 1) % dots.length;
        dots[activeDot]?.classList.add('active');
      }
    }, 3500);
  }
}

// Mobile Navigation Drawer Toggle
const menuToggle = document.querySelector('#menu-toggle');
const menuClose = document.querySelector('#menu-close');
const mobileNav = document.querySelector('#mobile-nav');
const mobileNavBackdrop = document.querySelector('#mobile-nav-backdrop');

function closeMobileNav() {
  if (mobileNav) {
    mobileNav.hidden = true;
    mobileNav.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}
function openMobileNav() {
  if (mobileNav) {
    mobileNav.hidden = false;
    mobileNav.classList.add('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
}
if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    if (!mobileNav.hidden) closeMobileNav();
    else openMobileNav();
  });
}
if (menuClose) menuClose.addEventListener('click', closeMobileNav);
if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav);
if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));
}

