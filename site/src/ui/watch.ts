import { gsap } from '../scroll';

/** Opening hours, Europe/Lisbon. [openMin, closeMin] per weekday (0 = Sunday). */
const HOURS: Record<number, [number, number]> = {
  0: [510, 1080], 1: [510, 1080], 2: [510, 1080], 3: [510, 1080], 4: [510, 1080], 5: [510, 1080], 6: [510, 1080], // every day 8h30–18h00
};
const DAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export function drawTicks(svg: SVGElement) {
  const g = svg.querySelector('.watch__ticks')!;
  let html = '';
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const big = i % 5 === 0;
    const r1 = big ? 40 : 43, r2 = 45.5;
    html += `<line x1="${60 + Math.sin(a) * r1}" y1="${60 - Math.cos(a) * r1}" x2="${60 + Math.sin(a) * r2}" y2="${60 - Math.cos(a) * r2}" ${big ? 'style="stroke-width:1.6"' : 'style="opacity:.6"'} />`;
  }
  g.innerHTML = html;
}

function portoNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', hour: 'numeric', minute: 'numeric', second: 'numeric', weekday: 'short', hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { h: +get('hour') % 24, m: +get('minute'), s: +get('second'), wd };
}

const fmt = (min: number) => `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`;

export function openState() {
  const { h, m, wd } = portoNow();
  const now = h * 60 + m;
  const [o, c] = HOURS[wd];
  if (now >= o && now < c) return { open: true, text: `Aberto agora · fecha às ${fmt(c)}` };
  if (now < o) return { open: false, text: `Fechado · abre hoje às ${fmt(o)}` };
  const next = (wd + 1) % 7;
  return { open: false, text: `Fechado · abre ${next === (wd + 1) % 7 ? 'amanhã' : DAYS[next]} às ${fmt(HOURS[next][0])}` };
}

/** Live pocket watch: hour hand glides, minute hand steps, second hand ticks. */
export function initLiveWatch() {
  const svg = document.getElementById('liveWatch') as SVGElement | null;
  if (!svg) return;
  drawTicks(svg);
  const hh = svg.querySelector<SVGElement>('.watch__hand--h')!;
  const mh = svg.querySelector<SVGElement>('.watch__hand--m')!;
  const sh = svg.querySelector<SVGElement>('.watch__hand--s')!;
  const state = document.getElementById('openState')!;
  const pill = document.getElementById('reservePill')!;
  const pillLabel = document.getElementById('reserveLabel')!;

  const update = () => {
    const { h, m, s } = portoNow();
    gsap.set(hh, { rotation: (h % 12) * 30 + m * 0.5, svgOrigin: '60 60' });
    gsap.to(mh, { rotation: m * 6 + s * 0.1, duration: 0.4, ease: 'back.out(2)', svgOrigin: '60 60' });
    gsap.to(sh, { rotation: s * 6, duration: 0.25, ease: 'back.out(3)', svgOrigin: '60 60' });
    const st = openState();
    state.textContent = st.text;
    state.classList.toggle('is-open', st.open);
    pill.classList.toggle('is-open', st.open);
    pillLabel.textContent = st.open ? 'Aberto · Reservar' : 'Reservar';
  };
  update();
  setInterval(update, 1000);
}
