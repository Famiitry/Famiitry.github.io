// ── Floating particles ──────────────────────────────────────────────
const container = document.getElementById('particles');
for (let i = 0; i < 25; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 3 + 1;
  p.style.cssText = `
    left: ${Math.random() * 100}%;
    width: ${size}px; height: ${size}px;
    animation-duration: ${Math.random() * 15 + 10}s;
    animation-delay: ${Math.random() * 10}s;
    opacity: ${Math.random() * 0.5 + 0.2};
    background: ${['#a78bfa','#f472b6','#38bdf8','#fff'][Math.floor(Math.random()*4)]};
  `;
  container.appendChild(p);
}

// ── Ripple effect ───────────────────────────────────────────────────
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple { to { transform:scale(1); opacity:0; } }`;
document.head.appendChild(rippleStyle);

document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; width:${size*2}px; height:${size*2}px;
      left:${e.clientX - rect.left - size}px; top:${e.clientY - rect.top - size}px;
      background:rgba(255,255,255,0.1); border-radius:50%;
      transform:scale(0); animation:ripple 0.6s linear; pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ── Terminal typewriter ─────────────────────────────────────────────
const termBody = document.getElementById('termBody');

const lines = [
  { prompt: '~$', text: 'git init',            color: 'cmd-text'   },
  { prompt: '',   text: 'Initialized repo ✓',  color: 'cmd-green'  },
  { prompt: '~$', text: 'git add .',            color: 'cmd-text'   },
  { prompt: '~$', text: 'git commit -m "init"', color: 'cmd-text'   },
  { prompt: '',   text: '[main] 1 file',         color: 'cmd-yellow' },
  { prompt: '~$', text: 'git push origin',      color: 'cmd-text'   },
  { prompt: '',   text: 'Done! 🚀',             color: 'cmd-pink'   },
];

const CHAR_DELAY  = 55;   // ms per character
const LINE_PAUSE  = 380;  // ms between lines
const CYCLE_PAUSE = 1800; // ms before restart

let lineIndex  = 0;
let charIndex  = 0;
let currentEl  = null;
let cursorEl   = null;
const MAX_VISIBLE = 7; // max lines shown

function createLineEl(line) {
  const div = document.createElement('div');
  div.className = 'terminal-line' + (line.prompt === '' ? ' dim' : '');

  if (line.prompt) {
    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = line.prompt + ' ';
    div.appendChild(prompt);
  }

  const txt = document.createElement('span');
  txt.className = line.color;
  div.appendChild(txt);

  return { div, txt };
}

function typeChar() {
  const line = lines[lineIndex];

  if (charIndex === 0) {
    // New line: create element
    const { div, txt } = createLineEl(line);
    currentEl = txt;

    // Remove cursor from previous line if any
    if (cursorEl && cursorEl.parentNode) cursorEl.parentNode.removeChild(cursorEl);

    termBody.appendChild(div);

    // Trim old lines
    while (termBody.children.length > MAX_VISIBLE) {
      termBody.removeChild(termBody.firstChild);
    }

    // Add cursor
    cursorEl = document.createElement('span');
    cursorEl.className = 'cursor';
    div.appendChild(cursorEl);
  }

  if (charIndex < line.text.length) {
    currentEl.textContent += line.text[charIndex];
    charIndex++;
    setTimeout(typeChar, CHAR_DELAY);
  } else {
    // Line done
    charIndex = 0;
    lineIndex++;

    if (lineIndex < lines.length) {
      setTimeout(typeChar, LINE_PAUSE);
    } else {
      // Full cycle done — restart
      lineIndex = 0;
      setTimeout(() => {
        // Clear terminal
        termBody.innerHTML = '';
        cursorEl = null;
        typeChar();
      }, CYCLE_PAUSE);
    }
  }
}

// Start after a short delay so page loads first
setTimeout(typeChar, 900);