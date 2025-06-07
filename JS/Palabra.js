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
let versesByCategory = {}; 


async function loadVersesFromJSON() {
  try {
    console.log('Cargando versículos desde JSON...');
 const response = await fetch('/categorias.json');


    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    versesByCategory = await response.json();
    console.log('Versículos cargados exitosamente:', Object.keys(versesByCategory));
    
   
    enableCategoryCards();
    
    return true;
  } catch (error) {
    console.error('Error al cargar versículos:', error);
    
  
    console.log('Usando versículos de respaldo...');
    versesByCategory = {
      love: [
        { text: "Amaos los unos a los otros como yo os he amado.", reference: "Juan 15:12" },
        { text: "El amor es paciente, es bondadoso.", reference: "1 Corintios 13:4" }
      ],
      faith: [
        { text: "La fe es la certeza de lo que se espera.", reference: "Hebreos 11:1" },
        { text: "Confía en el Señor con todo tu corazón.", reference: "Proverbios 3:5" }
      ],
      hope: [
        { text: "Porque yo sé los planes que tengo para vosotros, planes de bienestar y no de mal.", reference: "Jeremías 29:11" }
      ],
      strength: [
        { text: "Todo lo puedo en Cristo que me fortalece.", reference: "Filipenses 4:13" }
      ],
      family: [
        { text: "Honra a tu padre y a tu madre.", reference: "Éxodo 20:12" }
      ],
      prayer: [
        { text: "Orad sin cesar.", reference: "1 Tesalonicenses 5:17" }
      ]
    };
    
    enableCategoryCards();
    return false;
  }
}


function enableCategoryCards() {
  categoryCards.forEach(card => {
    card.style.opacity = '1';
    card.style.pointerEvents = 'auto';
    
    
    const category = card.dataset.category;
    if (versesByCategory[category]) {
      const countElement = card.querySelector('.verse-count');
      if (countElement) {
        countElement.textContent = `${versesByCategory[category].length} versículos`;
      }
    }
  });
}


async function fetchRandomVerse() {
  loading.style.display = "block";
  errorMessage.style.display = "none";

  try {
    const response = await fetch("https://labs.bible.org/api/?passage=random&type=json");
    
    if (!response.ok) {
      throw new Error(`Error de red: ${response.status}`);
    }
    
    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("Sin datos de la API");
    }

    const verse = data[0];
    const verseTextContent = verse.text;
    const reference = `${verse.bookname} ${verse.chapter}:${verse.verse}`;

    displayVerse(verseTextContent, reference);
    currentVerse = { text: verseTextContent, reference };

    addToHistory(currentVerse);
  } catch (error) {
    console.error('Error al obtener versículo de la API:', error);
    

    loadRandomLocalVerse();
  } finally {
    loading.style.display = "none";
  }
}


function loadRandomLocalVerse() {
  const categories = Object.keys(versesByCategory);
  if (categories.length === 0) {
    showError("No se pudieron cargar los versículos.");
    return;
  }

  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  loadVerseByCategory(randomCategory);
}


function loadVerseByCategory(category) {
  if (!versesByCategory[category] || versesByCategory[category].length === 0) {
    showError("Categoría no encontrada o vacía.");
    return;
  }

  const verses = versesByCategory[category];
  const verse = verses[Math.floor(Math.random() * verses.length)];

  displayVerse(verse.text, verse.reference);
  currentVerse = verse;

  addToHistory(currentVerse);
  
 
  highlightSelectedCategory(category);
}


function displayVerse(text, reference) {
  verseText.textContent = `"${text}"`;
  verseReference.textContent = reference;
  
 
  verseText.style.opacity = '0';
  verseReference.style.opacity = '0';
  
  setTimeout(() => {
    verseText.style.opacity = '1';
    verseReference.style.opacity = '1';
  }, 100);
}


function showError(message) {
  errorMessage.style.display = "block";
  errorMessage.textContent = message;
  verseText.textContent = "No se pudo cargar el versículo.";
  verseReference.textContent = "";
  currentVerse = null;
}


function highlightSelectedCategory(selectedCategory) {
  categoryCards.forEach(card => {
    if (card.dataset.category === selectedCategory) {
      card.classList.add('selected');
      setTimeout(() => card.classList.remove('selected'), 2000);
    }
  });
}


function addToHistory(verse) {
  
  if (verseHistoryData.length > 0 && 
      verseHistoryData[0].text === verse.text && 
      verseHistoryData[0].reference === verse.reference) {
    return;
  }

  verseHistoryData.unshift(verse);
  if (verseHistoryData.length > 5) verseHistoryData.pop();

  updateHistoryDisplay();
}


