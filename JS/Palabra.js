// Palabra.js - Sistema completo de versículos bíblicos con API

// Base de datos local de versículos (como fallback)
const biblicalVerses = {
    love: [
        {
            text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
            reference: "Juan 3:16"
        },
        {
            text: "El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece.",
            reference: "1 Corintios 13:4"
        },
        {
            text: "En esto hemos conocido el amor, en que él puso su vida por nosotros; también nosotros debemos poner nuestras vidas por los hermanos.",
            reference: "1 Juan 3:16"
        },
        {
            text: "Y nosotros hemos conocido y creído el amor que Dios tiene para con nosotros. Dios es amor; y el que permanece en amor, permanece en Dios, y Dios en él.",
            reference: "1 Juan 4:16"
        },
        {
            text: "Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros.",
            reference: "Romanos 5:8"
        }
    ],
    faith: [
        {
            text: "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.",
            reference: "Hebreos 11:1"
        },
        {
            text: "Y Jesús les dijo: Por vuestra poca fe; porque de cierto os digo, que si tuviereis fe como un grano de mostaza, diréis a este monte: Pásate de aquí allá, y se pasará; y nada os será imposible.",
            reference: "Mateo 17:20"
        },
        {
            text: "Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios.",
            reference: "Efesios 2:8"
        },
        {
            text: "Justificados, pues, por la fe, tenemos paz para con Dios por medio de nuestro Señor Jesucristo.",
            reference: "Romanos 5:1"
        },
        {
            text: "Pelea la buena batalla de la fe, echa mano de la vida eterna, a la cual asimismo fuiste llamado.",
            reference: "1 Timoteo 6:12"
        }
    ],
    hope: [
        {
            text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
            reference: "Jeremías 29:11"
        },
        {
            text: "Bienaventurado el varón que confía en Jehová, y cuya confianza es Jehová.",
            reference: "Jeremías 17:7"
        },
        {
            text: "Espera en Jehová; esfuérzate, y aliéntese tu corazón; sí, espera en Jehová.",
            reference: "Salmos 27:14"
        },
        {
            text: "Y la esperanza no avergüenza; porque el amor de Dios ha sido derramado en nuestros corazones por el Espíritu Santo que nos fue dado.",
            reference: "Romanos 5:5"
        },
        {
            text: "Bendito el Dios y Padre de nuestro Señor Jesucristo, que según su grande misericordia nos hizo renacer para una esperanza viva.",
            reference: "1 Pedro 1:3"
        }
    ],
    strength: [
        {
            text: "Todo lo puedo en Cristo que me fortalece.",
            reference: "Filipenses 4:13"
        },
        {
            text: "Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.",
            reference: "Salmos 23:1-2"
        },
        {
            text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.",
            reference: "Isaías 41:10"
        },
        {
            text: "Encomienda a Jehová tu camino, y confía en él; y él hará.",
            reference: "Salmos 37:5"
        },
        {
            text: "Mas los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.",
            reference: "Isaías 40:31"
        }
    ],
    family: [
        {
            text: "Honra a tu padre y a tu madre, para que tus días se alarguen en la tierra que Jehová tu Dios te da.",
            reference: "Éxodo 20:12"
        },
        {
            text: "Y vosotros, padres, no provoquéis a ira a vuestros hijos, sino criadlos en disciplina y amonestación del Señor.",
            reference: "Efesios 6:4"
        },
        {
            text: "Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él.",
            reference: "Proverbios 22:6"
        },
        {
            text: "Y si mal os parece servir a Jehová, escogeos hoy a quién sirváis; pero yo y mi casa serviremos a Jehová.",
            reference: "Josué 24:15"
        },
        {
            text: "Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia, y se entregó a sí mismo por ella.",
            reference: "Efesios 5:25"
        }
    ],
    prayer: [
        {
            text: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.",
            reference: "Filipenses 4:6"
        },
        {
            text: "Y todo lo que pidiereis en oración, creyendo, lo recibiréis.",
            reference: "Mateo 21:22"
        },
        {
            text: "Orad sin cesar.",
            reference: "1 Tesalonicenses 5:17"
        },
        {
            text: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.",
            reference: "Jeremías 33:3"
        },
        {
            text: "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá.",
            reference: "Mateo 7:7"
        }
    ]
};

