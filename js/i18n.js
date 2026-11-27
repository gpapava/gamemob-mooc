/* Languages for the course shell (home page and player).
   To add a language: add it to LANGS, add its strings to UI, and add js/course-xx.js.
   Course content is translated in the course-xx.js files; anything missing falls back to English. */
const LANGS = {
  en: { short: 'EN', name: 'English', html: 'en' },
  el: { short: 'ΕΛ', name: 'Ελληνικά', html: 'el' },
  sr: { short: 'SR', name: 'Srpski', html: 'sr-Latn' }
};
const LANG_KEY = 'gamemob-lang';

const UI = {
  en: {
    home_page_title: 'GAMEMOB Online Course – Free MOOC on Sustainable Urban Mobility',
    home_page_desc: 'A free, self-paced online course on sustainable urban mobility and road safety for students aged 12–19, developed by the EU-funded GAMEMOB project.',
    learn_page_title: 'Learn – GAMEMOB Online Course',
    logo_sub: 'Online course',
    course_home: 'Course home',
    language: 'Language',
    lead: 'A free online course on sustainable urban mobility and road safety for students aged 12–19, from the EU-funded GAMEMOB project.',
    start_course: 'Start the course',
    modules_heading: 'Course modules',
    details_heading: 'Course details',
    d_length: 'Length', d_length_v: '5 modules, about 10–12 hours',
    d_pace: 'Pace', d_pace_v: 'At your own pace',
    d_cost: 'Cost', d_cost_v: 'Free, no sign-up',
    d_lang: 'Languages', d_lang_v: 'English, Greek, Serbian',
    d_progress: 'Progress', d_progress_v: 'Saved on this device',
    d_cert: 'Certificate', d_cert_v: 'After all five modules',
    about_link: 'About this course',
    footer: 'Part of the <a href="https://www.gamemob.eu">GAMEMOB</a> project, co-funded by EIT Urban Mobility and the European Union.',
    module_n: 'Module {n}: {title}',
    lessons_list: 'Lessons: {list}',
    interactive_suffix: '{title} (interactive)',
    banner: 'Beta version: the course is still being developed, and some lesson content is placeholder.',
    banner_link: 'Send us your feedback',
    english_only: '',
    pct_complete: '{pct}% complete',
    type_lesson: 'Lesson', type_material: 'Study page', type_worksheet: 'Worksheet', type_activity: 'Interactive', type_quiz: 'Quiz', type_teacher: 'Teacher guide',
    start_module1: 'Start Module 1',
    video_pending: 'Video to be added',
    back: 'Back',
    next: 'Continue',
    complete_continue: 'Mark complete and continue',
    complete: 'Mark complete',
    completed: 'Completed',
    not_completed: 'Not completed yet',
    open_print: 'Open in a new tab / print',
    download_scorm: 'Download SCORM 1.2 package (.zip)',
    hint_material: 'Read the page, then continue',
    hint_worksheet: 'Print it or work from the screen, then continue',
    hint_teacher: 'For teachers. Mark it complete when you have read it',
    check: 'Check answers',
    finish: 'Finish course',
    q_correct: 'Correct.',
    q_none: 'No answer selected. The correct one is highlighted above.',
    q_wrong: 'Not quite. The correct answer is highlighted above.',
    fb_question: 'How was this module?',
    fb_note: 'The feedback form is short and anonymous.',
    fb_button: 'Give feedback',
    cert_title: 'Course complete',
    cert_text: 'Enter your name to generate your certificate of completion.',
    cert_name: 'Your name',
    cert_print: 'Save or print certificate'
  },
  el: {
    home_page_title: 'Διαδικτυακό μάθημα GAMEMOB – Δωρεάν MOOC για τη βιώσιμη αστική κινητικότητα',
    home_page_desc: 'Δωρεάν διαδικτυακό μάθημα, με τον δικό σας ρυθμό, για τη βιώσιμη αστική κινητικότητα και την οδική ασφάλεια, για μαθητές και μαθήτριες 12–19 ετών, από το ευρωπαϊκό έργο GAMEMOB.',
    learn_page_title: 'Μάθημα – Διαδικτυακό μάθημα GAMEMOB',
    logo_sub: 'Διαδικτυακό μάθημα',
    course_home: 'Αρχική μαθήματος',
    language: 'Γλώσσα',
    lead: 'Δωρεάν διαδικτυακό μάθημα για τη βιώσιμη αστική κινητικότητα και την οδική ασφάλεια, για μαθητές και μαθήτριες 12–19 ετών, από το ευρωπαϊκό έργο GAMEMOB.',
    start_course: 'Ξεκινήστε το μάθημα',
    modules_heading: 'Ενότητες του μαθήματος',
    details_heading: 'Πληροφορίες μαθήματος',
    d_length: 'Διάρκεια', d_length_v: '5 ενότητες, περίπου 10–12 ώρες',
    d_pace: 'Ρυθμός', d_pace_v: 'Με τον δικό σας ρυθμό',
    d_cost: 'Κόστος', d_cost_v: 'Δωρεάν, χωρίς εγγραφή',
    d_lang: 'Γλώσσες', d_lang_v: 'Αγγλικά, ελληνικά, σερβικά',
    d_progress: 'Πρόοδος', d_progress_v: 'Αποθηκεύεται σε αυτή τη συσκευή',
    d_cert: 'Βεβαίωση', d_cert_v: 'Μετά και τις πέντε ενότητες',
    about_link: 'Σχετικά με το μάθημα',
    footer: 'Μέρος του έργου <a href="https://www.gamemob.eu">GAMEMOB</a>, με τη συγχρηματοδότηση του EIT Urban Mobility και της Ευρωπαϊκής Ένωσης.',
    module_n: 'Ενότητα {n}: {title}',
    lessons_list: 'Μαθήματα: {list}',
    interactive_suffix: '{title} (διαδραστική δραστηριότητα)',
    banner: 'Δοκιμαστική έκδοση (beta): το μάθημα βρίσκεται υπό ανάπτυξη και μέρος του περιεχομένου των μαθημάτων είναι προσωρινό.',
    banner_link: 'Στείλτε μας τα σχόλιά σας',
    english_only: 'Αυτό το υλικό είναι προς το παρόν διαθέσιμο μόνο στα αγγλικά.',
    pct_complete: 'Ολοκληρώθηκε το {pct}%',
    type_lesson: 'Μάθημα', type_material: 'Σελίδα μελέτης', type_worksheet: 'Φύλλο εργασίας', type_activity: 'Διαδραστική δραστηριότητα', type_quiz: 'Κουίζ', type_teacher: 'Οδηγός εκπαιδευτικού',
    start_module1: 'Ξεκινήστε την Ενότητα 1',
    video_pending: 'Το βίντεο θα προστεθεί',
    back: 'Πίσω',
    next: 'Συνέχεια',
    complete_continue: 'Ολοκλήρωση και συνέχεια',
    complete: 'Ολοκλήρωση',
    completed: 'Ολοκληρώθηκε',
    not_completed: 'Δεν έχει ολοκληρωθεί ακόμη',
    open_print: 'Άνοιγμα σε νέα καρτέλα / εκτύπωση',
    download_scorm: 'Λήψη πακέτου SCORM 1.2 (.zip)',
    hint_material: 'Διαβάστε τη σελίδα και συνεχίστε',
    hint_worksheet: 'Εκτυπώστε το ή δουλέψτε από την οθόνη και συνεχίστε',
    hint_teacher: 'Για εκπαιδευτικούς. Σημειώστε το ως ολοκληρωμένο αφού το διαβάσετε',
    check: 'Έλεγχος απαντήσεων',
    finish: 'Ολοκλήρωση μαθήματος',
    q_correct: 'Σωστά.',
    q_none: 'Δεν επιλέξατε απάντηση. Η σωστή επισημαίνεται παραπάνω.',
    q_wrong: 'Όχι ακριβώς. Η σωστή απάντηση επισημαίνεται παραπάνω.',
    fb_question: 'Πώς σας φάνηκε η ενότητα;',
    fb_note: 'Η φόρμα σχολίων είναι σύντομη και ανώνυμη.',
    fb_button: 'Πείτε τη γνώμη σας',
    cert_title: 'Ολοκληρώσατε το μάθημα',
    cert_text: 'Γράψτε το όνομά σας για να δημιουργηθεί η βεβαίωση ολοκλήρωσης.',
    cert_name: 'Το όνομά σας',
    cert_print: 'Αποθήκευση ή εκτύπωση βεβαίωσης'
  },
  sr: {
    home_page_title: 'GAMEMOB onlajn kurs – Besplatan MOOC o održivoj urbanoj mobilnosti',
    home_page_desc: 'Besplatan onlajn kurs o održivoj urbanoj mobilnosti i bezbednosti u saobraćaju za učenike uzrasta 12–19 godina, koji se prati sopstvenim tempom, iz projekta GAMEMOB koji finansira EU.',
    learn_page_title: 'Učenje – GAMEMOB onlajn kurs',
    logo_sub: 'Onlajn kurs',
    course_home: 'Početna strana kursa',
    language: 'Jezik',
    lead: 'Besplatan onlajn kurs o održivoj urbanoj mobilnosti i bezbednosti u saobraćaju za učenike uzrasta 12–19 godina, iz projekta GAMEMOB koji finansira EU.',
    start_course: 'Započnite kurs',
    modules_heading: 'Moduli kursa',
    details_heading: 'O kursu ukratko',
    d_length: 'Trajanje', d_length_v: '5 modula, oko 10–12 sati',
    d_pace: 'Tempo', d_pace_v: 'Sopstvenim tempom',
    d_cost: 'Cena', d_cost_v: 'Besplatno, bez registracije',
    d_lang: 'Jezici', d_lang_v: 'Engleski, grčki, srpski',
    d_progress: 'Napredak', d_progress_v: 'Čuva se na ovom uređaju',
    d_cert: 'Potvrda', d_cert_v: 'Nakon svih pet modula',
    about_link: 'O ovom kursu',
    footer: 'Deo projekta <a href="https://www.gamemob.eu">GAMEMOB</a>, koji sufinansiraju EIT Urban Mobility i Evropska unija.',
    module_n: 'Modul {n}: {title}',
    lessons_list: 'Lekcije: {list}',
    interactive_suffix: '{title} (interaktivna aktivnost)',
    banner: 'Beta verzija: kurs je još u izradi i deo sadržaja lekcija je privremen.',
    banner_link: 'Pošaljite nam svoje utiske',
    english_only: 'Ovaj materijal je za sada dostupan samo na engleskom jeziku.',
    pct_complete: 'Završeno: {pct}%',
    type_lesson: 'Lekcija', type_material: 'Stranica za učenje', type_worksheet: 'Radni list', type_activity: 'Interaktivna aktivnost', type_quiz: 'Kviz', type_teacher: 'Vodič za nastavnike',
    start_module1: 'Započnite Modul 1',
    video_pending: 'Video će biti dodat',
    back: 'Nazad',
    next: 'Nastavite',
    complete_continue: 'Označite kao završeno i nastavite',
    complete: 'Označite kao završeno',
    completed: 'Završeno',
    not_completed: 'Još nije završeno',
    open_print: 'Otvorite u novoj kartici / štampajte',
    download_scorm: 'Preuzmite SCORM 1.2 paket (.zip)',
    hint_material: 'Pročitajte stranicu, pa nastavite',
    hint_worksheet: 'Odštampajte ga ili radite sa ekrana, pa nastavite',
    hint_teacher: 'Za nastavnike. Označite kao završeno kada pročitate',
    check: 'Proverite odgovore',
    finish: 'Završite kurs',
    q_correct: 'Tačno.',
    q_none: 'Niste izabrali odgovor. Tačan odgovor je istaknut iznad.',
    q_wrong: 'Nije sasvim tačno. Tačan odgovor je istaknut iznad.',
    fb_question: 'Kakav vam je bio ovaj modul?',
    fb_note: 'Upitnik je kratak i anoniman.',
    fb_button: 'Podelite utiske',
    cert_title: 'Kurs je završen',
    cert_text: 'Unesite svoje ime da biste dobili potvrdu o završenom kursu.',
    cert_name: 'Vaše ime',
    cert_print: 'Sačuvajte ili odštampajte potvrdu'
  }
};

