
const letters = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת'];

const categoryPacks = {
    intro: [
        'זיכרון ילדות נעים', 'תחביב שאני אוהב/ת', 'מקום שהייתי רוצה לבקר בו',
        'מאכל שמעלה בי חיוך', 'סרט או סדרה שאני ממליץ/ה', 'ספר או שיר שאני אוהב/ת',
        'משהו שאני אוהב/ת לעשות בשעות הפנאי', 'מקום שכיף לי להיות בו',
        'עיר או מדינה שהייתי רוצה לגור בה', 'תכונה שמאפיינת אותי',
        'דבר שאני תמיד עונה עליו "כן"', 'משהו שקניתי לאחרונה ואני מרוצה ממנו',
        'אירוע שמחכה לי השנה', 'דבר שהייתי עושה ביום חופש מושלם',
        'מאכל שהייתי אוכל/ת כל יום אם יכולתי', 'זמר או להקה שאני אוהב/ת',
        'דבר שתמיד יש לי בתיק', 'עונה בשנה שהכי אני אוהב/ת',
        'משחק שאני אוהב/ת לשחק', 'מקום שהייתי חוזר/ת אליו שוב ושוב',
        'דבר שגורם לי להרגיש בבית', 'תחביב שהייתי רוצה להתחיל'
    ],
    social: [
        'מחמאה שאפשר לתת מכל הלב', 'דרך לעזור לחבר/ה', 'תכונה טובה בחבר/ה',
        'דרך להקשיב באמת', 'דרך לפתור אי הבנה', 'משהו שקבוצה מעניקה לי',
        'דרך לבקש סליחה', 'התנהגות מכבדת שתמיד עובדת', 'משהו שמחבר בין אנשים',
        'דרך להראות שאכפת לך מהחבר/ה', 'מה עושה קבוצה לצוות טוב',
        'תכונה שחשובה בעבודת צוות', 'דרך לפרגן לחבר/ה',
        'איך יודעים שמישהו חבר אמיתי', 'דרך להתמודד עם ריב עם חבר/ה',
        'מה עוזר להרגיש שייכ/ת לקבוצה', 'דרך להכיר חבר/ה חדש/ה',
        'משהו שאפשר ללמוד מחבר/ה', 'איך עוזרים למישהו שמרגיש לבד',
        'מילה טובה שתמיד משמחת', 'דרך לחגוג הצלחה של חבר/ה',
        'מה הופך מפגש קבוצתי למוצלח'
    ],
    strengths: [
        'תכונה שאני גאה בה', 'חוש או כישרון שיש לי', 'משהו שאני טוב/ה בו',
        'יכולת שעוזרת לי להצליח', 'משהו שלמדתי לאחרונה', 'דרך שבה אני מתגבר/ת על קושי',
        'כוח שיש לי לעזור לאחרים', 'איכות שאנשים מעריכים בי',
        'הצלחה קטנה שקרתה לי לאחרונה', 'תכונה שירשתי ממישהו במשפחה',
        'דבר שקשה לי אבל אני מתאמץ/ת בו', 'כישרון שהתגלה אצלי בהפתעה',
        'דרך שבה אני מעודד/ת את עצמי', 'מה עוזר לי להתרכז',
        'תחום שבו השתפרתי השנה', 'משהו שאני עושה טוב יותר מבעבר',
        'איך אני מתמודד/ת עם ביקורת', 'כוח פנימי שעוזר לי בקושי',
        'הרגל טוב שיש לי', 'מה עוזר לי לקום אחרי כישלון',
        'תכונה שהופכת אותי למיוחד/ת'
    ],
    values: [
        'ערך שחשוב לי בחיים', 'מעשה טוב שאפשר לעשות היום', 'מה הופך מנהיג/ה לטוב/ה',
        'משהו שנותן לי ביטחון', 'דרך להראות אחריות', 'משהו שהייתי משנה לטובה בעולם',
        'איך שומרים על ישרות וכבוד', 'משהו שמעורר בי השראה',
        'דמות שמהווה השראה עבורי', 'דרך להראות סובלנות',
        'מה חשוב לי שיזכרו אותי בזכותו', 'החלטה טובה שקיבלתי',
        'דרך לתמוך במישהו שטועה', 'מה עוזר לקבל החלטות נכונות',
        'ערך שהייתי רוצה להעביר הלאה', 'דרך להתמודד עם לחץ חברתי',
        'מעשה של מנהיגות שראיתי', 'איך מתנצלים כמו שצריך',
        'מה עושה מקום לביטחון בקבוצה', 'דרך לכבד דעה שונה משלי',
        'למה חשוב לעמוד מאחורי מה שנכון'
    ],
    fun: [
        'מאכל מוזר שאני אוהב/ת', 'פדיחה מצחיקה שקרתה לי', 'כישרון סודי או מוזר',
        'חיה שהייתי רוצה להיות ליום אחד', 'משהו שהייתי לוקח/ת לאי בודד',
        'משהו שמצחיק אותי תמיד', 'חפץ מוזר שיש לי בבית', 'מילה מצחיקה שאני אוהב/ת',
        'דבר הכי מוזר שאכלתי בחיים', 'שיר שאני שר/ה גם כשלא רואים אותי',
        'על-כוח מצחיק שהייתי רוצה שיהיה לי', 'הרגל מוזר שיש לי',
        'משהו שתמיד גורם לי לצחוק מחדש', 'דבר שהייתי עושה אם הייתי בלתי נראה/ית ליום',
        'כינוי מצחיק שקראו לי פעם', 'הדבר הכי מביך שקרה לי',
        'מה הייתי עושה עם מיליון שקל ביום אחד', 'חיה שהכי מזכירה אותי',
        'מאכל שלעולם לא אנסה', 'דבר שתמיד שוכח/ת', 'ריקוד או תנועה מצחיקה שאני עושה'
    ],
    workplace: [
        'טיפ שמשנה את יום העבודה', 'איכות שאני מעריך/ה בקולגה', 'משהו שלא יודעים עליי במשרד',
        'משהו שנותן לי מוטיבציה', 'פדיחה קטנה בעבודה', 'דבר ראשון שאני עושה בסוף היום',
        'רגע גאווה מהעבודה', 'דבר שהייתי משפר בסביבת העבודה',
        'מה עוזר לי להתמודד עם לחץ בעבודה', 'הרגל טוב מהעבודה',
        'קולגה שהשפיע/ה עליי', 'מטרה מקצועית לשנה הקרובה'
    ],
    parents: [
        'משהו שאני גאה בו בילד/ה שלי', 'ציפייה שיש לי מהשנה הקרובה', 'דבר שכיף לעשות ביחד כמשפחה',
        'תכונה שהייתי שמח/ה שתתפתח השנה', 'זיכרון טוב מהשנה שעברה', 'דרך שבה אשמח להיות מעורב/ת בכיתה',
        'משהו שהייתי רוצה שהצוות החינוכי ידע עלינו', 'מסורת משפחתית שאנחנו אוהבים',
        'דבר שהיינו רוצים לשפר כהורים', 'זיכרון טוב מגיל הגן או בית הספר של הילד/ה',
        'דרך שבה המשפחה שלנו אוהבת לחגוג', 'ציפייה מהצוות החינוכי השנה',
        'דבר שגורם לילד/ה שלנו לחייך', 'איך אנחנו אוהבים לבלות בסוף שבוע',
        'דבר שלמדנו מהילד/ה שלנו', 'תמיכה שהיינו רוצים לקבל מבית הספר',
        'מסורת שהיינו רוצים להנחיל', 'דבר שגאים בו במשפחה שלנו',
        'איך אנחנו מעודדים למידה בבית', 'זיכרון מצחיק מהבית',
        'דבר שמדאיג ומרגיע אותנו לגבי השנה'
    ],
    kindergarten: [
        'חיה שאני אוהב/ת', 'צבע שאני אוהב/ת', 'מאכל טעים', 'משחק כיף',
        'דבר שיש בבית שלי', 'חבר או חברה בגן', 'דבר שמצחיק אותי',
        'דמות שאני אוהב/ת מהטלוויזיה', 'משהו שאני אוהב/ת לצייר', 'דבר שעושה אותי שמח/ה',
        'דבר שאני אוהב/ת לעשות עם אמא או אבא', 'צליל שאני אוהב/ת לשמוע',
        'דבר שאני לוקח/ת איתי כשאני ישן/ה', 'מקום שאני אוהב/ת ללכת אליו',
        'שיר שאני אוהב/ת לשיר'
    ],
    grade1_2: [
        'צעצוע שאני הכי אוהב/ת', 'חיה שהייתי רוצה להיות', 'צבע שאני הכי אוהב/ת',
        'משחק שכיף לי לשחק', 'דבר שמצחיק אותי', 'מאכל שאני אוהב/ת לאכול',
        'דבר שאני יודע/ת לעשות טוב', 'חבר/ה שכיף לי לשחק איתו/ה',
        'דבר שיש לי בתיק לבית ספר', 'משחק שאני אוהב/ת בהפסקה',
        'דבר שקורה בכיתה שאני אוהב/ת', 'חג שאני הכי אוהב/ת',
        'דבר שאני עושה עם המשפחה בסוף שבוע', 'דמות מסרט שאני אוהב/ת',
        'דבר שגורם לי לשמוח', 'חיה שהייתי רוצה שתהיה לי בבית',
        'דבר שלמדתי לעשות לבד', 'צליל או קול שאני אוהב/ת'
    ],
    grade3_4: [
        'תחביב שאני אוהב/ת', 'ספר שאהבתי לקרוא', 'משהו שלמדתי לאחרונה',
        'מקום שהייתי רוצה לטייל בו', 'דבר שאני גאה בו', 'משחק חוץ שאני אוהב/ת',
        'חלום שיש לי לעתיד', 'דרך לעזור לחבר/ה בכיתה',
        'ספר שהייתי ממליץ/ה לחבר/ה', 'דבר שהייתי רוצה לדעת לעשות',
        'משחק קבוצתי שאני אוהב/ת', 'מקצוע חלומי',
        'דבר שקשה לי בבית הספר', 'דבר שקל לי בבית הספר',
        'טיול שהייתי רוצה לצאת אליו', 'דבר שאני עושה כשמשעמם לי',
        'חבר/ה שהכרתי השנה', 'דבר שהייתי משנה בכיתה שלי'
    ],
    grade5_6: [
        'תכונה טובה שיש לי', 'סדרה או סרט שאני ממליץ/ה עליו', 'משהו שהייתי רוצה ללמוד',
        'דרך להיות חבר/ה טוב/ה', 'הישג שאני גאה בו', 'משהו שמלחיץ אותי בבית הספר',
        'תחביב חדש שהייתי רוצה לנסות', 'מה עוזר לי כשאני עצוב/ה',
        'אפליקציה או משחק שאני אוהב/ת', 'דבר שהייתי רוצה שההורים ידעו עליי',
        'דרך שבה אני מתמודד/ת עם שינוי', 'דבר שמלחיץ אותי לפני מבחן',
        'תחביב שהייתי רוצה להשקיע בו יותר', 'דבר שגורם לי גאווה בכיתה',
        'דבר שהייתי רוצה ללמד מישהו', 'חבר/ה שתמיד אפשר לסמוך עליו/ה',
        'דבר שהייתי רוצה שיקרה השנה', 'מה עוזר לי כשמתווכחים איתי'
    ],
    grade7_8: [
        'תכונה שאני מעריך/ה בחבר/ה', 'דבר שקשה לי בגיל הזה', 'משהו שהייתי רוצה שישתנה בבית הספר',
        'חלום או שאיפה לעתיד', 'דרך שבה אני מתמודד/ת עם לחץ', 'משהו שמניע אותי',
        'מוזיקה שאני אוהב/ת עכשיו', 'משהו שלמדתי על עצמי השנה',
        'דבר שמעניין אותי ברשתות חברתיות', 'דעה שהשתנתה אצלי לאחרונה',
        'דבר שהייתי רוצה שיבינו עליי המבוגרים', 'דרך להתמודד עם ביקורת מחברים',
        'תחום שהייתי רוצה להעמיק בו', 'דבר שגורם לי ללחץ חברתי',
        'מה עוזר לי להירגע', 'דמות שמעוררת בי השראה עכשיו',
        'דבר שהייתי משנה בעצמי', 'זיכרון טוב מהקיץ האחרון'
    ],
    grade9_10: [
        'ערך שחשוב לי', 'תחום שהייתי רוצה להתמקצע בו', 'משהו שמלחיץ אותי לגבי העתיד',
        'דרך שבה אני מתמודד/ת עם כישלון', 'תכונה שהייתי רוצה לפתח', 'מה הכי חשוב לי בחברות',
        'רגע שבו הרגשתי גאה בעצמי', 'משהו שהייתי רוצה שיבינו עליי',
        'כיוון לימודים שמעניין אותי', 'דבר שהייתי רוצה לנסות ולא מעז/ה',
        'איך אני מתמודד/ת עם ציפיות', 'דבר שהכי חשוב לי בזוגיות או בחברות',
        'רגע שבו הפתעתי את עצמי', 'דבר שהייתי רוצה לשנות בבית הספר',
        'מה מלחיץ אותי בבגרויות', 'ערך שהייתי נלחם/ת עליו',
        'דבר שלמדתי מטעות', 'חלום מקצועי שיש לי'
    ],
    grade11_12: [
        'תוכנית לשנה הבאה', 'ערך שינחה אותי בעתיד', 'משהו שלמדתי על עצמי בתיכון',
        'חשש לגבי הבגרות או העתיד', 'רגע משמעותי מהשנים בתיכון', 'תכונה שעוזרת לי להתמודד עם לחץ',
        'משהו שהייתי רוצה לומר לעצמי הצעיר/ה', 'חלום גדול שיש לי',
        'דבר שהכי יחסר לי מהתיכון', 'פחד לגבי השירות או העתיד',
        'עצה שהייתי נותן/ת לעצמי בכיתה ט׳', 'דבר שהייתי רוצה לעשות לפני שממשיכים הלאה',
        'מה מגדיר בגרות בעיניי', 'דבר שהכי גאה בו מהשנים האלה',
        'חבר/ה שאשאר איתו/ה בקשר', 'ערך שאקח איתי הלאה',
        'מה עוזר לי להתמודד עם אי-ודאות', 'רגע שבו הרגשתי שהתבגרתי'
    ]
};


