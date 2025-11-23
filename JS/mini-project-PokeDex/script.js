'use strict';

const $ = (id) => document.getElementById(id);
const input = $('q');
const searchBtn = $('searchBtn');
const surpriseBtn = $('surpriseBtn');
const cancelBtn = $('cancelBtn');
const statusEl = $('status');
const cardEl = $('card');
const spriteEl = $('sprite');
const metaIdEl = $('meta-id');
const typesEl = $('types');
const statsEl = $('stats');
const histListEl = $('historyList');
const statTpl = $('stat-tpl');

const API = 'https://pokeapi.co/api/v2';
let currentController = null; // AbortController en cours

// Cache des modèles UI (clé: id numérique)
const dexCache = new Map();

// Historique mémoire (persisté en localStorage)
const MAX_HISTORY = 10;
let historyList = [];



function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg || '';
}

function setLoading(isLoading) {
  if (!searchBtn || !surpriseBtn || !cancelBtn) return;
  searchBtn.disabled = !!isLoading;
  surpriseBtn.disabled = !!isLoading;
  cancelBtn.disabled = !isLoading; // activé seulement s'il y a une requête en cours
}

function clearCard() {
  if (spriteEl) { spriteEl.src = ''; spriteEl.hidden = true; }
  if (metaIdEl) metaIdEl.textContent = '—';
  if (typesEl) typesEl.innerHTML = '';
  if (statsEl) statsEl.innerHTML = '';
  const title = cardEl?.querySelector('.title');
  if (title) title.textContent = 'Aucun Pokémon';
  if (cardEl) cardEl.style.removeProperty('--species-color');
}

function renderNotFound(q) {
  clearCard();
  const title = cardEl?.querySelector('.title');
  if (title) title.textContent = `Introuvable : ${q}`;
}

function renderError() {
  clearCard();
  const title = cardEl?.querySelector('.title');
  if (title) title.textContent = 'Erreur réseau';
}

function speciesColorToCss(name) {
  const map = {
    black:   'rgb(40,40,50)',
    blue:    'rgb(50,120,230)',
    brown:   'rgb(150,110,70)',
    gray:    'rgb(120,130,145)',
    green:   'rgb(64,166,74)',
    pink:    'rgb(241,132,205)',
    purple:  'rgb(130,90,200)',
    red:     'rgb(235,80,80)',
    white:   'rgb(245,245,255)',
    yellow:  'rgb(240,180,50)'
  };
  return map[name] || 'rgb(114,176,255)';
}

function applySpeciesColor(colorName) {
  if (cardEl) cardEl.style.setProperty('--species-color', speciesColorToCss(colorName));
}

function typePill(typeName) {
  const span = document.createElement('span');
  span.className = `pill type-${typeName}`;
  span.textContent = typeName;
  return span;
}

function renderStats(stats) {
  statsEl.innerHTML = '';
  stats.forEach(({ name, base }) => {
    let node;
    if (statTpl?.content) {
      node = statTpl.content.firstElementChild.cloneNode(true);
      node.querySelector('.label').textContent = name;
      node.querySelector('.value').textContent = String(base);
      const bar = node.querySelector('.bar > span');
      const pct = Math.max(0, Math.min(100, Math.round((base / 255) * 100)));
      // animation CSS via width
      requestAnimationFrame(() => {
        bar.style.width = pct + '%';
      });
    } else {
      // Fallback sans template
      node = document.createElement('div');
      node.className = 'stat';
      node.innerHTML = `
        <span class="label">${name}</span>
        <div class="bar" aria-hidden="true"><span style="width:0%"></span></div>
        <span class="value">${base}</span>`;
      const bar = node.querySelector('.bar > span');
      const pct = Math.max(0, Math.min(100, Math.round((base / 255) * 100)));
      requestAnimationFrame(() => { bar.style.width = pct + '%'; });
    }
    statsEl.appendChild(node);
  });
}

