/* ============================================================
   Apple-style Lockscreen / Passcode
   ============================================================ */
(function () {
  'use strict';

  var PIN = '000000';
  var PIN_LENGTH = PIN.length;

  var lockscreen = document.getElementById('lockscreen');
  var passcode   = document.getElementById('passcode');
  var home       = document.getElementById('home');
  var lockTime   = document.getElementById('lock-time');
  var statusTime = document.getElementById('status-time');
  var statusDate = document.getElementById('status-date');
  var dotsEl     = document.getElementById('dots');
  var dots       = Array.prototype.slice.call(dotsEl.querySelectorAll('.dot'));
  var cancelBtn  = document.getElementById('cancel');

  var entered = '';
  var locked  = false;   // blockt Eingaben während der Prüf-Animation
  var state   = 'lock';  // 'lock' | 'pass' | 'home'

  /* ---------- Live-Uhr ---------- */
  var DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function renderClock() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var time = h + ':' + (m < 10 ? '0' + m : m);

    lockTime.textContent   = time;
    statusTime.textContent = time;
    statusDate.textContent = DAYS[now.getDay()] + ' ' +
                             MONTHS[now.getMonth()] + ' ' + now.getDate();
  }
  renderClock();
  setInterval(renderClock, 1000);

  /* ---------- Screen-Wechsel ---------- */
  function showPasscode() {
    if (state !== 'lock') return;
    state = 'pass';
    lockscreen.classList.remove('is-dragging');
    lockscreen.style.transform = '';
    lockscreen.style.opacity   = '';
    lockscreen.classList.add('is-hidden');
    passcode.classList.add('is-active');
  }

  function showLockscreen() {
    if (state !== 'pass') return;
    state = 'lock';
    reset();
    passcode.classList.remove('is-active');
    lockscreen.classList.remove('is-hidden');
  }

  function showHome() {
    state = 'home';
    passcode.classList.remove('is-active');
    home.classList.add('is-active');
  }

  /* ---------- Punkte ---------- */
  function renderDots() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('filled', i < entered.length);
    }
  }

  function reset() {
    entered = '';
    renderDots();
  }

  /* ---------- Eingabe ---------- */
  function pushDigit(d) {
    if (state !== 'pass' || locked) return;
    if (entered.length >= PIN_LENGTH) return;

    entered += d;
    renderDots();

    if (entered.length === PIN_LENGTH) {
      locked = true;
      window.setTimeout(check, 180);
    }
  }

  function deleteDigit() {
    if (state !== 'pass' || locked) return;
    if (entered.length === 0) {
      showLockscreen();   // Cancel bei leerer Eingabe -> zurück zum Lockscreen
      return;
    }
    entered = entered.slice(0, -1);
    renderDots();
  }

  function check() {
    if (entered === PIN) {
      showHome();
      window.setTimeout(function () { reset(); locked = false; }, 500);
      return;
    }
    dotsEl.classList.add('shake');
    window.setTimeout(function () {
      dotsEl.classList.remove('shake');
      reset();
      locked = false;
    }, 450);
  }

  /* ---------- Keypad ---------- */
  var keys = document.querySelectorAll('.key');
  Array.prototype.forEach.call(keys, function (key) {
    key.addEventListener('click', function () {
      pushDigit(key.getAttribute('data-digit'));
    });
  });

  cancelBtn.addEventListener('click', deleteDigit);

  /* ---------- Tastatur (Desktop / externes iPad-Keyboard) ---------- */
  document.addEventListener('keydown', function (e) {
    if (state === 'lock') {
      if (e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showPasscode();
      }
      return;
    }
    if (state !== 'pass') return;

    if (e.key >= '0' && e.key <= '9') {
      pushDigit(e.key);
      flash(document.querySelector('.key[data-digit="' + e.key + '"]'));
    } else if (e.key === 'Backspace' || e.key === 'Escape') {
      e.preventDefault();
      deleteDigit();
    }
  });

  function flash(el) {
    if (!el) return;
    el.classList.add('pressed');
    window.setTimeout(function () { el.classList.remove('pressed'); }, 110);
  }

  /* ---------- Swipe nach oben ---------- */
  var startY = null;
  var moved  = 0;
  var THRESHOLD = 70;

  function dragStart(y) {
    if (state !== 'lock') return;
    startY = y;
    moved  = 0;
    lockscreen.classList.add('is-dragging');
  }

  function dragMove(y) {
    if (startY === null || state !== 'lock') return;
    moved = y - startY;
    if (moved > 0) moved = 0;                 // nur nach oben
    var limit = window.innerHeight;
    var offset = Math.max(moved, -limit);
    lockscreen.style.transform = 'translate3d(0,' + offset + 'px,0)';
    lockscreen.style.opacity = String(Math.max(0, 1 + offset / (limit * 0.55)));
  }

  function dragEnd() {
    if (startY === null) return;
    startY = null;
    lockscreen.classList.remove('is-dragging');
    if (-moved > THRESHOLD) {
      showPasscode();
    } else {
      lockscreen.style.transform = '';
      lockscreen.style.opacity   = '';
    }
    moved = 0;
  }

  lockscreen.addEventListener('touchstart', function (e) {
    dragStart(e.touches[0].clientY);
  }, { passive: true });

  lockscreen.addEventListener('touchmove', function (e) {
    dragMove(e.touches[0].clientY);
  }, { passive: true });

  lockscreen.addEventListener('touchend', dragEnd);
  lockscreen.addEventListener('touchcancel', dragEnd);

  lockscreen.addEventListener('mousedown', function (e) { dragStart(e.clientY); });
  window.addEventListener('mousemove', function (e) { dragMove(e.clientY); });
  window.addEventListener('mouseup', dragEnd);

  lockscreen.addEventListener('wheel', function (e) {
    if (state === 'lock' && e.deltaY > 12) showPasscode();
  }, { passive: true });

  /* ---------- Doppeltipp-Zoom / Kontextmenü unterbinden ---------- */
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  renderDots();
})();