const state = {
    participants: 24,
    playMode: 'group',
    groupSize: 4,
    duration: 10,
    totalRounds: 4,
    letterMode: 'auto',
    selectedLetter: null,
    categoryPack: 'mixed',
    activeCategories: [],
    currentRound: 0,
    groups: [],
    playedLetters: [],
    paused: false,
    activeTimers: []
};

const dom = {
    participantCountInput: document.getElementById('participantCountInput'),
    participantMinus: document.getElementById('participantMinus'),
    participantPlus: document.getElementById('participantPlus'),
    groupModeButton: document.getElementById('groupModeButton'),
    classModeButton: document.getElementById('classModeButton'),
    groupSizeSection: document.getElementById('groupSizeSection'),
    groupSizeButtons: Array.from(document.querySelectorAll('.group-size-buttons .option-button')),
    groupSummaryText: document.getElementById('groupSummaryText'),
    nameToggleButton: document.getElementById('nameToggleButton'),
    durationButtons: Array.from(document.querySelectorAll('.duration-buttons .option-button')),
    roundsDisplay: document.getElementById('roundsDisplay'),
    letterModeAutoButton: document.getElementById('letterModeAutoButton'),
    letterModeManualButton: document.getElementById('letterModeManualButton'),
    letterVisual: document.getElementById('letterVisual'),
    manualLetterGrid: document.getElementById('manualLetterGrid'),
    selectedLetterIndicator: document.getElementById('selectedLetterIndicator'),
    letterModeNote: document.getElementById('letterModeNote'),
    packButtons: Array.from(document.querySelectorAll('.pack-button')),
    switchCategoriesButton: document.getElementById('switchCategoriesButton'),
    setupCategoryGrid: document.getElementById('setupCategoryGrid'),
    startGameButton: document.getElementById('startGameButton'),
    openHelpButton: document.getElementById('openHelpButton'),
    footerSummary: document.getElementById('footerSummary'),
    groupCountText: document.getElementById('groupCountText'),
    groupCountdownNumber: document.getElementById('groupCountdownNumber'),
    groupList: document.getElementById('groupList'),
    countdownLabel: document.getElementById('countdownLabel'),
    countdownNumber: document.getElementById('countdownNumber'),
    roundHeader: document.getElementById('roundHeader'),
    progressFill: document.getElementById('progressFill'),
    timerLabel: document.getElementById('timerLabel'),
    timerDisplay: document.getElementById('timerDisplay'),
    statusText: document.getElementById('statusText'),
    letterDisplay: document.getElementById('letterDisplay'),
    categoryGrid: document.getElementById('categoryGrid'),
    playAgainButton: document.getElementById('playAgainButton'),
    anotherGameButton: document.getElementById('anotherGameButton'),
    sharePhaseText: document.getElementById('shareQuestion'),
    shareTimerDisplay: document.getElementById('shareTimerDisplay'),
    shareCountdownRow: document.getElementById('shareCountdownRow'),
    shareNextCountdown: document.getElementById('shareNextCountdown'),
    finishRoundsText: document.getElementById('finishRoundsText'),
    finishLettersText: document.getElementById('finishLettersText'),
    helpStartButton: document.getElementById('helpStartButton'),
    closeHelpButton: document.getElementById('closeHelpButton'),
    closeNamesButton: document.getElementById('closeNamesButton'),
    namesOverlay: document.getElementById('namesOverlay'),
    helpOverlay: document.getElementById('helpOverlay'),
    exitOverlay: document.getElementById('exitOverlay'),
    confirmYes: document.getElementById('confirmYes'),
    confirmNo: document.getElementById('confirmNo')
};

