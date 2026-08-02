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
const pinwheel = document.getElementById('pinwheel');
const breathChar = document.getElementById('breathChar');
const breathLabel = document.getElementById('breathLabel');
const breathCaption = document.getElementById('breathCaption');
const breathCount = document.getElementById('breathCount');
const breathStopBtn = document.getElementById('breathStop');

const PATTERNS = {
  triangle: {
    phases: [
      { type: 'inhale', label: 'שאפו אוויר' },
      { type: 'hold', label: 'החזיקו רגע...' },
      { type: 'exhale', label: 'נשפו לאט לאט' }
    ]
  },
  rectangle: {
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
    'סבתא שואפת עמוק... איזה ריח דייסה משגע',
    'סבתא מערבבת בסיר ושואפת את הניחוח המתוק',
    'שאיפה עמוקה, בדיוק כמו שסבתא נהנית מהריח שעולה מהסיר',
    'שואפים כמו שסבתא שואפת את ריח הקינמון בדייסה'
  ],
  hold: [
    'סבתא מקפיאה את הכף באוויר... עוד רגע טועמת',
    'סבתא בודקת: "רגע, זה כבר מוכן?" ומחכה בלי לזוז',
    'תחזיקו כמו שסבתא מחזיקה את הכף לפני שהיא טועמת',
    'רגע של מתח... הדייסה בסיר, וסבתא מחכה שתתקרר קצת'
  ],
  exhale: [
    'סבתא נושפת חזק על הכף החמה, לא רוצים לשרוף את הלשון!',
    'נשיפה ארוכה על הדייסה הרותחת, בדיוק כמו סבתא',
    'תנשפו את זה כמו שסבתא מצננת את הדייסה לפני שהיא טועמת',
    'נשפו לאט, כמו שסבתא מצננת כפית אחרי כפית'
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

let breathTimer = null;

document.querySelectorAll('.choice-card').forEach(btn => {
  btn.addEventListener('click', () => startBreathing(btn.dataset.pattern));
});
breathStopBtn.addEventListener('click', stopBreathing);

function startBreathing(patternName) {
  const pattern = PATTERNS[patternName];
  breathingSelectEl.classList.add('hidden');
  breathingPlayEl.classList.remove('hidden');

  let phaseIndex = 0;

  function runPhase() {
    const phase = pattern.phases[phaseIndex];
    breathLabel.textContent = phase.label;
    breathCaption.textContent = pickCaption(phase.type);
    breathChar.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
    breathChar.classList.add('phase-' + phase.type);
    pinwheel.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
    pinwheel.classList.add('phase-' + phase.type);

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

  runPhase();
}

function stopBreathing() {
  clearInterval(breathTimer);
  breathChar.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
  pinwheel.classList.remove('phase-inhale', 'phase-hold', 'phase-exhale');
  breathingPlayEl.classList.add('hidden');
  breathingSelectEl.classList.remove('hidden');
}

// ===== בדיחות להפגת חרדה =====
const JOKES = [
  'למה המחשב הלך לרופא? כי היה לו וירוס!',
  'מה אומר אפס לשמונה? יפה החגורה!',
  'למה הדג לא משחק טניס? כי הוא מפחד מהרשת!',
  'מה קורה לצפרדע שהמכונית שלה מתקלקלת? היא נגררת!',
  'למה הספר לא מפסיק לבכות? כי יש לו יותר מדי עמודים עצובים!',
  'למה העיפרון היה עצוב? כי לא היה לו כיוון!',
  'מה אומר קיר לקיר אחר? ניפגש בפינה!',
  'למה השעון הלך לפסיכולוג? כי הוא ״תיק תיק תיק״ כל הזמן!',
  'למה הכוכב לא נרדם בלילה? כי הוא זוהר מדי!',
  'מה אומרים לענן ביום הולדתו? שיהיה לך מזל טוב וגשום!'
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
const MOODS = [
  { id: 'happy', label: 'שמח' },
  { id: 'sad', label: 'עצוב' },
  { id: 'angry', label: 'כועס' },
  { id: 'scared', label: 'מפוחד' },
  { id: 'neutral', label: 'רגוע' },
  { id: 'loving', label: 'אוהב' }
];

const MOOD_FACES = {
  happy: '<circle class="dot" cx="14" cy="16" r="2"></circle><circle class="dot" cx="26" cy="16" r="2"></circle><path d="M12 24 Q20 32 28 24"></path>',
  sad: '<circle class="dot" cx="14" cy="17" r="2"></circle><circle class="dot" cx="26" cy="17" r="2"></circle><path d="M10 12 Q14 9 18 12"></path><path d="M22 12 Q26 9 30 12"></path><path d="M12 27 Q20 21 28 27"></path>',
  angry: '<path d="M9 11 L18 16"></path><path d="M31 11 L22 16"></path><circle class="dot" cx="14" cy="19" r="2"></circle><circle class="dot" cx="26" cy="19" r="2"></circle><path d="M13 27 Q20 24 27 27"></path>',
  scared: '<circle class="ring" cx="14" cy="17" r="3.2"></circle><circle class="dot" cx="14" cy="17" r="1.2"></circle><circle class="ring" cx="26" cy="17" r="3.2"></circle><circle class="dot" cx="26" cy="17" r="1.2"></circle><path d="M11 11 h6 M23 11 h6"></path><ellipse class="ring-fill" cx="20" cy="27" rx="3.4" ry="4.2"></ellipse>',
  neutral: '<circle class="dot" cx="14" cy="16" r="2"></circle><circle class="dot" cx="26" cy="16" r="2"></circle><path d="M14 26 H26"></path>',
  loving: '<path d="M11 16 Q14 12.5 17 16"></path><path d="M23 16 Q26 12.5 29 16"></path><path d="M12 24 Q20 32 28 24"></path><circle class="mood-blush" cx="11" cy="21" r="2.2"></circle><circle class="mood-blush" cx="29" cy="21" r="2.2"></circle>'
};

function moodIconSVG(id) {
  return `<svg viewBox="0 0 40 40" class="mood-face">${MOOD_FACES[id]}</svg>`;
}

const moodRow = document.getElementById('moodRow');
let selectedMood = null;

MOODS.forEach(mood => {
  const btn = document.createElement('button');
  btn.className = 'mood-btn';
  btn.title = mood.label;
  btn.innerHTML = moodIconSVG(mood.id);
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    if (selectedMood === mood.id) {
      selectedMood = null;
    } else {
      selectedMood = mood.id;
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
        <span class="entry-mood">${entry.mood && MOOD_FACES[entry.mood] ? moodIconSVG(entry.mood) : ''}</span>
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
