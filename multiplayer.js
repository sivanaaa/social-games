import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    increment
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAwlobsrlIvScgD6GQfRUPu-YCjCjZpEwc",
    authDomain: "eretz-ir-sivan.firebaseapp.com",
    projectId: "eretz-ir-sivan",
    storageBucket: "eretz-ir-sivan.firebasestorage.app",
    messagingSenderId: "755498295677",
    appId: "1:755498295677:web:aafe7dd19ee21dce026c14"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const WRITE_SECONDS = 90;
const SHARE_SECONDS = 45;
const COUNTDOWN_SECONDS = 3;
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L to avoid confusion

let currentRoomCode = null;
let isHost = false;
let unsubscribeRoom = null;
let tickTimer = null;
let hostTimer = null;
let lastRenderedStatus = null;

function el(id) {
    return document.getElementById(id);
}

function roomRef(code) {
    return doc(db, "rooms", code);
}

function generateRoomCode() {
    let code = "";
    for (let i = 0; i < 5; i += 1) {
        code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    return code;
}

/* ---------------- Mode toggle (setup screen) ---------------- */

function initModeToggle() {
    const buttons = Array.from(document.querySelectorAll(".mode-toggle-button"));
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((b) => {
                const active = b === button;
                b.classList.toggle("selected", active);
                b.setAttribute("aria-pressed", String(active));
            });
            window.digitalGameMode = button.dataset.gameMode;
        });
    });
    window.digitalGameMode = "local";
}

/* ---------------- Join screen wiring ---------------- */

function initJoinFlow() {
    const openJoinButton = el("openJoinButton");
    const joinCodeInput = el("joinCodeInput");
    const joinRoomButton = el("joinRoomButton");
    const joinErrorText = el("joinErrorText");

    openJoinButton.addEventListener("click", () => {
        joinErrorText.classList.add("hidden");
        joinCodeInput.value = "";
        window.switchScreen("joinScreen");
        joinCodeInput.focus();
    });

    joinCodeInput.addEventListener("input", () => {
        joinCodeInput.value = joinCodeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
    });

    joinRoomButton.addEventListener("click", () => {
        attemptJoin(joinCodeInput.value.trim());
    });

    joinCodeInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") attemptJoin(joinCodeInput.value.trim());
    });

    const params = new URLSearchParams(window.location.search);
    const joinParam = (params.get("join") || "").toUpperCase();
    if (joinParam) {
        window.switchScreen("joinScreen");
        joinCodeInput.value = joinParam;
        attemptJoin(joinParam);
    }
}

async function attemptJoin(code) {
    const joinErrorText = el("joinErrorText");
    joinErrorText.classList.add("hidden");
    if (!code || code.length < 4) {
        joinErrorText.textContent = "יש להקליד קוד תקין";
        joinErrorText.classList.remove("hidden");
        return;
    }
    try {
        const snap = await getDoc(roomRef(code));
        if (!snap.exists()) {
            joinErrorText.textContent = "לא נמצא משחק עם הקוד הזה";
            joinErrorText.classList.remove("hidden");
            return;
        }
        isHost = false;
        currentRoomCode = code;
        el("joinedRoomCodeDisplay").textContent = code;
        updateDoc(roomRef(code), { joinedCount: increment(1) }).catch(() => {});
        listenToRoom(code);
    } catch (err) {
        console.error("Join failed", err);
        joinErrorText.textContent = "משהו השתבש. נסו שוב.";
        joinErrorText.classList.remove("hidden");
    }
}

/* ---------------- Host flow ---------------- */

