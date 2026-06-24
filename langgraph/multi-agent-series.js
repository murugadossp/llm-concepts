(function () {
  'use strict';
  var root = document.documentElement;

  var themeButtons = document.querySelectorAll('[data-theme-set]');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function getPref() { return root.getAttribute('data-theme-pref') || 'system'; }
  function applyPref(pref) {
    var resolved = pref === 'system' ? (mq.matches ? 'dark' : 'light') : pref;
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-pref', pref);
    try { localStorage.setItem('theme', pref); } catch (e) {}
    themeButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-theme-set') === pref ? 'true' : 'false');
    });
  }
  themeButtons.forEach(function (button) {
    button.addEventListener('click', function () { applyPref(button.getAttribute('data-theme-set')); });
  });
  if (mq.addEventListener) {
    mq.addEventListener('change', function () { if (getPref() === 'system') applyPref('system'); });
  }
  applyPref(getPref());

  var mesh = document.querySelector('.mesh');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches && mesh) mesh.classList.add('is-paused');
  document.addEventListener('visibilitychange', function () {
    if (!mesh) return;
    if (document.hidden) mesh.classList.add('is-paused');
    else if (!reduce.matches) mesh.classList.remove('is-paused');
  });

  document.querySelectorAll('[data-stepper]').forEach(function (stepper) {
    var steps = Array.prototype.slice.call(stepper.querySelectorAll('[data-step]'));
    var prev = stepper.querySelector('[data-step-prev]');
    var next = stepper.querySelector('[data-step-next]');
    var count = stepper.querySelector('[data-step-count]');
    var idx = 0;
    function render() {
      steps.forEach(function (step, i) { step.classList.toggle('is-active', i === idx); });
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === steps.length - 1;
      if (count) count.textContent = (idx + 1) + ' / ' + steps.length;
    }
    if (prev) prev.addEventListener('click', function () { idx = Math.max(0, idx - 1); render(); });
    if (next) next.addEventListener('click', function () { idx = Math.min(steps.length - 1, idx + 1); render(); });
    render();
  });

  document.querySelectorAll('[data-scenarios]').forEach(function (wrap) {
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[data-scenario-tab]'));
    var panels = Array.prototype.slice.call(wrap.querySelectorAll('[data-scenario-panel]'));
    function show(name) {
      tabs.forEach(function (tab) {
        tab.setAttribute('aria-pressed', tab.getAttribute('data-scenario-tab') === name ? 'true' : 'false');
      });
      panels.forEach(function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-scenario-panel') === name);
      });
    }
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { show(tab.getAttribute('data-scenario-tab')); });
    });
    if (tabs[0]) show(tabs[0].getAttribute('data-scenario-tab'));
  });

  var quizBlocks = Array.prototype.slice.call(document.querySelectorAll('.quiz[data-kind="scored"]'));
  var scoreVal = document.getElementById('score-val');
  var totalVal = document.getElementById('score-total');
  var reset = document.getElementById('quiz-reset');
  var score = 0;
  var answered = quizBlocks.map(function () { return false; });
  if (totalVal) totalVal.textContent = quizBlocks.length;

  quizBlocks.forEach(function (block, idx) {
    var opts = Array.prototype.slice.call(block.querySelectorAll('.quiz-opt'));
    var fb = block.querySelector('.quiz-fb');
    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (answered[idx]) return;
        answered[idx] = true;
        var correct = opt.getAttribute('data-correct') === 'true';
        opts.forEach(function (other) {
          if (other.getAttribute('data-correct') === 'true') other.classList.add('correct');
        });
        if (!correct) opt.classList.add('wrong');
        if (correct) {
          score += 1;
          if (scoreVal) scoreVal.textContent = score;
        }
        if (fb) {
          fb.textContent = correct ? 'Correct.' : 'Not quite. The correct answer is highlighted above.';
          fb.classList.add('show');
        }
      });
    });
  });

  if (reset) {
    reset.addEventListener('click', function () {
      score = 0;
      answered = answered.map(function () { return false; });
      if (scoreVal) scoreVal.textContent = '0';
      document.querySelectorAll('.quiz-opt').forEach(function (opt) { opt.classList.remove('correct', 'wrong'); });
      document.querySelectorAll('.quiz-fb').forEach(function (fb) { fb.classList.remove('show'); fb.textContent = ''; });
    });
  }
})();
