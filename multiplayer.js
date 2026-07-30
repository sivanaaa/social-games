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
const COUNTDOWN_SECONDS = 3;
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L to avoid confusion

let currentRoomCode = null;
let isHost = false;
let unsubscribeRoom = null;
let tickTimer = null;
let hostTimer = null;
let lastRenderedStatus = null;
let latestRoomData = null;
let myPlayerId = null;
let hasSubmittedThisRound = false;

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

function getMyPlayerId() {
    if (!myPlayerId) {
        myPlayerId = (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : ("p" + Math.random().toString(36).slice(2) + Date.now());
    }
    return myPlayerId;
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
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
        const nameInput = el("joinNameInput");
        const name = (nameInput && nameInput.value.trim()) || `אורח/ת ${Math.floor(Math.random() * 900 + 100)}`;
        const pid = getMyPlayerId();
        updateDoc(roomRef(code), {
            [`players.${pid}`]: name,
            [`totalScores.${pid}`]: 0,
            joinedCount: increment(1)
        }).catch(() => {});
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
        players: {},
        totalScores: {},
        answers: {},
        submitted: {},
        bonusGiven: {},
        revealIndex: 0,
        lastRoundScores: {},
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
    startButton.onclick = async () => {
        const nameInput = el("hostNameInput");
        const name = (nameInput && nameInput.value.trim()) || "מארח/ת";
        const pid = getMyPlayerId();
        await updateDoc(roomRef(currentRoomCode), {
            [`players.${pid}`]: name,
            [`totalScores.${pid}`]: 0,
            updatedAt: serverTimestamp()
        });
        hostBeginCountdown();
    };

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
        answers: {},
        submitted: {},
        bonusGiven: {},
        revealIndex: 0,
        updatedAt: serverTimestamp()
    });
    window.__digitalPlayedLetters = [...(window.__digitalPlayedLetters || []), letter];
    scheduleHostTransition(phaseEndsAt, () => hostRunReveal());
}

async function hostRunReveal() {
    await updateDoc(roomRef(currentRoomCode), {
        status: "reveal",
        phase: "reveal",
        phaseEndsAt: null,
        revealIndex: 0,
        updatedAt: serverTimestamp()
    });
}

function computeRoundScores(playerIds, categories, answers, bonusGiven) {
    const scores = {};
    playerIds.forEach((pid) => { scores[pid] = 0; });
    categories.forEach((_, catIndex) => {
        const valuesByPlayer = {};
        playerIds.forEach((pid) => {
            const raw = answers[pid] && answers[pid][catIndex];
            valuesByPlayer[pid] = raw ? String(raw).trim() : "";
        });
        const counts = {};
        playerIds.forEach((pid) => {
            const v = valuesByPlayer[pid];
            if (v) counts[v] = (counts[v] || 0) + 1;
        });
        playerIds.forEach((pid) => {
            const v = valuesByPlayer[pid];
            if (v) {
                scores[pid] += 1;
                if (counts[v] === 1) scores[pid] += 1;
            }
        });
        const bonusPid = bonusGiven ? bonusGiven[String(catIndex)] : null;
        if (bonusPid && scores[bonusPid] !== undefined) scores[bonusPid] += 1;
    });
    return scores;
}

async function hostAdvanceReveal() {
    if (!isHost || !latestRoomData) return;
    const categories = latestRoomData.categories || [];
    const nextIndex = (latestRoomData.revealIndex || 0) + 1;
    if (nextIndex >= categories.length) {
        const playerIds = Object.keys(latestRoomData.players || {});
        const roundScores = computeRoundScores(
            playerIds,
            categories,
            latestRoomData.answers || {},
            latestRoomData.bonusGiven || {}
        );
        const totalScores = { ...(latestRoomData.totalScores || {}) };
        playerIds.forEach((pid) => {
            totalScores[pid] = (totalScores[pid] || 0) + (roundScores[pid] || 0);
        });
        await updateDoc(roomRef(currentRoomCode), {
            status: "scoreboard",
            phase: null,
            lastRoundScores: roundScores,
            totalScores,
            updatedAt: serverTimestamp()
        });
    } else {
        await updateDoc(roomRef(currentRoomCode), {
            revealIndex: nextIndex,
            updatedAt: serverTimestamp()
        });
    }
}