function renderCard(model) {
  if (!model) return clearCard();
  const { id, name, sprite, types = [], stats = [], speciesColor } = model;
  const title = cardEl?.querySelector('.title');
  if (title) title.textContent = name || '—';
  if (metaIdEl) metaIdEl.textContent = id != null ? String(id) : '—';

  if (spriteEl) {
    if (sprite) { spriteEl.src = sprite; spriteEl.hidden = false; }
    else { spriteEl.src = ''; spriteEl.hidden = true; }
  }

  typesEl.innerHTML = '';
  types.forEach(t => typesEl.appendChild(typePill(t)));

  renderStats(stats);
  applySpeciesColor(speciesColor);
}





function cacheSet(model) {
  if (!model || !model.id) return;
  dexCache.set(Number(model.id), model);
}
function cacheGetById(id) {
  return dexCache.get(Number(id)) || null;
}

function addToHistory(entry) {
  if (!entry || !entry.id || !entry.name) return;
  const id = Number(entry.id);
  historyList = historyList.filter(x => Number(x.id) !== id);
  historyList.unshift({ id, name: entry.name });
  if (historyList.length > MAX_HISTORY) historyList.length = MAX_HISTORY;
  try { localStorage.setItem('pokedx_history', JSON.stringify(historyList)); } catch {}
}
function loadHistory() {
  try {
    const raw = localStorage.getItem('pokedx_history');
    if (raw) historyList = JSON.parse(raw) || [];
  } catch {}
}
function renderHistory() {
  if (!histListEl) return;
  histListEl.innerHTML = '';
  historyList.forEach(item => {
    const li = document.createElement('li');
    li.className = 'hist-item';
    li.innerHTML = `
      <div class="left"><span class="dot"></span><span>${item.name}</span></div>
      <span class="id">#${item.id}</span>`;
    li.addEventListener('click', () => startSearch(String(item.id)));
    histListEl.appendChild(li);
  });
}




function fetchWithTimeout(url, { signal, timeout = 8000, ...init } = {}) {
  const controller = new AbortController();
  const linkAbort = () => controller.abort();

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', linkAbort, { once: true });
  }

  const tid = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...init, signal: controller.signal })
    .finally(() => {
      clearTimeout(tid);
      signal?.removeEventListener('abort', linkAbort);
    });
}

async function retry(fn, { retries = 2, backoffMs = 400 } = {}) {
  let attempt = 0;
  for (;;) {
    try {
      const res = await fn();
      if ('ok' in res && res.ok === false) {
        if (res.status >= 500) throw new Error('HTTP_' + res.status);
        return res; // 4xx: pas de retry
      }
      return res;
    } catch (err) {
      const isAbort = err?.name === 'AbortError';
      const isHttp5xx = /^HTTP_5/.test(err?.message);
      const isNetwork = !isAbort && !isHttp5xx && (err instanceof TypeError);
      const canRetry = (isHttp5xx || isNetwork) && attempt < retries;
      if (!canRetry) throw err;
      const delay = Math.round(backoffMs * Math.pow(2, attempt) * (0.7 + Math.random()*0.6));
      await new Promise(r => setTimeout(r, delay));
      attempt++;
    }
  }
}



