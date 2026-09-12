import { gsap, ScrollTrigger, initScroll, scrollTo, stopScroll, startScroll, reducedMotion, lenis } from './scroll';
import { initCursor } from './cursor';
import { initReveals } from './reveal';
import { initMagnetic } from './ui/magnetic';
import { drawTicks, initLiveWatch } from './ui/watch';
import { initTunnel } from './webgl/tunnel';
import { initHero } from './sections/hero';
import { initHistoria, initFrames, initTypeset, initBrunch, initDoor, initMap, initSusan, initContacts, initBottom, initChrome, initStrips, initMenuOverlay } from './sections/landings';

/* ---------- Preloader: the pocket watch ---------- */
function preload(): Promise<void> {
  const loader = document.getElementById('loader')!;
  if (reducedMotion) { loader.remove(); return Promise.resolve(); }
  stopScroll();
  const watch = loader.querySelector<SVGElement>('.watch')!;
  drawTicks(watch);
  const hh = watch.querySelector('.watch__hand--h')!, mh = watch.querySelector('.watch__hand--m')!;
  const pct = document.getElementById('loaderPct')!;
  const rabbit = loader.querySelector<HTMLElement>('.loader__rabbit')!;

  const spin = gsap.timeline({ repeat: -1 })
    .to(mh, { rotation: '+=360', duration: 0.9, ease: 'none', svgOrigin: '60 60' }, 0)
    .to(hh, { rotation: '+=30', duration: 0.9, ease: 'none', svgOrigin: '60 60' }, 0);

  const heroImg = document.querySelector<HTMLImageElement>('.rabbit__img')!;
  const assets = Promise.all([
    document.fonts.ready,
    heroImg.complete ? Promise.resolve() : new Promise((r) => { heroImg.onload = heroImg.onerror = () => r(null); }),
  ]);
  const minTime = new Promise((r) => setTimeout(r, 1100));
  const counter = { v: 0 };
  gsap.to(counter, { v: 92, duration: 1.1, ease: 'power2.out', onUpdate: () => { pct.textContent = String(Math.round(counter.v)); } });

  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      gsap.to(counter, { v: 100, duration: 0.25, onUpdate: () => { pct.textContent = String(Math.round(counter.v)); } });
      spin.kill();
      gsap.timeline({ onComplete: () => { loader.remove(); startScroll(); resolve(); } })
        .to(mh, { rotation: 0, duration: 0.5, ease: 'back.out(2)', svgOrigin: '60 60', modifiers: { rotation: (r) => `${parseFloat(r) % 360}` } }, 0)
        .to(hh, { rotation: 0, duration: 0.5, ease: 'back.out(2)', svgOrigin: '60 60', modifiers: { rotation: (r) => `${parseFloat(r) % 360}` } }, 0)
        .to(rabbit, { x: 0, rotation: 0, duration: 0.6, ease: 'back.out(1.6)' }, 0.1)
        .to(rabbit, { x: '-14%', y: '-6%', duration: 0.25, ease: 'power2.in', yoyo: true, repeat: 1 }, 0.7)
        .to(rabbit, { x: '120%', duration: 0.5, ease: 'power3.in' }, 1.15)
        .to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 1.25);
    };
    Promise.all([assets, minTime]).then(finish);
    setTimeout(finish, 3200);                       // never hold the page hostage
    loader.addEventListener('click', finish);
  });
}

/* ---------- Boot ---------- */
async function boot() {
  initScroll();
  const intro = initHero();
  initReveals();
  initFrames();
  initTypeset();
  initHistoria();
  initBrunch();
  initDoor();
  initMap();
  initSusan();
  initContacts();
  initBottom();
  initChrome();
  initStrips();
  initMenuOverlay();
  initMagnetic();
  initLiveWatch();
  initTunnel();
  initCursor();

  // anchor links go through Lenis
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]:not([data-menu])').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      if (id === '#') return;
      e.preventDefault();
      scrollTo(id === '#top' ? 0 : id, id === '#top' ? 0 : -20);
    });
  });

  await preload();
  ScrollTrigger.refresh();
  lenis?.resize();
  const hash = location.hash;
  if (hash && hash !== '#top' && document.querySelector(hash)) {
    intro?.progress(1);                 // also arms the hero pin, which adds height above the target
    ScrollTrigger.refresh();
    lenis?.resize();
    requestAnimationFrame(() => { scrollTo(hash, -20, true); setTimeout(() => scrollTo(hash, -20, true), 400); });
  } else intro?.play();
}

boot();
