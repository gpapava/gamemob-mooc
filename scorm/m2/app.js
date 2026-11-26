(function () {
  'use strict';

  var G = 9.81;
  var MU = { dry: 0.7, wet: 0.4 };

  var SCENARIOS = [
    { title: '1. Wet morning, child runs out from behind a van',
      text: 'It rained overnight. The child appears 15 metres ahead and the driver is paying full attention.',
      D: 15, surface: 'wet', tr: 1.0, trLabel: 'alert driver, 1.0 s' },
    { title: '2. Dry road, driver glances at the phone',
      text: 'Good surface, but the driver looked down for a moment. The child steps off the kerb 20 metres ahead.',
      D: 20, surface: 'dry', tr: 2.0, trLabel: 'distracted driver, 2.0 s' },
    { title: '3. Dry road, right outside the school gate',
      text: 'Best case: dry road and a driver who is watching. The child is already only 12 metres ahead when they step out.',
      D: 12, surface: 'dry', tr: 0.8, trLabel: 'ready driver, 0.8 s' }
  ];

  /* Tefft 2013: average pedestrian death risk by impact speed (km/h). */
  var RISK = [[0, 0], [37, 10], [51, 25], [68, 50], [80, 75], [93, 90], [110, 100]];

  /* ---------- physics ---------- */
  function ms(kmh) { return kmh / 3.6; }
  function kmh(v) { return v * 3.6; }

  function outcome(sc, speedKmh) {
    var v = ms(speedKmh), a = MU[sc.surface] * G;
    var react = v * sc.tr;
    var brake = v * v / (2 * a);
    var out = { react: react, brake: brake, stopDist: react + brake, D: sc.D, a: a, v: v };
    if (out.stopDist <= sc.D) {
      out.hit = false; out.margin = sc.D - out.stopDist; out.impact = 0;
    } else {
      out.hit = true; out.margin = 0;
      var left = sc.D - react;
      if (left <= 0) out.impact = speedKmh;
      else out.impact = kmh(Math.sqrt(Math.max(0, v * v - 2 * a * left)));
    }
    return out;
  }

  function safest(sc) {
    var best = 0;
    for (var s = 10; s <= 60; s += 5) if (!outcome(sc, s).hit) best = s;
    return best;
  }

  function risk(impactKmh) {
    for (var i = 1; i < RISK.length; i++) {
      if (impactKmh <= RISK[i][0]) {
        var p = RISK[i - 1], q = RISK[i];
        return p[1] + (q[1] - p[1]) * (impactKmh - p[0]) / (q[0] - p[0]);
      }
    }
    return 100;
  }

  /* ---------- state ---------- */
  var cur = 0;
  var solved = [false, false, false];
  var fails = 0;
  var finished = false;
  var anim = null;
  var lastShown = null;

  var cv = document.getElementById('cv');
  var ctx = cv.getContext('2d');
  var W = cv.width, H = cv.height;
  var X0 = 150;                 // x of car front at t=0
  var PXM = 20;                 // pixels per metre
  var ROAD_Y = 62, ROAD_H = 110;

  /* ---------- drawing ---------- */
  function drawScene(sc, carFront, showZones, out, childOn) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#d9d3c2';
    ctx.fillRect(0, 0, W, H);
    // road
    ctx.fillStyle = '#3b4140';
    ctx.fillRect(0, ROAD_Y, W, ROAD_H);
    ctx.strokeStyle = '#f3efe6'; ctx.lineWidth = 3; ctx.setLineDash([22, 18]);
    ctx.beginPath(); ctx.moveTo(0, ROAD_Y + ROAD_H / 2); ctx.lineTo(W, ROAD_Y + ROAD_H / 2); ctx.stroke();
    ctx.setLineDash([]);
    // crossing
    var cx = X0 + sc.D * PXM;
    ctx.fillStyle = '#f3efe6';
    for (var y = ROAD_Y + 6; y < ROAD_Y + ROAD_H - 8; y += 16) ctx.fillRect(cx - 14, y, 28, 9);

    // zones (after run)
    if (showZones && out) {
      var zy = ROAD_Y + ROAD_H + 14;
      var rx = X0 + out.react * PXM;
      var bx = X0 + out.stopDist * PXM;
      ctx.fillStyle = '#efb320'; ctx.fillRect(X0, zy, rx - X0, 12);
      ctx.fillStyle = '#c23b2e'; ctx.fillRect(rx, zy, Math.min(bx, W - 4) - rx, 12);
      ctx.fillStyle = '#1c2321'; ctx.font = '12px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText('reaction ' + out.react.toFixed(1) + ' m', X0, zy + 28);
      ctx.fillText('braking ' + out.brake.toFixed(1) + ' m', Math.max(rx, X0 + 120), zy + 28);
      ctx.strokeStyle = '#1c2321'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, zy - 4); ctx.lineTo(cx, zy + 16); ctx.stroke();
    }

    // scale ticks (every 5 m)
    ctx.fillStyle = '#4b544f'; ctx.font = '11px "Helvetica Neue", Arial, sans-serif';
    for (var m = 0; m <= 35; m += 5) {
      var tx = X0 + m * PXM;
      ctx.fillRect(tx, ROAD_Y - 10, 1.5, 8);
      ctx.fillText(m + ' m', tx - 8, ROAD_Y - 14);
    }

    // car (top view)
    var cw = 4.4 * PXM, ch = 46;
    var carY = ROAD_Y + ROAD_H * 0.75 - ch / 2;
    var cxs = carFront - cw;
    ctx.fillStyle = '#2c5f8c';
    roundRect(cxs, carY, cw, ch, 8); ctx.fill();
    ctx.strokeStyle = '#1c2321'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#9fc2dc';
    roundRect(cxs + cw * 0.58, carY + 6, cw * 0.2, ch - 12, 3); ctx.fill();
    ctx.fillStyle = '#efb320'; ctx.fillRect(carFront - 5, carY + 6, 4, 8); ctx.fillRect(carFront - 5, carY + ch - 14, 4, 8);

    // child
    if (childOn) {
      var chy = ROAD_Y + ROAD_H * 0.75;
      ctx.fillStyle = '#c23b2e';
      ctx.beginPath(); ctx.arc(cx, chy, 9, 0, 7); ctx.fill();
      ctx.strokeStyle = '#1c2321'; ctx.lineWidth = 2; ctx.stroke();
    } else {
      ctx.fillStyle = '#c23b2e';
      ctx.beginPath(); ctx.arc(cx, ROAD_Y + 12, 9, 0, 7); ctx.fill();
      ctx.strokeStyle = '#1c2321'; ctx.lineWidth = 2; ctx.stroke();
    }
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* ---------- UI ---------- */
  var elSpeed = document.getElementById('speed');
  var elSpeedVal = document.getElementById('speed-val');
  var elRun = document.getElementById('run');
  var elResult = document.getElementById('result');
  var elTabs = document.getElementById('tabs');

  function renderTabs() {
    elTabs.innerHTML = '';
    SCENARIOS.forEach(function (s, i) {
      var b = document.createElement('button');
      b.textContent = 'Situation ' + (i + 1);
      b.className = (i === cur ? 'on ' : '') + (solved[i] ? 'done' : '');
      b.addEventListener('click', function () { selectScenario(i); });
      elTabs.appendChild(b);
    });
  }

  function selectScenario(i) {
    stopAnim();
    cur = i;
    var sc = SCENARIOS[i];
    document.getElementById('sc-title').textContent = sc.title;
    document.getElementById('sc-text').textContent = sc.text;
    document.getElementById('sc-params').innerHTML =
      'Child steps out <b>' + sc.D + ' m</b> ahead · surface <b>' + sc.surface + '</b> · ' + sc.trLabel;
    elResult.innerHTML = '<span class="muted">Pick a speed and run it.</span>';
    renderTabs();
    drawScene(sc, X0, false, null, false);
    lastShown = null;
  }

  function stopAnim() { if (anim) { cancelAnimationFrame(anim.id); anim = null; elRun.disabled = false; } }

  function run() {
    var sc = SCENARIOS[cur];
    var speed = +elSpeed.value;
    var out = outcome(sc, speed);
    elRun.disabled = true;
    elResult.innerHTML = '<span class="muted">Child steps out…</span>';

    // time-stepped motion: constant speed during reaction, then constant deceleration
    var t0 = null, stopped = false;
    var tStop = sc.tr + out.v / out.a;
    var tEnd = out.hit ? sc.tr + (out.v - ms(out.impact)) / out.a : tStop;
    var SLOW = 0.7; // slightly slowed so the eye can follow it

    function pos(t) {
      if (t <= sc.tr) return out.v * t;
      var tb = Math.min(t - sc.tr, out.v / out.a);
      return out.v * sc.tr + out.v * tb - 0.5 * out.a * tb * tb;
    }

    function frame(ts) {
      if (t0 === null) t0 = ts;
      var t = (ts - t0) / 1000 * SLOW;
      var tt = Math.min(t, tEnd);
      var d = Math.min(pos(tt), out.hit ? sc.D : 1e9);
      drawScene(sc, X0 + d * PXM, false, null, true);
      if (t < tEnd + 0.1) { anim.id = requestAnimationFrame(frame); }
      else { anim = null; finish(sc, speed, out); }
    }
    anim = { id: requestAnimationFrame(frame) };
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { stopAnim(); finish(sc, speed, out); }
  }

  function finish(sc, speed, out) {
    elRun.disabled = false;
    var stopAt = out.hit ? sc.D : out.stopDist;
    drawScene(sc, X0 + stopAt * PXM, true, out, true);

    var best = safest(sc);
    var html;
    if (out.hit) {
      var r = Math.round(risk(out.impact));
      html = '<span class="tag hit">HIT</span> The car reaches the child at <b>' + Math.round(out.impact) +
        ' km/h</b>. For an average pedestrian, that is roughly a <b>' + r + '%</b> chance of dying' +
        (out.impact < 5 ? ' (a bump, but still a collision)' : '') + '. It needed ' + out.stopDist.toFixed(1) +
        ' m to stop and had ' + sc.D + ' m.';
      fails++;
    } else {
      html = '<span class="tag stop">STOPPED</span> The car stops <b>' + out.margin.toFixed(1) + ' m</b> short of the child.';
      if (speed === best) {
        html += ' That is the highest speed that works here. Go 5 km/h faster and it fails.';
        if (!solved[cur]) { solved[cur] = true; renderTabs(); checkAll(); }
      } else {
        html += ' It is safe, but not the limit yet. How high can you go?';
      }
    }
    elResult.innerHTML = html;
    addLog(sc, speed, out);
    save();
  }

  function addLog(sc, speed, out) {
    var tb = document.querySelector('#log tbody');
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + sc.title.split(',')[0] + '</td><td class="num">' + speed + ' km/h</td><td>' +
      (out.hit ? '<span class="tag hit">hit at ' + Math.round(out.impact) + ' km/h</span>' : '<span class="tag stop">stopped, ' + out.margin.toFixed(1) + ' m spare</span>') + '</td>';
    tb.insertBefore(tr, tb.firstChild);
    while (tb.children.length > 12) tb.removeChild(tb.lastChild);
  }

  function checkAll() {
    var all = solved.every(Boolean);
    var done = document.getElementById('done');
    if (!all) { done.classList.remove('show'); return; }
    done.classList.add('show');
    var b = SCENARIOS.map(safest);
    document.getElementById('done-text').textContent =
      'The limits you found: ' + b[0] + ', ' + b[1] + ' and ' + b[2] + ' km/h. Only the best case (dry road, alert driver) reaches 30 km/h, ' +
      'and only just. Any wet road or any distraction pushes the safe speed below that, which is why school zones are set at 30 and why the real answer is often lower.';
    if (!finished) {
      finished = true;
      SCORM.complete('passed', Math.max(50, 100 - 10 * fails));
    }
    save();
  }

  function save() { SCORM.setState({ s: solved, c: cur, f: finished ? 1 : 0, x: fails }); }

  elSpeed.addEventListener('input', function () { elSpeedVal.textContent = elSpeed.value; });
  elRun.addEventListener('click', run);

  var st = SCORM.init();
  if (st && Array.isArray(st.s)) { solved = st.s.slice(0, 3); finished = !!st.f; fails = st.x || 0; }
  selectScenario(0);
  checkAll();

  window.__m2 = { outcome: outcome, safest: safest, risk: risk, SCENARIOS: SCENARIOS };
})();
