‎'use strict';

/* ================= GLOBAL SAFETY NET ================= */
window.onerror = function (msg, src, line, col, err) {
  console.error("AccentPro Crash:", msg, line, col, err);
};

/* ================= HELPERS ================= */
const $ = (id) => document.getElementById(id);

/* ================= STATE ================= */
const DEFAULT_STATE = {
  currentDay: 1,
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  daysCompleted: [],
  totalWords: 0,
  darkMode: true,
  autoPlay: false,
  ttsSpeed: 0.85,
  elKey: '',
};

let state = loadState();

/* ================= DATA ================= */
const CURRICULUM = [/* (UNCHANGED — keep your full array here) */];

/* ================= DOM (SAFE) ================= */
let heroSection, trainerSection, heroCta, dayPills;
let trainerDayLabel, pairGroupLabel, wordA, wordB, phonA, phonB, tipBox;
let btnPlayNative, btnRecord, btnNext, btnHearBoth, recordLabel;
let progBar, progText, waveCanvas, waveStatus;
let tabTrain, tabProgress, tabSettings, panelProgress, panelSettings;

/* ================= RUNTIME ================= */
let trainerDay = null;
let flatPairs = [];
let flatGroups = [];
let pairIndex = 0;

let mediaRecorder, recordedChunks = [], recordedURL = null;
let micStream = null;
let analyser, audioCtx;

/* ================= INIT ================= */
function init() {
  try {
    cacheDOM();
    bindEvents();
    applyTheme();
    renderHero();
    renderTopBar();
  } catch (e) {
    console.error("Init failed:", e);
  }
}

function cacheDOM() {
  heroSection = $('heroSection');
  trainerSection = $('trainerSection');
  heroCta = $('heroCta');
  dayPills = $('dayPills');

  trainerDayLabel = $('trainerDayLabel');
  pairGroupLabel = $('pairGroupLabel');

  wordA = $('wordA');
  wordB = $('wordB');
  phonA = $('phonA');
  phonB = $('phonB');
  tipBox = $('tipBox');

  btnPlayNative = $('btnPlayNative');
  btnRecord = $('btnRecord');
  btnNext = $('btnNext');
  btnHearBoth = $('btnHearBoth');
  recordLabel = $('recordLabel');

  progBar = $('progBar');
  progText = $('progText');

  waveCanvas = $('waveCanvas');
  waveStatus = $('waveStatus');

  tabTrain = $('tabTrain');
  tabProgress = $('tabProgress');
  tabSettings = $('tabSettings');
  panelProgress = $('panelProgress');
  panelSettings = $('panelSettings');
}

/* ================= HERO ================= */
function renderHero() {
  if (!heroCta || !dayPills) return;

  dayPills.innerHTML = '';

  CURRICULUM.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'day-pill';
    btn.textContent = `D${d.day}`;

    btn.onclick = () => startDay(d.day);
    dayPills.appendChild(btn);
  });
}

/* ================= START DAY ================= */
function startDay(day) {
  trainerDay = CURRICULUM.find(d => d.day === day);
  if (!trainerDay) return;

  flatPairs = [];
  flatGroups = [];

  trainerDay.groups.forEach(g => {
    g.pairs.forEach(p => {
      flatPairs.push(p);
      flatGroups.push(g);
    });
  });

  pairIndex = 0;

  heroSection.hidden = true;
  trainerSection.hidden = false;

  loadPair();
}

/* ================= LOAD PAIR ================= */
function loadPair() {
  const pair = flatPairs[pairIndex];
  const group = flatGroups[pairIndex];

  if (!pair) return;

  trainerDayLabel.textContent = `Day ${trainerDay.day}`;
  pairGroupLabel.textContent = group.label;

  wordA.textContent = pair.a;
  wordB.textContent = pair.b;
  phonA.textContent = pair.phonA;
  phonB.textContent = pair.phonB;
  tipBox.textContent = pair.tip;

  progText.textContent = `${pairIndex + 1} / ${flatPairs.length}`;
}

/* ================= NEXT ================= */
function nextPair() {
  pairIndex++;

  if (pairIndex >= flatPairs.length) {
    alert("Day complete!");
    return;
  }

  loadPair();
}

/* ================= SPEECH (SAFE) ================= */
function speak(word) {
  try {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.error("Speech error:", e);
  }
}

/* ================= EVENTS ================= */
function bindEvents() {
  if (heroCta) heroCta.onclick = () => startDay(1);
  if (btnNext) btnNext.onclick = nextPair;

  if (wordA) wordA.onclick = () => speak(wordA.textContent);
  if (wordB) wordB.onclick = () => speak(wordB.textContent);

  if (btnPlayNative) {
    btnPlayNative.onclick = () => {
      const p = flatPairs[pairIndex];
      if (!p) return;
      speak(p.a);
      setTimeout(() => speak(p.b), 700);
    };
  }

  if (tabTrain) tabTrain.onclick = () => switchTab('train');
  if (tabProgress) tabProgress.onclick = () => switchTab('progress');
  if (tabSettings) tabSettings.onclick = () => switchTab('settings');
}

/* ================= TAB FIX ================= */
function switchTab(tab) {
  if (heroSection) heroSection.hidden = true;
  if (trainerSection) trainerSection.hidden = true;
  if (panelProgress) panelProgress.hidden = true;
  if (panelSettings) panelSettings.hidden = true;

  if (tab === 'train') heroSection.hidden = false;
  if (tab === 'progress') panelProgress.hidden = false;
  if (tab === 'settings') panelSettings.hidden = false;
}

/* ================= THEME ================= */
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
}

/* ================= STORAGE ================= */
function saveState() {
  localStorage.setItem("accentpro", JSON.stringify(state));
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem("accentpro")) || DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

/* ================= BOOT ================= */
window.addEventListener("DOMContentLoaded", init);
