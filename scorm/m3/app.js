(function () {
  'use strict';

  var DAYS = 180;
  var TRIPS = 2;
  var BANDS = [
    { n: 8,  km: 0.6 },
    { n: 10, km: 2.0 },
    { n: 6,  km: 4.5 }
  ];
  /* g CO2 per pupil-km; ok[] = allowed in each band; pupilsPerCar for gate count */
  var MODES = [
    { id: 'walk', label: 'Walk',            sub: 'on foot',                 g: 0,   ok: [1, 1, 0] },
    { id: 'bike', label: 'Bike / scooter',  sub: 'own power or electric',   g: 0,   ok: [1, 1, 1] },
    { id: 'bus',  label: 'Bus',             sub: 'public or school bus',    g: 70,  ok: [1, 1, 1] },
    { id: 'pool', label: 'Car pool',        sub: 'one car, three pupils',   g: 57,  ok: [1, 1, 1], perCar: 3 },
    { id: 'car',  label: 'Car, one pupil',  sub: 'a parent drops off',      g: 170, ok: [1, 1, 1], perCar: 1 }
  ];
  /* rows = modes, columns = bands. Today: */
  var BASE = {
    walk: [3, 1, 0],
    bike: [0, 0, 0],
    bus:  [0, 3, 2],
    pool: [0, 0, 0],
    car:  [5, 6, 4]
  };
  var TARGET_CUT = 0.60;

  var alloc = clone(BASE);
  var finished = false;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function annualKg(a) {
    var g = 0;
    MODES.forEach(function (m) {
      BANDS.forEach(function (b, bi) { g += (a[m.id][bi] || 0) * b.km * m.g * TRIPS * DAYS; });
    });
    return g / 1000;
  }
  function gateCars(a) {
    var c = 0;
    MODES.forEach(function (m) {
      if (!m.perCar) return;
      var pupils = 0;
      BANDS.forEach(function (b, bi) { pupils += a[m.id][bi] || 0; });
      c += Math.ceil(pupils / m.perCar);
    });
    return c;
  }
  function leftover(a, bi) {
    var used = 0;
    MODES.forEach(function (m) { used += a[m.id][bi] || 0; });
    return BANDS[bi].n - used;
  }

  var BASE_KG = annualKg(BASE);
  var BASE_CARS = gateCars(BASE);

  /* ---------- UI ---------- */
  var tbody = document.querySelector('#grid tbody');
  BANDS.forEach(function (b, i) { document.getElementById('n' + i).textContent = b.n + ' pupils'; });

  function build() {
    tbody.innerHTML = '';
    MODES.forEach(function (m) {
      var tr = document.createElement('tr');
      var th = document.createElement('td');
      th.className = 'm';
      th.innerHTML = m.label + '<small>' + m.sub + '</small>';
      tr.appendChild(th);
      BANDS.forEach(function (b, bi) {
        var td = document.createElement('td');
        if (!m.ok[bi]) {
          td.innerHTML = '<span class="na" title="Not realistic at this distance">–</span>';
        } else {
          td.innerHTML = '<div class="stepper"><button type="button" aria-label="Fewer pupils, ' + m.label + ', band ' + (bi + 1) + '">−</button>' +
            '<output id="o-' + m.id + '-' + bi + '">0</output>' +
            '<button type="button" aria-label="More pupils, ' + m.label + ', band ' + (bi + 1) + '">+</button></div>';
          var btns = td.querySelectorAll('button');
          btns[0].addEventListener('click', function () { change(m.id, bi, -1); });
          btns[1].addEventListener('click', function () { change(m.id, bi, +1); });
        }
        tr.appendChild(td);
      });
      var g = document.createElement('td');
      g.className = 'num';
      g.textContent = m.g;
      tr.appendChild(g);
      tbody.appendChild(tr);
    });
    var lr = document.createElement('tr');
    lr.className = 'left';
    lr.innerHTML = '<td>Still to place</td>' + BANDS.map(function (b, bi) { return '<td id="left-' + bi + '"></td>'; }).join('') + '<td></td>';
    tbody.appendChild(lr);

    var reset = document.createElement('tr');
    reset.innerHTML = '<td colspan="5" style="border:0;padding-top:10px"><button type="button" id="reset">Back to today</button></td>';
    tbody.appendChild(reset);
    document.getElementById('reset').addEventListener('click', function () { alloc = clone(BASE); update(); });
  }

  function change(mode, bi, d) {
    var v = (alloc[mode][bi] || 0) + d;
    if (v < 0) return;
    if (d > 0 && leftover(alloc, bi) <= 0) {
      /* nothing left to place: take a pupil from the car rows first so people can just click + */
      var order = ['car', 'pool', 'bus', 'bike', 'walk'].filter(function (id) { return id !== mode; });
      var took = false;
      for (var k = 0; k < order.length; k++) {
        if ((alloc[order[k]][bi] || 0) > 0 && MODES.filter(function (m) { return m.id === order[k]; })[0].ok[bi]) {
          alloc[order[k]][bi]--; took = true; break;
        }
      }
      if (!took) return;
    }
    alloc[mode][bi] = v;
    update();
  }

  function update() {
    MODES.forEach(function (m) {
      BANDS.forEach(function (b, bi) {
        var o = document.getElementById('o-' + m.id + '-' + bi);
        if (o) o.textContent = alloc[m.id][bi] || 0;
      });
    });
    var allPlaced = true;
    BANDS.forEach(function (b, bi) {
      var l = leftover(alloc, bi);
      var el = document.getElementById('left-' + bi);
      el.innerHTML = l === 0 ? '<span class="ok">all placed</span>' : '<span class="bad">' + l + ' left</span>';
      if (l !== 0) allPlaced = false;
    });

    var kg = annualKg(alloc);
    var ratio = BASE_KG ? kg / BASE_KG : 0;
    var cut = 1 - ratio;
    var cars = gateCars(alloc);
    document.getElementById('kg').textContent = Math.round(kg).toLocaleString('en-GB');
    var chg = document.getElementById('chg');
    var pc = Math.round(cut * 100);
    chg.textContent = pc === 0 ? '0%' : (pc > 0 ? '−' : '+') + Math.abs(pc) + '%';
    document.getElementById('cars').textContent = cars;
    document.getElementById('meter').style.width = Math.min(100, ratio * 100) + '%';
    document.getElementById('target').style.left = ((1 - TARGET_CUT) * 100) + '%';

    var goals = [
      { t: 'Every pupil has a way to travel', ok: allPlaced },
      { t: 'Emissions cut by at least 60% against today', ok: allPlaced && cut >= TARGET_CUT },
      { t: 'No more than 4 cars at the gate (today ' + BASE_CARS + ')', ok: allPlaced && cars <= 4 }
    ];
    var ul = document.getElementById('goals');
    ul.innerHTML = '';
    goals.forEach(function (g) {
      var li = document.createElement('li');
      if (g.ok) li.className = 'met';
      li.innerHTML = '<span class="mark">' + (g.ok ? '✓' : '') + '</span><span>' + g.t + '</span>';
      ul.appendChild(li);
    });

    var msg = document.getElementById('msg');
    var text = '';
    if (allPlaced) {
      var carG = 0, tot = 0;
      MODES.forEach(function (m) {
        BANDS.forEach(function (b, bi) {
          var x = (alloc[m.id][bi] || 0) * b.km * m.g;
          tot += x; if (m.id === 'car' || m.id === 'pool') carG += x;
        });
      });
      if (tot > 0) text = 'Cars cause ' + Math.round(carG / tot * 100) + '% of your emissions.';
      else text = 'Zero operating emissions.';
      var far = alloc.car[2] + alloc.pool[2];
      if (far > 0 && cut >= TARGET_CUT) text += ' The longest trips are the hard part: ' + far + ' pupil' + (far > 1 ? 's' : '') + ' still depend on a car there.';
    }
    msg.style.display = text ? '' : 'none';
    msg.textContent = text;

    var ok = goals.every(function (g) { return g.ok; });
    var done = document.getElementById('done');
    if (ok) {
      done.classList.add('show');
      document.getElementById('done-text').textContent =
        'The class now emits ' + Math.round(kg).toLocaleString('en-GB') + ' kg a year instead of ' +
        Math.round(BASE_KG).toLocaleString('en-GB') + ' kg, with ' + cars + ' cars at the gate instead of ' + BASE_CARS +
        '. Notice where the saving came from: the short trips cost little to switch, but the long ones carry most of the emissions.';
      if (!finished) { finished = true; SCORM.complete('passed', 100); }
    } else {
      done.classList.remove('show');
    }
    SCORM.setState({ a: alloc, f: finished ? 1 : 0 });
  }

  build();
  var st = SCORM.init();
  if (st && st.a) {
    var okShape = MODES.every(function (m) { return Array.isArray(st.a[m.id]) && st.a[m.id].length === 3; });
    if (okShape) { alloc = st.a; finished = !!st.f; }
  }
  update();

  window.__m3 = { annualKg: annualKg, gateCars: gateCars, BASE: BASE, BASE_KG: BASE_KG };
})();
