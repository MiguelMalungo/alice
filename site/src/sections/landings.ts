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
  const badge = document.querySelector<HTMLElement>('.bottom__badge img');
  const wrap = document.getElementById('badge');
  const arrived = document.getElementById('arrived');
  if (!badge || !wrap || !arrived || reducedMotion) return;
  // the stamp slowly turns in the lamplight, and leans toward the cursor
  const idle = gsap.to(badge, { rotationY: 14, rotationX: -6, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  if (!isTouch) {
    const rx = gsap.quickTo(badge, 'rotationX', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(badge, 'rotationY', { duration: 0.5, ease: 'power3' });
    wrap.addEventListener('pointerenter', () => idle.pause());
    wrap.addEventListener('pointermove', (e) => { const r = wrap.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 40); rx(-((e.clientY - r.top) / r.height - 0.5) * 30); });
    wrap.addEventListener('pointerleave', () => { rx(0); ry(0); gsap.delayedCall(0.6, () => idle.resume()); });
  }
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

/* ---------- Photo strips: a horizontal scroller you can drag, swipe, wheel or arrow through ---------- */
export function initStrips() {
  document.querySelectorAll<HTMLElement>('.strip-wrap').forEach((wrap) => {
    const strip = wrap.querySelector<HTMLElement>('.strip')!;
    const polaroids = strip.querySelectorAll<HTMLElement>('.polaroid');
    const prev = wrap.querySelector<HTMLButtonElement>('.strip__nav--l');
    const next = wrap.querySelector<HTMLButtonElement>('.strip__nav--r');
    const arrow = wrap.querySelector('.strip__hint span');
    const step = () => (polaroids[0]?.offsetWidth || 240) + 28;
    const maxLeft = () => strip.scrollWidth - strip.clientWidth;

    const updateNav = () => {
      if (prev) prev.disabled = strip.scrollLeft <= 2;
      if (next) next.disabled = strip.scrollLeft >= maxLeft() - 2;
    };
    strip.addEventListener('scroll', updateNav, { passive: true });
    addEventListener('resize', updateNav);
    updateNav();

    const glide = (to: number) => gsap.to(strip, { scrollLeft: gsap.utils.clamp(0, maxLeft(), to), duration: 0.7, ease: 'power3.out', overwrite: true });
    prev?.addEventListener('click', () => glide(strip.scrollLeft - step() * 2));
    next?.addEventListener('click', () => glide(strip.scrollLeft + step() * 2));

    // mouse drag to scroll, with a little inertia on release
    let dragging = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, vx = 0;
    strip.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;               // touch already scrolls natively
      dragging = true; startX = lastX = e.clientX; startLeft = strip.scrollLeft; lastT = performance.now(); vx = 0;
      strip.classList.add('is-dragging'); strip.setPointerCapture(e.pointerId); gsap.killTweensOf(strip);
    });
    strip.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const now = performance.now(); vx = (e.clientX - lastX) / Math.max(now - lastT, 1); lastX = e.clientX; lastT = now;
      strip.scrollLeft = startLeft - (e.clientX - startX);
    });
    const release = () => {
      if (!dragging) return; dragging = false; strip.classList.remove('is-dragging');
      glide(strip.scrollLeft - vx * 260);
    };
    strip.addEventListener('pointerup', release); strip.addEventListener('pointercancel', release);
    // a sideways trackpad gesture scrolls the strip natively; Lenis must not see it
    strip.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation(); }, { passive: true });

    if (reducedMotion) return;
    gsap.from(polaroids, { rotation: (i) => (i % 2 ? 9 : -9), transformOrigin: '50% -10px', duration: 1.6, ease: 'elastic.out(1, 0.45)', stagger: 0.08,
      scrollTrigger: { trigger: strip, start: 'top 85%', once: true } });
    if (arrow) gsap.to(arrow, { x: 6, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    // nudge once so people see it moves
    ScrollTrigger.create({ trigger: strip, start: 'top 75%', once: true, onEnter: () => {
      gsap.to(strip, { scrollLeft: 70, duration: 0.6, ease: 'power2.out', delay: 0.5, yoyo: true, repeat: 1, repeatDelay: 0.2 });
    } });
  });
}