function updateHistoryDisplay() {
  if (!verseHistory) return;

  verseHistory.innerHTML = "";
  verseHistoryData.forEach((v, index) => {
    const card = document.createElement("div");
    card.className = 'history-card';
    card.innerHTML = `
      <p class="history-text">"${v.text}"</p>
      <small class="history-reference">${v.reference}</small>
    `;
    
    
    card.addEventListener('click', () => {
      displayVerse(v.text, v.reference);
      currentVerse = v;
    });
    
    verseHistory.appendChild(card);
  });
}


function saveVerse() {
  if (!currentVerse) {
    alert("No hay versículo seleccionado para guardar.");
    return;
  }

  try {
    let saved = JSON.parse(localStorage.getItem("favorites") || "[]");

    
    const exists = saved.some(v => 
      v.text === currentVerse.text && v.reference === currentVerse.reference
    );

    if (exists) {
      alert("Este versículo ya está en tus favoritos.");
      return;
    }

    
    const verseWithTimestamp = {
      ...currentVerse,
      savedAt: new Date().toISOString()
    };

    saved.unshift(verseWithTimestamp); 
    localStorage.setItem("favorites", JSON.stringify(saved));
    
   
    saveBtn.textContent = "¡Guardado!";
    setTimeout(() => {
      saveBtn.textContent = "💾 Guardar";
    }, 2000);
    
  } catch (error) {
    console.error('Error al guardar favorito:', error);
    alert("Error al guardar el versículo.");
  }
}


function showFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    favoritesList.innerHTML = "";

    if (saved.length === 0) {
      favoritesList.innerHTML = "<p class='no-favorites'>No tienes versículos guardados.</p>";
    } else {
      saved.forEach((v, index) => {
        const div = document.createElement("div");
        div.className = 'favorite-item';
        
        const savedDate = v.savedAt ? new Date(v.savedAt).toLocaleDateString() : '';
        
        div.innerHTML = `
          <p class="favorite-text">"${v.text}"</p>
          <small class="favorite-reference">${v.reference}</small>
          ${savedDate ? `<small class="saved-date">Guardado: ${savedDate}</small>` : ''}
          <button class="remove-favorite" data-index="${index}">🗑️</button>
        `;
        
        
        const removeBtn = div.querySelector('.remove-favorite');
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeFavorite(index);
        });
        
       
        div.addEventListener('click', () => {
          displayVerse(v.text, v.reference);
          currentVerse = { text: v.text, reference: v.reference };
          favoritesModal.style.display = "none";
        });
        
        favoritesList.appendChild(div);
      });
    }

    favoritesModal.style.display = "block";
  } catch (error) {
    console.error('Error al mostrar favoritos:', error);
    alert("Error al cargar los favoritos.");
  }
}


function removeFavorite(index) {
  try {
    let saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    saved.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(saved));
    showFavorites(); 
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
  }
}


function shareVerse() {
  if (!currentVerse) {
    alert("No hay versículo seleccionado para compartir.");
    return;
  }

  const textToShare = `"${currentVerse.text}" - ${currentVerse.reference}`;

  if (navigator.share) {
    navigator.share({
      title: "Palabra del Día - Iglesia Santa Lucía",
      text: textToShare,
      url: window.location.href
    }).catch(err => {
      console.error("Error al compartir:", err);
      fallbackShare(textToShare);
    });
  } else {
    fallbackShare(textToShare);
  }
}


function fallbackShare(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Versículo copiado al portapapeles!");
    }).catch(() => {
      prompt("Copia este versículo:", text);
    });
  } else {
    prompt("Copia este versículo:", text);
  }
}


document.addEventListener('DOMContentLoaded', async () => {

  categoryCards.forEach(card => {
    card.style.opacity = '0.5';
    card.style.pointerEvents = 'none';
  });

 
  await loadVersesFromJSON();


  categoryCards.forEach(card => {
    card.addEventListener("click", () => {
      const category = card.dataset.category;
      loadVerseByCategory(category);
    });
  });

  
  fetchRandomVerse();
});


if (newVerseBtn) {
  newVerseBtn.addEventListener("click", fetchRandomVerse);
}

if (saveBtn) {
  saveBtn.addEventListener("click", saveVerse);
}

if (favoritesBtn) {
  favoritesBtn.addEventListener("click", showFavorites);
}

if (shareBtn) {
  shareBtn.addEventListener("click", shareVerse);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    favoritesModal.style.display = "none";
  });
}


if (favoritesModal) {
  favorites}