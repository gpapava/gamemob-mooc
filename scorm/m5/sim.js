/* Crossing simulator core — no DOM, so it can be tested in Node. */
(function (root) {
  'use strict';

  var CLEAR = 4;          // seconds of all-red after the walk phase
  var CROSS_TIME = 6;     // seconds a pedestrian needs to cross
  var SAT = 0.5;          // cars released per second of green
  var GIVE_UP = 35;       // pedestrians cross against red after waiting this long
  var DURATION = 600;

  var SCENARIOS = {
    quiet:  { label: 'Quiet midday',  cars: 5,  peds: 1.5, seed: 11 },
    school: { label: 'School peak',   cars: 14, peds: 9,   seed: 29 }
  };

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* p: { strategy:'fixed'|'button'|'sensor', carGreen:number, pedWalk:number, scenario:'quiet'|'school' } */
  function create(p) {
    var sc = SCENARIOS[p.scenario];
    var rand = rng(sc.seed);
    var s = {
      t: 0, phase: 'CAR', phaseT: 0, walkLen: p.pedWalk,
      carQ: [], pedQ: [], crossing: [], passed: [],
      acc: 0,
      carN: 0, carDelay: 0, carMax: 0,
      pedN: 0, pedWait: 0, pedMax: 0, viol: 0,
      done: false
    };

    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

    function startPed() {
      s.phase = 'PED'; s.phaseT = 0;
      s.walkLen = p.strategy === 'sensor'
        ? clamp(5 + 1.2 * s.pedQ.length, 6, p.pedWalk)
        : p.pedWalk;
    }

    function wantPed() {
      if (p.strategy === 'fixed') return s.phaseT >= p.carGreen;
      if (!s.pedQ.length) return false;
      if (p.strategy === 'button') return s.phaseT >= p.carGreen;
      /* sensor: go early when the approach is empty, otherwise respect the minimum */
      return s.phaseT >= p.carGreen || (s.carQ.length === 0 && s.phaseT >= 6);
    }

    function step() {
      if (s.done) return;
      s.t++; s.phaseT++;

      /* phase logic */
      if (s.phase === 'CAR') { if (wantPed()) startPed(); }
      else if (s.phase === 'PED') { if (s.phaseT > s.walkLen) { s.phase = 'CLEAR'; s.phaseT = 0; } }
      else if (s.phase === 'CLEAR') { if (s.phaseT >= CLEAR) { s.phase = 'CAR'; s.phaseT = 0; s.acc = 0; } }

      /* arrivals (Bernoulli per second approximates Poisson at these rates) */
      if (rand() < sc.cars / 60) {
        if (s.phase === 'CAR' && s.carQ.length === 0) { s.carN++; s.passed.push(s.t); }
        else s.carQ.push(s.t);
      }
      if (rand() < sc.peds / 60) {
        if (s.phase === 'PED') {
          s.pedN++; s.crossing.push(s.t);
        } else s.pedQ.push(s.t);
      }

      /* discharge cars */
      if (s.phase === 'CAR') {
        s.acc += SAT;
        while (s.acc >= 1 && s.carQ.length) {
          var a = s.carQ.shift(); var d = s.t - a;
          s.carN++; s.carDelay += d; if (d > s.carMax) s.carMax = d;
          s.passed.push(s.t); s.acc -= 1;
        }
        if (s.acc > 1) s.acc = 1;
      }

      /* pedestrians */
      if (s.phase === 'PED') {
        while (s.pedQ.length) {
          var w = s.t - s.pedQ.shift();
          s.pedN++; s.pedWait += w; if (w > s.pedMax) s.pedMax = w;
          s.crossing.push(s.t);
        }
      } else {
        while (s.pedQ.length && s.t - s.pedQ[0] >= GIVE_UP) {
          var w2 = s.t - s.pedQ.shift();
          s.pedN++; s.pedWait += w2; if (w2 > s.pedMax) s.pedMax = w2;
          s.viol++; s.crossing.push(s.t);
        }
      }

      /* tidy animation lists */
      while (s.passed.length && s.t - s.passed[0] > 10) s.passed.shift();
      while (s.crossing.length && s.t - s.crossing[0] > CROSS_TIME) s.crossing.shift();

      if (s.t >= DURATION) s.done = true;
    }

    function result() {
      /* anyone still queued counts with the wait so far, so a strategy can't hide delay by never serving them */
      var cw = 0, cm = s.carMax, pw = 0, pm = s.pedMax;
      s.carQ.forEach(function (a) { var d = s.t - a; cw += d; if (d > cm) cm = d; });
      s.pedQ.forEach(function (a) { var d = s.t - a; pw += d; if (d > pm) pm = d; });
      var cn = s.carN + s.carQ.length, pn = s.pedN + s.pedQ.length;
      return {
        carAvg: cn ? (s.carDelay + cw) / cn : 0,
        carMax: cm,
        pedAvg: pn ? (s.pedWait + pw) / pn : 0,
        pedMax: pm,
        viol: s.viol, cars: cn, peds: pn
      };
    }

    return { s: s, step: step, result: result };
  }

  function runAll(p) {
    var sim = create(p);
    while (!sim.s.done) sim.step();
    return sim.result();
  }

  var api = { create: create, runAll: runAll, SCENARIOS: SCENARIOS, DURATION: DURATION, CROSS_TIME: CROSS_TIME };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CrossingSim = api;
})(typeof window !== 'undefined' ? window : this);
