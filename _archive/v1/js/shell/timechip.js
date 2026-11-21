// Gulf-time availability chip. Client-side clock; working hours are a placeholder [NEEDS ARIFA].
const HOURS = { days: [1, 2, 3, 4, 5], from: 9, to: 18 }; // default Mon–Fri 09:00–18:00 GST

function dubaiNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: 'numeric', minute: '2-digit', hour12: true, weekday: 'short', hourCycle: 'h12' })
    .formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '';
  const time = `${get('hour')}:${get('minute')} ${get('dayPeriod').toUpperCase()}`;
  const h24 = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: 'numeric', hour12: false }).format(new Date())) % 24;
  const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { time, h24, dayIdx };
}

export function mountTimeChips(root = document) {
  const chips = Array.from(root.querySelectorAll('[data-timechip]'));
  if (!chips.length) return;
  const render = () => {
    let t;
    try { t = dubaiNow(); } catch { return; }
    const on = HOURS.days.includes(t.dayIdx) && t.h24 >= HOURS.from && t.h24 < HOURS.to;
    chips.forEach((c) => {
      c.classList.add('timechip');
      c.classList.toggle('is-off', !on);
      c.innerHTML = `<span class="timechip__dot" aria-hidden="true"></span><span>Arifa is in Dubai (GST, UTC+4). It's <b>${t.time}</b> there now · <b>${on ? 'Available' : 'Offline'}</b></span>`;
    });
  };
  render();
  setInterval(render, 30000);
}
