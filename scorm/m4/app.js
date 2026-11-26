(function () {
  'use strict';

  var MAXD = 15, MAXT = 90;
  var opt = { traffic: 'rush', bus: 10, park: 'ok' };
  var guess = null;
  var tried = {};          // which traffic settings were looked at
  var finished = false;
  var dist = 3;

  var MODES = [
    { id: 'walk', label: 'Walk',  colour: '#7c847e' },
    { id: 'bike', label: 'Bike',  colour: '#2e7a4d' },
    { id: 'bus',  label: 'Bus',   colour: '#b5463a' },
    { id: 'car',  label: 'Car',   colour: '#2c5f8c' }
  ];

  /* ---------- model: returns segments in minutes ---------- */
  function segments(mode, d, o) {
    var rush = o.traffic === 'rush';
    switch (mode) {
      case 'walk': return [['walking', d / 4.8 * 60]];
      case 'bike': return [['riding', d / 14 * 60], ['locking up', o.park === 'ok' ? 1 : 3]];
      case 'bus':  return [['to the stop', 5], ['waiting', o.bus / 2], ['on the bus', d / (rush ? 18 : 24) * 60], ['walking on', 3]];
      case 'car':  return [['to the car', 1], ['driving', d / (rush ? 22 : 30) * 60], ['parking', rush ? 4 : 2], ['walking on', 3]];
    }
  }
  function total(mode, d, o) { return segments(mode, d, o).reduce(function (s, x) { return s + x[1]; }, 0); }

  /* distance at which car first beats bike (null if never within MAXD) */
  function crossover(o) {
    for (var d = 0.05; d <= 60; d += 0.05) if (total('car', d, o) < total('bike', d, o)) return Math.round(d * 10) / 10;
    return null;
  }

  /* ---------- chart ---------- */
  var svg = document.getElementById('chart');
  var NS = 'http://www.w3.org/2000/svg';
  var M = { l: 46, r: 14, t: 14, b: 38 }, VW = 640, VH = 340;
  function X(d) { return M.l + d / MAXD * (VW - M.l - M.r); }
  function Y(t) { return VH - M.b - t / MAXT * (VH - M.t - M.b); }
  function el(name, attrs, text) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function drawChart() {
    svg.innerHTML = '';
    var d, t;
    for (t = 0; t <= MAXT; t += 15) {
      svg.appendChild(el('line', { x1: M.l, x2: VW - M.r, y1: Y(t), y2: Y(t), 'class': 'gridline' }));
      svg.appendChild(el('text', { x: M.l - 8, y: Y(t) + 4, 'text-anchor': 'end', 'font-size': 11 }, t));
    }
    for (d = 0; d <= MAXD; d += 3) {
      svg.appendChild(el('line', { x1: X(d), x2: X(d), y1: Y(0), y2: Y(0) + 5, stroke: '#1c2321' }));
      svg.appendChild(el('text', { x: X(d), y: Y(0) + 19, 'text-anchor': 'middle', 'font-size': 11 }, d));
    }
    svg.appendChild(el('text', { x: (VW + M.l) / 2, y: VH - 4, 'text-anchor': 'middle', 'font-size': 12 }, 'distance (km)'));
    svg.appendChild(el('text', { x: 12, y: (VH - M.b) / 2, 'text-anchor': 'middle', 'font-size': 12, transform: 'rotate(-90 12 ' + (VH - M.b) / 2 + ')' }, 'door to door (minutes)'));
    svg.appendChild(el('line', { x1: M.l, x2: VW - M.r, y1: Y(0), y2: Y(0), stroke: '#1c2321', 'stroke-width': 1.5 }));
    svg.appendChild(el('line', { x1: M.l, x2: M.l, y1: Y(0), y2: M.t, stroke: '#1c2321', 'stroke-width': 1.5 }));

    MODES.forEach(function (m) {
      var pts = [];
      for (d = 0.25; d <= MAXD + 1e-9; d += 0.25) {
        var v = total(m.id, d, opt);
        pts.push(X(d).toFixed(1) + ',' + Y(Math.min(v, MAXT)).toFixed(1));
        if (v > MAXT) break;
      }
      svg.appendChild(el('polyline', { points: pts.join(' '), fill: 'none', stroke: m.colour, 'stroke-width': 3, 'stroke-linejoin': 'round' }));
    });

    // crossover
    var cx = crossover(opt);
    if (cx !== null && cx <= MAXD) {
      svg.appendChild(el('line', { x1: X(cx), x2: X(cx), y1: Y(0), y2: M.t, stroke: '#2c5f8c', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }));
      svg.appendChild(el('text', { x: X(cx) + 5, y: M.t + 12, 'font-size': 11, 'font-weight': 700 }, 'car overtakes bike: ' + cx.toFixed(1) + ' km'));
    }
    // guess
    if (guess !== null) {
      svg.appendChild(el('line', { x1: X(guess), x2: X(guess), y1: Y(0), y2: M.t, stroke: '#c23b2e', 'stroke-width': 2 }));
      svg.appendChild(el('text', { x: X(guess) + 5, y: M.t + (cx !== null && Math.abs(cx - guess) < 2 ? 28 : 12), 'font-size': 11, fill: '#c23b2e', style: 'fill:#c23b2e', 'font-weight': 700 }, 'your guess: ' + guess.toFixed(1) + ' km'));
    }
    // cursor
    svg.appendChild(el('line', { x1: X(dist), x2: X(dist), y1: Y(0), y2: M.t, stroke: '#1c2321', 'stroke-width': 1 }));
    MODES.forEach(function (m) {
      var v = total(m.id, dist, opt);
      if (v <= MAXT) svg.appendChild(el('circle', { cx: X(dist), cy: Y(v), r: 5, fill: m.colour, stroke: '#1c2321', 'stroke-width': 1.5 }));
    });
  }

  function drawLegend() {
    document.getElementById('legend').innerHTML = MODES.map(function (m) {
      return '<span><i style="background:' + m.colour + '"></i>' + m.label + '</span>';
    }).join('');
  }

  function drawDetail() {
    var tb = document.querySelector('#detail tbody');
    tb.innerHTML = '';
    var rows = MODES.map(function (m) { return { m: m, t: total(m.id, dist, opt) }; });
    var best = Math.min.apply(null, rows.map(function (r) { return r.t; }));
    rows.forEach(function (r) {
      var segs = segments(r.m.id, dist, opt);
      var shades = ['1', '.7', '.45', '.25'];
      var bar = segs.map(function (s, i) {
        return '<span class="seg" title="' + s[0] + ': ' + Math.round(s[1]) + ' min" style="width:' + (s[1] / MAXT * 130) + 'px;background:' + r.m.colour + ';opacity:' + shades[i % 4] + '"></span>';
      }).join('');
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><b>' + r.m.label + '</b></td><td class="num" style="text-align:right"><b>' + Math.round(r.t) + '</b> min' +
        (r.t === best ? ' ★' : '') + '</td><td>' + bar + '</td>';
      tb.appendChild(tr);
    });
  }

  function drawVerdict() {
    var cx = crossover(opt);
    var v = document.getElementById('verdict');
    var s = '<h3>Your guess against the model</h3>';
    var diff = cx === null ? null : guess - cx;
    if (cx === null) {
      s += '<p>With these settings the car never beats the bike within 60 km.</p>';
    } else {
      s += '<p>You guessed <b>' + guess.toFixed(1) + ' km</b>. With these settings the car overtakes the bike at <b>' + cx.toFixed(1) + ' km</b>';
      if (Math.abs(diff) <= 1) s += ', so you were close.';
      else if (diff > 0) s += '. You overestimated: most people think of the car as faster for longer than it is.';
      else s += '. You were pessimistic about the bike.';
      s += '</p>';
    }
    s += '<p class="muted small">Try the other traffic setting and the other bus interval. Which assumption moves the crossover most?</p>';
    v.innerHTML = s;
  }

  function drawOpts() {
    function group(id, items, key) {
      var box = document.getElementById(id);
      box.innerHTML = '';
      items.forEach(function (it) {
        var b = document.createElement('button');
        b.textContent = it[1];
        b.className = String(opt[key]) === String(it[0]) ? 'on' : '';
        b.addEventListener('click', function () {
          opt[key] = it[0];
          if (key === 'traffic') tried[it[0]] = true;
          refresh();
        });
        box.appendChild(b);
      });
    }
    group('opt-traffic', [['rush', 'Rush hour'], ['free', 'Free-flowing']], 'traffic');
    group('opt-bus', [[10, '10 min'], [20, '20 min']], 'bus');
    group('opt-park', [['ok', 'At the door'], ['none', 'Nowhere obvious']], 'park');
  }

  function showDone() {
    var a = crossover({ traffic: 'rush', bus: opt.bus, park: opt.park });
    var b = crossover({ traffic: 'free', bus: opt.bus, park: opt.park });
    document.getElementById('done').classList.add('show');
    document.getElementById('done-text').textContent =
      'In the rush hour the car only wins beyond ' + (a === null ? '?' : a.toFixed(1)) + ' km; on empty roads, beyond ' + (b === null ? '?' : b.toFixed(1)) +
      ' km. Most urban trips are shorter than that, which is why bike lanes and secure parking matter more than speed limits for getting people to cycle.';
  }

  function checkDone() {
    if (finished || !guess || !(tried.rush && tried.free)) return;
    finished = true;
    showDone();
    SCORM.complete('completed', null);
    save();
  }

  function refresh() {
    document.getElementById('dist-val').textContent = dist.toFixed(1);
    drawOpts(); drawChart(); drawDetail();
    if (guess !== null) drawVerdict();
    checkDone();
    save();
  }

  function save() { SCORM.setState({ g: guess, t: tried, f: finished ? 1 : 0 }); }

  function unlock() {
    document.getElementById('guess-panel').hidden = true;
    document.getElementById('lab').hidden = false;
    document.getElementById('s1').className = 'done';
    document.getElementById('s2').className = 'cur';
    document.getElementById('s3').className = '';
    tried[opt.traffic] = true;
    drawLegend();
    refresh();
  }

  /* ---------- wiring ---------- */
  var gEl = document.getElementById('guess');
  gEl.addEventListener('input', function () { document.getElementById('guess-val').textContent = (+gEl.value).toFixed(1); });
  document.getElementById('lock').addEventListener('click', function () { guess = +gEl.value; unlock(); });

  var dEl = document.getElementById('dist');
  dEl.addEventListener('input', function () { dist = +dEl.value; refresh(); });

  function fromPointer(ev) {
    var r = svg.getBoundingClientRect();
    var x = (ev.clientX - r.left) / r.width * VW;
    var d = (x - M.l) / (VW - M.l - M.r) * MAXD;
    d = Math.max(0.5, Math.min(MAXD, Math.round(d * 2) / 2));
    dist = d; dEl.value = d; refresh();
  }
  var dragging = false;
  svg.addEventListener('pointerdown', function (e) { dragging = true; fromPointer(e); });
  svg.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
  window.addEventListener('pointerup', function () { dragging = false; });

  var st = SCORM.init();
  if (st && typeof st.g === 'number') {
    guess = st.g; tried = st.t || {}; finished = !!st.f;
    gEl.value = guess; document.getElementById('guess-val').textContent = guess.toFixed(1);
    unlock();
    if (finished) showDone();
  }

  window.__m4 = { total: total, crossover: crossover };
})();
