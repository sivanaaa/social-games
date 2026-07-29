(function () {
    'use strict';

    var SIGNATURE_SENTENCES = [
        'המשחק נבדק על תלמידים אמיתיים. הם עדיין מסתובבים בינינו.',
        'נוסה בכיתה אמיתית. הרעש היה חלק מהבדיקה.',
        'נבדק על תלמידים. רובם שיתפו פעולה.',
        'פותח בין צלצול להפסקה.',
        'נוצר אחרי יותר מדי פעמים של ״המורהההה״.',
        'אושר על ידי ועדת המומחים המחמירה ביותר: תלמידים.',
        'תופעת לוואי אפשרית: תלמידים שמדברים זה עם זה.',
        'נבדק בשטח. כלומר, בכיתה.',
        'אף דף עבודה לא נפגע במהלך פיתוח המשחק.',
        'נוצר עם הרבה מחשבה. והומור הישרדותי.'
    ];

    var ROTATION_INTERVAL_MS = 30000;
    var TRANSITION_MS = 350;
    var RECENT_HISTORY_SIZE = 3;

    var signatureRoot = null;
    var captionEl = null;
    var rotationTimer = null;
    var lastScreenId = null;
    var currentIndex = -1;
    var recentHistory = [];
    var hasRenderedOnce = false;

    function prefersReducedMotion() {
        return typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function buildComponent() {
        var root = document.createElement('div');
        root.className = 'signature-component';
        root.innerHTML =
            '<div class="creator-stamp" aria-label="נוצר על ידי C.van עם הרבה הומור ועם הרבה מחשבה">' +
            '<div class="creator-name">C.van</div>' +
            '<div class="creator-line">נוצר עם</div>' +
            '<div class="creator-humor">הרבה הומור</div>' +
            '<div class="creator-message">ועם הרבה מחשבה</div>' +
            '</div>' +
            '<p class="signature-caption" aria-live="polite"></p>';
        return root;
    }

    function pickNextIndex() {
        var exclude = {};
        if (currentIndex !== -1) exclude[currentIndex] = true;
        recentHistory.forEach(function (i) { exclude[i] = true; });

        var candidates = [];
        for (var i = 0; i < SIGNATURE_SENTENCES.length; i += 1) {
            if (!exclude[i]) candidates.push(i);
        }
        if (candidates.length === 0) {
            for (var j = 0; j < SIGNATURE_SENTENCES.length; j += 1) {
                if (j !== currentIndex) candidates.push(j);
            }
        }
        if (candidates.length === 0) candidates = [0];
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    function showSentence(index) {
        if (!captionEl) return;
        if (currentIndex !== -1) {
            recentHistory.push(currentIndex);
            if (recentHistory.length > RECENT_HISTORY_SIZE) recentHistory.shift();
        }
        currentIndex = index;
        var text = SIGNATURE_SENTENCES[index];

        if (!hasRenderedOnce || prefersReducedMotion()) {
            captionEl.textContent = text;
            hasRenderedOnce = true;
            return;
        }

        captionEl.classList.add('is-transitioning');
        setTimeout(function () {
            captionEl.textContent = text;
            void captionEl.offsetWidth; // force reflow so the fade-in transition replays
            captionEl.classList.remove('is-transitioning');
        }, TRANSITION_MS);
    }

    function rotateSentence() {
        showSentence(pickNextIndex());
    }

    function clearTimer() {
        if (rotationTimer) {
            clearInterval(rotationTimer);
            rotationTimer = null;
        }
    }

    function startTimer() {
        clearTimer();
        rotationTimer = setInterval(rotateSentence, ROTATION_INTERVAL_MS);
    }

    function getActiveScreenId() {
        var active = document.querySelector('.screen.active');
        return active ? active.id : null;
    }

    function relocateToSlot(screenId) {
        var slot = document.querySelector('#' + screenId + ' .signature-slot');
        if (!slot || !signatureRoot) return;
        if (signatureRoot.parentElement !== slot) {
            slot.appendChild(signatureRoot);
        }
    }

    function handleScreenChange() {
        var screenId = getActiveScreenId();
        if (!screenId || screenId === lastScreenId) return;
        lastScreenId = screenId;
        relocateToSlot(screenId);
        rotateSentence();
        startTimer();
    }

    function initObserver() {
        var screens = document.querySelectorAll('.screen');
        var observer = new MutationObserver(handleScreenChange);
        screens.forEach(function (screen) {
            observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
        });
    }

    function initVisibilityHandling() {
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                clearTimer();
            } else if (getActiveScreenId()) {
                startTimer();
            }
        });
    }

    function init() {
        signatureRoot = buildComponent();
        captionEl = signatureRoot.querySelector('.signature-caption');
        initObserver();
        initVisibilityHandling();
        handleScreenChange();
        if (!document.hidden) startTimer();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
