const CATEGORIES = [
  { id: "animals", title: "Animals", gradient: "linear-gradient(0deg,#090979,#00d4ff)",
    items: "bird cat chicken cow dinosaur dog duck eagle elephant horse lion monkey mouse owl pig rooster sheep snake tiger wolf" },
  { id: "instruments", title: "Instruments", gradient: "linear-gradient(0deg,#0d3600,#00cf01)",
    items: "accordion banjo beatbox bugle drums guitar long_drum piano saxophone singing trumpet violin" },
  { id: "transport", title: "Transport", gradient: "linear-gradient(0deg,#fa0000,#ffa200)",
    items: "ambulance bicycle car fire_truck helicopter jet_plane motorcycle police_car prop_plane race_car rickshaw rocket scooter ship skateboard space_ship taxi tractor train truck" },
  { id: "fun", title: "Fun", gradient: "linear-gradient(0deg,#6b0194,#ff00b5)",
    items: "arcade alien bowling ghost kisses phone popcorn robot roller_coaster silly toilet toy" },
  // Custom sounds have no emoji art, so they use a fixed emoji instead.
  { id: "money", title: "Money", gradient: "linear-gradient(0deg,#7a5a00,#ffd400)",
    emoji: { "cash-register-beep": "🧾", kaching: "💰", "receipt-printing": "🖨️" },
    items: "cash-register-beep kaching receipt-printing" },
];

// One page = up to 10 sounds, mapped to keys 1-9 then 0.
const PAGES = [];
for (const cat of CATEGORIES) {
  const names = cat.items.split(" ");
  const count = Math.ceil(names.length / 10);
  for (let p = 0; p < count; p++) {
    PAGES.push({ cat, names: names.slice(p * 10, p * 10 + 10), num: p + 1, of: count });
  }
}

const KEY_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const label = (n) => n.replace(/[_-]/g, " ");
const app = document.getElementById("app");
const title = document.getElementById("title");
const nowPlaying = document.getElementById("now");
const pad = document.getElementById("pad");

let page = 0;
let audios = {};
let playing = null;
const cells = {};

KEY_ORDER.forEach((k) => {
  const cell = document.createElement("button");
  cell.className = "key" + (k === "0" ? " zero" : "");
  cell.onclick = () => press(k);
  pad.appendChild(cell);
  cells[k] = cell;
});

function show(i) {
  page = (i + PAGES.length) % PAGES.length;
  const { cat, names, num, of } = PAGES[page];
  if (playing) playing.pause();
  playing = null;
  audios = {};
  app.style.background = cat.gradient;
  title.textContent = of > 1 ? `${cat.title} ${num}/${of}` : cat.title;
  nowPlaying.textContent = "";
  KEY_ORDER.forEach((k, idx) => {
    const name = names[idx];
    const cell = cells[k];
    if (!name) { cell.innerHTML = `<b>${k}</b>`; cell.classList.add("empty"); return; }
    cell.classList.remove("empty");
    const art = cat.emoji ? `<i>${cat.emoji[name]}</i>` : `<img src="image/${cat.id}/${name}.svg" alt="">`;
    cell.innerHTML = `${art}<b>${k}</b>`;
    const a = new Audio(`sound/${cat.id}/${name}.mp3`);
    a.preload = "auto";
    audios[k] = a;
  });
}

function press(k) {
  const a = audios[k];
  if (!a) return;
  if (playing && playing !== a) playing.pause();
  a.currentTime = 0;
  a.play().catch(() => {});
  playing = a;
  const name = PAGES[page].names[KEY_ORDER.indexOf(k)];
  nowPlaying.textContent = label(name);
  cells[k].classList.add("pop");
  setTimeout(() => cells[k].classList.remove("pop"), 200);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "SoftLeft") { show(page - 1); e.preventDefault(); }
  else if (e.key === "ArrowRight" || e.key === "SoftRight") { show(page + 1); e.preventDefault(); }
  else if (/^[0-9]$/.test(e.key)) { press(e.key); e.preventDefault(); }
});
document.getElementById("sl").onclick = () => show(page - 1);
document.getElementById("sr").onclick = () => show(page + 1);
document.addEventListener("contextmenu", (e) => e.preventDefault());

show(0);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