const navHomeButtons = Array.from(document.querySelectorAll('.nav-home'));
const navExitButtons = Array.from(document.querySelectorAll('.nav-exit'));

function init() {
    bindEvents();
    setCategoryPack(state.categoryPack);
    updateParticipantCount();
    updateGroupSettings();
    updateDuration(state.duration);
    updateLetterMode(state.letterMode);
    renderFooterSummary();
    renderCategories();
}

function bindEvents() {
    dom.participantMinus.addEventListener('click', () => changeParticipants(-1));
    dom.participantPlus.addEventListener('click', () => changeParticipants(1));
    dom.groupModeButton.addEventListener('click', () => setPlayMode('group'));
    dom.classModeButton.addEventListener('click', () => setPlayMode('class'));
    dom.groupSizeButtons.forEach(button => button.addEventListener('click', () => setGroupSize(Number(button.dataset.size))));
    dom.durationButtons.forEach(button => button.addEventListener('click', () => setDuration(Number(button.dataset.minutes))));
    dom.letterModeAutoButton.addEventListener('click', () => setLetterMode('auto'));
    dom.letterModeManualButton.addEventListener('click', () => setLetterMode('manual'));
    dom.packButtons.forEach(button => button.addEventListener('click', () => setCategoryPack(button.dataset.pack)));
    dom.switchCategoriesButton.addEventListener('click', () => {
        generateCategories();
        renderCategories();
    });
    dom.startGameButton.addEventListener('click', startGame);
    dom.openHelpButton.addEventListener('click', openHelpOverlay);
    dom.nameToggleButton.addEventListener('click', openNamesOverlay);
    dom.closeNamesButton.addEventListener('click', closeNamesOverlay);
    dom.helpStartButton.addEventListener('click', () => {
        closeHelpOverlay();
        startGame();
    });
    dom.closeHelpButton.addEventListener('click', closeHelpOverlay);
    navHomeButtons.forEach(button => button.addEventListener('click', goHome));
    navExitButtons.forEach(button => button.addEventListener('click', showExitModal));
    dom.confirmYes.addEventListener('click', confirmExit);
    dom.confirmNo.addEventListener('click', closeExitModal);
    document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(event) {
    if (event.key !== 'Escape') return;
    if (!dom.helpOverlay.classList.contains('hidden')) {
        closeHelpOverlay();
        return;
    }
    if (!dom.namesOverlay.classList.contains('hidden')) {
        closeNamesOverlay();
        return;
    }
    if (!dom.exitOverlay.classList.contains('hidden')) {
        closeExitModal();
    }
}

function changeParticipants(amount) {
    state.participants = Math.max(1, Math.min(100, state.participants + amount));
    updateParticipantCount();
    updateGroupSettings();
    renderFooterSummary();
}

function updateParticipantCount() {
    dom.participantCountInput.textContent = state.participants;
}

function setPlayMode(mode) {
    state.playMode = mode;
    dom.groupModeButton.classList.toggle('selected', mode === 'group');
    dom.groupModeButton.setAttribute('aria-pressed', mode === 'group');
    dom.classModeButton.classList.toggle('selected', mode === 'class');
    dom.classModeButton.setAttribute('aria-pressed', mode === 'class');
    updateGroupSettings();
    renderFooterSummary();
}

function setGroupSize(size) {
    state.groupSize = size;
    dom.groupSizeButtons.forEach(button => {
        const active = Number(button.dataset.size) === size;
        button.classList.toggle('selected', active);
        button.setAttribute('aria-pressed', active);
    });
    updateGroupSettings();
    renderFooterSummary();
}

function updateGroupSettings() {
    const isGroupMode = state.playMode === 'group';
    dom.groupSizeSection.classList.toggle('hidden', !isGroupMode);
    if (!isGroupMode) {
        dom.groupSummaryText.textContent = 'כל הכיתה';
        return;
    }
    const groupCount = Math.ceil(state.participants / state.groupSize);
    const base = Math.floor(state.participants / groupCount);
    const remainder = state.participants % groupCount;
    const groupText = remainder === 0
        ? `${groupCount} קבוצות · ${base} משתתפים בכל קבוצה`
        : `${groupCount} קבוצות · ${base}–${base + 1} משתתפים`;
    dom.groupSummaryText.textContent = groupText;
}

function setDuration(minutes) {
    state.duration = minutes;
    dom.durationButtons.forEach(button => {
        const active = Number(button.dataset.minutes) === minutes;
        button.classList.toggle('selected', active);
        button.setAttribute('aria-pressed', active);
    });
    updateDuration(minutes);
    renderFooterSummary();
}

function updateDuration(minutes) {
    state.totalRounds = minutes === 15 ? 6 : minutes === 20 ? 8 : 4;
    dom.roundsDisplay.textContent = `${state.totalRounds} סיבובים`;
}

function setLetterMode(mode) {
    state.letterMode = mode;
    dom.letterModeAutoButton.classList.toggle('selected', mode === 'auto');
    dom.letterModeAutoButton.setAttribute('aria-pressed', mode === 'auto');
    dom.letterModeManualButton.classList.toggle('selected', mode === 'manual');
    dom.letterModeManualButton.setAttribute('aria-pressed', mode === 'manual');
    updateLetterMode();
}

function updateLetterMode() {
    const isAuto = state.letterMode === 'auto';
    dom.manualLetterGrid.classList.toggle('hidden', isAuto);
    dom.selectedLetterIndicator.classList.toggle('hidden', isAuto);
    dom.letterModeNote.textContent = isAuto ? 'האות תוגרל עם תחילת הסיבוב' : 'בחרו אות ידנית מהלוח';
    if (isAuto) {
        dom.letterVisual.innerHTML = '<span>?</span>';
    } else {
        if (!state.selectedLetter) {
            state.selectedLetter = letters[0];
        }
        dom.letterVisual.innerHTML = `<span>${state.selectedLetter}</span>`;
        renderManualLetterGrid();
        dom.selectedLetterIndicator.textContent = `אות נבחרת: ${state.selectedLetter}`;
    }
}

function renderManualLetterGrid() {
    dom.manualLetterGrid.innerHTML = letters.map(letter => {
        const active = letter === state.selectedLetter;
        return `<button type="button" class="option-button${active ? ' selected' : ''}" data-letter="${letter}" aria-pressed="${active}">${letter}</button>`;
    }).join('');
    dom.manualLetterGrid.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            state.selectedLetter = button.dataset.letter;
            renderManualLetterGrid();
            dom.letterVisual.innerHTML = `<span>${state.selectedLetter}</span>`;
            dom.selectedLetterIndicator.textContent = `אות נבחרת: ${state.selectedLetter}`;
        });
    });
}

