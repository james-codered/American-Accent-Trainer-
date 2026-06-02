'use strict';

const CURRICULUM = [...your full curriculum array here... ]; // keep all your days data

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
let trainerDay = null;
let flatPairs = [];
let flatGroups = [];
let pairIndex = 0;

let mediaRecorder = null;
let recordedChunks = [];
let recordedBlob = null;
let recordedURL = null;
let analyser = null;
let audioCtx = null;
let micStream = null;
let animFrameId = null;

const $ = id => document.getElementById(id);

// WAIT FOR HTML TO LOAD FIRST
document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  applyTheme();
  updateStreakLogic();
  renderHero();
  renderTopBar();
  bindEvents();
  darkModeCheck.checked = state.darkMode;
  autoPlayCheck.checked = state.autoPlay;
  speedRange.value = state.ttsSpeed;
  speedVal.textContent = state.ttsSpeed + '×';
  elInput.value = state.elKey || '';
  if (state.elKey) elStatus.textContent = '✓ Key saved';
}

function bindEvents() {
  heroCta.addEventListener('click', () => startDay(state.currentDay));
  backBtn.addEventListener('click', () => {
    trainerSection.hidden = true;
    heroSection.hidden = false;
  });
  btnPlayNative.addEventListener('click', speakNative);
  btnRecord.addEventListener('click', () => {
    if (btnRecord.classList.contains('is-recording')) stopRecording();
    else startRecording();
  });
  btnHearBoth.addEventListener('click', speakBoth);
  btnNext.addEventListener('click', nextPair);
  overlayNext.addEventListener('click', closeOverlay);
  themeToggle.addEventListener('click', toggleTheme);
  tabTrain.addEventListener('click', () => switchTab('train'));
  tabProgress.addEventListener('click', () => switchTab('progress'));
  tabSettings.addEventListener('click', () => switchTab('settings'));
  darkModeCheck.addEventListener('change', e => {
    state.darkMode = e.target.checked;
    applyTheme();
    saveState();
  });
  autoPlayCheck.addEventListener('change', e => {
    state.autoPlay = e.target.checked;
    saveState();
  });
  speedRange.addEventListener('input', e => {
    state.ttsSpeed = e.target.value;
    speedVal.textContent = state.ttsSpeed + '×';
    saveState();
  });
  btnSaveEl.addEventListener('click', () => {
    state.elKey = elInput.value.trim();
    elStatus.textContent = state.elKey? '✓ Key saved' : '';
    saveState();
  });
  btnResetProgress.addEventListener('click', resetProgress);
}

function renderHero() {
  const day = state.currentDay;
  heroDayNum.textContent = day;
  dayPills.innerHTML = '';
  CURRICULUM.forEach(d => {
    const pill = document.createElement('button');
    pill.className = 'day-pill';
    const done = state.daysCompleted.includes(d.day);
    const current = d.day === day;
    const locked = d.day > day;
    if (done) pill.classList.add('done');
    else if (current) pill.classList.add('current');
    else if (locked) pill.classList.add('locked');
    pill.textContent = `D${d.day} ${d.emoji}`;
    pill.addEventListener('click', () => {
      if (!locked) startDay(d.day);
    });
    dayPills.appendChild(pill);
  });
}

function renderTopBar() {
  streakBadge.textContent = '🔥 ' + state.streak;
  xpPill.textContent = state.xp + ' XP';
}

function updateStreakLogic() {
  const today = todayISO();
  if (!state.lastActiveDate) return;
  const diff = daysBetween(state.lastActiveDate, today);
  if (diff > 1) {
    state.streak = 0;
    saveState();
  }
}

function startDay(dayNum) {
  trainerDay = CURRICULUM.find(d => d.day === dayNum);
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
  recordedBlob = null;
  recordedURL = null;

  heroSection.hidden = true;
  trainerSection.hidden = false;

  loadPair();
  if (state.autoPlay) setTimeout(speakNative, 600);
}

