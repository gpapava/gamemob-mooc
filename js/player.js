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

// Build a flat, ordered list of items: lesson, lesson, ..., quiz, per module.
function buildItems() {
  const items = [];
  COURSE.modules.forEach(m => {
    m.lessons.forEach(l => items.push({ type: 'lesson', moduleId: m.id, moduleTitle: m.title, ...l }));
    items.push({ type: 'quiz', moduleId: m.id, moduleTitle: m.title, ...m.quiz });
  });
  return items;
}

const ITEMS = buildItems();
let progress = loadProgress();

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
      row.innerHTML = `<span class="dot">${progress[item.id] ? '✓' : ''}</span><span>${item.type === 'quiz' ? '📝 ' : ''}${item.title}</span>`;
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

  if (item.type === 'quiz') renderQuiz(item);
  else renderLesson(item);
}

window.addEventListener('popstate', render);
render();
