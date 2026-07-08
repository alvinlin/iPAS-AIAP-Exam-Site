/*
 * 色系切換（theme.js）— iPAS AI 應用規劃師教材共用腳本
 * 於 <head> 載入（不加 defer），在頁面繪製前套用主題以避免閃爍。
 * 右上角提供 Light/Dark 切換按鈕；選擇存於 localStorage（鍵：ipas-theme），
 * 未選擇時跟隨作業系統的深淺色偏好。
 * 深色配色以各頁既有的 --accent 主題色變數推導（color-mix），
 * 初級綠、中級靛藍、考前琥珀／紫等配色自動對應。
 */
(function () {
  'use strict';
  var KEY = 'ipas-theme';

  /* ---------- 深色樣式 ---------- */
  var css =
    'html[data-theme="dark"]{color-scheme:dark;}' +
    /* 主題變數（教材內容頁） */
    '[data-theme="dark"]{--ink:#d9e0eb;--muted:#8f9bad;--line:#2b3447;--bg:#0d1220;--accent-soft:#1c2434;--accent-bright:var(--accent,#0e7c66);}' +
    '@supports(color:color-mix(in srgb,red,blue)){' +
      '[data-theme="dark"]{--accent-soft:color-mix(in srgb,var(--accent,#0e7c66) 18%,#111827);--accent-bright:color-mix(in srgb,var(--accent,#0e7c66) 55%,#fff);}' +
    '}' +
    '[data-theme="dark"] body{background:var(--bg,#0d1220);color:var(--ink,#d9e0eb);}' +
    '[data-theme="dark"] .wrap{background:#131a29;}' +
    '[data-theme="dark"] nav.toc{background:#0f1522;}' +
    '[data-theme="dark"] nav.toc a:hover,[data-theme="dark"] nav.toc a.active{color:var(--accent-bright);}' +
    '[data-theme="dark"] h3{color:var(--accent-bright);}' +
    '[data-theme="dark"] .term{color:var(--accent-bright);}' +
    '[data-theme="dark"] th{color:var(--accent-bright);}' +
    '[data-theme="dark"] tr:nth-child(even) td{background:#161e2e;}' +
    '[data-theme="dark"] .box.def{background:#152238;}[data-theme="dark"] .box.def .tag{color:#82aaff;}' +
    '[data-theme="dark"] .box.key{background:#2b2210;}[data-theme="dark"] .box.key .tag{color:#f5b74e;}' +
    '[data-theme="dark"] .box.note{background:#122718;}[data-theme="dark"] .box.note .tag{color:#5fd38a;}' +
    '[data-theme="dark"] code{background:#1d2637;}' +
    '[data-theme="dark"] .q{background:#131a29;}' +
    '[data-theme="dark"] .gl{text-decoration-color:var(--accent-bright);}' +
    /* 教材首頁（index.html，無主題變數） */
    '[data-theme="dark"] .container .card{background:#131a29;border-color:#2b3447;}' +
    '[data-theme="dark"] .container .card p{color:#8f9bad;}' +
    '[data-theme="dark"] .container .card h3{color:#d9e0eb;}' +
    '[data-theme="dark"] .acts .ghost{background:transparent;}' +
    '[data-theme="dark"] .res{background:#131a29;border-color:#2b3447;}' +
    '[data-theme="dark"] .res a{color:#8ab4ff;}' +
    '[data-theme="dark"] .legend{color:#8f9bad;}[data-theme="dark"] .legend b{color:#d9e0eb;}' +
    '[data-theme="dark"] footer{color:#7a8699;border-color:#2b3447;}' +
    /* 切換按鈕 */
    '.theme-toggle{position:fixed;top:14px;right:16px;z-index:10000;width:40px;height:40px;border-radius:50%;border:1px solid #d5dbe4;background:#fff;font-size:18px;line-height:1;cursor:pointer;box-shadow:0 2px 10px rgba(15,23,42,.18);display:flex;align-items:center;justify-content:center;padding:0;}' +
    '.theme-toggle:hover{transform:scale(1.08);}' +
    '[data-theme="dark"] .theme-toggle{background:#1c2434;border-color:#334158;box-shadow:0 2px 10px rgba(0,0,0,.5);}' +
    '@media print{.theme-toggle{display:none;}}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- 主題套用 ---------- */
  function preferred() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === 'dark' || v === 'light') return v;
    } catch (e) { /* localStorage 不可用時跟隨系統 */ }
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    var b = document.getElementById('theme-toggle-btn');
    if (b) {
      b.textContent = (t === 'dark') ? '☀️' : '🌙';
      var label = (t === 'dark') ? '切換為淺色模式' : '切換為深色模式';
      b.setAttribute('aria-label', label);
      b.title = label;
    }
  }

  apply(preferred()); // 繪製前先套用，避免閃爍

  /* ---------- 切換按鈕 ---------- */
  function initButton() {
    var b = document.createElement('button');
    b.id = 'theme-toggle-btn';
    b.className = 'theme-toggle';
    b.type = 'button';
    b.addEventListener('click', function () {
      var t = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      try { localStorage.setItem(KEY, t); } catch (e) { }
      apply(t);
    });
    document.body.appendChild(b);
    apply(document.documentElement.getAttribute('data-theme') || 'light');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButton);
  } else {
    initButton();
  }
})();
