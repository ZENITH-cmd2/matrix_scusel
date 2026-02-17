/**
 * MATRIX EXCUSE GENERATOR
 */

// Scuse integrate direttamente nel codice (funziona senza server)
const SCUSE_DATA = `1|Realistica|Corta|Ho la febbre alta e devo restare a letto.
1|Realistica|Lunga|Il medico mi ha consigliato riposo assoluto perché ho la febbre e sono molto debilitato.
1|Realistica|Corta|Stanotte ho avuto un forte mal di testa e non ho chiuso occhio.
1|Realistica|Lunga|Ho passato la notte con un'emicrania intensa e non sono riuscito a dormire, mi sento completamente esausto.
1|Realistica|Corta|La macchina non parte questa mattina.
1|Realistica|Lunga|L'auto non si accende e il meccanico può intervenire solo nelle prossime ore.
1|Realistica|Corta|Devo accompagnare un familiare a una visita urgente.
1|Realistica|Lunga|Un familiare ha bisogno di essere accompagnato a una visita medica urgente e non posso rimandare.
1|Realistica|Corta|Ho un problema idraulico improvviso in casa.
1|Realistica|Lunga|C'è una perdita d'acqua importante in casa e sto aspettando l'idraulico per sistemare il guasto.
2|Assurda|Corta|Il mio cane ha mangiato le chiavi della macchina.
2|Assurda|Lunga|Il mio cane ha ingerito le chiavi dell'auto e sto aspettando indicazioni dal veterinario.
2|Assurda|Corta|Sono rimasto chiuso dentro casa.
2|Assurda|Lunga|La serratura si è bloccata improvvisamente e non riesco ad aprire la porta per uscire.
2|Assurda|Corta|Un vicino ha allagato il mio appartamento.
2|Assurda|Lunga|Durante la notte il vicino ha causato un allagamento e sto gestendo i danni in casa.
2|Assurda|Corta|Il gatto ha distrutto il mio computer.
2|Assurda|Lunga|Il mio gatto ha rovesciato il PC acceso e ora non funziona più, sto cercando di risolvere.
2|Assurda|Corta|Un piccione è entrato in casa.
2|Assurda|Lunga|Un piccione è entrato dalla finestra e sto cercando di farlo uscire senza devastare il soggiorno.
3|Assurda|Corta|Un'entità interdimensionale ha sabotato la mia sveglia.
3|Assurda|Lunga|Sono certo che un'entità interdimensionale abbia interferito con la mia sveglia facendomi perdere il senso del tempo.
3|Assurda|Corta|Sono stato convocato da una società segreta.
3|Assurda|Lunga|Ho ricevuto una convocazione urgente da una società segreta che richiede la mia presenza immediata.
3|Assurda|Corta|Ho aperto per sbaglio un portale temporale.
3|Assurda|Lunga|Mentre facevo colazione ho attivato accidentalmente un portale temporale in cucina e la situazione è sfuggita di mano.
3|Assurda|Corta|Il mio tostapane ha sviluppato autocoscienza.
3|Assurda|Lunga|Il tostapane sembra aver sviluppato autocoscienza e sto cercando di capire come disattivarlo in sicurezza.
3|Assurda|Corta|Un drone misterioso sorvola il mio balcone.
3|Assurda|Lunga|Da ore un drone misterioso sta sorvolando il mio balcone e non mi sento tranquillo a uscire di casa.`;

let excuses = [];
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width, height, columns;
const fontSize = 16;
let drops = [];

// Matrix Rain Animation
function initMatrix() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(1);
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#00FF41';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(Math.random() * 128);
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Parsa le scuse dal testo
function parseExcuses(text) {
    const lines = text.split('\n');
    const parsed = [];
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.length > 0 && trimmed.includes('|')) {
            const [level, category, length, sentence] = trimmed.split('|');
            parsed.push({
                level: level.trim(),
                category: category.trim(),
                length: length.trim(),
                sentence: sentence.trim()
            });
        }
    });
    return parsed;
}