// Configuración de APIs
const API_CONFIG = {
    // API Bible (gratuita, requiere registro)
    // https://scripture.api.bible/
    bible: {
        url: 'https://api.scripture.api.bible/v1',
        key: 'TU_API_KEY_AQUI', // Reemplaza con tu API key
        bibleId: 'dc76be4e0b1e4c3c-01' // ID de la Biblia Reina Valera
    },
    
    // API alternativa sin API key (limitada)
    alternative: {
        url: 'https://bible-api.com',
        spanish: true
    }
};

// Variables globales
let currentVerse = null;
let verseHistory = [];
let favorites = [];
let isLoading = false;

// Elementos del DOM
const verseText = document.getElementById('verse-text');
const verseReference = document.getElementById('verse-reference');
const newVerseBtn = document.getElementById('new-verse-btn');
const shareVerseBtn = document.getElementById('share-verse-btn');
const saveVerseBtn = document.getElementById('save-verse-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const favoritesModal = document.getElementById('favorites-modal');
const favoritesList = document.getElementById('favorites-list');
const closeModal = document.querySelector('.close-modal');
const categoryCards = document.querySelectorAll('.category-card');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const suggestionTags = document.querySelectorAll('.suggestion-tag');
const verseHistoryContainer = document.getElementById('verse-history');

// Funciones de API
async function fetchVerseFromAPI(reference) {
    console.log('Buscando versículo:', reference);
    
    try {
        // Primero intentar con bible-api.com (gratuita, sin API key)
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=rvr`);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.verses && data.verses.length > 0) {
                return {
                    text: data.verses[0].text.trim(),
                    reference: data.reference,
                    source: 'api'
                };
            }
        }
        
        // Si falla, intentar formato alternativo
        const altResponse = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}`);
        
        if (altResponse.ok) {
            const altData = await altResponse.json();
            
            if (altData.text) {
                return {
                    text: altData.text.trim(),
                    reference: altData.reference,
                    source: 'api'
                };
            }
        }
        
        throw new Error('No se encontró el versículo en la API');
        
    } catch (error) {
        console.error('Error al consultar API:', error);
        throw error;
    }
}

async function searchVersesInAPI(query) {
    console.log('Buscando en API:', query);
    
    try {
        // Intentar diferentes formatos de búsqueda
        const searchFormats = [
            query,
            query.replace(/(\d+):(\d+)/g, '$1.$2'), // 3:16 -> 3.16
            query.replace(/(\d+)\.(\d+)/g, '$1:$2'), // 3.16 -> 3:16
        ];
        
        for (const format of searchFormats) {
            try {
                const verse = await fetchVerseFromAPI(format);
                if (verse) {
                    return [verse];
                }
            } catch (e) {
                continue;
            }
        }
        
        throw new Error('No se encontraron resultados');
        
    } catch (error) {
        console.error('Error en búsqueda API:', error);
        return [];
    }
}

// Función para buscar versículos (API + local)
async function searchVerses(query) {
    if (!query || query.trim() === '') {
        return [];
    }
    
    const results = [];
    
    // Primero intentar buscar en la API
    if (isReference(query)) {
        console.log('Detectada referencia bíblica, buscando en API...');
        try {
            const apiResults = await searchVersesInAPI(query);
            if (apiResults.length > 0) {
                results.push(...apiResults);
            }
        } catch (error) {
            console.log('Error en API, continuando con búsqueda local');
        }
    }
    
    // Buscar también en la base de datos local
    const localResults = searchVersesLocal(query);
    
    // Combinar resultados evitando duplicados
    localResults.forEach(verse => {
        if (!results.some(r => r.reference === verse.reference)) {
            results.push(verse);
        }
    });
    
    return results;
}

function isReference(query) {
    // Detectar si la consulta parece una referencia bíblica
    const referencePatterns = [
        /\d+:\d+/,           // 3:16
        /\d+\.\d+/,          // 3.16
        /(juan|mateo|marcos|lucas|romanos|corintios|galatas|efesios|filipenses|colosenses|tesalonicenses|timoteo|tito|filemon|hebreos|santiago|pedro|judas|apocalipsis|genesis|exodo|levitico|numeros|deuteronomio|josue|jueces|rut|samuel|reyes|cronicas|esdras|nehemias|ester|job|salmos|proverbios|eclesiastes|cantares|isaias|jeremias|lamentaciones|ezequiel|daniel|oseas|joel|amos|abdias|jonas|miqueas|nahum|habacuc|sofonias|hageo|zacarias|malaquias)\s*\d+/i
    ];
    
    return referencePatterns.some(pattern => pattern.test(query));
}