function setCategoryPack(pack) {
    state.categoryPack = pack;
    dom.packButtons.forEach(button => {
        const active = button.dataset.pack === pack;
        button.classList.toggle('selected', active);
        button.setAttribute('aria-pressed', active);
    });
    generateCategories();
    renderCategories();
}

function generateCategories() {
    if (state.categoryPack === 'mixed') {
        state.activeCategories = buildMixedCategories();
        return;
    }
    state.activeCategories = shuffleArray(categoryPacks[state.categoryPack]).slice(0, 10);
}

function buildMixedCategories() {
    const picked = [];
    picked.push(...pickUnique(categoryPacks.social, 2, picked));
    picked.push(...pickUnique(categoryPacks.strengths, 2, picked));
    picked.push(...pickUnique(categoryPacks.fun, 2, picked));
    const pool = [...categoryPacks.intro, ...categoryPacks.values, ...categoryPacks.social, ...categoryPacks.strengths, ...categoryPacks.fun]
        .filter(item => !picked.includes(item));
    picked.push(...pickUnique(pool, 4, picked));
    return shuffleArray(picked).slice(0, 10);
}

function pickUnique(source, count, existing) {
    const pool = source.filter(item => !existing.includes(item));
    return shuffleArray(pool).slice(0, count);
}

