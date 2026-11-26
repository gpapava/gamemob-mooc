(function () {
  'use strict';

  var BUDGET = 20.0;
  var BASELINE_PEOPLE = 4800;
  var BASELINE_CAR_SHARE = 0.8;

  var TYPES = {
    walk:  { label: 'Pavement',       w: 2.0, cls: 't-walk' },
    plaza: { label: 'Wide pavement',  w: 3.5, cls: 't-plaza' },
    tree:  { label: 'Planter',        w: 1.5, cls: 't-tree' },
    bike:  { label: 'Bike lane',      w: 2.0, cls: 't-bike', cap: 7500, mode: 'bike' },
    park:  { label: 'Parking',        w: 2.0, cls: 't-park' },
    car:   { label: 'Car lane',       w: 3.0, cls: 't-car',  cap: 1200, mode: 'car' },
    bus:   { label: 'Bus lane',       w: 3.0, cls: 't-bus',  cap: 6000, mode: 'bus' }
  };
  var ORDER = ['walk', 'plaza', 'tree', 'bike', 'park', 'car', 'bus'];
  var START = ['walk', 'park', 'car', 'car', 'car', 'car', 'park', 'walk'];

  var strips = START.slice();
  var sel = -1;
  var finished = false;

  /* ---------- model ---------- */
  function analyse(list) {
    var width = 0, cap = { car: 0, bus: 0, bike: 0 }, carWidth = 0, exposed = 0, bikes = 0;
    list.forEach(function (t, i) {
      var d = TYPES[t];
      width += d.w;
      if (d.mode) cap[d.mode] += d.cap;
      if (t === 'car' || t === 'park') carWidth += d.w;
      if (t === 'bike') {
        bikes++;
        var l = list[i - 1], r = list[i + 1];
        if (l === 'car' || l === 'bus' || r === 'car' || r === 'bus') exposed++;
      }
    });
    width = Math.round(width * 10) / 10;
    var people = cap.car + cap.bus + cap.bike;
    var edgeOk = list.length >= 2 && (list[0] === 'walk' || list[0] === 'plaza') &&
                 (list[list.length - 1] === 'walk' || list[list.length - 1] === 'plaza');
    return {
      width: width, fits: width <= BUDGET + 1e-9, cap: cap, people: people,
      carShare: carWidth / BUDGET, bikes: bikes, exposed: exposed, edgeOk: edgeOk,
      buses: list.filter(function (t) { return t === 'bus'; }).length,
      trees: list.filter(function (t) { return t === 'tree'; }).length,
      plaza: list.filter(function (t) { return t === 'plaza'; }).length
    };
  }

  function goals(a) {
    return [
      { text: 'Pavement on both edges, one of them wide (3.5 m) for the school gate', ok: a.edgeOk && a.plaza >= 1 },
      { text: 'At least one bike lane, and no bike lane touching a moving traffic lane', ok: a.bikes >= 1 && a.exposed === 0 },
      { text: 'A bus lane', ok: a.buses >= 1 },
      { text: 'At least one planter for shade', ok: a.trees >= 1 },
      { text: 'Moves at least 6,000 people an hour, and everything fits in 20 m', ok: a.fits && a.people >= 6000 }
    ];
  }

  /* ---------- rendering ---------- */
  var elXs = document.getElementById('xs');
  var elWidth = document.getElementById('width-line');
  var elSelTitle = document.getElementById('sel-title');
  var elSel = document.getElementById('sel-controls');
  var elAdd = document.getElementById('add-controls');

  function fmt(n) { return n.toLocaleString('en-GB'); }

  function renderXs(a) {
    elXs.innerHTML = '';
    elXs.classList.toggle('over', !a.fits);
    strips.forEach(function (t, i) {
      var d = TYPES[t];
      var el = document.createElement('div');
      el.className = 'strip ' + d.cls + (i === sel ? ' sel' : '') + (d.w < 2.5 ? ' narrow' : '');
      el.style.flex = '0 0 ' + (d.w / Math.max(BUDGET, a.width) * 100) + '%';
      el.setAttribute('role', 'listitem');
      el.tabIndex = 0;
      el.setAttribute('aria-label', d.label + ', ' + d.w + ' metres' + (i === sel ? ', selected' : ''));
      el.innerHTML = '<span class="lab">' + d.label + (d.w < 2.5 ? ' · ' : '<br>') + d.w + ' m</span>';
      el.addEventListener('click', function () { select(i); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); }
      });
      elXs.appendChild(el);
    });
    if (a.width < BUDGET) {
      var free = document.createElement('div');
      free.className = 'strip t-free';
      free.innerHTML = '<span class="lab">' + (BUDGET - a.width).toFixed(1) + ' m unused</span>';
      elXs.appendChild(free);
    }
    if (a.fits) {
      elWidth.textContent = a.width.toFixed(1) + ' m of 20.0 m used.';
      elWidth.style.color = '';
    } else {
      elWidth.textContent = 'Does not fit: ' + (a.width - BUDGET).toFixed(1) + ' m too wide. Remove or narrow something.';
      elWidth.style.color = 'var(--red)';
    }
  }

  function renderControls() {
    elSel.innerHTML = '';
    if (sel < 0 || sel >= strips.length) {
      elSelTitle.textContent = 'Select a strip to change it';
      return;
    }
    elSelTitle.textContent = 'Strip ' + (sel + 1) + ' of ' + strips.length + ': ' + TYPES[strips[sel]].label;
    ORDER.forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'type' + (strips[sel] === t ? ' on' : '');
      b.textContent = TYPES[t].label;
      b.addEventListener('click', function () { strips[sel] = t; update(); });
      elSel.appendChild(b);
    });
    elSel.appendChild(document.createElement('br'));
    [['← Move left', -1], ['Move right →', 1]].forEach(function (p) {
      var b = document.createElement('button');
      b.textContent = p[0];
      var j = sel + p[1];
      b.disabled = j < 0 || j >= strips.length;
      b.addEventListener('click', function () {
        var tmp = strips[sel]; strips[sel] = strips[j]; strips[j] = tmp; sel = j; update();
      });
      elSel.appendChild(b);
    });
    var rm = document.createElement('button');
    rm.textContent = 'Remove strip';
    rm.disabled = strips.length <= 2;
    rm.addEventListener('click', function () { strips.splice(sel, 1); sel = -1; update(); });
    elSel.appendChild(rm);
  }

  function renderAdd() {
    elAdd.innerHTML = '';
    ORDER.forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'type';
      b.textContent = '+ ' + TYPES[t].label + ' (' + TYPES[t].w + ' m)';
      b.addEventListener('click', function () { strips.push(t); sel = strips.length - 1; update(); });
      elAdd.appendChild(b);
    });
    var reset = document.createElement('button');
    reset.textContent = 'Start again';
    reset.style.marginLeft = '10px';
    reset.addEventListener('click', function () { strips = START.slice(); sel = -1; update(); });
    elAdd.appendChild(reset);
  }

  function renderResults(a) {
    var SCALE = 16000;
    var bar = document.getElementById('bar');
    bar.innerHTML = '';
    var colours = { car: 'var(--road)', bus: '#b5463a', bike: 'var(--green)' };
    ['car', 'bus', 'bike'].forEach(function (m) {
      var s = document.createElement('span');
      s.style.width = (a.cap[m] / SCALE * 100) + '%';
      s.style.background = colours[m];
      bar.appendChild(s);
    });
    var mark = document.createElement('div');
    mark.className = 'mark';
    mark.style.left = (BASELINE_PEOPLE / SCALE * 100) + '%';
    bar.appendChild(mark);
    var total = document.getElementById('total');
    total.textContent = fmt(a.people);
    total.style.opacity = a.fits ? 1 : .35;
  }

  function renderGoals(a) {
    var ul = document.getElementById('goals');
    ul.innerHTML = '';
    var gs = goals(a);
    gs.forEach(function (g) {
      var li = document.createElement('li');
      if (g.ok) li.className = 'met';
      li.innerHTML = '<span class="mark">' + (g.ok ? '✓' : '') + '</span><span>' + g.text + '</span>';
      ul.appendChild(li);
    });
    return gs.every(function (g) { return g.ok; });
  }

  function renderWarnings(a) {
    var msgs = [];
    if (a.exposed > 0) msgs.push('A bike lane next to a moving lane has no protection. Put parking, a planter or a pavement on the traffic side of it.');
    if (!a.edgeOk) msgs.push('A street needs somewhere to walk on both edges.');
    var panel = document.getElementById('warn-panel');
    panel.style.display = msgs.length ? '' : 'none';
    document.getElementById('warn').innerHTML = msgs.map(function (m) { return '<p class="note warn">' + m + '</p>'; }).join('');
  }

  function renderDone(a, all) {
    var done = document.getElementById('done');
    if (!all) { done.classList.remove('show'); return; }
    done.classList.add('show');
    var share = Math.round(a.carShare * 100);
    document.getElementById('done-text').textContent =
      'Your street moves ' + fmt(a.people) + ' people an hour, against 4,800 before, and gives ' + share +
      '% of its width to cars and parking (it was ' + Math.round(BASELINE_CAR_SHARE * 100) + '%). ' +
      'Nobody was banned from driving. The space was just handed to the modes that carry more people per metre.';
    if (!finished) {
      finished = true;
      SCORM.complete('passed', 100);
    }
  }

  function select(i) { sel = (sel === i) ? -1 : i; renderControls(); renderXs(analyse(strips)); }

  function update() {
    if (sel >= strips.length) sel = -1;
    var a = analyse(strips);
    renderXs(a);
    renderControls();
    renderAdd();
    renderResults(a);
    renderWarnings(a);
    var all = renderGoals(a);
    renderDone(a, all);
    SCORM.setState({ s: strips, f: finished ? 1 : 0 });
  }

  /* ---------- start ---------- */
  var saved = SCORM.init();
  if (saved && Array.isArray(saved.s) && saved.s.every(function (t) { return TYPES[t]; }) && saved.s.length >= 2) {
    strips = saved.s;
    finished = !!saved.f;
  }
  update();

  if (typeof module !== 'undefined') module.exports = { analyse: analyse, goals: goals, START: START };
})();
