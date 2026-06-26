const data = {
  food: [
    ["Pizza","Essen"],["Burger","Fast Food"],["Spaghetti","Italienisch"],["Schokolade","Süssigkeit"],
    ["Döner","Fast Food"],["Sushi","Asiatisches Essen"],["Pommes","Beilage"],["Eiscreme","Dessert"]
  ],
  places: [
    ["Strand","Ort draussen"],["Kino","Freizeitort"],["Bahnhof","Verkehr"],["Schule","Gebäude"],
    ["Flughafen","Reisen"],["Berge","Natur"],["Restaurant","Essen gehen"],["Museum","Kultur"]
  ],
  sports: [
    ["Fussball","Sportart"],["Tennis","Ballsport"],["Schwimmen","Wasser"],["Skifahren","Winter"],
    ["Basketball","Ballsport"],["Volleyball","Teamsport"],["Joggen","Laufen"],["Boxen","Kampfsport"]
  ],
  movies: [
    ["Titanic","Film"],["Avatar","Film"],["Harry Potter","Filmreihe"],["Frozen","Animationsfilm"],
    ["Barbie","Film"],["Spider-Man","Superheld"],["Shrek","Animationsfilm"],["Star Wars","Science-Fiction"]
  ],
  school: [
    ["Prüfung","Schule"],["Hausaufgaben","Lernen"],["Lehrbetrieb","Ausbildung"],["Pause","Schule"],
    ["Laptop","Gerät"],["Stundenplan","Planung"],["Noten","Bewertung"],["Lehrperson","Schule"]
  ]
};

let players = 4;
let current = 1;
let imposter = 1;
let word = "";
let hint = "";
let revealed = false;

const $ = id => document.getElementById(id);

function show(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

function pool(){
  const cat = $("category").value;
  return cat === "all" ? Object.values(data).flat() : data[cat];
}

function startGame(){
  players = Math.max(3, Math.min(12, Number($("players").value) || 4));
  $("players").value = players;
  const chosen = pool()[Math.floor(Math.random() * pool().length)];
  word = chosen[0];
  hint = chosen[1];
  imposter = Math.floor(Math.random() * players) + 1;
  current = 1;
  resetCard();
  show("cardScreen");
}

function resetCard(){
  revealed = false;
  $("playerLabel").textContent = "Person " + current + " von " + players;
  $("cardText").textContent = "?";
  $("flipCard").classList.remove("revealed");
  $("flipCard").querySelector(".card-small").textContent = "Tippen zum Aufdecken";
  $("next").classList.add("hidden");
}

function reveal(){
  if(revealed) return;
  revealed = true;
  $("flipCard").classList.add("revealed");
  $("flipCard").querySelector(".card-small").textContent = current === imposter ? "Du bist der Imposter" : "Dein Wort";
  $("cardText").textContent = current === imposter ? "Hinweis: " + hint : word;
  $("next").classList.remove("hidden");
}

function nextPlayer(){
  current++;
  if(current > players){
    show("discussion");
  } else {
    resetCard();
  }
}

$("minus").onclick = () => $("players").value = Math.max(3, Number($("players").value) - 1);
$("plus").onclick = () => $("players").value = Math.min(12, Number($("players").value) + 1);
$("start").onclick = startGame;
$("flipCard").onclick = reveal;
$("next").onclick = nextPlayer;
$("solve").onclick = () => {
  $("wordResult").textContent = word;
  $("imposterResult").textContent = imposter;
  show("result");
};
$("again").onclick = () => show("setup");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