function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function renderCategories() {
    const markup = state.activeCategories.map((category, index) => `<div class="category-cell"><span class="category-number">${index + 1}</span><span class="category-text">${category}</span></div>`).join('');
    if (!dom.setupCategoryGrid || !dom.categoryGrid) {
        console.error('Categories rendered failed: missing DOM elements', {
            setupCategoryGrid: !!dom.setupCategoryGrid,
            categoryGrid: !!dom.categoryGrid
        });
        return;
    }
    dom.setupCategoryGrid.innerHTML = markup;
    dom.categoryGrid.innerHTML = markup;
    console.log('Categories rendered', state.activeCategories.length);
}

function renderFooterSummary() {
    const modeText = state.playMode === 'group' ? `קבוצות של ${state.groupSize}` : 'כל הכיתה';
    dom.footerSummary.textContent = `${state.participants} משתתפים · ${modeText} · ${state.duration} דקות · ${state.totalRounds} סיבובים`;
}

function startGame() {
    console.log('Game started');
    stopAllTimers();
    state.groups = buildGroups();
    state.playedLetters = [];
    state.currentRound = 0;
    if (state.playMode === 'group') {
        showGroupScreen();
    } else {
        startCountdown(3, startRound);
    }
}

function startCountdown(seconds, callback) {
    console.log('Countdown started', seconds);
    showCountdownScreen('המשחק מתחיל בעוד', seconds, callback);
}

