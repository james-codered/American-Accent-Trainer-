/* ═══════════════════════════════════════════════════
‎   AccentPro — script.js
‎   7-day plan · Danger pairs · Web Speech · LocalStorage
‎═══════════════════════════════════════════════════ */
‎
‎'use strict';
‎
‎// ─── 7-DAY CURRICULUM ───────────────────────────────────────────────────────
‎const CURRICULUM = [
‎  {
‎    day: 1,
‎    title: 'Vowels',
‎    emoji: '🔤',
‎    groups: [
‎      {
‎        label: "The 'ee' vs 'i' Trap",
‎        pairs: [
‎          { a: 'Ship',  b: 'Sheep', phonA: '/ʃɪp/',  phonB: '/ʃiːp/',  tip: 'Short /ɪ/ — relax your tongue midway. Long /iː/ — stretch your lips wide.' },
‎          { a: 'Bit',   b: 'Beat',  phonA: '/bɪt/',  phonB: '/biːt/',  tip: 'Feel the difference: /ɪ/ is a quick flick; /iː/ holds a beat longer.' },
‎          { a: 'Sit',   b: 'Seat',  phonA: '/sɪt/',  phonB: '/siːt/',  tip: 'Native speakers often drop the jaw slightly more on /iː/.' },
‎          { a: 'Sheet', b: 'Sh*t',  phonA: '/ʃiːt/', phonB: '/ʃɪt/',  tip: '⚠️ Danger pair! /iː/ is long and bright — get it right to avoid embarrassment.' },
‎          { a: 'Beach', b: 'B*tch', phonA: '/biːtʃ/',phonB: '/bɪtʃ/', tip: '⚠️ Classic danger pair. Hold that /iː/ long and forward in your mouth.' },
‎        ]
‎      },
‎      {
‎        label: "The 'ae' vs 'eh' Trap",
‎        pairs: [
‎          { a: 'Bad',  b: 'Bed',  phonA: '/bæd/',  phonB: '/bɛd/', tip: '/æ/ sits low in the mouth; your jaw drops and tongue lies flat.' },
‎          { a: 'Man',  b: 'Men',  phonA: '/mæn/',  phonB: '/mɛn/', tip: 'Think of saying "ah" then tighten slightly for /æ/.' },
‎          { a: 'Cat',  b: 'Cut',  phonA: '/kæt/',  phonB: '/kʌt/', tip: '/ʌ/ is central and relaxed — like a tiny grunt.' },
‎        ]
‎      }
‎    ]
‎  },
‎  {
‎    day: 2,
‎    title: 'TH Sounds',
‎    emoji: '👅',
‎    groups: [
‎      {
‎        label: "The TH vs S/Z Swap",
‎        pairs: [
‎          { a: 'Think', b: 'Sink',  phonA: '/θɪŋk/', phonB: '/sɪŋk/', tip: 'For /θ/, put your tongue tip between your teeth and breathe out.' },
‎          { a: 'Three', b: 'Free',  phonA: '/θriː/', phonB: '/friː/', tip: 'TH is dental — touch your upper teeth with your tongue tip gently.' },
‎          { a: 'That',  b: 'Zat',   phonA: '/ðæt/',  phonB: '/zæt/',  tip: 'Voiced /ð/ — same tongue position but add voice (vibration in your throat).' },
‎          { a: 'They',  b: 'Zey',   phonA: '/ðeɪ/',  phonB: '/zeɪ/',  tip: 'Feel the buzz on your tongue tip for the voiced TH /ð/.' },
‎          { a: 'Bath',  b: 'Baz',   phonA: '/bæθ/',  phonB: '/bæz/',  tip: 'Final unvoiced TH: let air hiss past your tongue against the teeth.' },
‎        ]
‎      }
‎    ]
‎  },
‎  {
‎    day: 3,
‎    title: 'R Sounds',
‎    emoji: '🌀',
‎    groups: [
‎      {
‎        label: "American R vs No R",
‎        pairs: [
‎          { a: 'Car',   b: 'Cah',   phonA: '/kɑːr/',  phonB: '/kɑː/',  tip: 'American R: curl your tongue tip back, don\'t let it touch the roof.' },
‎          { a: 'Bird',  b: 'Bud',   phonA: '/bɜːrd/', phonB: '/bʌd/',  tip: 'The /ɜːr/ is the trickiest — curl deep while your lips stay neutral.' },
‎          { a: 'Water', b: 'Wadah', phonA: '/ˈwɔːtər/',phonB:'/ˈwɔːdə/',tip: 'The flap T + R combo: "waddur" — T becomes a quick D tap.' },
‎          { a: 'Party', b: 'Pahty', phonA: '/ˈpɑːrti/',phonB:'/ˈpɑːti/',tip: 'Don\'t drop the R! Curl into it confidently after the vowel.' },
‎          { a: 'Here',  b: 'Hee',   phonA: '/hɪər/',  phonB: '/hiː/',  tip: '/ɪər/ glides from /ɪ/ into a retroflex R — feel the curl at the end.' },
‎        ]
‎      }
‎    ]
‎  },
‎  {
‎    day: 4,
‎    title: 'Linking',
‎    emoji: '🔗',
‎    groups: [
‎      {
‎        label: "Consonant-to-Vowel Linking",
‎        pairs: [
‎          { a: 'Pick it up',  b: 'Pick — it — up',  phonA: '/ˈpɪkɪtʌp/', phonB: 'staccato',  tip: 'Native speakers link: "pi-ki-tup" sounds like one word.' },
‎          { a: 'Turn it off', b: 'Turn — it — off',  phonA: '/ˈtɜːrnɪtɔːf/',phonB:'staccato', tip: 'The N links to I: "tur-ni-toff". Flow, don\'t pause.' },
‎          { a: 'Take a look', b: 'Take. A. Look.',   phonA: '/ˈteɪkəlʊk/', phonB:'staccato',  tip: '"tay-kuh-look" — the K glides right into "a".' },
‎          { a: 'Come on',     b: 'Come. On.',        phonA: '/kʌˈmɒn/',    phonB:'staccato',  tip: '"kuh-MON" — stress lands on the second syllable when linked.' },
‎          { a: 'Not at all',  b: 'Not. At. All.',    phonA: '/nɒtətˈɔːl/', phonB:'staccato',  tip: '"nah-tuh-TALL" — three words become one fluid phrase.' },
‎        ]
‎      },
‎      {
‎        label: "Reduction & Schwa",
‎        pairs: [
‎          { a: 'gonna',  b: 'going to',  phonA: '/ˈɡʌnə/', phonB: '/ˈɡoʊɪŋ tuː/', tip: 'Reduction is natural — "gonna" isn\'t lazy, it\'s fluent.' },
‎          { a: 'wanna',  b: 'want to',   phonA: '/ˈwɒnə/', phonB: '/ˈwɒnt tuː/', tip: 'The schwa /ə/ swallows unstressed vowels — master it.' },
‎          { a: 'hafta',  b: 'have to',   phonA: '/ˈhæftə/',phonB: '/ˈhæv tuː/', tip: '"have to" naturally becomes /ˈhæftə/ in fast speech.' },
‎        ]
‎      }
‎    ]
‎  },
‎  {
‎    day: 5,
‎    title: 'Review: Vowels',
‎    emoji: '🔁',
‎    groups: [
‎      {
‎        label: "Vowel Review — Day 1 Revisited",
‎        pairs: [
‎          { a: 'Ship',  b: 'Sheep', phonA: '/ʃɪp/',  phonB: '/ʃiːp/',  tip: 'Still the #1 danger pair for learners. Keep nailing it.' },
‎          { a: 'Beach', b: 'B*tch', phonA: '/biːtʃ/',phonB: '/bɪtʃ/', tip: 'Review: long bright /iː/ — hold it for a full beat.' },
‎          { a: 'Bad',   b: 'Bed',   phonA: '/bæd/',  phonB: '/bɛd/', tip: 'Jaw drop for /æ/ — your face actually moves more.' },
‎          { a: 'Man',   b: 'Men',   phonA: '/mæn/',  phonB: '/mɛn/', tip: 'Say "apple" — that front /æ/ is the same in "man".' },
‎        ]
‎      }
‎    ]
‎  },
‎  {
‎    day: 6,
‎    title: 'Review: Consonants',
‎    emoji: '🔁',
‎    groups: [
‎      {
‎        label: "TH & R Review",
‎        pairs: [
‎          { a: 'Think', b: 'Sink',  phonA: '/θɪŋk/', phonB: '/sɪŋk/', tip: 'Tongue between the teeth — a little ugly, but correct.' },
‎          { a: 'Bird',  b: 'Bud',   phonA: '/bɜːrd/', phonB: '/bʌd/', tip: 'Deep retroflex curl for the American R — commit to it.' },
‎          { a: 'They',  b: 'Zey',   phonA: '/ðeɪ/',  phonB: '/zeɪ/', tip: 'Voiced TH: buzz on the tongue tip is the key.' },
‎          { a: 'Three', b: 'Free',  phonA: '/θriː/', phonB: '/friː/', tip: 'Unvoiced TH before R: dental + airflow + curl.' },
‎        ]
‎      }
‎    ]
‎  },
‎  {
‎    day: 7,
‎    title: 'Full Review',
‎    emoji: '🏆',
‎    groups: [
‎      {
‎        label: "Ultimate Danger Pairs Challenge",
‎        pairs: [
‎          { a: 'Ship',  b: 'Sheep', phonA: '/ʃɪp/',   phonB: '/ʃiːp/',  tip: 'The classic. Own it.' },
‎          { a: 'Beach', b: 'B*tch', phonA: '/biːtʃ/', phonB: '/bɪtʃ/', tip: 'Long /iː/ wins every time.' },
‎          { a: 'Sheet', b: 'Sh*t',  phonA: '/ʃiːt/',  phonB: '/ʃɪt/',  tip: 'Hold that /iː/ — don\'t rush it.' },
‎          { a: 'Think', b: 'Sink',  phonA: '/θɪŋk/', phonB: '/sɪŋk/', tip: 'Tongue forward for TH — always.' },
‎          { a: 'Bird',  b: 'Bud',   phonA: '/bɜːrd/', phonB: '/bʌd/', tip: 'Curl deep for the American R.' },
‎          { a: 'gonna', b: 'going to',phonA:'/ˈɡʌnə/',phonB:'/ˈɡoʊɪŋ tuː/',tip:'Flow like a native — reduction is correct.' },
‎        ]
‎      }
‎    ]
‎  }
‎];
‎
‎// ─── STATE ──────────────────────────────────────────────────────────────────
‎const DEFAULT_STATE = {
‎  currentDay: 1,
‎  xp: 0,
‎  streak: 0,
‎  lastActiveDate: null,  // ISO date string
‎  daysCompleted: [],     // [1, 2, …]
‎  totalWords: 0,
‎  darkMode: true,
‎  autoPlay: false,
‎  ttsSpeed: 0.85,
‎  elKey: '',
‎};
‎
‎let state = loadState();
‎
‎// ─── TRAINER RUNTIME ────────────────────────────────────────────────────────
‎let trainerDay = null;    // day object
‎let flatPairs = [];       // all pairs for current day, flattened
‎let flatGroups = [];      // group per pair index
‎let pairIndex = 0;
‎
‎// Audio / recording
‎let mediaRecorder = null;
‎let recordedChunks = [];
‎let recordedBlob = null;
‎let recordedURL = null;
‎let analyser = null;
‎let audioCtx = null;
‎let micStream = null;
‎let animFrameId = null;
‎
‎// ─── DOM REFS ────────────────────────────────────────────────────────────────
‎const $ = id => document.getElementById(id);
‎
‎const heroSection     = $('heroSection');
‎const trainerSection  = $('trainerSection');
‎const heroDayNum      = $('heroDayNum');
‎const heroCta         = $('heroCta');
‎const dayPills        = $('dayPills');
‎
‎const trainerDayLabel = $('trainerDayLabel');
‎const pairGroupLabel  = $('pairGroupLabel');
‎const trapBadge       = $('trapBadge');
‎const wordA           = $('wordA');
‎const wordB           = $('wordB');
‎const phonA           = $('phonA');
‎const phonB           = $('phonB');
‎const tipBox          = $('tipBox');
‎const wordCard        = $('wordCard');
‎
‎const waveCanvas      = $('waveCanvas');
‎const waveStatus      = $('waveStatus');
‎const btnPlayNative   = $('btnPlayNative');
‎const btnRecord       = $('btnRecord');
‎const recordLabel     = $('recordLabel');
‎const btnHearBoth     = $('btnHearBoth');
‎const btnNext         = $('btnNext');
‎const progBar         = $('progBar');
‎const progText        = $('progText');
‎
‎const dayCompleteOverlay = $('dayCompleteOverlay');
‎const overlayEmoji    = $('overlayEmoji');
‎const overlayTitle    = $('overlayTitle');
‎const overlayMsg      = $('overlayMsg');
‎const statWords       = $('statWords');
‎const statStreak      = $('statStreak');
‎const statXP          = $('statXP');
‎const overlayNext     = $('overlayNext');
‎
‎const themeToggle     = $('themeToggle');
‎const streakBadge     = $('streakBadge');
‎const xpPill          = $('xpPill');
‎const backBtn         = $('backBtn');
‎
‎const tabTrain        = $('tabTrain');
‎const tabProgress     = $('tabProgress');
‎const tabSettings     = $('tabSettings');
‎const panelProgress   = $('panelProgress');
‎const panelSettings   = $('panelSettings');
‎const weekGrid        = $('weekGrid');
‎const bigStreak       = $('bigStreak');
‎const bigXP           = $('bigXP');
‎const bigWords        = $('bigWords');
‎
‎const darkModeCheck   = $('darkModeCheck');
‎const autoPlayCheck   = $('autoPlayCheck');
‎const speedRange      = $('speedRange');
‎const speedVal        = $('speedVal');
‎const elInput         = $('elInput');
‎const btnSaveEl       = $('btnSaveEl');
‎const elStatus        = $('elStatus');
‎const btnResetProgress= $('btnResetProgress');
‎
‎// ─── INIT ────────────────────────────────────────────────────────────────────
‎function init() {
‎  applyTheme();
‎  updateStreakLogic();
‎  renderHero();
‎  renderTopBar();
‎  bindEvents();
‎  darkModeCheck.checked = state.darkMode;
‎  autoPlayCheck.checked = state.autoPlay;
‎  speedRange.value = state.ttsSpeed;
‎  speedVal.textContent = state.ttsSpeed + '×';
‎  elInput.value = state.elKey || '';
‎  if (state.elKey) elStatus.textContent = '✓ Key saved';
‎}
‎
‎// ─── HERO ────────────────────────────────────────────────────────────────────
‎function renderHero() {
‎  const day = state.currentDay;
‎  heroDayNum.textContent = day;
‎  dayPills.innerHTML = '';
‎  CURRICULUM.forEach(d => {
‎    const pill = document.createElement('button');
‎    pill.className = 'day-pill';
‎    const done = state.daysCompleted.includes(d.day);
‎    const current = d.day === day;
‎    const locked = d.day > day;
‎    if (done) pill.classList.add('done');
‎    else if (current) pill.classList.add('current');
‎    else if (locked) pill.classList.add('locked');
‎    pill.textContent = `D${d.day} ${d.emoji}`;
‎    pill.setAttribute('aria-label', `Day ${d.day}: ${d.title}`);
‎    pill.addEventListener('click', () => {
‎      if (!locked) startDay(d.day);
‎    });
‎    dayPills.appendChild(pill);
‎  });
‎}
‎
‎// ─── TOP BAR ─────────────────────────────────────────────────────────────────
‎function renderTopBar() {
‎  streakBadge.textContent = '🔥 ' + state.streak;
‎  xpPill.textContent = state.xp + ' XP';
‎}
‎
‎// ─── STREAK LOGIC (soft landing) ─────────────────────────────────────────────
‎function updateStreakLogic() {
‎  const today = todayISO();
‎  if (!state.lastActiveDate) return; // first time
‎  const diff = daysBetween(state.lastActiveDate, today);
‎  if (diff === 0) return; // already counted today
‎  if (diff === 1) {
‎    // consecutive — streak maintained; will increment on completion
‎  } else if (diff === 2) {
‎    // SOFT LANDING: missed one day — don't reset, just don't increment
‎    // show gentle reminder (no penalty)
‎  } else {
‎    // missed 2+ days — reset streak
‎    state.streak = 0;
‎    saveState();
‎  }
‎}
‎
‎// ─── START DAY ───────────────────────────────────────────────────────────────
‎function startDay(dayNum) {
‎  trainerDay = CURRICULUM.find(d => d.day === dayNum);
‎  if (!trainerDay) return;
‎
‎  // flatten pairs
‎  flatPairs = [];
‎  flatGroups = [];
‎  trainerDay.groups.forEach(g => {
‎    g.pairs.forEach(p => {
‎      flatPairs.push(p);
‎      flatGroups.push(g);
‎    });
‎  });
‎
‎  pairIndex = 0;
‎  recordedBlob = null;
‎  recordedURL = null;
‎
‎  heroSection.hidden = true;
‎  trainerSection.hidden = false;
‎  trainerSection.removeAttribute('hidden');
‎
‎  loadPair();
‎
‎  if (state.autoPlay) {
‎    setTimeout(speakNative, 600);
‎  }
‎}
‎
‎// ─── LOAD PAIR ───────────────────────────────────────────────────────────────
‎function loadPair() {
‎  const pair = flatPairs[pairIndex];
‎  const group = flatGroups[pairIndex];
‎
‎  trainerDayLabel.textContent = `Day ${trainerDay.day}`;
‎  pairGroupLabel.textContent = group.label;
‎  trapBadge.textContent = group.label;
‎
‎  wordA.textContent = pair.a;
‎  wordB.textContent = pair.b;
‎  phonA.textContent = pair.phonA;
‎  phonB.textContent = pair.phonB;
‎  tipBox.textContent = pair.tip;
‎
‎  // reset buttons
‎  btnPlayNative.disabled = false;
‎  btnRecord.disabled = false;
‎  btnHearBoth.disabled = true;
‎  btnNext.disabled = true;
‎  btnRecord.classList.remove('is-recording');
‎  recordLabel.textContent = 'Record Yourself';
‎
‎  recordedBlob = null;
‎  recordedURL = null;
‎
‎  wordCard.classList.remove('glow-correct');
‎  waveStatus.textContent = '—';
‎
‎  // progress
‎  const total = flatPairs.length;
‎  const pct = Math.round((pairIndex / total) * 100);
‎  progBar.style.width = pct + '%';
‎  progText.textContent = `${pairIndex} / ${total}`;
‎
‎  clearCanvas();
‎}
‎
‎// ─── TTS: PLAY NATIVE ────────────────────────────────────────────────────────
‎function speakNative() {
‎  const pair = flatPairs[pairIndex];
‎  // Speak A then B with a pause
‎  speakWord(pair.a, () => {
‎    setTimeout(() => speakWord(pair.b), 700);
‎  });
‎  // Draw native waveform simulation
‎  drawSimulatedWave('native');
‎}
‎
‎function speakWord(word, onEnd) {
‎  if (!window.speechSynthesis) return;
‎  window.speechSynthesis.cancel();
‎  const utt = new SpeechSynthesisUtterance(word);
‎  utt.lang = 'en-US';
‎  utt.rate = parseFloat(state.ttsSpeed) || 0.85;
‎  utt.pitch = 1.0;
‎
‎  // Try to pick an American English voice
‎  const voices = window.speechSynthesis.getVoices();
‎  const american = voices.find(v =>
‎    (v.lang === 'en-US') && (v.name.toLowerCase().includes('samantha') ||
‎      v.name.toLowerCase().includes('alex') || v.name.toLowerCase().includes('google'))
‎  ) || voices.find(v => v.lang === 'en-US') || voices[0];
‎  if (american) utt.voice = american;
‎
‎  if (onEnd) utt.onend = onEnd;
‎  window.speechSynthesis.speak(utt);
‎}
‎
‎function speakBoth() {
‎  const pair = flatPairs[pairIndex];
‎  speakWord('Native: ' + pair.a, () => {
‎    setTimeout(() => {
‎      speakWord('You recorded:');
‎      if (recordedURL) {
‎        setTimeout(() => {
‎          const audio = new Audio(recordedURL);
‎          audio.play();
‎        }, 600);
‎      }
‎    }, 800);
‎  });
‎}
‎
‎// ─── RECORDING ───────────────────────────────────────────────────────────────
‎async function startRecording() {
‎  try {
‎    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
‎  } catch (e) {
‎    alert('Microphone access denied. Please allow microphone access and try again.');
‎    return;
‎  }
‎
‎  recordedChunks = [];
‎  mediaRecorder = new MediaRecorder(micStream);
‎  mediaRecorder.ondataavailable = e => {
‎    if (e.data.size > 0) recordedChunks.push(e.data);
‎  };
‎  mediaRecorder.onstop = onRecordingStop;
‎
‎  // Set up analyser for waveform
‎  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
‎  const source = audioCtx.createMediaStreamSource(micStream);
‎  analyser = audioCtx.createAnalyser();
‎  analyser.fftSize = 256;
‎  source.connect(analyser);
‎
‎  mediaRecorder.start();
‎  btnRecord.classList.add('is-recording');
‎  recordLabel.textContent = 'Stop Recording';
‎  waveStatus.textContent = '⏺ recording';
‎  drawLiveWave();
‎}
‎
‎function stopRecording() {
‎  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
‎    mediaRecorder.stop();
‎  }
‎  if (micStream) {
‎    micStream.getTracks().forEach(t => t.stop());
‎  }
‎  cancelAnimationFrame(animFrameId);
‎  btnRecord.classList.remove('is-recording');
‎  recordLabel.textContent = 'Re-record';
‎  waveStatus.textContent = '✓ recorded';
‎}
‎
‎function onRecordingStop() {
‎  recordedBlob = new Blob(recordedChunks, { type: 'audio/webm' });
‎  recordedURL = URL.createObjectURL(recordedBlob);
‎  btnHearBoth.disabled = false;
‎  btnNext.disabled = false;
‎  wordCard.classList.add('glow-correct');
‎  // Give XP for recording
‎  addXP(10);
‎}
‎
‎// ─── WAVEFORM CANVAS ─────────────────────────────────────────────────────────
‎const CTX = waveCanvas.getContext('2d');
‎
‎function clearCanvas() {
‎  CTX.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
‎  CTX.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#0d0d14';
‎  CTX.fillRect(0, 0, waveCanvas.width, waveCanvas.height);
‎}
‎
‎function drawLiveWave() {
‎  animFrameId = requestAnimationFrame(drawLiveWave);
‎  if (!analyser) return;
‎
‎  const bufLen = analyser.frequencyBinCount;
‎  const dataArr = new Uint8Array(bufLen);
‎  analyser.getByteTimeDomainData(dataArr);
‎
‎  const w = waveCanvas.width, h = waveCanvas.height;
‎  CTX.clearRect(0, 0, w, h);
‎  CTX.fillStyle = '#0d0d14';
‎  CTX.fillRect(0, 0, w, h);
‎
‎  CTX.lineWidth = 2;
‎  CTX.strokeStyle = '#ef4444';
‎  CTX.beginPath();
‎
‎  const sliceW = w / bufLen;
‎  let x = 0;
‎  for (let i = 0; i < bufLen; i++) {
‎    const v = dataArr[i] / 128.0;
‎    const y = (v * h) / 2;
‎    if (i === 0) CTX.moveTo(x, y);
‎    else CTX.lineTo(x, y);
‎    x += sliceW;
‎  }
‎  CTX.lineTo(w, h / 2);
‎  CTX.stroke();
‎}
‎
‎function drawSimulatedWave(type) {
‎  // draw a fake wave for native playback
‎  const w = waveCanvas.width, h = waveCanvas.height;
‎  CTX.clearRect(0, 0, w, h);
‎  CTX.fillStyle = '#0d0d14';
‎  CTX.fillRect(0, 0, w, h);
‎
‎  const color = type === 'native' ? '#7c6af5' : '#34d399';
‎  CTX.lineWidth = 2;
‎  CTX.strokeStyle = color;
‎  CTX.beginPath();
‎  for (let x = 0; x < w; x++) {
‎    const y = h / 2 + Math.sin((x / w) * Math.PI * 8) * (h / 2 - 6) * Math.sin((x / w) * Math.PI);
‎    if (x === 0) CTX.moveTo(x, y);
‎    else CTX.lineTo(x, y);
‎  }
‎  CTX.stroke();
‎}
‎
‎// ─── NEXT PAIR / DAY COMPLETE ─────────────────────────────────────────────────
‎function nextPair() {
‎  pairIndex++;
‎  state.totalWords++;
‎  saveState();
‎
‎  const total = flatPairs.length;
‎  const pct = Math.round((pairIndex / total) * 100);
‎  progBar.style.width = pct + '%';
‎  progText.textContent = `${pairIndex} / ${total}`;
‎
‎  if (pairIndex >= flatPairs.length) {
‎    completDay();
‎  } else {
‎    loadPair();
‎    if (state.autoPlay) setTimeout(speakNative, 400);
‎  }
‎}
‎
‎function completDay() {
‎  const dayNum = trainerDay.day;
‎
‎  // Update state
‎  if (!state.daysCompleted.includes(dayNum)) {
‎    state.daysCompleted.push(dayNum);
‎  }
‎
‎  // Streak logic
‎  const today = todayISO();
‎  const diff = state.lastActiveDate ? daysBetween(state.lastActiveDate, today) : 99;
‎  if (diff >= 1) {
‎    if (diff <= 2) {
‎      // consecutive or soft-landing — increment
‎      state.streak = (state.streak || 0) + 1;
‎    }
‎    // if diff > 2, streak already reset in updateStreakLogic
‎    state.lastActiveDate = today;
‎  }
‎
‎  // Advance currentDay
‎  if (dayNum >= state.currentDay && dayNum < 7) {
‎    state.currentDay = dayNum + 1;
‎  }
‎
‎  addXP(50);
‎  saveState();
‎
‎  // Show overlay
‎  statWords.textContent = flatPairs.length;
‎  statStreak.textContent = state.streak;
‎  statXP.textContent = state.xp;
‎  overlayTitle.textContent = `Day ${dayNum} Complete!`;
‎  overlayMsg.textContent = `You finished Day ${dayNum} — ${trainerDay.title}!`;
‎  overlayEmoji.textContent = dayNum === 7 ? '🏆' : '🎉';
‎
‎  dayCompleteOverlay.removeAttribute('hidden');
‎  launchConfetti();
‎  renderTopBar();
‎}
‎
‎// ─── UTILS ────────────────────────────────────────────────────────────────────
‎function addXP(amount) {
‎  state.xp += amount;
‎  renderTopBar();
‎  saveState();
‎}
‎
‎function todayISO() {
‎  return new Date().toISOString().split('T')[0];
‎}
‎
‎function daysBetween(d1, d2) {
‎  const a = new Date(d1), b = new Date(d2);
‎  return Math.round((b - a) / 86400000);
‎}
‎
‎// ─── CONFETTI ─────────────────────────────────────────────────────────────────
‎function launchConfetti() {
‎  const container = $('confettiContainer');
‎  const colors = ['#7c6af5','#c084fc','#38bdf8','#34d399','#fbbf24','#f87171'];
‎  for (let i = 0; i < 60; i++) {
‎    const el = document.createElement('div');
‎    el.className = 'confetti-piece';
‎    el.style.left = Math.random() * 100 + 'vw';
‎    el.style.top = '-12px';
‎    el.style.background = colors[Math.floor(Math.random() * colors.length)];
‎    el.style.width = (6 + Math.random() * 8) + 'px';
‎    el.style.height = (6 + Math.random() * 8) + 'px';
‎    el.style.animationDuration = (1.5 + Math.random() * 2) + 's';
‎    el.style.animationDelay = (Math.random() * 0.8) + 's';
‎    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
‎    container.appendChild(el);
‎    el.addEventListener('animationend', () => el.remove());
‎  }
‎}
‎
‎// ─── THEME ────────────────────────────────────────────────────────────────────
‎function applyTheme() {
‎  document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
‎  themeToggle.textContent = state.darkMode ? '☀️' : '🌙';
‎  darkModeCheck.checked = state.darkMode;
‎}
‎
‎// ─── PROGRESS TAB ─────────────────────────────────────────────────────────────
‎function renderProgressTab() {
‎  weekGrid.innerHTML = '';
‎  CURRICULUM.forEach(d => {
‎    const cell = document.createElement('div');
‎    cell.className = 'day-cell';
‎    const done = state.daysCompleted.includes(d.day);
‎    const current = d.day === state.currentDay;
‎    const missed = !done && d.day < state.currentDay;
‎    if (done) cell.classList.add('done');
‎    else if (current) cell.classList.add('current');
‎    else if (missed) cell.classList.add('missed');
‎    cell.innerHTML = `<span class="dc-num">${d.emoji}</span><span>D${d.day}</span>`;
‎    weekGrid.appendChild(cell);
‎  });
‎  bigStreak.textContent = state.streak;
‎  bigXP.textContent = state.xp;
‎  bigWords.textContent = state.totalWords;
‎}
‎
‎// ─── LOCAL STORAGE ────────────────────────────────────────────────────────────
‎function saveState() {
‎  localStorage.setItem('accentpro_v2', JSON.stringify(state));
‎}
‎
‎function loadState() {
‎  try {
‎    const raw = localStorage.getItem('accentpro_v2');
‎    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
‎  } catch(e) {}
‎  return { ...DEFAULT_STATE };
‎}
‎
‎// ─── TAB SWITCHING ───────────────────────────────────────────────────────────
‎function showTab(tab) {
‎  [tabTrain, tabProgress, tabSettings].forEach(t => t.classList.remove('active'));
‎  [heroSection, trainerSection, panelProgress, panelSettings].forEach(p => {
‎    if (p) p.hidden = true;
‎  });
‎
‎  if (tab === 'train') {
‎    tabTrain.classList.add('active');
‎    if (trainerSection && !trainerSection.hidden === false) {
‎      // if trainer was open, keep it open
‎    }
‎    heroSection.hidden = false;
‎  } else if (tab === 'progress') {
‎    tabProgress.classList.add('active');
‎    panelProgress.hidden = false;
‎    renderProgressTab();
‎  } else if (tab === 'settings') {
‎    tabSettings.classList.add('active');
‎    panelSettings.hidden = false;
‎  }
‎}
‎
‎// ─── EVENT BINDINGS ──────────────────────────────────────────────────────────
‎function bindEvents() {
‎  // Hero CTA
‎  heroCta.addEventListener('click', () => startDay(state.currentDay));
‎
‎  // Back button
‎  backBtn.addEventListener('click', () => {
‎    stopRecording();
‎    trainerSection.hidden = true;
‎    heroSection.hidden = false;
‎    renderHero();
‎  });
‎
‎  // Play Native
‎  btnPlayNative.addEventListener('click', () => {
‎    speakNative();
‎  });
‎
‎  // Click word to hear it individually
‎  wordA.addEventListener('click', () => speakWord(flatPairs[pairIndex]?.a));
‎  wordB.addEventListener('click', () => speakWord(flatPairs[pairIndex]?.b));
‎
‎  // Record toggle
‎  btnRecord.addEventListener('click', () => {
‎    if (mediaRecorder && mediaRecorder.state === 'recording') {
‎      stopRecording();
‎    } else {
‎      startRecording();
‎    }
‎  });
‎
‎  // Hear Both
‎  btnHearBoth.addEventListener('click', speakBoth);
‎
‎  // Next
‎  btnNext.addEventListener('click', nextPair);
‎
‎  // Overlay continue
‎  overlayNext.addEventListener('click', () => {
‎    dayCompleteOverlay.hidden = true;
‎    heroSection.hidden = false;
‎    trainerSection.hidden = true;
‎    renderHero();
‎    renderTopBar();
‎    showTab('train');
‎  });
‎
‎  // Theme toggle button (topbar)
‎  themeToggle.addEventListener('click', () => {
‎    state.darkMode = !state.darkMode;
‎    applyTheme(); saveState();
‎  });
‎
‎  // Nav tabs
‎  tabTrain.addEventListener('click', () => showTab('train'));
‎  tabProgress.addEventListener('click', () => showTab('progress'));
‎  tabSettings.addEventListener('click', () => showTab('settings'));
‎
‎  // Settings
‎  darkModeCheck.addEventListener('change', () => {
‎    state.darkMode = darkModeCheck.checked;
‎    applyTheme(); saveState();
‎  });
‎  autoPlayCheck.addEventListener('change', () => {
‎    state.autoPlay = autoPlayCheck.checked;
‎    saveState();
‎  });
‎  speedRange.addEventListener('input', () => {
‎    state.ttsSpeed = parseFloat(speedRange.value);
‎    speedVal.textContent = state.ttsSpeed + '×';
‎    saveState();
‎  });
‎  btnSaveEl.addEventListener('click', () => {
‎    state.elKey = elInput.value.trim();
‎    saveState();
‎    elStatus.textContent = state.elKey ? '✓ Key saved' : '';
‎  });
‎
‎  // Reset progress
‎  btnResetProgress.addEventListener('click', () => {
‎    if (confirm('Reset all progress? This cannot be undone.')) {
‎      localStorage.removeItem('accentpro_v2');
‎      state = { ...DEFAULT_STATE };
‎      saveState();
‎      renderHero();
‎      renderTopBar();
‎      renderProgressTab();
‎      applyTheme();
‎    }
‎  });
‎
‎  // Voices may load async
‎  window.speechSynthesis.onvoiceschanged = () => {};
‎}
‎
‎// ─── BOOT ─────────────────────────────────────────────────────────────────────
‎init();
‎
