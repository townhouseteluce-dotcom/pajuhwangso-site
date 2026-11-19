/* 파주 황소바위마을 — 시안 스크립트 */
(function () {
  'use strict';

  var head = document.getElementById('siteHead');
  var nav = document.getElementById('headNav');
  var menuBtn = document.getElementById('menuBtn');
  var scrim = document.getElementById('navScrim');

  /* ---------- 헤더 스크롤 상태 ---------- */
  var onScroll = function () {
    if (!head) return;
    if (window.scrollY > 40) head.classList.add('is-scrolled');
    else head.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 히어로 영상 ----------
     - 자동재생이 되면 영상이 포스터 위로 부드럽게 드러난다.
     - 저사양·데이터 절약·모션 최소화 환경에서는 포스터 사진만 보여 준다.
     - 화면이 가려지면 재생을 멈춰 배터리·데이터를 아낀다. */
  var heroVideo = document.getElementById('heroVideo');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));

  if (heroVideo) {
    if (reduceMotion || saveData) {
      heroVideo.removeAttribute('autoplay');
      try { heroVideo.pause(); } catch (err) { /* noop */ }
    } else {
      heroVideo.addEventListener('playing', function () {
        heroVideo.classList.add('is-playing');
      });

      var tryPlay = function () {
        var p = heroVideo.play();
        if (p && p.catch) {
          p.catch(function () {
            // 자동재생이 막힌 경우(절전 모드 등) 첫 터치·스크롤에서 한 번 더 시도
            var kick = function () {
              document.removeEventListener('touchstart', kick);
              document.removeEventListener('click', kick);
              var q = heroVideo.play();
              if (q && q.catch) q.catch(function () {});
            };
            document.addEventListener('touchstart', kick, { once: true, passive: true });
            document.addEventListener('click', kick, { once: true });
          });
        }
      };
      tryPlay();

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          try { heroVideo.pause(); } catch (err) { /* noop */ }
        } else {
          tryPlay();
        }
      });
    }
  }

  /* ---------- 모바일 메뉴 ---------- */
  function closeNav() {
    if (!nav || !menuBtn) return;
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', '메뉴 열기');
    document.body.style.overflow = '';
    if (scrim) {
      scrim.classList.remove('is-on');
      setTimeout(function () { if (!scrim.classList.contains('is-on')) scrim.hidden = true; }, 300);
    }
  }
  function openNav() {
    if (!nav || !menuBtn) return;
    if (scrim) { scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('is-on'); }); }
    nav.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', '메뉴 닫기');
    document.body.style.overflow = 'hidden';
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      if (menuBtn.getAttribute('aria-expanded') === 'true') closeNav();
      else openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    if (scrim) scrim.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    var mq = window.matchMedia('(min-width: 1081px)');
    var onMq = function (e) { if (e.matches) closeNav(); };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }

  /* ---------- 스크롤 등장 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 방문 예약 폼 → 문자 보내기 ---------- */
  var form = document.getElementById('bookForm');
  var errBox = document.getElementById('formErr');
  var done = document.getElementById('bookDone');
  var doneBody = document.getElementById('doneBody');
  var smsLink = document.getElementById('smsLink');
  var copyBtn = document.getElementById('copyBtn');
  var editBtn = document.getElementById('editBtn');
  var PHONE = '+821022463579';

  var nameEl = document.getElementById('fName');
  var phoneEl = document.getElementById('fPhone');
  var dateEl = document.getElementById('fDate');
  var typeEl = document.getElementById('fType');
  var msgEl = document.getElementById('fMsg');

  /* 오늘 이전 날짜는 선택하지 않도록 */
  if (dateEl) {
    var t = new Date();
    var iso = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    dateEl.min = iso;
  }

  function showErr(msg) {
    if (!errBox) return;
    errBox.textContent = msg;
    errBox.hidden = false;
  }
  function hideErr() {
    if (!errBox) return;
    errBox.hidden = true;
    errBox.textContent = '';
  }

  function prettyDate(v) {
    if (!v) return '미정 (전화로 협의)';
    var p = v.split('-');
    if (p.length !== 3) return v;
    return p[0] + '년 ' + Number(p[1]) + '월 ' + Number(p[2]) + '일';
  }

  function buildBody() {
    var lines = [
      '[파주 황소바위마을 방문 상담 예약]',
      '성함 : ' + nameEl.value.trim(),
      '연락처 : ' + phoneEl.value.trim(),
      '희망 방문일 : ' + prettyDate(dateEl ? dateEl.value : ''),
      '관심 평형 : ' + (typeEl ? typeEl.value : '')
    ];
    var m = msgEl ? msgEl.value.trim() : '';
    if (m) lines.push('문의 내용 : ' + m);
    lines.push('', '주소 : 경기도 파주시 월롱면 황소바위길 406-1');
    return lines.join('\n');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideErr();

      var name = nameEl.value.trim();
      var phone = phoneEl.value.trim();
      var digits = phone.replace(/[^0-9]/g, '');

      if (!name) {
        showErr('성함을 입력해 주세요.');
        nameEl.focus();
        return;
      }
      if (digits.length < 9) {
        showErr('연락처를 정확히 입력해 주세요. (예: 010-0000-0000)');
        phoneEl.focus();
        return;
      }

      var body = buildBody();
      if (doneBody) doneBody.textContent = body;
      if (smsLink) smsLink.href = 'sms:' + PHONE + '?&body=' + encodeURIComponent(body);

      form.hidden = true;
      if (done) {
        done.hidden = false;
        done.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  if (editBtn) {
    editBtn.addEventListener('click', function () {
      if (done) done.hidden = true;
      if (form) {
        form.hidden = false;
        nameEl.focus();
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = doneBody ? doneBody.textContent : '';
      var label = copyBtn.textContent;
      var ok = function () {
        copyBtn.textContent = '복사되었습니다';
        setTimeout(function () { copyBtn.textContent = label; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, function () { fallbackCopy(text, ok); });
      } else {
        fallbackCopy(text, ok);
      }
    });
  }

  function fallbackCopy(text, ok) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); ok(); } catch (err) { /* noop */ }
    document.body.removeChild(ta);
  }
})();
