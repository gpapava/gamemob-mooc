/* GAMEMOB MOOC prototype — client-side course player.
   Progress is stored in localStorage only; there is no backend or account system. */

const STORAGE_KEY = 'gamemob_mooc_progress_v1';
const NAME_KEY = 'gamemob_mooc_name_v1';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) { /* storage unavailable — progress just won't persist */ }
}

// Build a flat, ordered list of items per module: lessons, interactive activity, study page, quiz.
const TYPE_LABEL = { lesson: 'Lesson', material: 'Page', activity: 'Interactive', quiz: 'Quiz' };

function buildItems() {
  const items = [];
  COURSE.modules.forEach(m => {
    m.lessons.forEach(l => items.push({ type: 'lesson', moduleId: m.id, moduleTitle: m.title, ...l }));
    if (m.activity) items.push({ type: 'activity', moduleId: m.id, moduleTitle: m.title, ...m.activity });
    if (m.material) items.push({ type: 'material', moduleId: m.id, moduleTitle: m.title, ...m.material });
    items.push({ type: 'quiz', moduleId: m.id, moduleTitle: m.title, ...m.quiz });
  });
  return items;
}

const ITEMS = buildItems();
let progress = loadProgress();

/* ---- Minimal SCORM 1.2 runtime for the interactive activities ----
   Each activity is a SCORM package that talks to window.API. Here the "LMS" is
   this page: completion marks the course item as done, and suspend_data is kept
   in localStorage so learners can come back to where they were. */
let activeActivityId = null;
let scormData = {};
const SCORM_PREFIX = 'gamemob_scorm_v1_';

function loadScormData(id) {
  try { return JSON.parse(localStorage.getItem(SCORM_PREFIX + id)) || {}; } catch (e) { return {}; }
}
function saveScormData(id, data) {
  try { localStorage.setItem(SCORM_PREFIX + id, JSON.stringify(data)); } catch (e) { /* ignore */ }
}

window.API = {
  LMSInitialize() { return 'true'; },
  LMSFinish() { return 'true'; },
  LMSGetValue(key) { return scormData[key] || ''; },
  LMSSetValue(key, value) {
    if (!activeActivityId) return 'false';
    scormData[key] = String(value);
    saveScormData(activeActivityId, scormData);
    if (key === 'cmi.core.lesson_status' && (value === 'completed' || value === 'passed')) {
      if (!progress[activeActivityId]) {
        markComplete(activeActivityId);
        renderProgressBar();
        renderSidebar(activeActivityId);
        const flag = document.getElementById('activity-status');
        if (flag) { flag.textContent = 'Completed \u2713'; flag.classList.add('done'); }
      }
    }
    return 'true';
  },
  LMSCommit() { return 'true'; },
  LMSGetLastError() { return '0'; },
  LMSGetErrorString() { return ''; },
  LMSGetDiagnostic() { return ''; }
};

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function currentItemId() {
  const fromUrl = getParam('item');
  if (fromUrl && ITEMS.some(i => i.id === fromUrl)) return fromUrl;

  const moduleParam = getParam('module');
  if (moduleParam) {
    const first = ITEMS.find(i => i.moduleId === moduleParam);
    if (first) return first.id;
  }

  const firstIncomplete = ITEMS.find(i => !progress[i.id]);
  return firstIncomplete ? firstIncomplete.id : ITEMS[ITEMS.length - 1].id;
}

function pctComplete() {
  const done = ITEMS.filter(i => progress[i.id]).length;
  return Math.round((done / ITEMS.length) * 100);
}

function renderProgressBar() {
  const pct = pctComplete();
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '% complete';
}

function renderSidebar(activeId) {
  const wrap = document.getElementById('sidebar-modules');
  wrap.innerHTML = '';
  COURSE.modules.forEach(m => {
    const moduleItems = ITEMS.filter(i => i.moduleId === m.id);
    const isOpenModule = moduleItems.some(i => i.id === activeId);

    const modEl = document.createElement('div');
    modEl.className = 'sb-module' + (isOpenModule ? ' open' : '');

    const head = document.createElement('div');
    head.className = 'sb-module-head';
    head.innerHTML = `<span>${m.title}</span><span class="chev">▸</span>`;
    head.addEventListener('click', () => {
      modEl.classList.toggle('open');
    });
    modEl.appendChild(head);

    const lessonsWrap = document.createElement('div');
    lessonsWrap.className = 'sb-lessons';
    moduleItems.forEach(item => {
      const row = document.createElement('a');
      row.href = `learn.html?item=${item.id}`;
      row.className = 'sb-lesson'
        + (item.id === activeId ? ' active' : '')
        + (progress[item.id] ? ' done' : '')
        + (item.type === 'quiz' ? ' quiz' : '');
      const marker = item.type === 'quiz' ? '📝 ' : '';
      row.innerHTML = `<span class="dot">${progress[item.id] ? '✓' : ''}</span><span class="sb-title">${marker}${item.title}</span><span class="sb-type sb-type-${item.type}">${TYPE_LABEL[item.type]}</span>`;
      row.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(item.id);
      });
      lessonsWrap.appendChild(row);
    });
    modEl.appendChild(lessonsWrap);
    wrap.appendChild(modEl);
  });
}