function loadPair() {
  const pair = flatPairs[pairIndex];
  const group = flatGroups[pairIndex];

  trainerDayLabel.textContent = `Day ${trainerDay.day}`;
  pairGroupLabel.textContent = group.label;
  trapBadge.textContent = group.label;

  wordA.textContent = pair.a;
  wordB.textContent = pair.b;
  phonA.textContent = pair.phonA;
  phonB.textContent = pair.phonB;
  tipBox.textContent = pair.tip;

  btnPlayNative.disabled = false;
  btnRecord.disabled = false;
  btnHearBoth.disabled = true;
  btnNext.disabled = true;
  btnRecord.classList.remove('is-recording');
  recordLabel.textContent = 'Record Yourself';

  recordedBlob = null;
  recordedURL = null;

  wordCard.classList.remove('glow-correct');
  waveStatus.textContent = '—';

  const total = flatPairs.length;
  const pct = Math.round((pairIndex / total) * 100);
  progBar.style.width = pct + '%';
  progText.textContent = `${pairIndex} / ${total}`;

  clearCanvas();
}

function speakNative() {
  const pair = flatPairs[pairIndex];
  speakWord(pair.a, () => {
    setTimeout(() => speakWord(pair.b), 700);
  });
  drawSimulatedWave('native');
}

function speakWord(word, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(word);
  utt.lang = 'en-US';
  utt.rate = parseFloat(state.ttsSpeed) || 0.85;
  const voices = window.speechSynthesis.getVoices();
  const american = voices.find(v => v.lang === 'en-US') || voices[0];
  if (american) utt.voice = american;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

function speakBoth() {
  const pair = flatPairs[pairIndex];
  speakWord('Native: ' + pair.a, () => {
    setTimeout(() => {
      speakWord('You recorded:');
      if (recordedURL) {
        setTimeout(() => {
          const audio = new Audio(recordedURL);
          audio.play();
        }, 600);
      }
    }, 800);
  });
}

async function startRecording() {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (e) {
    alert('Microphone access denied.');
    return;
  }

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(micStream);
  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };
  mediaRecorder.onstop = onRecordingStop;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(micStream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  mediaRecorder.start();
  btnRecord.classList.add('is-recording');
  recordLabel.textContent = 'Stop Recording';
  waveStatus.textContent = '⏺ recording';
  drawLiveWave();
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state!== 'inactive') {
    mediaRecorder.stop();
  }
  if (micStream) micStream.getTracks().forEach(t => t.stop());
  cancelAnimationFrame(animFrameId);
  btnRecord.classList.remove('is-recording');
  recordLabel.textContent = 'Re-record';
  waveStatus.textContent = '✓ recorded';
}

function onRecordingStop() {
  recordedBlob = new Blob(recordedChunks, { type: 'audio/webm' });
  recordedURL = URL.createObjectURL(recordedBlob);
  btnHearBoth.disabled = false;
  btnNext.disabled = false;
  wordCard.classList.add('glow-correct');
  addXP(10);
}

const CTX = waveCanvas.getContext('2d');

function clearCanvas() {
  CTX.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
  CTX.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#0d0d14';
  CTX.fillRect(0, 0, waveCanvas.width, waveCanvas.height);
}

function drawLiveWave() {
  animFrameId = requestAnimationFrame(drawLiveWave);
  if (!analyser) return;
  const bufLen = analyser.frequencyBinCount;
  const dataArr = new Uint8Array(bufLen);
  analyser.getByteTimeDomainData(dataArr);

  const w = waveCanvas.width, h = waveCanvas.height;
  CTX.clearRect(0, 0, w, h);
  CTX.fillStyle = '#0d0d14';
  CTX.fillRect(0, 0, w, h);

  CTX.lineWidth = 2;
  CTX.strokeStyle = '#ef4444';
  CTX.beginPath();

  const sliceW = w / bufLen;
  let x = 0;
  for (let i = 0; i < bufLen; i++) {
    const v = dataArr[i] / 128.0;
    const y = (v * h) / 2;
    if (i === 0) CTX.moveTo(x, y);
    else CTX.lineTo(x, y);
    x += sliceW;
  }
  CTX.lineTo(w, h / 2);
  CTX.stroke();
}