function searchVersesLocal(query) {
    const results = [];
    const searchTerms = normalizeText(query).split(/\s+/);
    
    Object.entries(biblicalVerses).forEach(([category, verses]) => {
        verses.forEach(verse => {
            const normalizedText = normalizeText(verse.text);
            const normalizedReference = normalizeText(verse.reference);
            
            // Búsqueda exacta en referencia
            if (normalizedReference.includes(normalizeText(query))) {
                results.push({ ...verse, category, matchType: 'reference', source: 'local' });
                return;
            }
            
            // Búsqueda por palabras clave en el texto
            const matchesAllTerms = searchTerms.every(term => 
                normalizedText.includes(term) || normalizedReference.includes(term)
            );
            
            if (matchesAllTerms) {
                results.push({ ...verse, category, matchType: 'text', source: 'local' });
            }
        });
    });
    
    // Ordenar resultados
    results.sort((a, b) => {
        if (a.matchType === 'reference' && b.matchType !== 'reference') return -1;
        if (b.matchType === 'reference' && a.matchType !== 'reference') return 1;
        return 0;
    });
    
    return results;
}

// Funciones de utilidad
function showLoading() {
    isLoading = true;
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    hideError();
}

function hideLoading() {
    isLoading = false;
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

function showError(message = "Error al cargar el versículo. Intentando de nuevo...") {
    if (errorMessage) {
        errorMessage.querySelector('p').textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(hideError, 3000);
    }
}

function hideError() {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

function normalizeText(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, '')
        .trim();
}

function getRandomVerse(category = null) {
    let versesPool = [];
    
    if (category && biblicalVerses[category]) {
        versesPool = biblicalVerses[category];
    } else {
        Object.values(biblicalVerses).forEach(categoryVerses => {
            versesPool = versesPool.concat(categoryVerses);
        });
    }
    
    const randomIndex = Math.floor(Math.random() * versesPool.length);
    return { ...versesPool[randomIndex], source: 'local' };
}

function displayVerse(verse) {
    if (!verse) return;
    
    currentVerse = verse;
    
    if (verseText) {
        verseText.textContent = `"${verse.text}"`;
    }
    
    if (verseReference) {
        verseReference.textContent = verse.reference;
    }
    
    addToHistory(verse);
    updateSaveButton();
}

function addToHistory(verse) {
    if (verseHistory.length === 0 || verseHistory[0].reference !== verse.reference) {
        verseHistory.unshift(verse);
        
        if (verseHistory.length > 10) {
            verseHistory = verseHistory.slice(0, 10);
        }
        
        updateHistoryDisplay();
    }
}

function updateHistoryDisplay() {
    if (!verseHistoryContainer) return;
    
    verseHistoryContainer.innerHTML = '';
    
    verseHistory.forEach((verse, index) => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <div class="history-verse-text">"${verse.text.substring(0, 100)}${verse.text.length > 100 ? '...' : ''}"</div>
            <div class="history-verse-reference">${verse.reference} ${verse.source === 'api' ? '🌐' : ''}</div>
        `;
        
        card.addEventListener('click', () => {
            displayVerse(verse);
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
        
        verseHistoryContainer.appendChild(card);
    });
}

function loadNewVerse(category = null) {
    if (isLoading) return;
    
    showLoading();
    
    setTimeout(() => {
        try {
            const verse = getRandomVerse(category);
            displayVerse(verse);
            hideLoading();
        } catch (error) {
            console.error('Error loading verse:', error);
            showError();
            hideLoading();
        }
    }, 500);
}

async function displaySearchResults(results, query) {
    if (results.length === 0) {
        if (verseText) {
            verseText.textContent = `No se encontraron resultados para "${query}".`;
        }
        if (verseReference) {
            verseReference.textContent = "Intenta con otra referencia o palabra clave.";
        }
        showNotification(`No se encontraron resultados para "${query}"`);
        return;
    }
    
    displayVerse(results[0]);
    
    const sourceText = results[0].source === 'api' ? ' (desde API)' : ' (desde base local)';
    showNotification(`Se encontraron ${results.length} versículo(s) para "${query}"${sourceText}`);
    
    if (results.length > 1) {
        results.slice(1, 6).forEach(verse => {
            if (!verseHistory.some(h => h.reference === verse.reference)) {
                verseHistory.push(verse);
            }
        });
        updateHistoryDisplay();
    }
}

async function performSearch() {
    const query = searchInput ? searchInput.value.trim() : '';
    
    if (!query) {
        showNotification('Por favor ingresa una palabra clave o referencia bíblica');
        return;
    }
    
    console.log('Iniciando búsqueda para:', query);
    showLoading();
    
    try {
        const results = await searchVerses(query);
        displaySearchResults(results, query);
        hideLoading();
    } catch (error) {
        console.error('Error en búsqueda:', error);
        showError('Error al realizar la búsqueda');
        hideLoading();
    }
}

function toggleFavorite() {
    if (!currentVerse) return;
    
    const index = favorites.findIndex(fav => fav.reference === currentVerse.reference);
    
    if (index === -1) {
        favorites.push(currentVerse);
        showNotification('Versículo agregado a favoritos');
    } else {
        favorites.splice(index, 1);
        showNotification('Versículo removido de favoritos');
    }
    
    updateSaveButton();
    updateFavoritesList();
}

function updateSaveButton() {
    if (!currentVerse || !saveVerseBtn) return;
    
    const index = favorites.findIndex(fav => fav.reference === currentVerse.reference);
    const isFavorite = index !== -1;
    const icon = saveVerseBtn.querySelector('.verse-icon');
    
    if (icon) {
        if (isFavorite) {
            icon.textContent = '💖';
            saveVerseBtn.classList.add('favorite-active');
        } else {
            icon.textContent = '❤️';
            saveVerseBtn.classList.remove('favorite-active');
        }
    }
}

function updateFavoritesList() {
    if (!favoritesList) return;
    
    favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="no-favorites">
                <p>Aún no tienes versículos favoritos.</p>
                <p>¡Haz clic en el corazón para guardar tus versículos preferidos!</p>
            </div>
        `;
        return;
    }
    
    favorites.forEach((verse, index) => {
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'favorite-card';
        favoriteCard.innerHTML = `
            <div class="favorite-text">"${verse.text}"</div>
            <div class="favorite-reference">${verse.reference} ${verse.source === 'api' ? '🌐' : ''}</div>
            <div class="favorite-actions">
                <button class="favorite-action-btn show-verse" data-index="${index}">Ver</button>
                <button class="favorite-action-btn remove-favorite" data-index="${index}">Eliminar</button>
            </div>
        `;
        
        favoritesList.appendChild(favoriteCard);
    });
    
    document.querySelectorAll('.show-verse').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            displayVerse(favorites[index]);
            if (favoritesModal) {
                favoritesModal.style.display = 'none';
            }
        });
    });
    
    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            favorites.splice(index, 1);
            updateFavoritesList();
            updateSaveButton();
            showNotification('Versículo eliminado de favoritos');
        });
    });
}

