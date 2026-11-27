/* Anonymous usage statistics with GoatCounter (no cookies, no accounts, no names).
   Nothing is loaded or sent while the address below is empty. To switch statistics on, create a
   GoatCounter site and put its count address here, e.g. "https://yourcode.goatcounter.com/count".
   If you change what is sent, update privacy.html too. */
const ANALYTICS_ENDPOINT = 'https://gpapava.goatcounter.com/count';

const Analytics = (function () {
  const SENT_KEY = 'gamemob_mooc_stats_sent_v1';
  // visitors whose browser asks not to be tracked are left out
  const optedOut = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  const enabled = Boolean(ANALYTICS_ENDPOINT) && !optedOut;
  const queue = [];

  function flush() {
    if (!window.goatcounter || !window.goatcounter.count) return;
    while (queue.length) window.goatcounter.count(queue.shift());
  }

  if (enabled) {
    window.goatcounter = { no_onload: true };   // page views are counted by hand, below
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = ANALYTICS_ENDPOINT;
    s.onload = flush;
    document.head.appendChild(s);
  }

  function send(data) {
    if (!enabled) return;
    queue.push(data);
    flush();
  }

  function sent() {
    try { return JSON.parse(localStorage.getItem(SENT_KEY)) || {}; } catch (e) { return {}; }
  }

  return {
    /* A page or course item was opened, e.g. view('learn/m1l1'). */
    view(path) { send({ path: `${LANG}/${path}`, title: path }); },

    /* Something happened, e.g. event('download/m1'). */
    event(name) { send({ path: `${name}/${LANG}`, title: name, event: true }); },

    /* Like event(), but counted only the first time on this device, in any language.
       Events that share a key count as the same one. */
    once(name, key = name) {
      if (!enabled) return;
      const done = sent();
      if (done[key]) return;
      done[key] = true;
      try { localStorage.setItem(SENT_KEY, JSON.stringify(done)); } catch (e) { /* storage unavailable */ }
      this.event(name);
    }
  };
})();
