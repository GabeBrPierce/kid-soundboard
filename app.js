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

const label = (n) => n.replace(/[_-]/g, " ");
let current = 0;
let playing = null;

const tabs = document.getElementById("tabs");
const content = document.getElementById("content");

CATEGORIES.forEach((cat, i) => {
  const tab = document.createElement("button");
  tab.className = "tab";
  tab.textContent = cat.title;
  tab.onclick = () => show(i);
  tabs.appendChild(tab);

  const sec = document.createElement("section");
  sec.className = "page";
  sec.style.background = cat.gradient;
  sec.innerHTML = `<h1>${cat.title}</h1><div class="grid"></div>`;
  const grid = sec.querySelector(".grid");
  cat.items.split(" ").forEach((name) => {
    const card = document.createElement("button");
    card.className = "card";
    const art = cat.emoji
      ? `<div class="emoji">${cat.emoji[name]}</div>`
      : `<img src="image/${cat.id}/${name}.svg" alt="">`;
    card.innerHTML = `${art}<span>${label(name)}</span>`;
    const audio = new Audio(`sound/${cat.id}/${name}.mp3`);
    audio.preload = "auto";
    card.onclick = () => {
      if (playing && playing !== audio) { playing.pause(); }
      audio.currentTime = 0;
      audio.play();
      playing = audio;
      card.classList.add("pop");
      setTimeout(() => card.classList.remove("pop"), 250);
    };
    grid.appendChild(card);
  });
  content.appendChild(sec);
});

function show(i) {
  current = (i + CATEGORIES.length) % CATEGORIES.length;
  [...content.children].forEach((s, j) => s.classList.toggle("active", j === current));
  [...tabs.children].forEach((t, j) => t.classList.toggle("active", j === current));
  window.scrollTo(0, 0);
}
document.getElementById("prev").onclick = () => show(current - 1);
document.getElementById("next").onclick = () => show(current + 1);
show(0);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