window.startDigitalGame = async function startDigitalGame() {
    const state = window.state;
    const code = generateRoomCode();
    currentRoomCode = code;
    isHost = true;

    const initialData = {
        status: "lobby",
        participants: state.participants,
        playMode: state.playMode,
        groupSize: state.groupSize,
        duration: state.duration,
        totalRounds: state.totalRounds,
        currentRound: 0,
        letterMode: state.letterMode,
        selectedLetter: null,
        categoryPack: state.categoryPack,
        categories: state.activeCategories,
        phase: null,
        phaseEndsAt: null,
        playedLetters: [],
        joinedCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    try {
        await setDoc(roomRef(code), initialData);
    } catch (err) {
        console.error("Failed to create room", err);
        alert("לא הצלחנו ליצור חדר משחק. בדקו את החיבור לאינטרנט ונסו שוב.");
        return;
    }

    el("roomCodeDisplay").textContent = code;
    el("roomJoinedCount").textContent = "ממתינים למשתתפים...";
    window.switchScreen("hostLobbyScreen");
    listenToRoom(code);

    const startButton = el("startDigitalRoundButton");
    startButton.onclick = () => hostBeginCountdown();

    const codeBox = document.querySelector("#hostLobbyScreen .room-code-box");
    codeBox.onclick = () => {
        navigator.clipboard.writeText(code).then(() => {
            el("roomJoinedCount").textContent = "הקוד הועתק!";
            setTimeout(() => renderJoinedCount(), 1500);
        }).catch(() => {});
    };
};

let lastKnownJoinedCount = 0;
function renderJoinedCount() {
    el("roomJoinedCount").textContent = lastKnownJoinedCount > 0
        ? `${lastKnownJoinedCount} מכשירים הצטרפו`
        : "ממתינים למשתתפים... (אפשר גם ללחוץ על הקוד להעתקה)";
}

async function hostBeginCountdown() {
    if (hostTimer) clearInterval(hostTimer);
    const phaseEndsAt = Date.now() + COUNTDOWN_SECONDS * 1000;
    await updateDoc(roomRef(currentRoomCode), {
        status: "countdown",
        phase: "countdown",
        phaseEndsAt,
        updatedAt: serverTimestamp()
    });
    scheduleHostTransition(phaseEndsAt, () => hostRunRound(1));
}

async function hostRunRound(roundNumber) {
    const state = window.state;
    if (roundNumber > state.totalRounds) {
        await updateDoc(roomRef(currentRoomCode), {
            status: "finished",
            phase: null,
            phaseEndsAt: null,
            updatedAt: serverTimestamp()
        });
        return;
    }
    const letter = state.letterMode === "auto"
        ? window.letters[Math.floor(Math.random() * window.letters.length)]
        : state.selectedLetter;
    const phaseEndsAt = Date.now() + WRITE_SECONDS * 1000;
    await updateDoc(roomRef(currentRoomCode), {
        status: "playing",
        currentRound: roundNumber,
        selectedLetter: letter,
        phase: "writing",
        phaseEndsAt,
        playedLetters: [...(window.__digitalPlayedLetters || []), letter],
        updatedAt: serverTimestamp()
    });
    window.__digitalPlayedLetters = [...(window.__digitalPlayedLetters || []), letter];
    scheduleHostTransition(phaseEndsAt, () => hostRunSharePhase(roundNumber));
}

async function hostRunSharePhase(roundNumber) {
    const phaseEndsAt = Date.now() + SHARE_SECONDS * 1000;
    await updateDoc(roomRef(currentRoomCode), {
        status: "sharing",
        phase: "sharing",
        phaseEndsAt,
        updatedAt: serverTimestamp()
    });
    scheduleHostTransition(phaseEndsAt, () => hostRunRound(roundNumber + 1));
}

function scheduleHostTransition(targetTime, callback) {
    if (hostTimer) clearInterval(hostTimer);
    hostTimer = setInterval(() => {
        if (Date.now() >= targetTime) {
            clearInterval(hostTimer);
            hostTimer = null;
            callback();
        }
    }, 500);
}

/* ---------------- Shared rendering (host + participant) ---------------- */

function listenToRoom(code) {
    if (unsubscribeRoom) unsubscribeRoom();
    unsubscribeRoom = onSnapshot(roomRef(code), (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        if (typeof data.joinedCount === "number") {
            lastKnownJoinedCount = data.joinedCount;
            if (isHost && data.status === "lobby") renderJoinedCount();
        }
        renderRoomState(data);
    }, (err) => {
        console.error("Room listener error", err);
    });
}

function renderCategoriesInto(gridEl, categories) {
    const markup = (categories || []).map((category, index) => (
        `<div class="category-cell"><span class="category-number">${index + 1}</span><span class="category-text">${category}</span></div>`
    )).join("");
    gridEl.innerHTML = markup;
}

function startTicker(endsAt, onTick) {
    if (tickTimer) clearInterval(tickTimer);
    function tick() {
        const remaining = Math.max(0, Math.round((endsAt - Date.now()) / 1000));
        onTick(remaining);
    }
    tick();
    tickTimer = setInterval(tick, 1000);
}

function renderRoomState(data) {
    const dom = window.dom;
    const changedStatus = data.status !== lastRenderedStatus;
    lastRenderedStatus = data.status;

    if (data.status === "lobby") {
        if (!isHost) {
            window.switchScreen("joinWaitingScreen");
            el("joinedRoomCodeDisplay").textContent = currentRoomCode;
        }
        return;
    }

    if (data.status === "countdown") {
        window.switchScreen("countdownScreen");
        dom.countdownLabel.textContent = "המשחק מתחיל בעוד";
        startTicker(data.phaseEndsAt, (remaining) => {
            dom.countdownNumber.textContent = String(remaining);
        });
        return;
    }

    if (data.status === "playing") {
        window.switchScreen("gameScreen");
        dom.roundHeader.textContent = `${data.currentRound} מתוך ${data.totalRounds}`;
        dom.letterDisplay.textContent = data.selectedLetter;
        if (changedStatus || dom.letterVisual.textContent !== data.selectedLetter) {
            dom.letterVisual.innerHTML = `<span>${data.selectedLetter}</span>`;
        }
        if (changedStatus) renderCategoriesInto(dom.categoryGrid, data.categories);
        dom.timerLabel.textContent = "כותבים";
        dom.statusText.textContent = "כותבים תשובות";
        startTicker(data.phaseEndsAt, (remaining) => {
            dom.timerDisplay.textContent = window.formatTime(remaining);
            window.updateProgress(remaining, WRITE_SECONDS);
        });
        return;
    }

    if (data.status === "sharing") {
        window.switchScreen("shareScreen");
        dom.sharePhaseText.textContent = data.currentRound === data.totalRounds
            ? "סבב סוף: שתפו תשובה טובה."
            : "שתפו תשובה אחת בקבוצה.";
        dom.shareCountdownRow.classList.add("hidden");
        startTicker(data.phaseEndsAt, (remaining) => {
            el("shareTimerDisplay").textContent = String(remaining);
        });
        return;
    }

    if (data.status === "finished") {
        if (tickTimer) clearInterval(tickTimer);
        window.switchScreen("finishScreen");
        el("finishRoundsText").textContent = `שוחקו ${data.totalRounds} סיבובים.`;
        el("finishLettersText").textContent = `אותות שנבחרו: ${(data.playedLetters || []).join(" · ")}.`;
        const finishActions = document.querySelector("#finishScreen .finish-actions");
        if (finishActions) finishActions.classList.add("hidden");
        return;
    }
}

/* ---------------- Cleanup ---------------- */

window.leaveDigitalGame = function leaveDigitalGame() {
    if (unsubscribeRoom) {
        unsubscribeRoom();
        unsubscribeRoom = null;
    }
    if (tickTimer) {
        clearInterval(tickTimer);
        tickTimer = null;
    }
    if (hostTimer) {
        clearInterval(hostTimer);
        hostTimer = null;
    }
    const finishActions = document.querySelector("#finishScreen .finish-actions");
    if (finishActions) finishActions.classList.remove("hidden");
    currentRoomCode = null;
    isHost = false;
    lastRenderedStatus = null;
    window.__digitalPlayedLetters = [];
};

/* ---------------- Init ---------------- */

initModeToggle();
initJoinFlow();