function buildGroups() {
    if (state.playMode === 'class') {
        return [{ name: 'כיתה אחת', members: Array.from({ length: state.participants }, (_, index) => `משתתף ${index + 1}`) }];
    }
    const groupCount = Math.ceil(state.participants / state.groupSize);
    const base = Math.floor(state.participants / groupCount);
    const remainder = state.participants % groupCount;
    return Array.from({ length: groupCount }, (_, index) => {
        const size = base + (index < remainder ? 1 : 0);
        return {
            name: `קבוצה ${index + 1}`,
            members: Array.from({ length: size }, (_, memberIndex) => `משתתף ${index * state.groupSize + memberIndex + 1}`)
        };
    });
}

function showGroupScreen() {
    stopAllTimers();
    dom.groupCountText.textContent = `${state.participants} משתתפים בחלוקה ל־${state.groups.length} קבוצות.`;
    dom.groupList.innerHTML = state.groups.map(group => `<div class="group-card"><h2>${group.name}</h2><p>${group.members.length} משתתפים</p></div>`).join('');
    switchScreen('groupScreen');
    let counter = 5;
    dom.groupCountdownNumber.textContent = String(counter);
    const interval = setInterval(() => {
        counter -= 1;
        dom.groupCountdownNumber.textContent = String(counter);
        if (counter <= 0) {
            stopAllTimers();
            showCountdownScreen('המשחק מתחיל בעוד', 3, startRound);
        }
    }, 1000);
    state.activeTimers.push(interval);
}