/* ---------- Menu overlay: the Alice Brunch poster and the Signature Coffee page ---------- */
export function initMenuOverlay() {
  const overlay = document.getElementById('menuOverlay');
  const close = document.getElementById('menuClose');
  if (!overlay || !close) return;
  const tabs = overlay.querySelectorAll<HTMLButtonElement>('.menu-overlay__tab');
  const pages = overlay.querySelectorAll<HTMLElement>('.menu-overlay__page');
  const scroll = overlay.querySelector<HTMLElement>('.menu-overlay__scroll')!;
  let opener: HTMLElement | null = null;
  const showPage = (name: string) => {
    tabs.forEach((t) => { const on = t.dataset.page === name; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
    pages.forEach((p) => p.classList.toggle('is-active', p.dataset.page === name));
    scroll.scrollTop = 0;
    const page = overlay.querySelector<HTMLElement>(`.menu-overlay__page[data-page="${name}"]`)!;
    gsap.fromTo(page.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06, overwrite: true });
  };
  const open = (from?: HTMLElement) => {
    opener = from ?? null;
    overlay.hidden = false;
    stopScroll();
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    showPage(from?.dataset.menuPage || 'brunch');
    close.focus();
  };
  const shut = () => {
    gsap.to(overlay, { opacity: 0, duration: 0.25, onComplete: () => { overlay.hidden = true; startScroll(); opener?.focus(); } });
  };
  document.querySelectorAll<HTMLElement>('[data-menu]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); open(el); }));
  tabs.forEach((t) => t.addEventListener('click', () => showPage(t.dataset.page!)));
  close.addEventListener('click', shut);
  overlay.addEventListener('click', (e) => { if (e.target === overlay || e.target === scroll) shut(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) shut(); });
}

/* ---------- The magic lantern: campaign frames crossfade inside the storybook frame ---------- */
export function initLantern() {
  const lantern = document.getElementById('lantern');
  if (!lantern) return;
  const frames = Array.from(lantern.querySelectorAll<HTMLImageElement>('.lantern__frame')).slice(0, isTouch ? 6 : 10);
  lantern.querySelectorAll<HTMLImageElement>('.lantern__frame').forEach((f, i) => { if (i >= frames.length) f.remove(); });
  const crank = document.getElementById('crank')!;
  const arm = crank.querySelector<SVGGElement>('.crank__arm')!;
  const count = document.getElementById('lanternCount')!;
  let i = 0, playing = false, loaded = false;
  let timer: gsap.core.Tween | null = null;

  const load = () => { if (loaded) return; loaded = true; frames.forEach((f) => { if (f.dataset.src) { f.src = f.dataset.src; delete f.dataset.src; } }); };
  const show = (n: number, dir = 1) => {
    const prev = frames[i]; i = (n + frames.length) % frames.length; const next = frames[i];
    count.textContent = `${i + 1} / ${frames.length}`;
    if (reducedMotion) { prev.classList.remove('is-on'); next.classList.add('is-on'); return; }
    gsap.killTweensOf([prev, next]);
    next.classList.add('is-on');
    gsap.fromTo(next, { opacity: 0, scale: 1.0 }, { opacity: 1, duration: 1.1, ease: 'power2.inOut' });
    gsap.fromTo(next, { scale: 1.0 }, { scale: 1.08, duration: 5.2, ease: 'none' });
    gsap.to(prev, { opacity: 0, duration: 1.1, ease: 'power2.inOut', onComplete: () => prev.classList.remove('is-on') });
    gsap.to(arm, { rotation: `+=${dir * 180}`, duration: 0.9, ease: 'power2.inOut', svgOrigin: '30 30' });
  };
  const schedule = () => { timer?.kill(); if (playing) timer = gsap.delayedCall(4.2, () => { show(i + 1); schedule(); }); };
  const play = () => { load(); if (playing) return; playing = true; if (!frames[i].classList.contains('is-on')) frames[i].classList.add('is-on'); gsap.fromTo(frames[i], { scale: 1 }, { scale: 1.08, duration: 5.2, ease: 'none' }); schedule(); };
  const pause = () => { playing = false; timer?.kill(); };

  crank.addEventListener('click', (e) => { e.stopPropagation(); show(i + 1); schedule(); });
  lantern.addEventListener('click', () => { show(i + 1); schedule(); });
  // dragging the crank in a circle turns the film
  let dragging = false, lastAngle = 0, acc = 0;
  const angleOf = (e: PointerEvent) => { const r = crank.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)); };
  crank.addEventListener('pointerdown', (e) => { dragging = true; lastAngle = angleOf(e); acc = 0; crank.setPointerCapture(e.pointerId); e.stopPropagation(); });
  crank.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const a = angleOf(e); let d = a - lastAngle; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; lastAngle = a; acc += d;
    gsap.set(arm, { rotation: `+=${(d * 180) / Math.PI}`, svgOrigin: '30 30' });
    if (acc > Math.PI / 2) { acc = 0; show(i + 1, 0); schedule(); } else if (acc < -Math.PI / 2) { acc = 0; show(i - 1, 0); schedule(); }
  });
  const stopDrag = () => { dragging = false; };
  crank.addEventListener('pointerup', stopDrag); crank.addEventListener('pointercancel', stopDrag);

  ScrollTrigger.create({ trigger: lantern, start: 'top 150%', once: true, onEnter: load });
  ScrollTrigger.create({ trigger: lantern, start: 'top 90%', end: 'bottom 10%', onToggle: (st) => (st.isActive ? play() : pause()) });
}

