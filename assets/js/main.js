/* nail.lounge — клиентская логика. Без зависимостей.
   Меню, запись, фильтр работ, «до и после», карта, cookie-баннер.

   Настройки приходят из разметки: window.NL_CONFIG. Если bookingEndpoint
   пустой, форма не исчезает — она собирает готовое сообщение и передаёт
   его в мессенджер. Так запись работает на статике, без сервера. */
(function () {
  'use strict';

  var CONFIG = window.NL_CONFIG || {};
  var ENDPOINT = CONFIG.bookingEndpoint || '';
  var PHONE = CONFIG.phone || '';
  var COOKIE_KEY = 'nl-cookie-choice';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* --- Меню на телефоне ------------------------------------------------ */
  (function menu() {
    var burger = $('.burger');
    var panel = $('#mobile-menu');
    if (!burger || !panel) return;

    var close = function () {
      burger.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    };

    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
    $$('a', panel).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        close();
        burger.focus();
      }
    });
  })();

  /* --- Окно записи ------------------------------------------------------ */
  var modal = (function () {
    var dialog = $('#booking-modal');
    if (!dialog) return { open: function () {} };
    var lastFocused = null;

    function setSelect(select, value) {
      if (!select || !value) return;
      var found = $$('option', select).some(function (o) {
        if (o.value === value || o.textContent.indexOf(value) === 0) { select.value = o.value; return true; }
        return false;
      });
      if (!found) select.value = '';
    }

    function open(master, service) {
      var form = $('#booking-form-modal');
      if (form) {
        setSelect($('[data-master-select]', form), master);
        setSelect($('[data-service-select]', form), service);
      }
      lastFocused = document.activeElement;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      var first = $('.channel', dialog) || $('input, select, button', dialog);
      if (first) first.focus();
    }

    function close() {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      if (lastFocused) lastFocused.focus();
    }

    dialog.addEventListener('click', function (e) {
      // Клик по затемнённому фону — за пределами внутренней карточки.
      if (e.target === dialog) close();
      if (e.target.closest('[data-close-modal]')) close();
    });

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-book]');
      if (!trigger) return;
      e.preventDefault();
      open(trigger.getAttribute('data-master') || '', trigger.getAttribute('data-service') || '');
    });

    return { open: open, close: close };
  })();

  /* --- Телефон: подсказываем формат, но не мешаем вводить -------------- */
  $$('[data-phone]').forEach(function (input) {
    input.addEventListener('input', function () {
      var digits = input.value.replace(/\D/g, '').replace(/^375/, '');
      if (!digits) { input.value = ''; return; }
      var out = '+375';
      if (digits.length) out += ' ' + digits.slice(0, 2);
      if (digits.length > 2) out += ' ' + digits.slice(2, 5);
      if (digits.length > 5) out += '-' + digits.slice(5, 7);
      if (digits.length > 7) out += '-' + digits.slice(7, 9);
      input.value = out;
    });
  });

  /* --- Дата: не даём выбрать вчерашний день ---------------------------- */
  $$('[data-date]').forEach(function (input) {
    var today = new Date();
    input.min = today.toISOString().slice(0, 10);
    var limit = new Date(today.getTime() + 90 * 864e5);
    input.max = limit.toISOString().slice(0, 10);
  });

  /* --- Форма записи ----------------------------------------------------- */
  function fieldError(form, name, message) {
    var box = $('[data-error-for="' + name + '"]', form);
    var input = form.elements[name];
    if (box) box.textContent = message || '';
    if (input && input.setAttribute) {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }

  function validate(form) {
    var ok = true;
    var name = (form.elements.name.value || '').trim();
    var phone = (form.elements.phone.value || '').replace(/\D/g, '');

    fieldError(form, 'name', '');
    fieldError(form, 'phone', '');
    fieldError(form, 'consent', '');

    if (name.length < 2) { fieldError(form, 'name', 'Напишите, как к вам обращаться'); ok = false; }
    if (phone.length < 11) { fieldError(form, 'phone', 'Телефон нужен, чтобы подтвердить запись'); ok = false; }
    if (form.elements.consent && !form.elements.consent.checked) {
      fieldError(form, 'consent', 'Без согласия мы не можем обработать заявку');
      ok = false;
    }
    if (!ok) {
      var bad = $('[aria-invalid="true"], [data-error-for]:not(:empty)', form);
      if (bad && bad.focus) bad.focus();
    }
    return ok;
  }

  function collect(form) {
    var get = function (n) { return form.elements[n] ? String(form.elements[n].value || '').trim() : ''; };
    return {
      name: get('name'),
      phone: get('phone'),
      service: get('service'),
      master: get('master'),
      date: get('date'),
      time: get('time'),
      comment: get('comment'),
    };
  }

  function asMessage(data) {
    var lines = ['Здравствуйте! Хочу записаться.'];
    lines.push('Имя: ' + data.name);
    lines.push('Телефон: ' + data.phone);
    if (data.service) lines.push('Услуга: ' + data.service);
    if (data.master) lines.push('Мастер: ' + data.master);
    if (data.date) lines.push('Дата: ' + data.date);
    if (data.time) lines.push('Время: ' + data.time);
    if (data.comment) lines.push('Комментарий: ' + data.comment);
    return lines.join('\n');
  }

  $$('form.form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) return;

      var data = collect(form);
      var done = $('.form__done', form);
      var send = $('.form__send', form);
      var button = $('button[type="submit"]', form);

      var finish = function (text) {
        if (done) {
          if (text) $('strong', done).textContent = text;
          done.hidden = false;
        }
        if (send) send.hidden = false;
        goal('booking');
      };

      if (ENDPOINT) {
        if (button) { button.disabled = true; button.textContent = 'Отправляем…'; }
        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
          .then(function (r) {
            if (!r.ok) throw new Error('bad status');
            form.reset();
            finish('Заявка отправлена.');
          })
          .catch(function () {
            // Сеть подвела — не теряем заявку, предлагаем мессенджер.
            prepareLinks(form, data);
            finish('Не получилось отправить автоматически.');
          })
          .then(function () {
            if (button) { button.disabled = false; button.textContent = 'Записаться'; }
          });
        return;
      }

      prepareLinks(form, data);
      finish('Заявка готова.');
    });
  });

  /* Готовое сообщение подставляем в ссылки мессенджеров: на статике это
     надёжнее почты — заявка уходит туда, где администратор и так сидит. */
  function prepareLinks(form, data) {
    var text = asMessage(data);
    var send = $('.form__send', form);
    if (!send) return;
    $$('[data-send]', send).forEach(function (a) {
      var kind = a.getAttribute('data-send');
      var digits = PHONE.replace(/\D/g, '');
      if (kind === 'telegram') a.href = 'https://t.me/share/url?url=&text=' + encodeURIComponent(text);
      if (kind === 'whatsapp') a.href = 'https://wa.me/' + digits + '?text=' + encodeURIComponent(text);
      if (kind === 'viber') a.href = 'viber://chat?number=%2B' + digits;
      if (kind === 'copy') {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var write = navigator.clipboard && navigator.clipboard.writeText
            ? navigator.clipboard.writeText(text)
            : Promise.reject();
          write.then(function () { a.textContent = 'Скопировано'; })
            .catch(function () { window.prompt('Скопируйте текст заявки', text); });
        }, { once: true });
      }
    });
    var area = $('[data-message]', send);
    if (area) area.value = text;
  }

  /* --- Фильтр работ ----------------------------------------------------- */
  (function worksFilter() {
    var gallery = $('[data-gallery]');
    if (!gallery) return;
    var state = { direction: 'all', master: 'all' };

    function apply() {
      var shown = 0;
      $$('[data-work]', gallery).forEach(function (item) {
        var okDir = state.direction === 'all' || item.getAttribute('data-direction') === state.direction;
        var okMaster = state.master === 'all' || item.getAttribute('data-master') === state.master;
        var visible = okDir && okMaster;
        item.classList.toggle('is-hidden', !visible);
        if (visible) shown++;
      });
      var empty = $('[data-empty]');
      if (empty) empty.hidden = shown > 0;
      var counter = $('[data-count]');
      if (counter) counter.textContent = String(shown);
    }

    $$('[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var group = chip.getAttribute('data-filter');
        state[group] = chip.getAttribute('data-value');
        $$('[data-filter="' + group + '"]').forEach(function (c) {
          c.setAttribute('aria-pressed', String(c === chip));
        });
        apply();
      });
    });
    apply();
  })();

  /* --- «До и после» ----------------------------------------------------- */
  $$('[data-ba]').forEach(function (box) {
    var range = $('input[type="range"]', box);
    var after = $('.ba__after', box);
    if (!range || !after) return;
    var move = function () { after.style.width = range.value + '%'; };
    range.addEventListener('input', move);
    move();
  });

  /* --- Якоря на странице цен: подсвечиваем текущий раздел -------------- */
  (function priceNav() {
    var nav = $('.pricenav');
    if (!nav || !('IntersectionObserver' in window)) return;
    var links = $$('a', nav);
    var sections = links
      .map(function (a) { return document.getElementById(a.getAttribute('href').replace(/^.*#/, '')); })
      .filter(Boolean);
    if (!sections.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href').replace(/^.*#/, '') === entry.target.id);
        });
      });
    }, { rootMargin: '-140px 0px -70% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* --- Карта по клику: iframe тянет много и тормозит первый экран ------ */
  $$('[data-map]').forEach(function (box) {
    var button = $('button', box);
    if (!button) return;
    button.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = box.getAttribute('data-map');
      frame.loading = 'lazy';
      frame.title = 'Карта: как нас найти';
      frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      box.innerHTML = '';
      box.appendChild(frame);
    });
  });

  /* --- Cookie-баннер ---------------------------------------------------- */
  (function cookies() {
    var bar = $('#cookiebar');
    if (!bar) return;
    var stored = null;
    try { stored = localStorage.getItem(COOKIE_KEY); } catch (e) { stored = null; }
    if (stored) {
      if (stored === 'accept') loadAnalytics();
      return;
    }
    bar.hidden = false;
    $$('[data-cookie]', bar).forEach(function (button) {
      button.addEventListener('click', function () {
        var choice = button.getAttribute('data-cookie');
        try { localStorage.setItem(COOKIE_KEY, choice); } catch (e) { /* приватный режим */ }
        bar.hidden = true;
        if (choice === 'accept') loadAnalytics();
      });
    });
  })();

  /* Аналитику подключаем только после согласия — требование для РБ. */
  function loadAnalytics() {
    if (CONFIG.metrikaId) {
      window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
      window.ym.l = 1 * new Date();
      var s = document.createElement('script');
      s.src = 'https://mc.yandex.ru/metrika/tag.js';
      s.async = true;
      document.head.appendChild(s);
      window.ym(CONFIG.metrikaId, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
    }
    if (CONFIG.gaId) {
      var g = document.createElement('script');
      g.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.gaId;
      g.async = true;
      document.head.appendChild(g);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', CONFIG.gaId);
    }
  }

  function goal(name) {
    if (window.ym && CONFIG.metrikaId) window.ym(CONFIG.metrikaId, 'reachGoal', name);
    if (window.gtag) window.gtag('event', name);
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-goal]');
    if (target) goal(target.getAttribute('data-goal'));
  });
})();