function showCountdownScreen(label, seconds, callback) {
    stopAllTimers();
    dom.countdownLabel.textContent = label;
    let counter = seconds;
    dom.countdownNumber.textContent = String(counter);
    switchScreen('countdownScreen');
    const interval = setInterval(() => {
        counter -= 1;
        dom.countdownNumber.textContent = String(counter);
        if (counter <= 0) {
            console.log('Countdown finished');
            stopAllTimers();
            callback();
        }
    }, 1000);
    state.activeTimers.push(interval);
}

function startRound() {
    console.log('Round started', state.currentRound + 1);
    stopAllTimers();
    state.currentRound += 1;
    if (state.currentRound > state.totalRounds) {
        finishGame();
        return;
    }
    if (state.letterMode === 'auto') {
        state.selectedLetter = letters[Math.floor(Math.random() * letters.length)];
    }
    state.playedLetters.push(state.selectedLetter);
    renderLetter();
    renderCategories();
    dom.roundHeader.textContent = `${state.currentRound} מתוך ${state.totalRounds}`;
    dom.timerLabel.textContent = 'כותבים';
    dom.statusText.textContent = 'כותבים תשובות';
    switchScreen('gameScreen');
    startRoundTimer(90, startSharePhase);
}

function renderLetter() {
    if (!dom.letterVisual || !dom.letterDisplay) {
        console.error('Letter rendering failed: missing DOM elements', {
            letterVisual: !!dom.letterVisual,
            letterDisplay: !!dom.letterDisplay
        });
        return;
    }
    if (state.letterMode === 'auto') {
        dom.letterVisual.innerHTML = `<span>${state.selectedLetter}</span>`;
    } else {
        if (!state.selectedLetter) {
            state.selectedLetter = letters[0];
        }
        dom.letterVisual.innerHTML = `<span>${state.selectedLetter}</span>`;
        if (dom.selectedLetterIndicator) {
            dom.selectedLetterIndicator.textContent = `אות נבחרת: ${state.selectedLetter}`;
        }
    }
    dom.letterDisplay.textContent = state.selectedLetter;
    console.log('Letter generated', state.selectedLetter);
}