function drawSimulatedWave(type) {
  const w = waveCanvas.width, h = waveCanvas.height;
  CTX.clearRect(0, 0, w, h);
  CTX.fillStyle = '#0d0d14';
  CTX.fillRect(0, 0, w, h);

  const color = type === 'native'? '#7c6af5' : '#34d399';
  CTX.lineWidth = 2;
  CTX.strokeStyle = color;
  CTX.beginPath();
  for (let x = 0; x < w; x++) {
    const y = h / 2 + Math.sin((x / w) * Math.PI * 8) * (h / 2 - 6) * Math.sin((x / w) * Math.PI);
    if (x === 0) CTX.moveTo(x, y);
    else CTX.lineTo(x, y);
  }
  CTX.stroke();
}

function nextPair() {
  pairIndex++;
  state.totalWords++;
  saveState();

  const total = flatPairs.length;
  const pct = Math.round((pairIndex / total) * 100);
  progBar.style.width = pct + '%';
  progText.textContent = `${pairIndex} / ${total}`;

  if (pairIndex >= flatPairs.length) {
    completeDay(); // FIXED TYPO HERE
  } else {
    loadPair();
    if (state.autoPlay) setTimeout(speakNative, 400);
  }
}

function completeDay() { // FIXED NAME
  const dayNum = trainerDay.day;
  if (!state.daysCompleted.includes(dayNum)) {
    state.daysCompleted.push(dayNum);
  }

  const today = todayISO();
  const diff = state.lastActiveDate? daysBetween(state.lastActiveDate, today) : 1;
  if (diff <= 1) state.streak++;
  state.lastActiveDate = today;
  addXP(50);
  saveState();

  overlayEmoji.textContent = '🎉';
  overlayTitle.textContent = 'Day Complete!';
  overlayMsg.textContent = `You nailed Day ${dayNum} — ${trainerDay.title}.`;
  statWords.textContent = flatPairs.length;
  statStreak.textContent = state.streak;
  statXP.textContent = '+60';
  dayCompleteOverlay.hidden = false;

  state.currentDay = Math.min(7, dayNum + 1);
}

function closeOverlay() {
  dayCompleteOverlay.hidden = true;
  trainerSection.hidden = true;
  heroSection.hidden = false;
  renderHero();
  renderTopBar();
}

function addXP(amount) {
  state.xp += amount;
  renderTopBar();
  saveState();
}

function toggleTheme() {
  state.darkMode =!state.darkMode;
  applyTheme();
  darkModeCheck.checked = state.darkMode;
  saveState();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.darkMode? 'dark' : 'light');
  themeToggle.textContent = state.darkMode? '☀️' : '🌙';
}

function switchTab(tab) {
  tabTrain.classList.remove('active');
  tabProgress.classList.remove('active');
  tabSettings.classList.remove('active');
  panelProgress.hidden = true;
  panelSettings.hidden = true;

  if (tab === 'train') {
    tabTrain.classList.add('active');
    heroSection.hidden = false;
    trainerSection.hidden = true;
  } else if (tab === 'progress') {
    tabProgress.classList.add('active');
    panelProgress.hidden = false;
    renderProgress();
  } else {
    tabSettings.classList.add('active');
    panelSettings.hidden = false;
  }
}

function renderProgress() {
  weekGrid.innerHTML = '';
  CURRICULUM.forEach(d => {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    if (state.daysCompleted.includes(d.day)) cell.classList.add('done');
    else if (d.day === state.currentDay) cell.classList.add('current');
    cell.innerHTML = `<div class="dc-num">${d.day}</div><div>${d.emoji}</div>`;
    weekGrid.appendChild(cell);
  });
  bigStreak.textContent = state.streak;
  bigXP.textContent = state.xp;
  bigWords.textContent = state.totalWords;
}

function resetProgress() {
  if (confirm('Reset all progress?')) {
    localStorage.removeItem('accentpro_state');
    location.reload();
  }
}

function loadState() {
  const saved = localStorage.getItem('accentpro_state');
  return saved? JSON.parse(saved) : {...DEFAULT_STATE};
}

function saveState() {
  localStorage.setItem('accentpro_state', JSON.stringify(state));
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(d1, d2) {
  return Math.floor((new Date(d2) - new Date(d1)) / 86400000);
}
