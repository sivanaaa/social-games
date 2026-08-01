// ===== ניווט בין מסכים =====
const screens = document.querySelectorAll('.screen');
const backBtn = document.getElementById('backBtn');
let currentScreen = 'home';

function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  backBtn.classList.toggle('hidden', id === 'home');
  currentScreen = id;
}

document.querySelectorAll('.stage-card').forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.screen));
});

backBtn.addEventListener('click', () => {
  if (currentScreen === 'breathing' && !breathingPlayEl.classList.contains('hidden')) {
    stopBreathing();
    return;
  }
  showScreen('home');
});

// ===== תרגילי נשימה =====
const breathingSelectEl = document.getElementById('breathing-select');
const breathingPlayEl = document.getElementById('breathing-play');
const breathShape = document.getElementById('breathShape');
const breathDot = document.getElementById('breathDot');
const breathChar = document.getElementById('breathChar');
const charParticles = document.getElementById('charParticles');
const breathLabel = document.getElementById('breathLabel');
const breathCaption = document.getElementById('breathCaption');
const breathCount = document.getElementById('breathCount');
const breathStopBtn = document.getElementById('breathStop');

const PATTERNS = {
  triangle: {
    points: [[100, 20], [180, 170], [20, 170]],
    phases: [
      { type: 'inhale', label: 'שאפו אוויר' },
      { type: 'hold', label: 'החזיקו רגע...' },
      { type: 'exhale', label: 'נשפו לאט לאט' }
    ]
  },
  rectangle: {
    points: [[30, 30], [170, 30], [170, 170], [30, 170]],
    phases: [
      { type: 'inhale', label: 'שאפו אוויר' },
      { type: 'hold', label: 'החזיקו רגע...' },
      { type: 'exhale', label: 'נשפו לאט לאט' },
      { type: 'hold', label: 'החזיקו רגע...' }
    ]
  }
};
const PHASE_SECONDS = 4;

const CAPTIONS = {
  inhale: [
    'כמו שאתם שואפים ריח של פיצה טרייה מהתנור 🍕',
    'שאפו כמו שאתם שואפים את הבאס במסיבה 🔊',
    'תמלאו אוויר כמו שממלאים סטורי בלי לחשוב פעמיים 📱',
    'שאפו כאילו זה הריח של האוכל של אמא כשנכנסים הביתה 🍜'
  ],
  hold: [
    'תחזיקו כמו שמחזיקים צחוק באמצע שיעור 🤐',
    'קפאו כמו כשהמורה שואלת "מי לא הכין שיעורים?" 😳',
    'תחזיקו חזק, כמו שמחזיקים סוד ממש שווה 🤫',
    'עצרו הכל, בדיוק כמו כשהווידאו טוען וקופא 🌀'
  ],
  exhale: [
    'שחררו הכל, כמו שמשחררים דעה בקבוצת וואטסאפ 😤',
    'נשפו כמו שנושפים על נרות יום הולדת (בלי לכבות את כל השכנים) 🎂',
    'תנו לזה לצאת כמו אנחה אחרי מבחן שהסתיים 😮‍💨',
    'תשפו את זה כמו שמשחררים סטרס אחרי שהגשתם עבודה 🎉'
  ]
};
let lastCaption = {};

function pickCaption(type) {
  const pool = CAPTIONS[type];
  let idx;
  do { idx = Math.floor(Math.random() * pool.length); } while (idx === lastCaption[type] && pool.length > 1);
  lastCaption[type] = idx;
  return pool[idx];
}

function spawnPuffs() {
  charParticles.innerHTML = '';
  const emojis = ['💨', '✨', '💨'];
  emojis.forEach((emoji, i) => {
    const span = document.createElement('span');
    span.className = 'puff';
    span.textContent = emoji;
    span.style.left = 90 + i * 15 + 'px';
    span.style.top = '135px';
    span.style.setProperty('--dx', (i - 1) * 30 + 'px');
    span.style.animationDelay = i * 0.15 + 's';
    charParticles.appendChild(span);
  });
}

let breathTimer = null;
let breathFrame = null;

document.querySelectorAll('.choice-card').forEach(btn => {
  btn.addEventListener('click', () => startBreathing(btn.dataset.pattern));
});
breathStopBtn.addEventListener('click', stopBreathing);

function startBreathing(patternName) {
  const pattern = PATTERNS[patternName];
  breathShape.setAttribute('points', pattern.points.map(p => p.join(',')).join(' '));
  breathChar.classList.remove('pattern-triangle', 'pattern-rectangle');
  breathChar.classList.add('pattern-' + patternName);
  breathingSelectEl.classList.add('hidden');
  breathingPlayEl.classList.remove('hidden');

  let phaseIndex = 0;
  let phaseStart = performance.now();

  function runPhase() {
    const phase = pattern.phases[phaseIndex];
    breathLabel.textContent = phase.label;
    breathCaption.textContent = pickCaption(phase.type);
    breathChar.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
    breathChar.classList.add('phase-' + phase.type);
    if (phase.type === 'exhale') spawnPuffs();
    phaseStart = performance.now();

    let secondsLeft = PHASE_SECONDS;
    breathCount.textContent = secondsLeft;
    clearInterval(breathTimer);
    breathTimer = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft > 0) {
        breathCount.textContent = secondsLeft;
      } else {
        phaseIndex = (phaseIndex + 1) % pattern.phases.length;
        runPhase();
      }
    }, 1000);
  }

  function animateDot(now) {
    const elapsed = (now - phaseStart) / 1000;
    const t = Math.min(elapsed / PHASE_SECONDS, 1);
    const a = pattern.points[phaseIndex];
    const b = pattern.points[(phaseIndex + 1) % pattern.points.length];
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    breathDot.setAttribute('cx', x);
    breathDot.setAttribute('cy', y);
    breathFrame = requestAnimationFrame(animateDot);
  }

  runPhase();
  breathFrame = requestAnimationFrame(animateDot);
}

