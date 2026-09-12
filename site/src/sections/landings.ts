import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { gsap, ScrollTrigger, isTouch, reducedMotion, velocity, stopScroll, startScroll } from '../scroll';
import { burst } from '../ui/sparkle';

gsap.registerPlugin(Draggable, InertiaPlugin, MotionPathPlugin);

/* ---------- História: the deck fans out ---------- */
export function initHistoria() {
  const cards = gsap.utils.toArray<HTMLElement>('#deck .pcard');
  if (reducedMotion || !cards.length) return;
  gsap.set(cards, { rotation: (i) => (i - 1) * 2, y: 0 });
  gsap.from(cards, {
    x: (i) => (1 - i) * 240, y: 60, rotation: (i) => (i - 1) * -30, opacity: 0,
    duration: 1.1, ease: 'power3.out', stagger: 0.08,
    scrollTrigger: { trigger: '#deck', start: 'top 80%', once: true },
  });
  if (isTouch) return;
  cards.forEach((c) => {
    c.addEventListener('pointerenter', () => gsap.to(c, { y: -18, rotation: 0, scale: 1.04, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }));
    c.addEventListener('pointerleave', () => gsap.to(c, { y: 0, rotation: (cards.indexOf(c) - 1) * 2, scale: 1, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }));
  });
}