function navigateTo(itemId) {
  history.pushState({}, '', `learn.html?item=${itemId}`);
  render();
}

function markComplete(itemId) {
  progress[itemId] = true;
  saveProgress(progress);
}

function nextItem(itemId) {
  const idx = ITEMS.findIndex(i => i.id === itemId);
  return ITEMS[idx + 1] || null;
}
function prevItem(itemId) {
  const idx = ITEMS.findIndex(i => i.id === itemId);
  return idx > 0 ? ITEMS[idx - 1] : null;
}

function renderLesson(item) {
  const main = document.getElementById('main');
  const next = nextItem(item.id);
  const prev = prevItem(item.id);

  main.innerHTML = `
    <div class="lesson-eyebrow">${item.moduleTitle}</div>
    <h1 class="lesson-title">${item.title}</h1>
    <div class="lesson-video">▶ Video placeholder</div>
    <div class="lesson-body">${item.body}</div>
    <div class="lesson-nav">
      ${prev ? `<button class="btn btn-outline" id="btn-prev">← Back</button>` : `<span></span>`}
      <span class="spacer"></span>
      <button class="btn btn-primary" id="btn-complete">
        ${next ? 'Mark Complete & Continue →' : 'Mark Complete'}
      </button>
    </div>
  `;

  if (prev) document.getElementById('btn-prev').addEventListener('click', () => navigateTo(prev.id));
  document.getElementById('btn-complete').addEventListener('click', () => {
    markComplete(item.id);
    if (next) navigateTo(next.id);
    else render();
  });
}

function renderMaterial(item) {
  const main = document.getElementById('main');
  const next = nextItem(item.id);
  const prev = prevItem(item.id);

  main.innerHTML = `
    <div class="lesson-eyebrow">${item.moduleTitle} · Study page</div>
    <div class="activity-bar">
      <span class="activity-status${progress[item.id] ? ' done' : ''}">${progress[item.id] ? 'Completed \u2713' : 'Read the page, then continue'}</span>
      <a class="activity-dl" href="${item.src}" target="_blank" rel="noopener">Open in a new tab / print</a>
    </div>
    <iframe id="material-frame" class="activity-frame material-frame" title="${item.title}" src="${item.src}"></iframe>
    <div class="lesson-nav">
      ${prev ? `<button class="btn btn-outline" id="btn-prev">← Back</button>` : `<span></span>`}
      <span class="spacer"></span>
      <button class="btn btn-primary" id="btn-complete">${next ? 'Mark Complete & Continue →' : 'Mark Complete'}</button>
    </div>
  `;

  const frame = document.getElementById('material-frame');
  function fit() {
    try {
      const doc = frame.contentDocument;
      if (doc && doc.documentElement) frame.style.height = Math.max(520, doc.documentElement.scrollHeight + 4) + 'px';
    } catch (e) { /* keep default height */ }
  }
  frame.addEventListener('load', () => {
    fit();
    try {
      const doc = frame.contentDocument;
      if (window.ResizeObserver && doc && doc.body) new ResizeObserver(fit).observe(doc.body);
    } catch (e) { /* ignore */ }
  });

  if (prev) document.getElementById('btn-prev').addEventListener('click', () => navigateTo(prev.id));
  document.getElementById('btn-complete').addEventListener('click', () => {
    markComplete(item.id);
    if (next) navigateTo(next.id);
    else render();
  });
}

function renderActivity(item) {
  const main = document.getElementById('main');
  const next = nextItem(item.id);
  const prev = prevItem(item.id);
  activeActivityId = item.id;
  scormData = loadScormData(item.id);

  main.innerHTML = `
    <div class="lesson-eyebrow">${item.moduleTitle}</div>
    <h1 class="lesson-title">${item.title}</h1>
    <p class="activity-intro">${item.intro}</p>
    <div class="activity-bar">
      <span id="activity-status" class="activity-status${progress[item.id] ? ' done' : ''}">${progress[item.id] ? 'Completed \u2713' : 'Not completed yet'}</span>
      <a class="activity-dl" href="${item.zip}" download>Download SCORM 1.2 package (.zip)</a>
    </div>
    <iframe id="activity-frame" class="activity-frame" title="${item.title}" src="${item.src}" loading="lazy"></iframe>
    <div class="lesson-nav">
      ${prev ? `<button class="btn btn-outline" id="btn-prev">← Back</button>` : `<span></span>`}
      <span class="spacer"></span>
      ${next ? `<button class="btn btn-primary" id="btn-next">Continue →</button>` : ''}
    </div>
  `;

  const frame = document.getElementById('activity-frame');
  function fit() {
    try {
      const doc = frame.contentDocument;
      if (doc && doc.documentElement) frame.style.height = Math.max(520, doc.documentElement.scrollHeight + 4) + 'px';
    } catch (e) { /* cross-origin: keep default height */ }
  }
  frame.addEventListener('load', () => {
    fit();
    try {
      const doc = frame.contentDocument;
      if (window.ResizeObserver && doc && doc.body) new ResizeObserver(fit).observe(doc.body);
    } catch (e) { /* ignore */ }
  });

  if (prev) document.getElementById('btn-prev').addEventListener('click', () => navigateTo(prev.id));
  if (next) document.getElementById('btn-next').addEventListener('click', () => navigateTo(next.id));
}