/* ---------- Signature Coffee: the shelf of drinks ---------- */
export function initShelf() {
  const wrap = document.querySelector<HTMLElement>('.shelf-wrap');
  const shelf = document.getElementById('shelf');
  if (!wrap || !shelf) return;
  const drinks = Array.from(shelf.querySelectorAll<HTMLElement>('.drink'));
  const arts = drinks.map((d) => d.querySelector<HTMLElement>('.drink__art')!);
  const prev = wrap.querySelector<HTMLButtonElement>('.strip__nav--l');
  const next = wrap.querySelector<HTMLButtonElement>('.strip__nav--r');
  const maxLeft = () => shelf.scrollWidth - shelf.clientWidth;

  // the drink nearest the centre rises and tilts a little toward the cursor; the others settle back
  let raf = 0;
  const emphasise = () => {
    raf = 0;
    const cx = shelf.getBoundingClientRect().left + shelf.clientWidth / 2;
    let best = 0, bestD = Infinity;
    drinks.forEach((d, k) => {
      const r = d.getBoundingClientRect(); const dist = Math.abs(r.left + r.width / 2 - cx);
      const t = 1 - Math.min(dist / (r.width * 1.6), 1);
      gsap.set(arts[k], { scale: 1 + 0.2 * t, y: -30 * t, rotation: 0 });
      if (dist < bestD) { bestD = dist; best = k; }
    });
    drinks.forEach((d, k) => d.classList.toggle('is-center', k === best));
    if (prev) prev.disabled = shelf.scrollLeft <= 2;
    if (next) next.disabled = shelf.scrollLeft >= maxLeft() - 2;
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(emphasise); };
  shelf.addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  // start on the second drink so there is something on both sides
  requestAnimationFrame(() => { shelf.scrollLeft = drinks[1].offsetLeft - (shelf.clientWidth - drinks[1].offsetWidth) / 2; emphasise(); });

  const step = () => drinks[0].offsetWidth + parseFloat(getComputedStyle(shelf.querySelector('.shelf__track')!).gap || '40');
  const glide = (to: number) => gsap.to(shelf, { scrollLeft: gsap.utils.clamp(0, maxLeft(), to), duration: 0.7, ease: 'power3.out', overwrite: true });
  prev?.addEventListener('click', () => glide(shelf.scrollLeft - step()));
  next?.addEventListener('click', () => glide(shelf.scrollLeft + step()));

  // mouse drag with inertia
  let dragging = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, vx = 0;
  shelf.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    dragging = true; startX = lastX = e.clientX; startLeft = shelf.scrollLeft; lastT = performance.now(); vx = 0;
    shelf.classList.add('is-dragging'); shelf.setPointerCapture(e.pointerId); gsap.killTweensOf(shelf);
  });
  shelf.addEventListener('pointermove', (e) => {
    if (!dragging) { if (!isTouch) tiltToward(e); return; }
    const now = performance.now(); vx = (e.clientX - lastX) / Math.max(now - lastT, 1); lastX = e.clientX; lastT = now;
    shelf.scrollLeft = startLeft - (e.clientX - startX);
  });
  const release = () => { if (!dragging) return; dragging = false; shelf.classList.remove('is-dragging'); glide(shelf.scrollLeft - vx * 260); };
  shelf.addEventListener('pointerup', release); shelf.addEventListener('pointercancel', release);
  shelf.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation(); }, { passive: true });

  // the centre drink leans toward the cursor
  const tiltToward = (e: PointerEvent) => {
    const k = drinks.findIndex((d) => d.classList.contains('is-center')); if (k < 0) return;
    const r = drinks[k].getBoundingClientRect();
    const nx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / r.width);
    gsap.to(arts[k].querySelector('img'), { rotation: nx * 6, x: nx * 8, duration: 0.5, ease: 'power3', overwrite: 'auto' });
  };
  shelf.addEventListener('pointerleave', () => arts.forEach((a) => gsap.to(a.querySelector('img'), { rotation: 0, x: 0, duration: 0.6 })));

  // steam on the hot cup
  if (reducedMotion) return;
  shelf.querySelectorAll<HTMLCanvasElement>('.drink__steam').forEach((cv) => {
    const ctx = cv.getContext('2d')!; const W = cv.width, H = cv.height;
    type Wisp = { x: number; y: number; r: number; a: number; s: number; w: number; p: number };
    const wisps: Wisp[] = [];
    let on = false, id = 0;
    const spawn = () => wisps.push({ x: W / 2 + gsap.utils.random(-14, 14), y: H, r: gsap.utils.random(6, 12), a: 0, s: gsap.utils.random(0.25, 0.5), w: gsap.utils.random(0.6, 1.4), p: gsap.utils.random(0, 6) });
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      if (Math.random() < 0.08 && wisps.length < 14) spawn();
      for (let n = wisps.length - 1; n >= 0; n--) {
        const q = wisps[n]; q.y -= q.s; q.r += 0.06; q.p += 0.02;
        const life = 1 - q.y / H; q.a = Math.sin(life * Math.PI) * 0.35;
        const g = ctx.createRadialGradient(q.x + Math.sin(q.p * q.w * 3) * 8, q.y, 0, q.x + Math.sin(q.p * q.w * 3) * 8, q.y, q.r);
        g.addColorStop(0, `rgba(255,240,220,${q.a})`); g.addColorStop(1, 'rgba(255,240,220,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.x + Math.sin(q.p * q.w * 3) * 8, q.y, q.r, 0, Math.PI * 2); ctx.fill();
        if (q.y < -q.r) wisps.splice(n, 1);
      }
      if (on) id = requestAnimationFrame(tick);
    };
    ScrollTrigger.create({ trigger: cv, start: 'top 100%', end: 'bottom 0%', onToggle: (st) => { on = st.isActive; if (on && !id) id = requestAnimationFrame(tick); if (!on) { cancelAnimationFrame(id); id = 0; } } });
  });
}
