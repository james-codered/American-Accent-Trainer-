'use strict';

const CURRICULUM = [
  {day: 1, title: 'Vowels', emoji: '🔤', groups: [{label: "The 'ee' vs 'i' Trap", pairs: [{a: 'Ship', b: 'Sheep', phonA: '/ʃɪp/', phonB: '/ʃiːp/', tip: 'Short /ɪ/ — relax tongue. Long /iː/ — stretch lips.'}]}]},
  {day: 2, title: 'TH Sounds', emoji: '👅', groups: [{label: "TH vs S/Z", pairs: [{a: 'Think', b: 'Sink', phonA: '/θɪŋk/', phonB: '/sɪŋk/', tip: 'Tongue between teeth for TH.'}]}]},
  {day: 3, title: 'R Sounds', emoji: '🌀', groups: [{label: "American R", pairs: [{a: 'Car', b: 'Cah', phonA: '/kɑːr/', phonB: '/kɑː/', tip: 'Curl tongue back for R.'}]}]},
  {day: 4, title: 'Linking', emoji: '🔗', groups: [{label: "Linking", pairs: [{a: 'Pick it up', b: 'Pick-it-up', phonA: '/ˈpɪkɪtʌp/', phonB: 'staccato', tip: 'Link sounds together.'}]}]},
  {day: 5, title: 'Review', emoji: '🔁', groups: [{label: "Review", pairs: [{a: 'Ship', b: 'Sheep', phonA: '/ʃɪp/', phonB: '/ʃiːp/', tip: 'Review vowels.'}]}]},
  {day: 6, title: 'Review 2', emoji: '🔁', groups: [{label: "Review TH&R", pairs: [{a: 'Think', b: 'Sink', phonA: '/θɪŋk/', phonB: '/sɪŋk/', tip: 'TH again.'}]}]},
  {day: 7, title: 'Full Review', emoji: '🏆', groups: [{label: "Challenge", pairs: [{a: 'Ship', b: 'Sheep', phonA: '/ʃɪp/', phonB: '/ʃiːp/', tip: 'Final test.'}]}]}
];

const DEFAULT_STATE = {currentDay: 1, xp: 0, streak: 0, lastActiveDate: null, daysCompleted: [], totalWords: 0, darkMode: true, autoPlay: false, ttsSpeed: 0.85, elKey: ''};

let state = loadState();
let trainerDay = null, flatPairs = [], flatGroups = [], pairIndex = 0;
let mediaRecorder = null, recordedChunks = [], recordedBlob = null, recordedURL = null, analyser = null, audioCtx = null, micStream = null, animFrameId = null;

const $ = id => document.getElementById(id);
const heroSection = $('heroSection'), trainerSection = $('trainerSection'), heroDayNum = $('heroDayNum'), heroCta = $('heroCta'), dayPills = $('dayPills');
const trainerDayLabel = $('trainerDayLabel'), pairGroupLabel = $('pairGroupLabel'), trapBadge = $('trapBadge'), wordA = $('wordA'), wordB = $('wordB'), phonA = $('phonA'), phonB = $('phonB'), tipBox = $('tipBox'), wordCard = $('wordCard');
const waveCanvas = $('waveCanvas'), waveStatus = $('waveStatus'), btnPlayNative = $('btnPlayNative'), btnRecord = $('btnRecord'), recordLabel = $('recordLabel'), btnHearBoth = $('btnHearBoth'), btnNext = $('btnNext'), progBar = $('progBar'), progText = $('progText');
const dayCompleteOverlay = $('dayCompleteOverlay'), overlayEmoji = $('overlayEmoji'), overlayTitle = $('overlayTitle'), overlayMsg = $('overlayMsg'), statWords = $('statWords'), statStreak = $('statStreak'), statXP = $('statXP'), overlayNext = $('overlayNext');
const themeToggle = $('themeToggle'), streakBadge = $('streakBadge'), xpPill = $('xpPill'), backBtn = $('backBtn');
const tabTrain = $('tabTrain'), tabProgress = $('tabProgress'), tabSettings = $('tabSettings'), panelProgress = $('panelProgress'), panelSettings = $('panelSettings'), weekGrid = $('weekGrid'), bigStreak = $('bigStreak'), bigXP = $('bigXP'), bigWords = $('bigWords');
const darkModeCheck = $('darkModeCheck'), autoPlayCheck = $('autoPlayCheck'), speedRange = $('speedRange'), speedVal = $('speedVal'), elInput = $('elInput'), btnSaveEl = $('btnSaveEl'), elStatus = $('elStatus'), btnResetProgress = $('btnResetProgress');

