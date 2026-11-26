(function () {
  'use strict';

  var Sim = window.CrossingSim;
  var cfg = { strategy: 'fixed', scenario: 'school', carGreen: 25, pedWalk: 12 };
  var runs = [];
  var finished = false;
  var current = null;     // {sim, raf, last}
  var SPEED = 24;         // simulated seconds per real second

  var STRATS = {
    fixed:  { label: 'Fixed timer', help: 'Same cycle all day. Car green lasts exactly the time you set, then pedestrians get their phase, whether or not anyone is waiting.',
              cgLabel: 'Car green (exact)', pwLabel: 'Pedestrian green (exact)' },
    button: { label: 'Push button', help: 'Cars keep green until the minimum time has passed and someone is waiting. Then pedestrians get their phase.',
              cgLabel: 'Car green (minimum)', pwLabel: 'Pedestrian green' },
    sensor: { label: 'Sensor', help: 'Sees cars and pedestrians. Turns early if no cars are waiting, and lengthens the walk phase when a crowd has built up, up to the limit you set.',
              cgLabel: 'Car green (minimum)', pwLabel: 'Pedestrian green (maximum)' }
  };

  /* ---------- UI ---------- */
  var cv = document.getElementById('cv'), ctx = cv.getContext('2d');
  var W = cv.width, H = cv.height;

  function group(id, items, key, onChange) {
    var box = document.getElementById(id);
    box.innerHTML = '';
    items.forEach(function (it) {
      var b = document.createElement('button');
      b.textContent = it[1];
      b.className = cfg[key] === it[0] ? 'on' : '';
      b.addEventListener('click', function () { cfg[key] = it[0]; renderControls(); idle(); if (onChange) onChange(); });
      box.appendChild(b);
    });
  }

  function renderControls() {
    group('opt-sc', Object.keys(Sim.SCENARIOS).map(function (k) { return [k, Sim.SCENARIOS[k].label]; }), 'scenario');
    group('opt-st', Object.keys(STRATS).map(function (k) { return [k, STRATS[k].label]; }), 'strategy');
    var s = STRATS[cfg.strategy];
    document.getElementById('help').textContent = s.help;
    document.getElementById('cg-label').textContent = s.cgLabel;
    document.getElementById('pw-label').textContent = s.pwLabel;
    document.getElementById('cg').value = cfg.carGreen;
    document.getElementById('pw').value = cfg.pedWalk;
    document.getElementById('cg-val').textContent = cfg.carGreen;
    document.getElementById('pw-val').textContent = cfg.pedWalk;
  }

  document.getElementById('cg').addEventListener('input', function (e) { cfg.carGreen = +e.target.value; document.getElementById('cg-val').textContent = cfg.carGreen; });
  document.getElementById('pw').addEventListener('input', function (e) { cfg.pedWalk = +e.target.value; document.getElementById('pw-val').textContent = cfg.pedWalk; });

  /* ---------- drawing ---------- */
  var ROAD_Y = 92, ROAD_H = 78, XC = 440;   // crossing centre x
  function draw(s) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#d9d3c2'; ctx.fillRect(0, 0, W, H);
    // road
    ctx.fillStyle = '#3b4140'; ctx.fillRect(0, ROAD_Y, W, ROAD_H);
    ctx.strokeStyle = '#f3efe6'; ctx.lineWidth = 3; ctx.setLineDash([20, 16]);
    ctx.beginPath(); ctx.moveTo(0, ROAD_Y + ROAD_H / 2); ctx.lineTo(W, ROAD_Y + ROAD_H / 2); ctx.stroke(); ctx.setLineDash([]);
    // crossing stripes
    ctx.fillStyle = '#f3efe6';
    for (var y = ROAD_Y + 4; y < ROAD_Y + ROAD_H - 6; y += 14) ctx.fillRect(XC - 22, y, 44, 8);
    // stop line
    ctx.fillStyle = '#f3efe6'; ctx.fillRect(XC - 36, ROAD_Y + ROAD_H / 2, 5, ROAD_H / 2);

    var carGreen = s.phase === 'CAR';
    var pedGreen = s.phase === 'PED';

    // car signal
    signal(XC - 60, ROAD_Y + ROAD_H + 14, carGreen ? '#2e7a4d' : '#c23b2e', 'cars');
    // pedestrian signal
    signal(XC + 52, ROAD_Y - 36, pedGreen ? '#2e7a4d' : '#c23b2e', 'walk');

    // queued cars (lane below centre line, driving left to right)
    var laneY = ROAD_Y + ROAD_H * 0.75;
    var shown = Math.min(s.carQ.length, 11);
    for (var i = 0; i < shown; i++) car(XC - 48 - i * 31, laneY, '#2c5f8c');
    if (s.carQ.length > shown) {
      ctx.fillStyle = '#1c2321'; ctx.font = 'bold 13px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText('+' + (s.carQ.length - shown), XC - 48 - shown * 31 + 4, laneY + 5);
    }
    // cars passing
    s.passed.forEach(function (tp) {
      var x = XC - 30 + (s.t - tp) * 38;
      if (x < W + 40) car(x, laneY, '#6f93b3');
    });

    // waiting pedestrians on the north kerb
    ctx.fillStyle = '#c23b2e';
    var n = Math.min(s.pedQ.length, 16);
    for (var j = 0; j < n; j++) {
      var px = XC - 20 + (j % 8) * 7 - (j >= 8 ? 0 : 0), py = ROAD_Y - 14 - Math.floor(j / 8) * 9;
      dot(px, py);
    }
    // crossing pedestrians
    s.crossing.forEach(function (tc, k) {
      var f = Math.min(1, (s.t - tc) / Sim.CROSS_TIME);
      dot(XC - 16 + (k % 6) * 6, ROAD_Y + 6 + f * (ROAD_H - 12));
    });

    // phase caption
    ctx.fillStyle = '#1c2321'; ctx.font = '12px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(s.phase === 'CAR' ? 'cars go' : s.phase === 'PED' ? 'pedestrians cross' : 'all red, clearing', 14, 22);
    ctx.fillText('kerb', 14, ROAD_Y - 10);
  }

  function signal(x, y, colour, label) {
    ctx.fillStyle = '#1c2321'; ctx.fillRect(x - 11, y - 11, 22, 22);
    ctx.fillStyle = colour; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#1c2321'; ctx.font = '10px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(label, x - 12, y + 24);
  }
  function car(x, y, c) {
    ctx.fillStyle = c; ctx.strokeStyle = '#1c2321'; ctx.lineWidth = 1.5;
    ctx.fillRect(x - 28, y - 11, 28, 22); ctx.strokeRect(x - 28, y - 11, 28, 22);
    ctx.fillStyle = '#cfdde9'; ctx.fillRect(x - 10, y - 8, 6, 16);
  }
  function dot(x, y) {
    ctx.fillStyle = '#c23b2e'; ctx.strokeStyle = '#1c2321'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 7); ctx.fill(); ctx.stroke();
  }

  function fmtT(t) { return Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2); }
  function live(s) {
    document.getElementById('l-t').textContent = fmtT(s.t);
    document.getElementById('l-c').textContent = s.carQ.length;
    document.getElementById('l-p').textContent = s.pedQ.length;
  }

  function idle() {
    if (current) { cancelAnimationFrame(current.raf); current = null; }
    document.getElementById('go').disabled = false;
    document.getElementById('skip').disabled = true;
    var s = Sim.create(cfg).s;
    draw(s); live(s);
  }

  /* ---------- running ---------- */
  function start() {
    if (current) return;
    var sim = Sim.create(cfg);
    var params = JSON.parse(JSON.stringify(cfg));
    current = { sim: sim, params: params, last: null, acc: 0, raf: 0 };
    document.getElementById('go').disabled = true;
    document.getElementById('skip').disabled = false;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { finishRun(); return; }
    function frame(ts) {
      if (!current) return;
      if (current.last === null) current.last = ts;
      current.acc += (ts - current.last) / 1000 * SPEED;
      current.last = ts;
      while (current.acc >= 1 && !sim.s.done) { sim.step(); current.acc -= 1; }
      draw(sim.s); live(sim.s);
      if (sim.s.done) finishRun();
      else current.raf = requestAnimationFrame(frame);
    }
    current.raf = requestAnimationFrame(frame);
  }

  function finishRun() {
    var c = current;
    if (!c) return;
    while (!c.sim.s.done) c.sim.step();
    cancelAnimationFrame(c.raf);
    draw(c.sim.s); live(c.sim.s);
    current = null;
    document.getElementById('go').disabled = false;
    document.getElementById('skip').disabled = true;
    record(c.params, c.sim.result());
  }

  /* ---------- evaluation ---------- */
  function meets(r) {
    return [
      { t: 'Pedestrians wait 6 s or less on average', ok: r.pedAvg <= 6 },
      { t: 'Cars are delayed 8 s or less on average', ok: r.carAvg <= 8 },
      { t: 'Nobody waits longer than 30 s', ok: r.pedMax <= 30 },
      { t: 'Nobody crosses against the red', ok: r.viol === 0 }
    ];
  }

  function renderGoals(r) {
    var ul = document.getElementById('goals');
    ul.innerHTML = '';
    var gs = r ? meets(r) : meets({ pedAvg: 99, carAvg: 99, pedMax: 99, viol: 1 });
    gs.forEach(function (g) {
      var li = document.createElement('li');
      if (r && g.ok) li.className = 'met';
      li.innerHTML = '<span class="mark">' + (r && g.ok ? '✓' : '') + '</span><span>' + g.t + '</span>';
      ul.appendChild(li);
    });
    return r ? gs.every(function (g) { return g.ok; }) : false;
  }

  function record(p, r) {
    var shown = { fixed: 'Fixed timer', button: 'Push button', sensor: 'Sensor' }[p.strategy];
    var row = { sc: p.scenario, st: p.strategy, cg: p.carGreen, pw: p.pedWalk,
                pa: +r.pedAvg.toFixed(1), pm: r.pedMax, ca: +r.carAvg.toFixed(1), v: r.viol };
    runs.unshift(row);
    if (runs.length > 8) runs.pop();
    renderRuns();
    if (p.scenario === 'school') {
      var pass = renderGoals(r);
      document.getElementById('brief-note').textContent = pass ? 'All four met in this run.' : 'Last school-peak run: not all four met yet.';
      if (pass) win(p, r);
    } else {
      document.getElementById('brief-note').textContent = 'That was the quiet midday traffic. The brief is judged on the school peak.';
    }
    save();
  }

  function renderRuns() {
    var tb = document.querySelector('#runs tbody');
    tb.innerHTML = '';
    runs.forEach(function (r) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + Sim.SCENARIOS[r.sc].label + '</td><td>' + STRATS[r.st].label + '</td>' +
        '<td class="num">' + r.cg + ' s / ' + r.pw + ' s</td>' +
        '<td class="num">' + r.pa + ' / ' + r.pm + ' s</td><td class="num">' + r.ca + ' s</td>' +
        '<td class="num ' + (r.v ? 'bad' : 'ok') + '">' + r.v + '</td>';
      tb.appendChild(tr);
    });
  }

  function win(p, r) {
    var done = document.getElementById('done');
    done.classList.add('show');
    var txt = 'Pedestrians waited ' + r.pedAvg.toFixed(1) + ' s on average and cars ' + r.carAvg.toFixed(1) + ' s, with the "' +
      STRATS[p.strategy].label.toLowerCase() + '" controller.';
    if (p.strategy !== 'sensor') txt += ' Try the sensor on the same settings and compare: what does it change, and is that worth what it costs?';
    else txt += ' Now run the same settings with a fixed timer. The gap between the two is what the sensor is buying.';
    document.getElementById('done-text').textContent = txt;
    if (!finished) { finished = true; SCORM.complete('passed', 100); }
  }

  function save() { SCORM.setState({ r: runs, c: cfg, f: finished ? 1 : 0 }); }

  document.getElementById('go').addEventListener('click', start);
  document.getElementById('skip').addEventListener('click', finishRun);

  var st = SCORM.init();
  if (st && Array.isArray(st.r)) {
    runs = st.r.filter(function (r) { return r && Sim.SCENARIOS[r.sc] && STRATS[r.st]; });
    finished = !!st.f;
    if (st.c && STRATS[st.c.strategy] && Sim.SCENARIOS[st.c.scenario]) cfg = st.c;
  }
  renderControls();
  renderRuns();
  renderGoals(null);
  if (finished) document.getElementById('done').classList.add('show');
  idle();
})();