// Carica scuse: prima prova fetch, se fallisce usa i dati integrati
async function loadExcuses() {
    try {
        const response = await fetch('scuse.txt');
        if (!response.ok) throw new Error('Fetch fallito');
        const text = await response.text();
        excuses = parseExcuses(text);
        console.log('Database caricato da file:', excuses.length);
    } catch (error) {
        // Fallback: usa le scuse integrate direttamente nel codice
        excuses = parseExcuses(SCUSE_DATA);
        console.log('Database caricato (integrato):', excuses.length);
    }
}

// Copia la scusa negli appunti
function copyExcuse(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            btn.classList.remove('copied');
        }, 1500);
    });
}

// Typewriter effect for excuses
function typeEffect(element, text, container) {
    let i = 0;
    let current = '';
    element.innerHTML = '<span class="typing-cursor">&gt; _</span>';
    const interval = setInterval(() => {
        if (i < text.length) {
            current += text.charAt(i);
            element.innerHTML = '&gt; ' + current + '<span class="typing-cursor">_</span>';
            i++;
        } else {
            clearInterval(interval);
            element.innerHTML = '&gt; ' + text;
            // Aggiungi bottone copia
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.title = 'Copia scusa';
            copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            copyBtn.addEventListener('click', () => copyExcuse(text, copyBtn));
            container.appendChild(copyBtn);
        }
    }, 30);
}

function generateExcuse() {
    const displayArea = document.getElementById('excuse-display');
    const filter = document.getElementById('absurdity-filter').value;

    if (excuses.length === 0) return;

    let filtered = excuses;
    if (filter !== 'all') {
        filtered = excuses.filter(e => e.level === filter);
    }

    if (filtered.length === 0) {
        displayArea.innerHTML = `<p class="typing-text">&gt;_ ERRORE: NESSUN DATA_SET TROVATO</p>`;
        return;
    }

    const selected = filtered[Math.floor(Math.random() * filtered.length)];

    displayArea.innerHTML = '';
    const excuseP = document.createElement('p');
    excuseP.className = 'scusa-txt';
    displayArea.appendChild(excuseP);

    typeEffect(excuseP, selected.sentence, displayArea);
}

// Event Listeners
window.addEventListener('resize', initMatrix);

document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    setInterval(drawMatrix, 35);
    loadExcuses().then(() => loadCustomExcuses());

    document.getElementById('generate-btn').addEventListener('click', generateExcuse);

    // Toggle add panel
    const toggleBtn = document.getElementById('toggle-add-btn');
    const addPanel = document.getElementById('add-panel');
    if (toggleBtn && addPanel) {
        toggleBtn.addEventListener('click', () => {
            addPanel.classList.toggle('open');
        });
    }

    // Add excuse
    const addBtn = document.getElementById('add-excuse-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addExcuse);
    }
});

// Aggiunge una nuova scusa
function addExcuse() {
    const level = document.getElementById('new-level').value;
    const category = document.getElementById('new-category').value;
    const length = document.getElementById('new-length').value;
    const text = document.getElementById('new-excuse-text').value.trim();
    const feedback = document.getElementById('add-feedback');

    if (!text) {
        showFeedback(feedback, '⚠ INSERISCI UN TESTO', true);
        return;
    }

    // Aggiungi all'array attivo
    const newExcuse = { level, category, length, sentence: text };
    excuses.push(newExcuse);

    // Salva in localStorage
    const custom = JSON.parse(localStorage.getItem('custom_excuses') || '[]');
    custom.push(newExcuse);
    localStorage.setItem('custom_excuses', JSON.stringify(custom));

    // Formato per scuse.txt
    const line = `${level}|${category}|${length}|${text}`;
    navigator.clipboard.writeText(line).then(() => {
        showFeedback(feedback, '✓ AGGIUNTA + COPIATA PER SCUSE.TXT');
    }).catch(() => {
        showFeedback(feedback, '✓ AGGIUNTA AL DATABASE LOCALE');
    });

    // Reset form
    document.getElementById('new-excuse-text').value = '';
}

function showFeedback(el, msg, isError = false) {
    el.textContent = msg;
    el.style.color = isError ? 'var(--neon-pink)' : 'var(--neon-cyan)';
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
}

// Carica anche scuse custom da localStorage
function loadCustomExcuses() {
    const custom = JSON.parse(localStorage.getItem('custom_excuses') || '[]');
    excuses.push(...custom);
    if (custom.length > 0) {
        console.log('Scuse custom caricate:', custom.length);
    }
}