function startRoundTimer(seconds, onFinish) {
    console.log('Timer started', seconds);
    showGameTimer(seconds, onFinish);
}

function showGameTimer(seconds, onFinish) {
    stopAllTimers();
    let remaining = seconds;
    dom.timerDisplay.textContent = formatTime(remaining);
    updateProgress(remaining, seconds);
    const interval = setInterval(() => {
        if (state.paused) return;
        remaining -= 1;
        dom.timerDisplay.textContent = formatTime(remaining);
        updateProgress(remaining, seconds);
        if (remaining <= 0) {
            stopAllTimers();
            onFinish();
        }
    }, 1000);
    state.activeTimers.push(interval);
}

function updateProgress(value, total) {
    const percent = total > 0 ? ((total - value) / total) * 100 : 0;
    dom.progressFill.style.width = `${percent}%`;
}

function startSharePhase() {
    stopAllTimers();
    switchScreen('shareScreen');
    dom.sharePhaseText.textContent = state.currentRound === state.totalRounds
        ? 'סבב סוף: שתפו תשובה טובה.'
        : 'שתפו תשובה אחת בקבוצה.';
    let remaining = 45;
    document.getElementById('shareTimerDisplay').textContent = String(remaining);
    dom.shareCountdownRow.classList.add('hidden');
    const interval = setInterval(() => {
        if (state.paused) return;
        remaining -= 1;
        document.getElementById('shareTimerDisplay').textContent = String(remaining);
        if (remaining <= 0) {
            stopAllTimers();
            if (state.currentRound >= state.totalRounds) {
                finishGame();
            } else {
                beginNextRoundCountdown();
            }
        }
    }, 1000);
    state.activeTimers.push(interval);
}

function beginNextRoundCountdown() {
    dom.shareCountdownRow.classList.remove('hidden');
    let remaining = 3;
    dom.shareNextCountdown.textContent = String(remaining);
    const interval = setInterval(() => {
        if (state.paused) return;
        remaining -= 1;
        dom.shareNextCountdown.textContent = String(remaining);
        if (remaining <= 0) {
            stopAllTimers();
            startRound();
        }
    }, 1000);
    state.activeTimers.push(interval);
}

function finishGame() {
    stopAllTimers();
    switchScreen('finishScreen');
    document.getElementById('finishRoundsText').textContent = `שוחקו ${state.totalRounds} סיבובים.`;
    document.getElementById('finishLettersText').textContent = `אותות שנבחרו: ${state.playedLetters.join(' · ')}.`;
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.toggle('active', screen.id === screenId));
}

function openHelpOverlay() {
    dom.helpOverlay.classList.remove('hidden');
}

function closeHelpOverlay() {
    dom.helpOverlay.classList.add('hidden');
}

function openNamesOverlay() {
    dom.namesOverlay.classList.remove('hidden');
}

function closeNamesOverlay() {
    dom.namesOverlay.classList.add('hidden');
}

function showExitModal() {
    dom.exitOverlay.classList.remove('hidden');
}

function closeExitModal() {
    dom.exitOverlay.classList.add('hidden');
}

function confirmExit() {
    closeExitModal();
    goHome();
}

function goHome() {
    stopAllTimers();
    state.paused = false;
    state.currentRound = 0;
    dom.timerLabel.textContent = 'כותבים';
    dom.progressFill.style.width = '0%';
    switchScreen('setupScreen');
}

function stopAllTimers() {
    state.activeTimers.forEach(timerId => {
        clearInterval(timerId);
        clearTimeout(timerId);
    });
    state.activeTimers = [];
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateProgress(value, total) {
    const percent = total > 0 ? ((total - value) / total) * 100 : 0;
    dom.progressFill.style.width = `${percent}%`;
}

init();
