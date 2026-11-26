/* Minimal SCORM 1.2 runtime wrapper.
   Looks for the LMS API up the frame chain. If none is found (opened as a plain
   web page) it falls back to localStorage so the activity still works. */
(function (w) {
  'use strict';

  function findAPI(win) {
    var hops = 0;
    while (win && !win.API && win.parent && win.parent !== win && hops < 10) {
      win = win.parent;
      hops++;
    }
    return win && win.API ? win.API : null;
  }

  var api = findAPI(w) || (w.opener ? findAPI(w.opener) : null);
  var ready = false;
  var started = Date.now();
  var KEY = 'gamemob-scorm:' + w.location.pathname;

  function pad(n, len) { n = String(n); while (n.length < len) n = '0' + n; return n; }

  function sessionTime() {
    var s = Math.round((Date.now() - started) / 1000);
    return pad(Math.floor(s / 3600), 4) + ':' + pad(Math.floor(s % 3600 / 60), 2) + ':' + pad(s % 60, 2);
  }

  function get(el) { try { return String(api.LMSGetValue(el)); } catch (e) { return ''; } }
  function set(el, v) { try { api.LMSSetValue(el, String(v)); } catch (e) { /* ignore */ } }

  var SCORM = {
    standalone: !api,

    init: function () {
      if (api) {
        ready = String(api.LMSInitialize('')) === 'true';
        if (ready) {
          var st = get('cmi.core.lesson_status');
          if (!st || st === 'not attempted') set('cmi.core.lesson_status', 'incomplete');
          api.LMSCommit('');
        }
      }
      return this.getState();
    },

    getState: function () {
      try {
        var raw = (api && ready) ? get('cmi.suspend_data') : w.localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) { return {}; }
    },

    setState: function (obj) {
      var s = JSON.stringify(obj);
      if (s.length > 3500) return; /* SCORM 1.2 allows 4096 chars */
      if (api && ready) { set('cmi.suspend_data', s); api.LMSCommit(''); }
      else { try { w.localStorage.setItem(KEY, s); } catch (e) { /* ignore */ } }
    },

    /* status: 'completed' | 'passed'. score: 0-100 or null. */
    complete: function (status, score) {
      if (api && ready) {
        var cur = get('cmi.core.lesson_status');
        if (cur === 'passed' && status === 'completed') status = 'passed';
        if (score !== null && score !== undefined) {
          set('cmi.core.score.min', 0);
          set('cmi.core.score.max', 100);
          set('cmi.core.score.raw', Math.round(score));
        }
        set('cmi.core.lesson_status', status);
        api.LMSCommit('');
      }
      try { w.dispatchEvent(new CustomEvent('scorm-complete', { detail: status })); } catch (e) { /* ignore */ }
    },

    finish: function () {
      if (api && ready) {
        set('cmi.core.session_time', sessionTime());
        api.LMSCommit('');
        api.LMSFinish('');
        ready = false;
      }
    }
  };

  w.addEventListener('pagehide', function () { SCORM.finish(); });
  w.addEventListener('beforeunload', function () { SCORM.finish(); });
  w.SCORM = SCORM;
})(window);
