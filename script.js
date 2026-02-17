/**
 * MATRIX EXCUSE GENERATOR
 */

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

// Carica scuse esclusivamente da scuse.txt
async function loadExcuses() {
    try {
        const response = await fetch('scuse.txt');
        if (!response.ok) throw new Error('File non trovato');
        const text = await response.text();
        excuses = parseExcuses(text);
        console.log('Database caricato da scuse.txt:', excuses.length);
    } catch (error) {
        console.error('Errore caricamento scuse.txt:', error);
        const display = document.getElementById('excuse-display');
        if (display) {
            display.innerHTML = '<p class="typing-text">&gt;_ ERRORE: DATABASE NON TROVATO</p>';
        }
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

    // Carica scuse solo se siamo nella home (dove serve generarle)
    if (document.getElementById('generate-btn')) {
        loadExcuses().then(() => loadCustomExcuses());
        document.getElementById('generate-btn').addEventListener('click', generateExcuse);
    }

    // Gestione pagina Aggiungi
    const addBtn = document.getElementById('add-excuse-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addExcuse);
    }

    // Gestione Login e Registrazione
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const toggleRegister = document.getElementById('toggle-register');
    const toggleLogin = document.getElementById('toggle-login');

    if (loginBtn) {
        loginBtn.addEventListener('click', login);
        document.getElementById('login-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', register);
    }

    if (toggleRegister) {
        toggleRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form-container').style.display = 'none';
            document.getElementById('register-form-container').style.display = 'flex';
        });
    }

    if (toggleLogin) {
        toggleLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-form-container').style.display = 'none';
            document.getElementById('login-form-container').style.display = 'flex';
        });
    }
});

// Funzione Login
function login() {
    const password = document.getElementById('login-password').value;
    const feedback = document.getElementById('login-feedback');

    if (password === 'scusa') {
        showFeedback(feedback, '✓ ACCESSO AUTORIZZATO');
        setTimeout(() => {
            window.location.href = 'add.html';
        }, 800);
    } else {
        showFeedback(feedback, '⚠ ACCESSO NEGATO: CODICE ERRATO', true);
    }
}

// Funzione Registrazione (Mock)
function register() {
    const email = document.getElementById('register-email').value;
    const feedback = document.getElementById('register-feedback');

    if (email && email.includes('@')) {
        showFeedback(feedback, '✓ REGISTRAZIONE AVVENUTA CON SUCCESSO');
        setTimeout(() => {
            document.getElementById('register-form-container').style.display = 'none';
            document.getElementById('login-form-container').style.display = 'flex';
            document.getElementById('login-password').focus();
        }, 1500);
    } else {
        showFeedback(feedback, '⚠ INSERISCI UN\'EMAIL VALIDA', true);
    }
}

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
    el.className = 'form-feedback ' + (isError ? 'error' : 'success');
    // Force reflow
    void el.offsetWidth;
    el.classList.add('show');
    setTimeout(() => {
        el.classList.remove('show');
        // Reset classes after hide
        setTimeout(() => {
            el.className = 'form-feedback';
        }, 300);
    }, 2500);
}

// Carica anche scuse custom da localStorage
function loadCustomExcuses() {
    const custom = JSON.parse(localStorage.getItem('custom_excuses') || '[]');
    excuses.push(...custom);
    if (custom.length > 0) {
        console.log('Scuse custom caricate:', custom.length);
    }
}

