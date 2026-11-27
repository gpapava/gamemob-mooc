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

// Build a flat, ordered list of items per module: lessons, case study (where there is one), interactive activity, study page, worksheet, quiz, teacher guide.

function buildItems() {
  const items = [{ type: 'intro', ...COURSE.overview }];
  COURSE.modules.forEach(m => {
    m.lessons.forEach(l => items.push({ type: 'lesson', moduleId: m.id, moduleTitle: m.title, ...l }));
    if (m.caseStudy) items.push({ type: 'case', moduleId: m.id, moduleTitle: m.title, ...m.caseStudy });
    if (m.activity) items.push({ type: 'activity', moduleId: m.id, moduleTitle: m.title, ...m.activity });
    if (m.material) items.push({ type: 'material', moduleId: m.id, moduleTitle: m.title, ...m.material });
    if (m.worksheet) items.push({ type: 'worksheet', moduleId: m.id, moduleTitle: m.title, ...m.worksheet });
    items.push({ type: 'quiz', moduleId: m.id, moduleTitle: m.title, ...m.quiz });
    if (m.teacher) items.push({ type: 'teacher', moduleId: m.id, moduleTitle: m.title, ...m.teacher });
  });
  return items;
}

const ITEMS = buildItems();
// The overview is an introduction, so it does not count towards progress.
const COURSE_ITEMS = ITEMS.filter(i => i.type !== 'intro');
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
        if (flag) { flag.textContent = t('completed') + ' \u2713'; flag.classList.add('done'); }
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

  // New learners start at the course overview; returning learners resume.
  if (!COURSE_ITEMS.some(i => progress[i.id])) return COURSE.overview.id;

  const firstIncomplete = COURSE_ITEMS.find(i => !progress[i.id]);
  return firstIncomplete ? firstIncomplete.id : ITEMS[ITEMS.length - 1].id;
}

function pctComplete() {
  const done = COURSE_ITEMS.filter(i => progress[i.id]).length;
  return Math.round((done / COURSE_ITEMS.length) * 100);
}

function renderProgressBar() {
  const pct = pctComplete();
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = t('pct_complete', { pct });
}