async function hostToggleBonus(categoryIndex, playerId) {
    if (!isHost || !latestRoomData) return;
    const current = (latestRoomData.bonusGiven || {})[String(categoryIndex)];
    const newValue = current === playerId ? null : playerId;
    await updateDoc(roomRef(currentRoomCode), {
        [`bonusGiven.${categoryIndex}`]: newValue,
        updatedAt: serverTimestamp()
    });
}

async function hostStartNextRound() {
    if (!isHost || !latestRoomData) return;
    hostRunRound((latestRoomData.currentRound || 0) + 1);
}

async function hostEndGame() {
    if (!isHost) return;
    await updateDoc(roomRef(currentRoomCode), {
        status: "finished",
        phase: null,
        updatedAt: serverTimestamp()
    });
}

let pendingHostTransition = null;

function scheduleHostTransition(targetTime, callback) {
    if (hostTimer) clearInterval(hostTimer);
    pendingHostTransition = { targetTime, callback };
    hostTimer = setInterval(() => {
        if (Date.now() >= targetTime) {
            clearInterval(hostTimer);
            hostTimer = null;
            pendingHostTransition = null;
            callback();
        }
    }, 500);
}

// Backgrounded tabs throttle setInterval, which can delay the host's
// scheduled transition well past its target time. Catch up immediately
// once the tab is visible again instead of waiting on the throttled timer.
function catchUpPendingHostTransition() {
    if (!pendingHostTransition || document.hidden) return;
    if (Date.now() >= pendingHostTransition.targetTime) {
        const { callback } = pendingHostTransition;
        if (hostTimer) {
            clearInterval(hostTimer);
            hostTimer = null;
        }
        pendingHostTransition = null;
        callback();
    }
}

document.addEventListener("visibilitychange", catchUpPendingHostTransition);

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

/* ---- Digital round: answer inputs (writing phase) ---- */

function renderDigitalAnswerInputs(categories) {
    const grid = window.dom.categoryGrid;
    grid.classList.add("answer-list");
    grid.innerHTML = (categories || []).map((category, index) => `
        <div class="category-cell category-cell--input">
            <span class="category-number">${index + 1}</span>
            <span class="category-text">${escapeHtml(category)}</span>
            <input type="text" dir="rtl" class="answer-input" data-category-index="${index}" placeholder="התשובה שלך...">
        </div>
    `).join("");
    grid.querySelectorAll(".answer-input").forEach((input) => {
        input.addEventListener("input", updateAnswerProgress);
    });
    updateAnswerProgress();
}

function getMyAnswerValues() {
    return Array.from(document.querySelectorAll("#categoryGrid .answer-input"))
        .sort((a, b) => Number(a.dataset.categoryIndex) - Number(b.dataset.categoryIndex))
        .map((input) => input.value.trim());
}

function updateAnswerProgress() {
    const inputs = document.querySelectorAll("#categoryGrid .answer-input");
    const total = inputs.length;
    const answered = Array.from(inputs).filter((input) => input.value.trim() !== "").length;
    const progressEl = el("digitalAnswersProgress");
    if (progressEl) progressEl.textContent = `ענית על ${answered} מתוך ${total}`;
}

function lockAnswerInputs() {
    document.querySelectorAll("#categoryGrid .answer-input").forEach((input) => { input.disabled = true; });
}

function showAnswerControls() {
    el("digitalAnswersProgress").classList.remove("hidden");
    el("digitalSubmitButton").classList.remove("hidden");
    el("digitalSubmittedNote").classList.add("hidden");
}

function showSubmittedNote() {
    el("digitalAnswersProgress").classList.add("hidden");
    el("digitalSubmitButton").classList.add("hidden");
    el("digitalSubmittedNote").classList.remove("hidden");
}

async function finalizeMyAnswers() {
    if (hasSubmittedThisRound) return;
    hasSubmittedThisRound = true;
    const values = getMyAnswerValues();
    lockAnswerInputs();
    showSubmittedNote();
    try {
        const pid = getMyPlayerId();
        await updateDoc(roomRef(currentRoomCode), {
            [`answers.${pid}`]: values,
            [`submitted.${pid}`]: true,
            updatedAt: serverTimestamp()
        });
    } catch (err) {
        console.error("Failed to save answers", err);
    }
}

/* ---- Digital round: reveal phase ---- */