/* ---------- Storybook frames: parallax + looking-glass ripple ---------- */
export function initFrames() {
  if (reducedMotion) return;
  const disp = document.getElementById('rippleDisp')!;
  const turb = document.getElementById('rippleTurb')!;
  const ripple = { scale: 0, seed: 3 };
  let rippleTween: gsap.core.Tween | null = null;

  document.querySelectorAll<HTMLElement>('.frame, .door__room').forEach((fr) => {
    const img = fr.querySelector('img')!;
    gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: fr, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  if (isTouch) return;
  document.querySelectorAll<HTMLElement>('[data-ripple]').forEach((fr) => {
    fr.addEventListener('pointerenter', () => {
      fr.classList.add('is-rippling');
      ripple.seed = Math.floor(Math.random() * 100);
      turb.setAttribute('seed', String(ripple.seed));
      rippleTween?.kill();
      rippleTween = gsap.timeline()
        .to(ripple, { scale: 22, duration: 0.35, ease: 'power2.out', onUpdate: () => disp.setAttribute('scale', ripple.scale.toFixed(1)) })
        .to(ripple, { scale: 0, duration: 0.9, ease: 'power2.inOut', onUpdate: () => disp.setAttribute('scale', ripple.scale.toFixed(1)), onComplete: () => fr.classList.remove('is-rippling') }) as unknown as gsap.core.Tween;
    });
  });
}

/* ---------- Experiência: "Bebe-me, come-me" typesets itself ---------- */
export function initTypeset() {
  const el = document.getElementById('typeset');
  if (!el) return;
  const text = el.textContent!;
  el.innerHTML = text.split('').map((c) => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  if (reducedMotion) { el.classList.add('is-done'); return; }
  gsap.to(el.querySelectorAll('.ch'), { opacity: 1, duration: 0.05, stagger: 0.06, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onComplete: () => el.classList.add('is-done') });
}

/* ---------- Brunch: menu cards flip, the tag swings ---------- */
export function initBrunch() {
  document.querySelectorAll<HTMLElement>('.mcard').forEach((c) => {
    c.addEventListener('click', (e) => { c.classList.toggle('is-flipped'); burst(e.clientX, e.clientY, 8); });
  });
  const tag = document.getElementById('drinkme');
  if (!tag || reducedMotion) return;
  gsap.fromTo(tag, { rotation: -7 }, { rotation: 7, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  ScrollTrigger.create({ trigger: tag, start: 'top 90%', onEnter: () => gsap.fromTo(tag, { rotation: -26 }, { rotation: 7, duration: 2.4, ease: 'elastic.out(1, 0.35)', overwrite: true,
    onComplete: () => gsap.fromTo(tag, { rotation: 7 }, { rotation: -7, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }) }), once: true });
}

/* ---------- Eventos: the door swings open ---------- */
export function initDoor() {
  const door = document.getElementById('door');
  if (!door) return;
  const leaf = door.querySelector<HTMLElement>('.door__leaf')!;
  if (reducedMotion) { leaf.style.transform = 'rotateY(-104deg)'; return; }
  gsap.to(leaf, { rotateY: -104, duration: 1.6, ease: 'power3.inOut', scrollTrigger: { trigger: door, start: 'top 70%', once: true } });
  door.addEventListener('click', () => gsap.to(leaf, { rotateY: gsap.getProperty(leaf, 'rotateY') === 0 ? -104 : 0, duration: 1.2, ease: 'power3.inOut' }));
  door.addEventListener('pointerenter', () => gsap.to(leaf, { rotateY: -116, duration: 0.8, ease: 'power2.out' }));
  door.addEventListener('pointerleave', () => gsap.to(leaf, { rotateY: -104, duration: 0.8, ease: 'power2.out' }));
}

/* ---------- Localização: the rabbit runs to the pin ---------- */
export function initMap() {
  const map = document.getElementById('map');
  const runner = document.getElementById('runner');
  if (!map || !runner) return;
  // Google embed can be blocked; fall back to the static map if the iframe never loads
  const iframe = map.querySelector<HTMLIFrameElement>('.map__embed');
  if (iframe) {
    let loaded = false;
    iframe.addEventListener('load', () => { loaded = true; });
    setTimeout(() => { if (!loaded) map.classList.add('no-embed'); }, 6000);
  }
  if (reducedMotion) return;
  const pin = map.querySelector('.map__pin')!;
  gsap.to(pin, { y: -6, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.timeline({ scrollTrigger: { trigger: map, start: 'top 70%', once: true } })
    .set(runner, { opacity: 1 })
    .to(runner, { duration: 3.2, ease: 'power1.inOut',
      motionPath: { path: '#rabbitPath', align: '#rabbitPath', alignOrigin: [0.5, 0.9], autoRotate: false } })
    .to(runner, { rotation: 8, duration: 0.18, yoyo: true, repeat: 17, ease: 'sine.inOut' }, 0)
    .to(runner, { opacity: 0, scale: 0.6, duration: 0.5 }, '-=0.1')
    .fromTo(pin, { scale: 1 }, { scale: 1.5, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut', transformOrigin: '50% 100%' }, '-=0.4');
}

/* ---------- Dizem: the lazy susan ---------- */
export function initSusan() {
  const susan = document.getElementById('susan');
  const wheel = document.getElementById('wheel');
  if (!susan || !wheel) return;
  const reviews = gsap.utils.toArray<HTMLElement>('.review', wheel);
  const stars = wheel.querySelectorAll<HTMLElement>('.stars');
  if (reducedMotion) { stars.forEach((s) => s.querySelectorAll('i').forEach((i) => i.classList.add('is-lit'))); return; }
  stars.forEach((s) => {
    const lit = Array.from(s.children);
    ScrollTrigger.create({ trigger: s, start: 'top 92%', once: true, onEnter: () => lit.forEach((i, k) => setTimeout(() => i.classList.add('is-lit'), 140 * k)) });
  });

  const spread = () => parseFloat(getComputedStyle(wheel).getPropertyValue('--spread')) || 34;
  const PX_PER_DEG = 7;
  const state = { rot: 0 };

  // the front card upright and bright, the others receding
  const shade = () => {
    reviews.forEach((r, i) => {
      const a = state.rot + (i - 1) * spread();
      const k = 1 - Math.min(Math.abs(a) / (spread() * 2), 1);
      gsap.set(r, { opacity: 0.4 + 0.6 * k, scale: 0.92 + 0.08 * k });
    });
  };
  const setRot = (deg: number) => { state.rot = deg; gsap.set(wheel, { rotation: deg }); shade(); };
  setRot(0);

  // drag a hidden proxy horizontally; x maps to wheel rotation
  const proxy = document.createElement('div');
  const drag = Draggable.create(proxy, {
    type: 'x', trigger: susan, inertia: true,
    bounds: { minX: -spread() * PX_PER_DEG, maxX: spread() * PX_PER_DEG },
    snap: { x: (v) => Math.round(v / (spread() * PX_PER_DEG)) * spread() * PX_PER_DEG },
    onPress: () => { susan.classList.add('is-dragging'); idle.pause(); },
    onDrag() { setRot(-this.x / PX_PER_DEG); },
    onThrowUpdate() { setRot(-this.x / PX_PER_DEG); },
    onRelease: () => susan.classList.remove('is-dragging'),
    onThrowComplete: () => idle.restart(true),
  })[0];

  // slow idle swing between the three cards
  const idle = gsap.timeline({ repeat: -1, paused: true, defaults: { duration: 1.5, ease: 'power3.inOut' } })
    .to(state, { rot: -spread(), delay: 4, onUpdate: () => setRot(state.rot) })
    .to(state, { rot: spread(), delay: 4, onUpdate: () => setRot(state.rot) })
    .to(state, { rot: 0, delay: 4, onUpdate: () => setRot(state.rot) })
    .eventCallback('onUpdate', () => { gsap.set(proxy, { x: -state.rot * PX_PER_DEG }); drag.update(); });
  ScrollTrigger.create({ trigger: susan, start: 'top 85%', end: 'bottom 15%', onToggle: (s) => (s.isActive ? idle.play() : idle.pause()) });
}

/* ---------- Contactos: copy to clipboard ---------- */
export function initContacts() {
  document.querySelectorAll<HTMLButtonElement>('.copy').forEach((b) => {
    const original = b.textContent!;
    b.addEventListener('click', async (e) => {
      try { await navigator.clipboard.writeText(b.dataset.copy!); } catch { return; }
      b.textContent = 'Copiado ✓'; b.classList.add('is-copied');
      burst(e.clientX, e.clientY, 8);
      setTimeout(() => { b.textContent = original; b.classList.remove('is-copied'); }, 1600);
    });
  });
}

/* ---------- Footer: the bottom of the hole ---------- */
export function initBottom() {
  const rabbit = document.querySelector<HTMLElement>('.bottom__rabbit img');
  const arrived = document.getElementById('arrived');
  if (!rabbit || !arrived || reducedMotion) return;
  gsap.to(rabbit, { scaleY: 0.97, duration: 0.12, yoyo: true, repeat: -1, repeatDelay: 3.4, ease: 'sine.inOut', transformOrigin: '50% 100%' });
  ScrollTrigger.create({ trigger: '#bottom', start: 'top 80%', onEnter: () => {
    if (velocity.peak > 45) gsap.fromTo(arrived, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.4 });
  } });
}

/* ---------- Persistent UI: chapter dots and top bar ---------- */
export function initChrome() {
  const bar = document.querySelector('.topbar')!;
  const nav = document.querySelector('.chapters')!;
  const links = nav.querySelectorAll<HTMLAnchorElement>('a');
  ScrollTrigger.create({ start: 120, onUpdate: (s) => bar.classList.toggle('is-scrolled', s.scroll() > 120) });
  links.forEach((a) => {
    const id = a.getAttribute('href')!;
    if (id === '#top') return;
    ScrollTrigger.create({ trigger: id, start: 'top 55%', end: 'bottom 55%',
      onToggle: (s) => { if (s.isActive) { links.forEach((l) => l.classList.remove('is-active')); a.classList.add('is-active'); } } });
  });
  ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) { links.forEach((l) => l.classList.remove('is-active')); links[0].classList.add('is-active'); } } });
  // dark ground while falling or at the bottom
  document.querySelectorAll('.fall, .bottom').forEach((f) => {
    ScrollTrigger.create({ trigger: f, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => { nav.classList.toggle('is-dark', s.isActive); bar.classList.toggle('is-dark', s.isActive); } });
  });
}

/* ---------- Photo strips: drift sideways as the section scrolls ---------- */
export function initStrips() {
  document.querySelectorAll<HTMLElement>('.strip').forEach((strip) => {
    const track = strip.querySelector<HTMLElement>('.strip__track')!;
    const dir = Number(strip.dataset.dir) || 1;
    const place = () => {
      const overflow = Math.max(track.scrollWidth - strip.clientWidth, 0);
      return { from: dir > 0 ? -overflow : 0, to: dir > 0 ? 0 : -overflow };
    };
    if (reducedMotion) { gsap.set(track, { x: () => place().from + (place().to - place().from) / 2 }); return; }
    gsap.fromTo(track, { x: () => place().from }, { x: () => place().to, ease: 'none',
      scrollTrigger: { trigger: strip, start: 'top bottom', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true } });
    // polaroids swing a little as they arrive
    gsap.from(strip.querySelectorAll('.polaroid'), { rotation: (i) => (i % 2 ? 9 : -9), transformOrigin: '50% -10px', duration: 1.6, ease: 'elastic.out(1, 0.45)', stagger: 0.08,
      scrollTrigger: { trigger: strip, start: 'top 85%', once: true } });
  });
}

/* ---------- Menu overlay: the Alice Brunch poster ---------- */
export function initMenuOverlay() {
  const overlay = document.getElementById('menuOverlay');
  const close = document.getElementById('menuClose');
  if (!overlay || !close) return;
  const img = overlay.querySelector<HTMLElement>('.menu-overlay__img')!;
  let opener: HTMLElement | null = null;
  const open = (from?: HTMLElement) => {
    opener = from ?? null;
    overlay.hidden = false;
    stopScroll();
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(img, { y: 40, rotation: -2, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 });
    close.focus();
  };
  const shut = () => {
    gsap.to(overlay, { opacity: 0, duration: 0.25, onComplete: () => { overlay.hidden = true; startScroll(); opener?.focus(); } });
  };
  document.querySelectorAll<HTMLElement>('[data-menu]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); open(el); }));
  close.addEventListener('click', shut);
  overlay.addEventListener('click', (e) => { if (e.target === overlay || (e.target as HTMLElement).classList.contains('menu-overlay__scroll')) shut(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) shut(); });
}