function renderSidebar(activeId) {
  const wrap = document.getElementById('sidebar-modules');
  wrap.innerHTML = '';

  const intro = COURSE.overview;
  const introRow = document.createElement('a');
  introRow.href = `learn.html?item=${intro.id}`;
  introRow.className = 'sb-intro' + (activeId === intro.id ? ' active' : '');
  introRow.textContent = intro.title;
  introRow.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(intro.id);
  });
  wrap.appendChild(introRow);

  COURSE.modules.forEach(m => {
    const moduleItems = ITEMS.filter(i => i.moduleId === m.id);
    const isOpenModule = moduleItems.some(i => i.id === activeId);

    const modEl = document.createElement('div');
    modEl.className = 'sb-module' + (isOpenModule ? ' open' : '');

    const head = document.createElement('div');
    head.className = 'sb-module-head';
    head.innerHTML = `<span>${m.title}</span><span class="chev" aria-hidden="true"></span>`;
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
      row.innerHTML = `<span class="dot">${progress[item.id] ? '✓' : ''}</span><span class="sb-title">${item.title}<span class="sb-type">${t('type_' + item.type)}</span></span>`;
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
  trackCompletion(itemId);
}

/* ---- Anonymous statistics ----
   A module counts as completed when everything meant for learners is done; the teacher guide is not. */
function moduleDone(moduleId) {
  return ITEMS.filter(i => i.moduleId === moduleId && i.type !== 'teacher').every(i => progress[i.id]);
}

function trackCompletion(itemId) {
  const item = ITEMS.find(i => i.id === itemId);
  if (!item || !item.moduleId || item.type === 'teacher') return;
  Analytics.once('course-started');
  if (moduleDone(item.moduleId)) Analytics.once(`module-completed/${item.moduleId}`);
  if (COURSE.modules.every(m => moduleDone(m.id))) Analytics.once('course-completed');
}

let lastViewed = null;
function trackView(itemId) {
  if (itemId === lastViewed) return;
  lastViewed = itemId;
  Analytics.view(`learn/${itemId}`);
}

function nextItem(itemId) {
  const idx = ITEMS.findIndex(i => i.id === itemId);
  return ITEMS[idx + 1] || null;
}
function prevItem(itemId) {
  const idx = ITEMS.findIndex(i => i.id === itemId);
  return idx > 0 ? ITEMS[idx - 1] : null;
}

function renderIntro(item) {
  const main = document.getElementById('main');
  const next = nextItem(item.id);

  main.innerHTML = `
    <div class="lesson-eyebrow">${COURSE.title}</div>
    <h1 class="lesson-title">${item.title}</h1>
    <div class="lesson-body intro-body">${item.body}</div>
    <div class="lesson-nav">
      <span class="spacer"></span>
      <button class="btn btn-primary" id="btn-start">${t('start_module1')}</button>
    </div>
  `;

  document.getElementById('btn-start').addEventListener('click', () => navigateTo(next.id));
}

function renderLesson(item) {
  const main = document.getElementById('main');
  const next = nextItem(item.id);
  const prev = prevItem(item.id);

  main.innerHTML = `
    <div class="lesson-eyebrow">${item.moduleTitle}</div>
    <h1 class="lesson-title">${item.title}</h1>
    ${item.type === 'case' ? '' : `<div class="lesson-video">${t('video_pending')}</div>`}
    <div class="lesson-body${item.type === 'case' ? ' case-body' : ''}">${item.body}</div>
    <div class="lesson-nav">
      ${prev ? `<button class="btn btn-outline" id="btn-prev">${t('back')}</button>` : `<span></span>`}
      <span class="spacer"></span>
      <button class="btn btn-primary" id="btn-complete">
        ${next ? t('complete_continue') : t('complete')}
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

/* ---- Beta feedback ---- */
function feedbackLink(moduleId) {
  // The form lists modules by their English titles, whatever language the course is shown in.
  return (COURSE.feedbackUrl || '').replace('{module}', encodeURIComponent(MODULE_TITLES_EN[moduleId] || ''));
}

function renderBannerFeedback(moduleId) {
  const link = document.getElementById('banner-feedback');
  if (!COURSE.feedbackUrl) return;
  link.href = feedbackLink(moduleId);
  link.hidden = false;
}

/* Shown where a module ends: after the quiz for learners, on the teacher guide for teachers. */
function addModuleFeedback(item) {
  if (!COURSE.feedbackUrl) return;
  const box = document.createElement('div');
  box.className = 'module-feedback';
  box.innerHTML = `
    <p><strong>${t('fb_question')}</strong> ${t('fb_note')}</p>
    <a class="btn" target="_blank" rel="noopener">${t('fb_button')}</a>
  `;
  box.querySelector('a').href = feedbackLink(item.moduleId);
  const nav = document.querySelector('#main .lesson-nav');
  nav.parentNode.insertBefore(box, nav);
}

/* Tell an embedded page it is inside the player, so it can drop repeated chrome.
   Pages opened on their own or from an LMS package are left as they are. */
function markEmbedded(frame, ...classes) {
  try { frame.contentDocument.documentElement.classList.add(...classes); }
  catch (e) { /* cross-origin: leave the page unchanged */ }
}

/* Activities and printable pages are not translated yet. */
function englishOnlyNote() {
  return LANG === 'en' ? '' : `<p class="lang-note">${t('english_only')}</p>`;
}

function renderMaterial(item) {
  const main = document.getElementById('main');
  const next = nextItem(item.id);
  const prev = prevItem(item.id);

  main.innerHTML = `
    <div class="lesson-eyebrow">${item.moduleTitle}, ${t('type_' + item.type).toLowerCase()}</div>
    ${englishOnlyNote()}
    <div class="activity-bar">
      <span class="activity-status${progress[item.id] ? ' done' : ''}">${progress[item.id] ? t('completed') + ' \u2713' : t('hint_' + item.type)}</span>
      <a class="activity-dl" href="${item.src}" target="_blank" rel="noopener">${t('open_print')}</a>
    </div>
    <iframe id="material-frame" class="activity-frame material-frame" lang="en" title="${item.title}" src="${item.src}"></iframe>
    <div class="lesson-nav">
      ${prev ? `<button class="btn btn-outline" id="btn-prev">${t('back')}</button>` : `<span></span>`}
      <span class="spacer"></span>
      <button class="btn btn-primary" id="btn-complete">${next ? t('complete_continue') : t('complete')}</button>
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
    markEmbedded(frame, 'in-course');
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
    ${englishOnlyNote()}
    <div class="activity-bar">
      <span id="activity-status" class="activity-status${progress[item.id] ? ' done' : ''}">${progress[item.id] ? t('completed') + ' \u2713' : t('not_completed')}</span>
      <a class="activity-dl" href="${item.zip}" download>${t('download_scorm')}</a>
    </div>
    <iframe id="activity-frame" class="activity-frame" title="${item.title}" src="${item.src}" loading="lazy"></iframe>
    <div class="lesson-nav">
      ${prev ? `<button class="btn btn-outline" id="btn-prev">${t('back')}</button>` : `<span></span>`}
      <span class="spacer"></span>
      ${next ? `<button class="btn btn-primary" id="btn-next">${t('next')}</button>` : ''}
    </div>
  `;

  main.querySelector('a[download]').addEventListener('click', () => Analytics.event(`download/${item.moduleId}`));

  const frame = document.getElementById('activity-frame');
  function fit() {
    try {
      const doc = frame.contentDocument;
      if (doc && doc.documentElement) frame.style.height = Math.max(520, doc.documentElement.scrollHeight + 4) + 'px';
    } catch (e) { /* cross-origin: keep default height */ }
  }
  frame.addEventListener('load', () => {
    markEmbedded(frame, 'in-course', 'in-activity');
    fit();
    try {
      const doc = frame.contentDocument;
      if (window.ResizeObserver && doc && doc.body) new ResizeObserver(fit).observe(doc.body);
    } catch (e) { /* ignore */ }
  });

  if (prev) document.getElementById('btn-prev').addEventListener('click', () => navigateTo(prev.id));
  if (next) document.getElementById('btn-next').addEventListener('click', () => navigateTo(next.id));
}

/* Correct answers needed, out of the six in each module quiz, to complete it. */
const QUIZ_PASS = 4;

function renderQuiz(item) {
  const main = document.getElementById('main');
  const next = nextItem(item.id);
  const prev = prevItem(item.id);
  const total = item.questions.length;
  const needed = Math.min(QUIZ_PASS, total);
  const answers = new Array(total).fill(null);
  const shuffled = (n) => {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  main.innerHTML = `
    <div class="lesson-eyebrow">${item.moduleTitle}</div>
    <h1 class="lesson-title">${item.title}</h1>
    <p class="quiz-rules">${progress[item.id] ? `<strong>${t('completed')} \u2713</strong> ` : ''}${t('q_rules', { n: total, min: needed })}</p>
    <div id="quiz-questions"></div>
    <div id="quiz-result" class="quiz-result" role="status" hidden></div>
    <div class="lesson-nav">
      ${prev ? `<button class="btn btn-outline" id="btn-prev">${t('back')}</button>` : `<span></span>`}
      <span class="spacer"></span>
      <button class="btn btn-primary" id="btn-check">${t('check')}</button>
    </div>
  `;

  const qWrap = document.getElementById('quiz-questions');
  const result = document.getElementById('quiz-result');
  function showResult(kind, message) {
    result.className = 'quiz-result ' + kind;
    result.textContent = message;
    result.hidden = false;
  }

  item.questions.forEach((q, qi) => {
    const qEl = document.createElement('div');
    qEl.className = 'quiz-q';
    qEl.setAttribute('role', 'radiogroup');
    qEl.setAttribute('aria-labelledby', `q-${qi}`);
    qEl.innerHTML = `<p class="q-text" id="q-${qi}">${qi + 1}. ${q.q}</p>`;
    shuffled(q.options.length).forEach((oi) => {
      const optEl = document.createElement('div');
      optEl.className = 'quiz-opt';
      optEl.dataset.idx = oi;
      optEl.textContent = q.options[oi];
      optEl.setAttribute('role', 'radio');
      optEl.setAttribute('aria-checked', 'false');
      optEl.tabIndex = 0;
      const choose = () => {
        if (qEl.dataset.locked) return;
        qEl.querySelectorAll('.quiz-opt').forEach(el => { el.classList.remove('selected'); el.setAttribute('aria-checked', 'false'); });
        optEl.classList.add('selected');
        optEl.setAttribute('aria-checked', 'true');
        answers[qi] = oi;
        qEl.classList.remove('unanswered');
      };
      optEl.addEventListener('click', choose);
      optEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
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

  const btn = document.getElementById('btn-check');
  let checked = false;
  let passed = false;
  btn.addEventListener('click', () => {
    if (checked) {
      if (!passed) { renderQuiz(item); window.scrollTo(0, 0); }
      else if (next) navigateTo(next.id);
      else navigateTo('certificate');
      return;
    }

    const qEls = qWrap.querySelectorAll('.quiz-q');
    const missing = answers.map((a, i) => (a === null ? i : -1)).filter(i => i >= 0);
    if (missing.length) {
      missing.forEach(i => qEls[i].classList.add('unanswered'));
      showResult('warn', t('q_unanswered', { list: missing.map(i => i + 1).join(', ') }));
      qEls[missing[0]].scrollIntoView({ block: 'center' });
      return;
    }

    checked = true;
    const score = item.questions.filter((q, i) => answers[i] === q.correct).length;
    passed = score >= needed;
    qEls.forEach((qEl, qi) => {
      qEl.dataset.locked = 'true';
      const q = item.questions[qi];
      const right = answers[qi] === q.correct;
      qEl.querySelectorAll('.quiz-opt').forEach((el) => {
        const oi = +el.dataset.idx;
        el.tabIndex = -1;
        // below the pass mark the right answers stay hidden, so another attempt still means something
        if (oi === q.correct && (passed || right)) el.classList.add('correct');
        else if (oi === answers[qi] && !right) el.classList.add('incorrect');
      });
      const fb = qEl.querySelector('.quiz-feedback');
      fb.style.display = 'block';
      fb.classList.add(right ? 'correct' : 'incorrect');
      if (right) fb.textContent = t('q_correct') + ' ' + (q.explain || '');
      else fb.textContent = passed ? t('q_wrong') + ' ' + (q.explain || '') : t('q_wrong_retry');
    });

    // statistics keep the first full attempt on this device, passed or not
    Analytics.once(`quiz-score/${item.moduleId}/${score}-of-${total}`, `quiz/${item.moduleId}`);

    if (passed) {
      showResult('pass', t('q_passed', { score, n: total }));
      markComplete(item.id);
      renderProgressBar();
      renderSidebar(item.id);
      addModuleFeedback(item);
      btn.textContent = next ? t('next') : t('finish');
    } else {
      showResult('fail', t('q_failed', { score, n: total, min: needed }));
      btn.textContent = t('q_retry');
    }
    result.scrollIntoView({ block: 'nearest' });
  });
}

function renderCertificate() {
  const main = document.getElementById('main');
  const savedName = localStorage.getItem(NAME_KEY) || '';
  main.innerHTML = `
    <div class="certificate">
      <h2>${t('cert_title')}</h2>
      <p>${t('cert_text')}</p>
      <input type="text" id="cert-name" placeholder="${t('cert_name')}" value="${savedName}"
        style="width:100%;max-width:320px;padding:12px 16px;border:1px solid var(--border);border-radius:4px;font-size:.9375rem;margin-bottom:20px;" />
      <div>
        <button class="btn btn-primary" id="btn-print">${t('cert_print')}</button>
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
    trackView('certificate');
    renderBannerFeedback();
    return;
  }

  const item = ITEMS.find(i => i.id === activeId) || ITEMS[0];
  renderSidebar(item.id);
  renderProgressBar();

  activeActivityId = null;
  if (item.type === 'intro') renderIntro(item);
  else if (item.type === 'quiz') renderQuiz(item);
  else if (item.type === 'activity') renderActivity(item);
  else if (item.type === 'material' || item.type === 'worksheet' || item.type === 'teacher') renderMaterial(item);
  else renderLesson(item);

  if (item.type === 'teacher') addModuleFeedback(item);
  renderBannerFeedback(item.moduleId);
  trackView(item.id);
}

window.addEventListener('popstate', render);
render();