// WAIT FOR HTML
document.addEventListener('DOMContentLoaded', init);

function init() {
  applyTheme(); updateStreakLogic(); renderHero(); renderTopBar(); bindEvents();
  if(darkModeCheck) darkModeCheck.checked = state.darkMode;
  if(autoPlayCheck) autoPlayCheck.checked = state.autoPlay;
  if(speedRange) {speedRange.value = state.ttsSpeed; speedVal.textContent = state.ttsSpeed + '×';}
  if(elInput) elInput.value = state.elKey || '';
  if(elStatus && state.elKey) elStatus.textContent = '✓ Key saved';
}

function bindEvents() {
  if(heroCta) heroCta.addEventListener('click', () => startDay(state.currentDay));
  if(backBtn) backBtn.addEventListener('click', () => {trainerSection.hidden = true; heroSection.hidden = false;});
  if(btnPlayNative) btnPlayNative.addEventListener('click', speakNative);
  if(btnRecord) btnRecord.addEventListener('click', () => btnRecord.classList.contains('is-recording')? stopRecording() : startRecording());
  if(btnHearBoth) btnHearBoth.addEventListener('click', speakBoth);
  if(btnNext) btnNext.addEventListener('click', nextPair);
  if(overlayNext) overlayNext.addEventListener('click', closeOverlay);
  if(themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if(tabTrain) tabTrain.addEventListener('click', () => switchTab('train'));
  if(tabProgress) tabProgress.addEventListener('click', () => switchTab('progress'));
  if(tabSettings) tabSettings.addEventListener('click', () => switchTab('settings'));
  if(darkModeCheck) darkModeCheck.addEventListener('change', e => {state.darkMode = e.target.checked; applyTheme(); saveState();});
  if(autoPlayCheck) autoPlayCheck.addEventListener('change', e => {state.autoPlay = e.target.checked; saveState();});
  if(speedRange) speedRange.addEventListener('input', e => {state.ttsSpeed = e.target.value; speedVal.textContent = state.ttsSpeed + '×'; saveState();});
  if(btnSaveEl) btnSaveEl.addEventListener('click', () => {state.elKey = elInput.value.trim(); elStatus.textContent = state.elKey? '✓ Key saved' : ''; saveState();});
  if(btnResetProgress) btnResetProgress.addEventListener('click', resetProgress);
}

function renderHero() {
  if(!heroDayNum ||!dayPills) return;
  heroDayNum.textContent = state.currentDay;
  dayPills.innerHTML = '';
  CURRICULUM.forEach(d => {
    const pill = document.createElement('button');
    pill.className = 'day-pill';
    const done = state.daysCompleted.includes(d.day), current = d.day === state.currentDay, locked = d.day > state.currentDay;
    if(done) pill.classList.add('done'); else if(current) pill.classList.add('current'); else if(locked) pill.classList.add('locked');
    pill.textContent = `D${d.day} ${d.emoji}`;
    pill.addEventListener('click', () => {!locked && startDay(d.day)});
    dayPills.appendChild(pill);
  });
}

function renderTopBar() {if(streakBadge) streakBadge.textContent = '🔥 ' + state.streak; if(xpPill) xpPill.textContent = state.xp + ' XP';}
function updateStreakLogic() {const today = todayISO(); if(!state.lastActiveDate) return; const diff = daysBetween(state.lastActiveDate, today); if(diff > 1) {state.streak = 0; saveState();}}
function startDay(dayNum) {
  trainerDay = CURRICULUM.find(d => d.day === dayNum); if(!trainerDay) return;
  flatPairs = []; flatGroups = []; trainerDay.groups.forEach(g => g.pairs.forEach(p => {flatPairs.push(p); flatGroups.push(g);}));
  pairIndex = 0; recordedBlob = null; recordedURL = null;
  heroSection.hidden = true; trainerSection.hidden = false;
  loadPair(); if(state.autoPlay) setTimeout(speakNative, 600);
}

function loadPair() {
  const pair = flatPairs[pairIndex], group = flatGroups[pairIndex];
  if(trainerDayLabel) trainerDayLabel.textContent = `Day ${trainerDay.day}`;
  if(pairGroupLabel) pairGroupLabel.textContent = group.label;
  if(trapBadge) trapBadge.textContent = group.label;
  if(wordA) wordA.textContent = pair.a; if(wordB) wordB.textContent = pair.b;
  if(phonA) phonA.textContent = pair.phonA; if(phonB) phonB.textContent = pair.phonB;
  if(tipBox) tipBox.textContent = pair.tip;
  [btnPlayNative, btnRecord].forEach(b => b && (b.disabled = false));
  [btnHearBoth, btnNext].forEach(b => b && (b.disabled = true));
  if(btnRecord) {btnRecord.classList.remove('is-recording'); recordLabel.textContent = 'Record Yourself';}
  if(wordCard) wordCard.classList.remove('glow-correct');
  if(waveStatus) waveStatus.textContent = '—';
  const total = flatPairs.length, pct = Math.round((pairIndex / total) * 100);
  if(progBar) progBar.style.width = pct + '%';
  if(progText) progText.textContent = `${pairIndex} / ${total}`;
  clearCanvas();
}

function speakNative() {const pair = flatPairs[pairIndex]; speakWord(pair.a, () => setTimeout(() => speakWord(pair.b), 700)); drawSimulatedWave('native');}
function speakWord(word, onEnd) {if(!window.speechSynthesis) return; window.speechSynthesis.cancel(); const utt = new SpeechSynthesisUtterance(word); utt.lang = 'en-US'; utt.rate = parseFloat(state.ttsSpeed) || 0.85; const voices = window.speechSynthesis.getVoices(); const american = voices.find(v => v.lang === 'en-US') || voices[0]; if(american) utt.voice = american; if(onEnd) utt.onend = onEnd; window.speechSynthesis.speak(utt);}
function speakBoth() {const pair = flatPairs[pairIndex]; speakWord('Native: ' + pair.a, () => setTimeout(() => {speakWord('You recorded:'); if(recordedURL) setTimeout(() => new Audio(recordedURL).play(), 600)}, 800));}

async function startRecording() {
  try {micStream = await navigator.mediaDevices.getUserMedia({audio: true});} catch(e) {alert('Microphone access denied.'); return;}
  recordedChunks = []; mediaRecorder = new MediaRecorder(micStream);
  mediaRecorder.ondataavailable = e => {if(e.data.size > 0) recordedChunks.push(e.data);};
  mediaRecorder.onstop = onRecordingStop;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(micStream); analyser = audioCtx.createAnalyser(); analyser.fftSize = 256; source.connect(analyser);
  mediaRecorder.start(); btnRecord.classList.add('is-recording'); recordLabel.textContent = 'Stop Recording'; waveStatus.textContent = '⏺ recording'; drawLiveWave();
}

function stopRecording() {if(mediaRecorder && mediaRecorder.state!== 'inactive') mediaRecorder.stop(); if(micStream) micStream.getTracks().forEach(t => t.stop()); cancelAnimationFrame(animFrameId); btnRecord.classList.remove('is-recording'); recordLabel.textContent = 'Re-record'; waveStatus.textContent = '✓ recorded';}
function onRecordingStop() {recordedBlob = new Blob(recordedChunks, {type: 'audio/webm'}); recordedURL = URL.createObjectURL(recordedBlob); btnHearBoth.disabled = false; btnNext.disabled = false; wordCard.classList.add('glow-correct'); addXP(10);}

const CTX = waveCanvas.getContext('2d');
function clearCanvas() {CTX.clearRect(0, 0, waveCanvas.width, waveCanvas.height); CTX.fillStyle = '#0d0d14'; CTX.fillRect(0, 0, waveCanvas.width, waveCanvas.height);}
function drawLiveWave() {animFrameId = requestAnimationFrame(drawLiveWave); if(!analyser) return; const bufLen = analyser.frequencyBinCount; const dataArr = new Uint8Array(bufLen); analyser.getByteTimeDomainData(dataArr); const w = waveCanvas.width, h = waveCanvas.height; CTX.clearRect(0, 0, w, h); CTX.fillStyle = '#0d0d14'; CTX.fillRect(0, 0, w, h); CTX.lineWidth = 2; CTX.strokeStyle = '#ef4444'; CTX.beginPath(); const sliceW = w / bufLen; let x = 0; for(let i = 0; i < bufLen; i++) {const v = dataArr[i] / 128.0; const y = (v * h) / 2; if(i === 0) CTX.moveTo(x, y); else CTX.lineTo(x, y); x += sliceW;} CTX.lineTo(w, h / 2); CTX.stroke();}
function drawSimulatedWave(type) {const w = waveCanvas.width, h = waveCanvas.height; CTX.clearRect(0, 0, w, h); CTX.fillStyle = '#0d0d14'; CTX.fillRect(0, 0, w, h); const color = type === 'native'? '#7c6af5' : '#34d399'; CTX.lineWidth = 2; CTX.strokeStyle = color; CTX.beginPath(); for(let x = 0; x < w; x++) {const y = h / 2 + Math.sin((x / w) * Math.PI * 8) * (h / 2 - 6) * Math.sin((x / w) * Math.PI); if(x === 0) CTX.moveTo(x, y); else CTX.lineTo(x, y);} CTX.stroke();}

function nextPair() {
  pairIndex++; state.totalWords++; saveState();
  const total = flatPairs.length, pct = Math.round((pairIndex / total) * 100);
  progBar.style.width = pct + '%'; progText.textContent = `${pairIndex} / ${total}`;
  if(pairIndex >= flatPairs.length) completeDay(); else {loadPair(); if(state.autoPlay) setTimeout(speakNative, 400);}
}

function completeDay() {
  const dayNum = trainerDay.day;
  if(!state.daysCompleted.includes(dayNum)) state.daysCompleted.push(dayNum);
  const today = todayISO(); const diff = state.lastActiveDate? daysBetween(state.lastActiveDate, today) : 1;
  if(diff <= 1) state.streak++; state.lastActiveDate = today; addXP(50); saveState();
  overlayEmoji.textContent = '🎉'; overlayTitle.textContent = 'Day Complete!'; overlayMsg.textContent = `You nailed Day ${dayNum} — ${trainerDay.title}.`;
  statWords.textContent = flatPairs.length; statStreak.textContent = state.streak; statXP.textContent = '+60'; dayCompleteOverlay.hidden = false;
  state.currentDay = Math.min(7, dayNum + 1);
}

function closeOverlay() {dayCompleteOverlay.hidden = true; trainerSection.hidden = true; heroSection.hidden = false; renderHero(); renderTopBar();}
function addXP(amount) {state.xp += amount; renderTopBar(); saveState();}
function toggleTheme() {state.darkMode =!state.darkMode; applyTheme(); darkModeCheck.checked = state.darkMode; saveState();}
function applyTheme() {document.documentElement.setAttribute('data-theme', state.darkMode? 'dark' : 'light'); themeToggle.textContent = state.darkMode? '☀️' : '🌙';}
function switchTab(tab) {
  tabTrain.classList.remove('active'); tabProgress.classList.remove('active'); tabSettings.classList.remove('active');
  panelProgress.hidden = true; panelSettings.hidden = true;
  if(tab === 'train') {tabTrain.classList.add('active'); heroSection.hidden = false; trainerSection.hidden = true;}
  else if(tab === 'progress') {tabProgress.classList.add('active'); panelProgress.hidden = false; renderProgress();}
  else {tabSettings.classList.add('active'); panelSettings.hidden = false;}
}
function renderProgress() {
  weekGrid.innerHTML = ''; CURRICULUM.forEach(d => {
    const cell = document.createElement('div'); cell.className = 'day-cell';
    if(state.daysCompleted.includes(d.day)) cell.classList.add('done'); else if(d.day === state.currentDay) cell.classList.add('current');
    cell.innerHTML = `<div class="dc-num">${d.day}</div><div>${d.emoji}</div>`; weekGrid.appendChild(cell);
  });
  bigStreak.textContent = state.streak; bigXP.textContent = state.xp; bigWords.textContent = state.totalWords;
}
function resetProgress() {if(confirm('Reset all progress?')) {localStorage.removeItem('accentpro_state'); location.reload();}}
function loadState() {const saved = localStorage.getItem('accentpro_state'); return saved? JSON.parse(saved) : {...DEFAULT_STATE};}
function saveState() {localStorage.setItem('accentpro_state', JSON.stringify(state));}
function todayISO() {return new Date().toISOString().split('T')[0];}
function daysBetween(d1, d2) {return Math.floor((new Date(d2) - new Date(d1)) / 86400000);}
