const verseText = document.getElementById("verse-text");
const verseReference = document.getElementById("verse-reference");
const newVerseBtn = document.getElementById("new-verse-btn");
const shareBtn = document.getElementById("share-verse-btn");
const saveBtn = document.getElementById("save-verse-btn");
const favoritesBtn = document.getElementById("favorites-btn");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const favoritesModal = document.getElementById("favorites-modal");
const favoritesList = document.getElementById("favorites-list");
const closeModalBtn = document.querySelector(".close-modal");
const verseHistory = document.getElementById("verse-history");
const categoryCards = document.querySelectorAll(".category-card");

let currentVerse = null;
let verseHistoryData = [];

const versesByCategory = {
  love: [
    { text: "Amaos los unos a los otros como yo os he amado.", reference: "Juan 15:12" },
    { text: "El amor es paciente, es bondadoso.", reference: "1 Corintios 13:4" },
    { text: "Nadie tiene mayor amor que este, que uno ponga su vida por sus amigos.", reference: "Juan 15:13" }
  ],
  faith: [
    { text: "La fe es la certeza de lo que se espera.", reference: "Hebreos 11:1" },
    { text: "Confía en el Señor con todo tu corazón.", reference: "Proverbios 3:5" },
    { text: "Porque por gracia sois salvos mediante la fe.", reference: "Efesios 2:8" }
  ],
  hope: [
    { text: "Porque yo sé los planes que tengo para vosotros, planes de bienestar y no de mal.", reference: "Jeremías 29:11" },
    { text: "Que el Dios de la esperanza os llene de gozo y paz.", reference: "Romanos 15:13" }
  ],
  strength: [
    { text: "Todo lo puedo en Cristo que me fortalece.", reference: "Filipenses 4:13" },
    { text: "El Señor es mi fortaleza y mi escudo.", reference: "Salmo 28:7" }
  ],
  family: [
    { text: "Honra a tu padre y a tu madre.", reference: "Éxodo 20:12" },
    { text: "El que encuentra esposa halla el bien.", reference: "Proverbios 18:22" }
  ],
  prayer: [
    { text: "Orad sin cesar.", reference: "1 Tesalonicenses 5:17" },
    { text: "Clama a mí y yo te responderé.", reference: "Jeremías 33:3" }
  ]
};

async function fetchRandomVerse() {
  loading.style.display = "block";
  errorMessage.style.display = "none";

  try {
    const response = await fetch("https://labs.bible.org/api/?passage=random&type=json");
    const data = await response.json();

    if (data.length === 0) throw new Error("Sin datos");

    const verse = data[0];
    const verseTextContent = verse.text;
    const reference = `${verse.bookname} ${verse.chapter}:${verse.verse}`;

    verseText.textContent = `"${verseTextContent}"`;
    verseReference.textContent = reference;
    currentVerse = { text: verseTextContent, reference };

    addToHistory(currentVerse);
  } catch (error) {
    errorMessage.style.display = "block";
    verseText.textContent = "No se pudo cargar el versículo.";
    verseReference.textContent = "";
    currentVerse = null;
  } finally {
    loading.style.display = "none";
  }
}

function loadVerseByCategory(category) {
  if (!versesByCategory[category]) {
    verseText.textContent = "Categoría no encontrada.";
    verseReference.textContent = "";
    return;
  }

  const verses = versesByCategory[category];
  const verse = verses[Math.floor(Math.random() * verses.length)];

  verseText.textContent = `"${verse.text}"`;
  verseReference.textContent = verse.reference;
  currentVerse = verse;

  addToHistory(currentVerse);
}

function addToHistory(verse) {
  verseHistoryData.unshift(verse);
  if (verseHistoryData.length > 5) verseHistoryData.pop();

  verseHistory.innerHTML = "";
  verseHistoryData.forEach(v => {
    const card = document.createElement("div");
    card.innerHTML = `<p>"${v.text}"</p><small>${v.reference}</small>`;
    verseHistory.appendChild(card);
  });
}

function saveVerse() {
  if (!currentVerse) return;

  let saved = JSON.parse(localStorage.getItem("favorites") || "[]");

  if (saved.some(v => v.text === currentVerse.text && v.reference === currentVerse.reference)) {
    alert("Este versículo ya está en tus favoritos.");
    return;
  }

  saved.push(currentVerse);
  localStorage.setItem("favorites", JSON.stringify(saved));
  alert("Versículo guardado en favoritos.");
}

function showFavorites() {
  const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
  favoritesList.innerHTML = "";

  if (saved.length === 0) {
    favoritesList.innerHTML = "<p>No tienes versículos guardados.</p>";
    return;
  }

  saved.forEach(v => {
    const div = document.createElement("div");
    div.innerHTML = `<p>"${v.text}"</p><small>${v.reference}</small>`;
    favoritesList.appendChild(div);
  });

  favoritesModal.style.display = "block";
}

function shareVerse() {
  if (!currentVerse) return;

  const textToShare = `"${currentVerse.text}" - ${currentVerse.reference}`;

  if (navigator.share) {
    navigator.share({
      title: "Palabra del Día",
      text: textToShare,
    }).catch(err => console.error("Error al compartir:", err));
  } else {
    prompt("Copia este versículo:", textToShare);
  }
}

// Event Listeners para tarjetas categoría
categoryCards.forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    loadVerseByCategory(category);
  });
});

// Botones eventos
newVerseBtn.addEventListener("click", fetchRandomVerse);
saveBtn.addEventListener("click", saveVerse);
favoritesBtn.addEventListener("click", showFavorites);
shareBtn.addEventListener("click", shareVerse);
closeModalBtn.addEventListener("click", () => {
  favoritesModal.style.display = "none";
});

// Al cargar, muestra versículo aleatorio API
fetchRandomVerse();