/* ?lang= in the address wins, then the saved choice, then the browser language, then English. */
function pickLang() {
  const known = code => Object.prototype.hasOwnProperty.call(LANGS, code);
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl && known(fromUrl)) { storeLang(fromUrl); return fromUrl; }
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && known(saved)) return saved;
  } catch (e) { /* storage unavailable */ }
  const browser = (navigator.language || '').slice(0, 2).toLowerCase();
  return known(browser) ? browser : 'en';
}
function storeLang(code) {
  try { localStorage.setItem(LANG_KEY, code); } catch (e) { /* storage unavailable */ }
}

const LANG = pickLang();

function t(key, vars) {
  let s = UI[LANG][key] !== undefined ? UI[LANG][key] : UI.en[key];
  Object.keys(vars || {}).forEach(k => { s = s.replace('{' + k + '}', vars[k]); });
  return s;
}

/* English module titles, kept for pre-filling the feedback form in any language. */
const MODULE_TITLES_EN = Object.fromEntries(COURSE.modules.map(m => [m.id, m.title]));

/* Writes the chosen language's text over the English course data. Structure, ids,
   file paths and correct answers always come from the English original. */
function localiseCourse(course, text) {
  if (!text) return;
  const over = (target, source) => {
    if (!target || !source) return;
    Object.keys(source).forEach(k => { if (typeof source[k] === 'string') target[k] = source[k]; });
  };
  over(course, text);
  over(course.overview, text.overview);
  course.modules.forEach(m => {
    const tm = (text.modules || {})[m.id];
    if (!tm) return;
    over(m, tm);
    m.lessons.forEach(l => over(l, (tm.lessons || {})[l.id]));
    ['material', 'activity', 'worksheet', 'teacher', 'quiz'].forEach(k => over(m[k], tm[k]));
    const questions = (tm.quiz || {}).questions || [];
    m.quiz.questions.forEach((q, i) => {
      const tq = questions[i];
      if (!tq || tq.options.length !== q.options.length) return;
      Object.assign(q, { q: tq.q, options: tq.options, explain: tq.explain });
    });
  });
}
localiseCourse(COURSE, (window.COURSE_TEXT || {})[LANG]);

function applyStaticText() {
  document.documentElement.lang = LANGS[LANG].html;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-content]').forEach(el => { el.content = t(el.dataset.i18nContent); });
}

function renderLangSwitch() {
  const wrap = document.getElementById('lang-switch');
  if (!wrap) return;
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', t('language'));
  wrap.innerHTML = '<svg class="lang-globe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/></svg>';
  Object.entries(LANGS).forEach(([code, info]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    // full names where there is room, short codes on narrower screens
    btn.innerHTML = `<span class="lang-full">${info.name}</span><span class="lang-abbr">${info.short}</span>`;
    btn.lang = info.html;
    btn.title = info.name;
    btn.setAttribute('aria-label', info.name);
    btn.setAttribute('aria-pressed', String(code === LANG));
    btn.addEventListener('click', () => {
      if (code === LANG) return;
      storeLang(code);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', code);
      window.location.href = url.href;
    });
    wrap.appendChild(btn);
  });
}

applyStaticText();
renderLangSwitch();