function shareVerse() {
    if (!currentVerse) return;
    
    const shareText = `"${currentVerse.text}" - ${currentVerse.reference}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Palabra del Día',
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Versículo copiado al portapapeles');
            }).catch(() => {
                fallbackCopyToClipboard(shareText);
            });
        } else {
            fallbackCopyToClipboard(shareText);
        }
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Versículo copiado');
    } catch (err) {
        console.error('Error al copiar:', err);
        showNotification('No se pudo copiar el versículo');
    }
    
    document.body.removeChild(textArea);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando aplicación con soporte de API...');
    
    loadNewVerse();
    
    if (newVerseBtn) {
        newVerseBtn.addEventListener('click', () => loadNewVerse());
    }
    
    if (shareVerseBtn) {
        shareVerseBtn.addEventListener('click', shareVerse);
    }
    
    if (saveVerseBtn) {
        saveVerseBtn.addEventListener('click', toggleFavorite);
    }
    
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', () => {
            updateFavoritesList();
            if (favoritesModal) {
                favoritesModal.style.display = 'block';
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (favoritesModal) {
                favoritesModal.style.display = 'none';
            }
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === favoritesModal) {
            favoritesModal.style.display = 'none';
        }
    });
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            loadNewVerse(category);
            
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
    
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchTerm = tag.dataset.search;
            if (searchInput) {
                searchInput.value = searchTerm;
            }
            
            showLoading();
            setTimeout(async () => {
                try {
                    const results = await searchVerses(searchTerm);
                    displaySearchResults(results, searchTerm);
                    hideLoading();
                } catch (error) {
                    console.error('Error en búsqueda:', error);
                    showError('Error al realizar la búsqueda');
                    hideLoading();
                }
            }, 300);
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'n' && e.ctrlKey) {
            e.preventDefault();
            loadNewVerse();
        }
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            toggleFavorite();
        }
        if (e.key === 'Escape' && favoritesModal && favoritesModal.style.display === 'block') {
            favoritesModal.style.display = 'none';
        }
    });
    
    console.log('Aplicación inicializada correctamente con soporte de API');
});
