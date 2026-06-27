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

  document.querySelectorAll('[data-architecture-chooser]').forEach(function (wrap) {
    var buttons = Array.prototype.slice.call(wrap.querySelectorAll('[data-architecture-choice]'));
    var views = Array.prototype.slice.call(wrap.querySelectorAll('[data-architecture-view]'));
    function show(name) {
      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', button.getAttribute('data-architecture-choice') === name ? 'true' : 'false');
      });
      views.forEach(function (view) {
        view.classList.toggle('is-active', view.getAttribute('data-architecture-view') === name);
      });
    }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () { show(button.getAttribute('data-architecture-choice')); });
    });
    if (buttons[0]) show(buttons[0].getAttribute('data-architecture-choice'));
  });

  document.querySelectorAll('[data-state-workbench]').forEach(function (wrap) {
    var buttons = Array.prototype.slice.call(wrap.querySelectorAll('[data-state-add]'));
    var layers = Array.prototype.slice.call(wrap.querySelectorAll('[data-state-layer]'));
    var resetState = wrap.querySelector('[data-state-reset]');
    var empty = wrap.querySelector('[data-state-empty]');
    function refreshEmpty() {
      if (empty) empty.style.display = layers.some(function (layer) { return layer.classList.contains('is-visible'); }) ? 'none' : 'grid';
    }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var name = button.getAttribute('data-state-add');
        buttons.forEach(function (item) { item.classList.toggle('is-active', item === button); });
        var layer = wrap.querySelector('[data-state-layer="' + name + '"]');
        if (layer) layer.classList.add('is-visible');
        button.classList.add('is-complete');
        refreshEmpty();
      });
    });
    if (resetState) resetState.addEventListener('click', function () {
      buttons.forEach(function (button) { button.classList.remove('is-active', 'is-complete'); });
      layers.forEach(function (layer) { layer.classList.remove('is-visible'); });
      refreshEmpty();
    });
    refreshEmpty();
  });

  document.querySelectorAll('[data-agent-inspector]').forEach(function (wrap) {
    var buttons = Array.prototype.slice.call(wrap.querySelectorAll('[data-agent-pick]'));
    var name = wrap.querySelector('[data-contract-name]');
    var role = wrap.querySelector('[data-contract-role]');
    var fields = ['needs', 'writes', 'triggers', 'signals'];
    function show(button) {
      buttons.forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
      if (name) name.textContent = button.getAttribute('data-name');
      if (role) role.textContent = button.getAttribute('data-role');
      fields.forEach(function (field) {
        var target = wrap.querySelector('[data-contract-' + field + ']');
        if (!target) return;
        target.innerHTML = '';
        (button.getAttribute('data-' + field) || '').split('|').forEach(function (text) {
          var li = document.createElement('li');
          li.textContent = text;
          target.appendChild(li);
        });
      });
    }
    buttons.forEach(function (button) { button.addEventListener('click', function () { show(button); }); });
    if (buttons[0]) show(buttons[0]);
  });

  document.querySelectorAll('[data-strategy-console]').forEach(function (wrap) {
    var buttons = Array.prototype.slice.call(wrap.querySelectorAll('[data-question-pick]'));
    var title = wrap.querySelector('[data-strategy-title]');
    var pattern = wrap.querySelector('[data-strategy-pattern]');
    var reason = wrap.querySelector('[data-strategy-reason]');
    var flow = wrap.querySelector('[data-strategy-flow]');
    function show(button) {
      buttons.forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
      if (title) title.textContent = button.getAttribute('data-title');
      if (pattern) pattern.textContent = button.getAttribute('data-pattern');
      if (reason) reason.textContent = button.getAttribute('data-reason');
      if (flow) {
        flow.innerHTML = '';
        (button.getAttribute('data-flow') || '').split('|').forEach(function (step, index, all) {
          var node = document.createElement('div');
          node.className = 'strategy-node' + (step.indexOf('+') >= 0 ? ' is-parallel' : '') + (step.indexOf('Gate') >= 0 ? ' is-gate' : '');
          node.textContent = step;
          flow.appendChild(node);
          if (index < all.length - 1) {
            var arrowNode = document.createElement('span');
            arrowNode.className = 'strategy-arrow';
            arrowNode.textContent = '→';
            flow.appendChild(arrowNode);
          }
        });
      }
    }
    buttons.forEach(function (button) { button.addEventListener('click', function () { show(button); }); });
    if (buttons[0]) show(buttons[0]);
  });

  document.querySelectorAll('[data-failure-lab]').forEach(function (wrap) {
    var buttons = Array.prototype.slice.call(wrap.querySelectorAll('[data-failure-choice]'));
    var detected = wrap.querySelector('[data-failure-detected]');
    var recovery = wrap.querySelector('[data-failure-recovery]');
    var result = wrap.querySelector('[data-failure-result]');
    function show(button) {
      buttons.forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
      if (detected) detected.textContent = button.getAttribute('data-detected');
      if (recovery) recovery.textContent = button.getAttribute('data-recovery');
      if (result) result.textContent = button.getAttribute('data-result');
    }
    buttons.forEach(function (button) { button.addEventListener('click', function () { show(button); }); });
    if (buttons[0]) show(buttons[0]);
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