function stopBreathing() {
  clearInterval(breathTimer);
  cancelAnimationFrame(breathFrame);
  charParticles.innerHTML = '';
  breathChar.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
  breathingPlayEl.classList.add('hidden');
  breathingSelectEl.classList.remove('hidden');
}

// ===== בדיחות להפגת חרדה =====
const JOKES = [
  'למה המחשב הלך לרופא? כי היה לו וירוס! 🤒💻',
  'מה אומר אפס לשמונה? יפה החגורה! 🎯',
  'למה הדג לא משחק טניס? כי הוא מפחד מהרשת! 🐟',
  'מה קורה לצפרדע שהמכונית שלה מתקלקלת? היא נגררת! 🐸',
  'למה הספר לא מפסיק לבכות? כי יש לו יותר מדי עמודים עצובים! 📖',
  'למה העיפרון היה עצוב? כי לא היה לו כיוון! ✏️',
  'מה אומר קיר לקיר אחר? ניפגש בפינה! 🧱',
  'למה השעון הלך לפסיכולוג? כי הוא ״תיק תיק תיק״ כל הזמן! ⏰',
  'למה הכוכב לא נרדם בלילה? כי הוא זוהר מדי! ⭐',
  'מה אומרים לענן ביום הולדתו? שיהיה לך מזל טוב וגשום! ☁️'
];
let lastJoke = -1;

function showRandomJoke() {
  let idx;
  do { idx = Math.floor(Math.random() * JOKES.length); } while (idx === lastJoke && JOKES.length > 1);
  lastJoke = idx;
  document.getElementById('jokeBox').textContent = JOKES[idx];
}
document.getElementById('nextJoke').addEventListener('click', showRandomJoke);

// ===== משפטים שעוזרים =====
const SENTENCES = [
  '“זה בסדר לא להרגיש בסדר.”',
  '“אני יכול/ה להתמודד עם זה, צעד אחד בכל פעם.”',
  '“ההרגשה הזו תעבור, גם אם עכשיו היא חזקה.”',
  '“אני לא לבד עם מה שאני מרגיש/ה.”',
  '“מותר לי לבקש עזרה.”',
  '“כבר התמודדתי עם דברים קשים בעבר, ואני אתמודד גם עכשיו.”',
  '“אני נושם/ת, ואני כאן, ואני בטוח/ה.”',
  '“טעויות הן חלק מלגדול, לא סיבה להיבהל.”',
  '“אני מרשה לעצמי רגע לנשום לפני שאני ממשיך/ה.”',
  '“מה שאני מרגיש/ה חשוב, וגם אני חשוב/ה.”'
];
let lastSentence = -1;

function showRandomSentence() {
  let idx;
  do { idx = Math.floor(Math.random() * SENTENCES.length); } while (idx === lastSentence && SENTENCES.length > 1);
  lastSentence = idx;
  document.getElementById('sentenceBox').textContent = SENTENCES[idx];
}
document.getElementById('nextSentence').addEventListener('click', showRandomSentence);

// ===== הפינה שלי =====
const MOODS = ['😊', '😢', '😠', '😨', '😐', '🥰'];
const moodRow = document.getElementById('moodRow');
let selectedMood = null;

MOODS.forEach(mood => {
  const btn = document.createElement('button');
  btn.className = 'mood-btn';
  btn.textContent = mood;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    if (selectedMood === mood) {
      selectedMood = null;
    } else {
      selectedMood = mood;
      btn.classList.add('selected');
    }
  });
  moodRow.appendChild(btn);
});

const STORAGE_KEY = 'ani-personal-entries';
const personalText = document.getElementById('personalText');
const entriesList = document.getElementById('entriesList');

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderEntries() {
  const entries = loadEntries();
  entriesList.innerHTML = '';
  entries.slice().reverse().forEach((entry, i) => {
    const realIndex = entries.length - 1 - i;
    const item = document.createElement('div');
    item.className = 'entry-item';
    item.innerHTML = `
      <div class="entry-header">
        <span>${entry.mood || ''}</span>
        <span class="entry-date">${entry.date}</span>
        <button class="entry-delete" data-index="${realIndex}">✕</button>
      </div>
      <div class="entry-text"></div>
    `;
    item.querySelector('.entry-text').textContent = entry.text;
    entriesList.appendChild(item);
  });

  entriesList.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const entries = loadEntries();
      entries.splice(Number(btn.dataset.index), 1);
      saveEntries(entries);
      renderEntries();
    });
  });
}

document.getElementById('saveEntry').addEventListener('click', () => {
  const text = personalText.value.trim();
  if (!text && !selectedMood) return;

  const entries = loadEntries();
  entries.push({
    text,
    mood: selectedMood,
    date: new Date().toLocaleString('he-IL')
  });
  saveEntries(entries);

  personalText.value = '';
  selectedMood = null;
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  renderEntries();
});

// ===== אתחול =====
showRandomJoke();
showRandomSentence();
renderEntries();