function renderRevealAnswers(data, index) {
    const players = data.players || {};
    const answers = data.answers || {};
    const bonusGiven = data.bonusGiven || {};
    const bonusPlayerId = bonusGiven[String(index)];
    const listEl = el("revealAnswersList");
    listEl.innerHTML = Object.keys(players).map((pid) => {
        const name = players[pid];
        const raw = answers[pid] && answers[pid][index];
        const value = raw ? String(raw).trim() : "";
        const answerText = value ? escapeHtml(value) : "לא נכתבה תשובה";
        const hasBonus = bonusPlayerId === pid;
        const bonusMarkup = isHost
            ? `<button type="button" class="bonus-button${hasBonus ? " selected" : ""}" data-player-id="${pid}">בונוס יצירתי +1</button>`
            : (hasBonus ? `<span class="bonus-badge">בונוס יצירתי +1</span>` : "");
        return `
            <div class="reveal-answer-row">
                <div class="reveal-answer-name">${escapeHtml(name)}</div>
                <div class="reveal-answer-text${value ? "" : " reveal-answer-empty"}">${answerText}</div>
                ${bonusMarkup}
            </div>
        `;
    }).join("");
    if (isHost) {
        listEl.querySelectorAll(".bonus-button").forEach((button) => {
            button.addEventListener("click", () => hostToggleBonus(index, button.dataset.playerId));
        });
    }
}

/* ---- Digital round: scoreboard ---- */

function renderScoreboard(data) {
    const players = data.players || {};
    const lastRoundScores = data.lastRoundScores || {};
    const totalScores = data.totalScores || {};
    const rows = Object.keys(players).map((pid) => ({
        name: players[pid],
        roundScore: lastRoundScores[pid] || 0,
        totalScore: totalScores[pid] || 0
    })).sort((a, b) => b.totalScore - a.totalScore);
    const listEl = el("scoreboardList");
    listEl.innerHTML = rows.map((row) => `
        <div class="scoreboard-row">
            <div class="scoreboard-name">${escapeHtml(row.name)}</div>
            <div class="scoreboard-round-score">+${row.roundScore} הסיבוב</div>
            <div class="scoreboard-total-score">${row.totalScore} סה"כ</div>
        </div>
    `).join("");
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
    latestRoomData = data;
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
        if (changedStatus) {
            hasSubmittedThisRound = false;
            renderDigitalAnswerInputs(data.categories || []);
            showAnswerControls();
        }
        dom.timerLabel.textContent = "כותבים";
        dom.statusText.textContent = "כותבים תשובות";
        startTicker(data.phaseEndsAt, (remaining) => {
            dom.timerDisplay.textContent = window.formatTime(remaining);
            window.updateProgress(remaining, WRITE_SECONDS);
            if (remaining <= 0) finalizeMyAnswers();
        });
        return;
    }

    if (data.status === "reveal") {
        if (tickTimer) clearInterval(tickTimer);
        window.switchScreen("revealScreen");
        const categories = data.categories || [];
        const index = data.revealIndex || 0;
        el("revealCategoryText").textContent = categories[index] || "";
        renderRevealAnswers(data, index);
        const nextButton = el("revealNextButton");
        nextButton.classList.toggle("hidden", !isHost);
        nextButton.onclick = () => hostAdvanceReveal();
        return;
    }

    if (data.status === "scoreboard") {
        window.switchScreen("scoreboardScreen");
        renderScoreboard(data);
        const hostActions = el("scoreboardHostActions");
        hostActions.classList.toggle("hidden", !isHost);
        el("nextRoundButton").onclick = () => hostStartNextRound();
        el("endGameButton").onclick = () => hostEndGame();
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
    pendingHostTransition = null;
    const finishActions = document.querySelector("#finishScreen .finish-actions");
    if (finishActions) finishActions.classList.remove("hidden");
    currentRoomCode = null;
    isHost = false;
    lastRenderedStatus = null;
    latestRoomData = null;
    hasSubmittedThisRound = false;
    window.__digitalPlayedLetters = [];
};

/* ---------------- Init ---------------- */

function initDigitalSubmitButton() {
    const button = el("digitalSubmitButton");
    if (button) button.addEventListener("click", () => finalizeMyAnswers());
}

initModeToggle();
initJoinFlow();
initDigitalSubmitButton();