async function doFetchAll(query, { signal, timeout = 7000 } = {}) {
  // 1) Normaliser et résoudre l'id via /pokemon/{query}
  const q = String(query || '').trim().toLowerCase();
  if (!q) throw new Error('EMPTY_QUERY');

  const baseRes = await retry(() =>
    fetchWithTimeout(`${API}/pokemon/${encodeURIComponent(q)}`, { signal, timeout })
  );
  if (!baseRes.ok) {
    if (baseRes.status === 404) throw new Error('NOT_FOUND');
    throw new Error('HTTP_' + baseRes.status);
  }
  const baseJson = await baseRes.json();
  const id = baseJson.id;

  // 2) Cache rapide ?
  const cached = cacheGetById(id);
  if (cached) return cached;

  // 3) Parallèle /pokemon/{id} + /pokemon-species/{id}
  const [pRes, sRes] = await Promise.all([
    retry(() => fetchWithTimeout(`${API}/pokemon/${id}`, { signal, timeout })),
    retry(() => fetchWithTimeout(`${API}/pokemon-species/${id}`, { signal, timeout }))
  ]);
  if (!pRes.ok || !sRes.ok) {
    const code = !pRes.ok ? pRes.status : sRes.status;
    if (code === 404) throw new Error('NOT_FOUND');
    throw new Error('HTTP_' + code);
  }
  const [pJson, sJson] = await Promise.all([pRes.json(), sRes.json()]);

  const model = {
    id: pJson.id,
    name: pJson.name,
    sprite: pJson.sprites?.front_default,
    types: (pJson.types || []).map(t => t.type?.name),
    stats: (pJson.stats || []).map(s => ({ name: s.stat?.name, base: s.base_stat })),
    speciesColor: sJson.color?.name || 'blue',
    flavor: (sJson.flavor_text_entries || []).find(e => e.language?.name === 'en')?.flavor_text || null
  };
  return model;
}



async function fetchPokemon(query, { signal, timeout = 7000 } = {}) {
  setLoading(true); setStatus('Recherche…');
  try {
    const model = await doFetchAll(query, { signal, timeout });
    renderCard(model);
    cacheSet(model);
    addToHistory({ id: model.id, name: model.name });
    renderHistory();
    setStatus(`OK : ${model.name} (#${model.id})`);
    return model;
  } catch (err) {
    if (err?.name === 'AbortError') { setStatus('Recherche annulée.'); return; }
    if (err?.message === 'EMPTY_QUERY') { setStatus('Saisis un nom ou un ID.'); return; }
    if (err?.message === 'NOT_FOUND') { renderNotFound(query); setStatus(`Aucun Pokémon « ${query} »`); return; }
    renderError(); setStatus('Oups, problème réseau.');
  } finally {
    setLoading(false);
  }
}



function startSearch(query) {
  // Annuler la précédente
  if (currentController) currentController.abort();
  currentController = new AbortController();
  return fetchPokemon(query, { signal: currentController.signal, timeout: 7000 });
}

cancelBtn?.addEventListener('click', () => {
  currentController?.abort();
});

searchBtn?.addEventListener('click', () => {
  startSearch(input?.value);
});

input?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') startSearch(input.value);
});

surpriseBtn?.addEventListener('click', () => {
  // bornes raisonnables (Kanto..Paldea) — on peut ajuster
  const maxId = 1017; // valeur large; l'API ignore les IDs hors bornes
  const rnd = Math.max(1, Math.floor(Math.random() * maxId));
  startSearch(String(rnd));
});



function fakeCallbackPipeline(query, cb) {
  setTimeout(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return cb(new Error('EMPTY_QUERY'));
    setTimeout(() => {
      const valid = /^[a-z0-9-]+$/.test(q);
      if (!valid) return cb(new Error('INVALID_QUERY'));
      setTimeout(() => cb(null, { ok: true, queryNorm: q }), 250);
    }, 250);
  }, 250);
}

function onDemoCallbacks() {
  setStatus('Demo callbacks…');
  fakeCallbackPipeline(input?.value, (err, res) => {
    if (err) {
      if (err.message === 'EMPTY_QUERY') setStatus('Saisis un nom ou un ID.');
      else if (err.message === 'INVALID_QUERY') setStatus('Caractères invalides.');
      else setStatus('Erreur callback.');
      return;
    }
    setStatus(`OK (callbacks) : « ${res.queryNorm} »`);
  });
}



(function init() {
  loadHistory();
  renderHistory();
  setStatus('Prêt à chercher un Pokémon.');
  input?.focus();
})();