function renderQuiz(item) {
  const main = document.getElementById('main');
  const next = nextItem(item.id);
  const prev = prevItem(item.id);
  const answers = new Array(item.questions.length).fill(null);

  main.innerHTML = `
    <div class="lesson-eyebrow">${item.moduleTitle}</div>
    <h1 class="lesson-title">${item.title}</h1>
    <div id="quiz-questions"></div>
    <div class="lesson-nav">
      ${prev ? `<button class="btn btn-outline" id="btn-prev">← Back</button>` : `<span></span>`}
      <span class="spacer"></span>
      <button class="btn btn-primary" id="btn-check">Check Answers</button>
    </div>
  `;

  const qWrap = document.getElementById('quiz-questions');
  item.questions.forEach((q, qi) => {
    const qEl = document.createElement('div');
    qEl.className = 'quiz-q';
    qEl.innerHTML = `<p class="q-text">${qi + 1}. ${q.q}</p>`;
    q.options.forEach((opt, oi) => {
      const optEl = document.createElement('div');
      optEl.className = 'quiz-opt';
      optEl.textContent = opt;
      optEl.addEventListener('click', () => {
        if (qEl.dataset.locked) return;
        qEl.querySelectorAll('.quiz-opt').forEach(el => el.classList.remove('selected'));
        optEl.classList.add('selected');
        answers[qi] = oi;
      });
      qEl.appendChild(optEl);
    });
    const feedback = document.createElement('div');
    feedback.className = 'quiz-feedback';
    feedback.style.display = 'none';
    qEl.appendChild(feedback);
    qWrap.appendChild(qEl);
  });

  if (prev) document.getElementById('btn-prev').addEventListener('click', () => navigateTo(prev.id));

  document.getElementById('btn-check').addEventListener('click', () => {
    const qEls = qWrap.querySelectorAll('.quiz-q');
    qEls.forEach((qEl, qi) => {
      qEl.dataset.locked = 'true';
      const opts = qEl.querySelectorAll('.quiz-opt');
      const correctIdx = item.questions[qi].correct;
      const chosenIdx = answers[qi];
      opts.forEach((el, oi) => {
        if (oi === correctIdx) el.classList.add('correct');
        else if (oi === chosenIdx) el.classList.add('incorrect');
      });
      const fb = qEl.querySelector('.quiz-feedback');
      fb.style.display = 'block';
      if (chosenIdx === correctIdx) {
        fb.textContent = '✓ Correct!';
        fb.classList.add('correct');
      } else if (chosenIdx === null) {
        fb.textContent = 'No answer selected — correct answer highlighted above.';
        fb.classList.add('incorrect');
      } else {
        fb.textContent = 'Not quite — correct answer highlighted above.';
        fb.classList.add('incorrect');
      }
    });

    markComplete(item.id);
    renderProgressBar();
    renderSidebar(item.id);

    const btn = document.getElementById('btn-check');
    btn.textContent = next ? 'Continue →' : 'Finish Course →';
    btn.onclick = null;
    btn.addEventListener('click', () => {
      if (next) navigateTo(next.id);
      else navigateTo('certificate');
    });
  });
}

function renderCertificate() {
  const main = document.getElementById('main');
  const savedName = localStorage.getItem(NAME_KEY) || '';
  main.innerHTML = `
    <div class="certificate">
      <div class="medal">🏅</div>
      <h2>Course Complete!</h2>
      <p>Enter your name to generate your certificate of completion.</p>
      <input type="text" id="cert-name" placeholder="Your name" value="${savedName}"
        style="width:100%;max-width:320px;padding:12px 16px;border:1.5px solid var(--border);border-radius:8px;font-size:.9375rem;margin-bottom:20px;" />
      <div>
        <button class="btn btn-primary" id="btn-print">Save / Print Certificate</button>
      </div>
    </div>
  `;
  const input = document.getElementById('cert-name');
  input.addEventListener('input', () => localStorage.setItem(NAME_KEY, input.value));
  document.getElementById('btn-print').addEventListener('click', () => window.print());
}

function render() {
  const activeId = currentItemId();

  if (activeId === 'certificate' || getParam('item') === 'certificate') {
    renderSidebar('certificate');
    renderProgressBar();
    renderCertificate();
    return;
  }

  const item = ITEMS.find(i => i.id === activeId) || ITEMS[0];
  renderSidebar(item.id);
  renderProgressBar();

  activeActivityId = null;
  if (item.type === 'quiz') renderQuiz(item);
  else if (item.type === 'activity') renderActivity(item);
  else if (item.type === 'material') renderMaterial(item);
  else renderLesson(item);
}

window.addEventListener('popstate', render);
render();
