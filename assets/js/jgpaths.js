/* ============================================================
   jgpaths.js — JG Paths Database (Google Sheets CSV)
   Fetches, parses and renders S16 jungle clear data.
   Champion icons via noxelisdev/LoL_DDragon (Data Dragon mirror).
   ============================================================ */
(function () {
  'use strict';

  var SHEET_CSV   = 'https://docs.google.com/spreadsheets/d/1jE8bnlnIJnmWv9pnVW9veMKRXJNaaJf5tneQB3xUkbI/export?format=csv&gid=1938238048';
  var ICON_BASE   = 'https://raw.githubusercontent.com/noxelisdev/LoL_DDragon/master/latest/img/champion/';

  var allEntries   = [];
  var activeFilter = 'all';
  var searchQuery  = '';

  /* ── Champion name → Data Dragon key ── */
  var CHAMP_EXCEPTIONS = {
    'wukong':           'MonkeyKing',
    "bel'veth":         'Belveth',
    "cho'gath":         'Chogath',
    "dr. mundo":        'DrMundo',
    "dr mundo":         'DrMundo',
    "fiddlesticks":     'Fiddlesticks',
    "jarvan iv":        'JarvanIV',
    "k'sante":          'KSante',
    "kai'sa":           'Kaisa',
    "kha'zix":          'Khazix',
    "kog'maw":          'KogMaw',
    "leblanc":          'Leblanc',
    "lee sin":          'LeeSin',
    "master yi":        'MasterYi',
    "miss fortune":     'MissFortune',
    "nunu & willump":   'Nunu',
    "rek'sai":          'RekSai',
    "renata glasc":     'Renata',
    "tahm kench":       'TahmKench',
    "twisted fate":     'TwistedFate',
    "vel'koz":          'Velkoz',
    "xin zhao":         'XinZhao',
    "aurelion sol":     'AurelionSol',
  };

  function toChampKey(name) {
    var lower = name.toLowerCase().trim();
    if (CHAMP_EXCEPTIONS[lower]) return CHAMP_EXCEPTIONS[lower];
    // Default: PascalCase each word, strip apostrophes/dots/ampersands
    return name
      .trim()
      .split(/\s+/)
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
      .join('')
      .replace(/['\.\&]/g, '');
  }

  function iconUrl(champion) {
    return ICON_BASE + toChampKey(champion) + '.png';
  }

  /* ── CSV parser ── */
  function parseLine(line) {
    var cells = [], cur = '', inQ = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (c === ',' && !inQ) { cells.push(cur.trim()); cur = ''; }
      else cur += c;
    }
    cells.push(cur.trim());
    return cells;
  }

  function parseCSV(text) {
    return text.split(/\r?\n/).filter(function (l) { return l.trim(); }).map(parseLine);
  }

  /* ── Category detection ── */
  function detectCat(row) {
    var t = (row[0] || '').trim();
    if (/non.?meta|no.?meta/i.test(t)) return 'non-meta';
    if (/off.?meta/i.test(t))          return 'off-meta';
    if (/\bmeta\b/i.test(t) && /jungler/i.test(t)) return 'meta';
    return null;
  }

  function isDataRow(row) {
    return /^\d{1,2}:\d{2}/.test((row[4] || '').trim());
  }

  /* ── Build entries ── */
  function processRows(rows) {
    var entries = [], cat = 'meta', stop = false;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var first = (row[0] || '').toLowerCase();

      if (/helpful resources|appendix|outdated/i.test(first)) { stop = true; }
      if (stop) continue;

      var detected = detectCat(row);
      if (detected) { cat = detected; continue; }
      if (!isDataRow(row)) continue;

      var champion = (row[0] || '').trim();
      if (!champion) continue;

      var video = (row[6] || '').trim();
      if (video && !/^https?:\/\//i.test(video)) video = '';

      entries.push({
        champion: champion,
        patch:    (row[1] || '').trim(),
        camps:    (row[2] || '').trim(),
        smite:    (row[3] || '').trim(),
        time:     (row[4] || '').trim(),
        path:     (row[5] || '').trim(),
        video:    video,
        creator:  (row[7] || '').trim(),
        notes:    (row[8] || '').trim(),
        category: cat
      });
    }
    return entries;
  }

  /* ── Video embed helpers ── */
  function youtubeId(url) {
    // Handles youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
    var m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function bilibiliId(url) {
    var m = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
    return m ? m[1] : null;
  }

  function embedUrl(rawUrl) {
    if (!rawUrl) return null;
    var yt = youtubeId(rawUrl);
    if (yt) return 'https://www.youtube.com/embed/' + yt + '?autoplay=1&rel=0';
    var bv = bilibiliId(rawUrl);
    if (bv) return 'https://player.bilibili.com/player.html?bvid=' + bv + '&autoplay=1';
    return null;
  }

  /* ── Helpers ── */
  function toSecs(t) {
    var m = t.match(/^(\d+):(\d{2})/);
    return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 999;
  }

  function timeClass(t) {
    var s = toSecs(t);
    if (s <= 150) return 'teal';
    if (s <= 185) return 'gold';
    return 'crimson';
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function catLabel(c) {
    if (c === 'off-meta') return 'Off-Meta';
    if (c === 'non-meta') return 'No Meta';
    return 'Meta';
  }

  /* Icon with fallback to styled initial */
  function iconHtml(champion) {
    var src    = esc(iconUrl(champion));
    var alt    = esc(champion);
    var init   = esc(champion.charAt(0).toUpperCase());
    return (
      '<div class="jgp-icon">' +
        '<img ' +
          'src="' + src + '" ' +
          'alt="' + alt + '" ' +
          'loading="lazy" ' +
          'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'" ' +
        '/>' +
        '<span class="jgp-icon-fallback" style="display:none">' + init + '</span>' +
      '</div>'
    );
  }

  /* ── Render ── */
  function renderCards(list) {
    if (!list.length) {
      return '<div class="jgp-empty">// Sin resultados — prueba otro término.</div>';
    }
    return list.map(function (e) {
      var tc = timeClass(e.time);
      var embed = embedUrl(e.video);
      var videoBtn = e.video
        ? (embed
            ? '<button class="jgp-video" type="button" data-vid-url="' + esc(embed) + '" data-vid-raw="' + esc(e.video) + '" data-vid-title="' + esc(e.champion) + '">Ver vídeo <span aria-hidden="true">▶</span></button>'
            : '<a class="jgp-video" href="' + esc(e.video) + '" target="_blank" rel="noopener noreferrer">Ver vídeo <span aria-hidden="true">→</span></a>')
        : '';
      return (
        '<article class="jgp-card">' +
          '<div class="jgp-card-head">' +
            iconHtml(e.champion) +
            '<div class="jgp-card-meta">' +
              '<span class="jgp-champ-name">' + esc(e.champion) + '</span>' +
              '<span class="jgp-cat jgp-cat--' + esc(e.category) + '">' + catLabel(e.category) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="jgp-pills">' +
            (e.time  ? '<span class="pill ' + tc + '">' + esc(e.time) + '</span>' : '') +
            (e.patch ? '<span class="pill">p' + esc(e.patch) + '</span>' : '') +
            (e.camps ? '<span class="pill">' + esc(e.camps) + ' camps</span>' : '') +
            (e.smite ? '<span class="pill">' + esc(e.smite) + ' smite</span>' : '') +
          '</div>' +
          (e.path  ? '<div class="jgp-path">'  + esc(e.path)  + '</div>' : '') +
          (e.notes ? '<div class="jgp-notes">' + esc(e.notes) + '</div>' : '') +
          '<div class="jgp-card-foot">' +
            (e.creator ? '<span class="jgp-creator">por ' + esc(e.creator) + '</span>' : '<span></span>') +
            videoBtn +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function filterAndRender() {
    var list = allEntries;

    if (activeFilter !== 'all') {
      list = list.filter(function (e) { return e.category === activeFilter; });
    }

    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      list = list.filter(function (e) {
        return (
          e.champion.toLowerCase().indexOf(q) !== -1 ||
          e.creator.toLowerCase().indexOf(q) !== -1 ||
          e.path.toLowerCase().indexOf(q) !== -1 ||
          e.notes.toLowerCase().indexOf(q) !== -1
        );
      });
    }

    list = list.slice().sort(function (a, b) { return toSecs(a.time) - toSecs(b.time); });

    var counter = document.getElementById('jgpaths-count');
    if (counter) counter.textContent = list.length + ' entr' + (list.length === 1 ? 'ada' : 'adas');

    var container = document.getElementById('jgpaths-results');
    if (container) container.innerHTML = renderCards(list);
  }

  /* ── Init ── */
  function init() {
    var container = document.getElementById('jgpaths-results');
    if (!container) return;

    fetch(SHEET_CSV)
      .then(function (r) { return r.text(); })
      .then(function (text) {
        allEntries = processRows(parseCSV(text));

        var totalEl = document.getElementById('jgpaths-total');
        if (totalEl) totalEl.textContent = allEntries.length;

        filterAndRender();
      })
      .catch(function () {
        container.innerHTML = '<div class="jgp-empty">// Error al cargar los datos. Recarga la página.</div>';
        var counter = document.getElementById('jgpaths-count');
        if (counter) counter.textContent = '';
      });

    var searchEl = document.getElementById('jgpaths-search');
    if (searchEl) {
      searchEl.addEventListener('input', function (e) {
        searchQuery = e.target.value;
        filterAndRender();
      });
    }

    var filterBtns = document.querySelectorAll('[data-jgp-filter]');
    Array.prototype.forEach.call(filterBtns, function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.getAttribute('data-jgp-filter');
        Array.prototype.forEach.call(filterBtns, function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterAndRender();
      });
    });

    /* ── Video modal ── */
    var modal     = document.getElementById('vid-modal');
    var iframe    = document.getElementById('vid-iframe');
    var titleEl   = document.getElementById('vid-title');
    var externalA = document.getElementById('vid-external');
    var closeBtn  = document.getElementById('vid-close-btn');
    var backdrop  = document.getElementById('vid-close');
    var loadingEl = document.getElementById('vid-loading');

    if (iframe && loadingEl) {
      iframe.addEventListener('load', function () {
        if (iframe.src) loadingEl.classList.add('hidden');
      });
    }

    function openVideo(embedSrc, rawUrl, title) {
      if (!modal || !iframe) return;
      // Show loading state
      if (loadingEl) loadingEl.classList.remove('hidden');
      iframe.src     = embedSrc;
      if (titleEl)   titleEl.textContent = title || '';
      if (externalA) externalA.href = rawUrl;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeVideo() {
      if (!modal || !iframe) return;
      iframe.src = '';
      if (loadingEl) loadingEl.classList.remove('hidden');
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (closeBtn)  closeBtn.addEventListener('click', closeVideo);
    if (backdrop)  backdrop.addEventListener('click', closeVideo);
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeVideo();
    });

    // Event delegation — catches buttons added after initial render
    var resultsEl = document.getElementById('jgpaths-results');
    if (resultsEl) {
      resultsEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-vid-url]');
        if (!btn) return;
        openVideo(
          btn.getAttribute('data-vid-url'),
          btn.getAttribute('data-vid-raw'),
          btn.getAttribute('data-vid-title')
        );
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
