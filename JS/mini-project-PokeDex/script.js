/*
function fetchPokemonThenStyle(query) {
    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`
    return fetch(url)
        .then(res => {
            if (!res.ok) {
                if (res.status === 404) {
                    //cas du pokemon non trouvé
                    throw new Error('Pokémon non trouvé !');
                }
                //cas d'une autre erreur HTTP
                throw new Error('HTTP_' + res.status);
            }
            return res.json(); //renvoyer le JSON
        })
        .then(data => {
            //extraction des données utiles
            const model = {
                id: data.id,
                name: data.name,
                sprite: data.sprite?.front_default || [],
                types: data.types?.map(t => t.type?.name) || [],
                stats: data.stats?.map(s => ({name: s.stats?.name, base: s.base_stat})) || []
            };
            // mise à jour de l'interface
            renderCard(model);
            setStatus(`trouve: ${model.name} (#${model.id})`);
        })
        .catch(err => {
            if (err.message === 'Pkemon non trouve') {
                renderNotFound(query); //afficher le message "non trouvé"
                setStatus(`aucun pokemon « ${query}»`);
                return;
            }
        });   
};

function fetchBoth(id) {
    const p1 = fetch(`https://pokeapi.co/api/v2/pokemon/${id}`); //fetch du pokemon
    const p2 = fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`); //fetch de la species
    return Promise.all([p1, p2]) //attendre les 2 fetch
        .then(([r1, r2]) => {
            if (!r1.ok || !r2.ok ) {
                const code = !r1.ok ? r1.status : r2.status;
                throw new Error('HTTp_' + code);
            }
            return Promise.all([r1.json(), r2.json()]); //renvoyer les 2 JSON
        });
};
 //--------------------------------------------------------------------
async function fetchPokemon(query) {
    setLoading(true); setStatus('recherche...'); //aria-live
    try {
        // normaliser  -> obtenir l'id depuis /pokemon/{query}
        const baseRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`);
        if (!baseRes.ok) {
            if (baseRes.status === 404) return renderNotFound(query), setStatus(`aucun pokemon « ${query} »`);
            throw new Error('HTTP_' + baseRes.status);
        }
        const baseData = await baseRes.json();
        const id = baseData.id;
        // parallèle -> fetch des 2 endpoints
        const [pRes, sRes] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        ]);
        if (!pRes.ok || !sRes.ok) {
            const code = !pRes.ok ? pRes.status : sRes.status;
            throw new Error('HTTP_' + code);
        }
        const [pJson, sJson] = await Promise.all([pRes.json(), sRes.json()]);
        // extraction des données utiles
        const model = {
            id: pJson.id,
            name: pJson.name,
            sprite: pJson.sprites?.front_default,
            types: (pJson.types || []).map(t => t.type?.name),
            stats: (pJson.stats || []).map(s => ({ name: s.stat?.name, base: s.base_stat})),
            speciesColor: sJson.color?.name || 'blue',
            flavor: (sJson.flavor_text_entries || []).find(e => e.language?.name==='en')?.flavor_text || null
        };
        // mise à jour de l'interface
        renderCard(model);
        setStatus(`ok : ${model.name} (#${model.id})`);
    } catch (err) {
        //reseau, CORS, DNS, ou autres HTTP
        renderError();
        setStatus(`probleme reseau. ressayer`);
    } finally {
        setLoading(false);
    };
    
};
//------------------------------------------------------------------------


async function fetchPokemon(query, { signal }) {
  setLoading(true); setStatus('Recherche…');
  try {
    // 1) Résoudre l'id (avec timeout + retry)
    const baseRes = await retry(() =>
      fetchWithTimeout(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`, { signal, timeout: 7000 })
    );
    if (!baseRes.ok) {
      if (baseRes.status === 404) return renderNotFound(query), setStatus(`Aucun Pokémon « ${query} »`);
      throw new Error('HTTP_' + baseRes.status);
    }
    const baseData = await baseRes.json();
    const id = baseData.id;

    // 2) Parallèle + robustesse
    const [pRes, sRes] = await Promise.all([
      retry(() => fetchWithTimeout(`https://pokeapi.co/api/v2/pokemon/${id}`, { signal, timeout: 7000 })),
      retry(() => fetchWithTimeout(`https://pokeapi.co/api/v2/pokemon-species/${id}`, { signal, timeout: 7000 }))
    ]);

    if (!pRes.ok || !sRes.ok) {
      const code = !pRes.ok ? pRes.status : sRes.status;
      if (code === 404) return renderNotFound(id), setStatus(`Introuvable (#${id})`);
      throw new Error('HTTP_' + code);
    }

    const [pJson, sJson] = await Promise.all([pRes.json(), sRes.json()]);
    renderCard({
      id: pJson.id,
      name: pJson.name,
      sprite: pJson.sprites?.front_default,
      types: (pJson.types||[]).map(t => t.type?.name),
      stats: (pJson.stats||[]).map(s => ({ name: s.stat?.name, base: s.base_stat })),
      speciesColor: sJson.color?.name || 'blue',
      flavor: (sJson.flavor_text_entries||[]).find(e => e.language?.name==='en')?.flavor_text || null
    });
    setStatus('OK');
  } catch (err) {
    if (err?.name === 'AbortError') { setStatus('Recherche annulée.'); return; } // Cancel/Timeout
    renderError(); setStatus('Oups, problème réseau.');
  } finally {
    setLoading(false);
  }
}





// etat global
let currentController = null;

function startSearch(query) {
    // annuler la precedente
    if (currentController) currentController.abort();

    // nouvelle requete
    currentController = new AbortController();

    setLoading(true);
    setStatus('recherche...');

    // lancer la recherche
    return doFetchAll(query, { signal: currentController.signal})
    .then(model => {
        renderCard(model);
        setStatus(`ok : ${model.name} (#{model.id})`);
    })
    .catch(err => {
        if (err?.name === 'AbortError'){
            setStatus('recherche annule');
            return; //pas d'erreur pour l'annulation
        }
        renderError();
        setStatus('probleme reseau')
    })
    .finally(() => {
        setLoading(false);
        // ne reutiliser le controller que pour cette requete
        //laisser currentController tel quel (il sera ecraser a la prochaine recherche)
    });

};

// bouton cancel
cancelBtn.addEventListner('click', () => {
    currentController?.abort();
});

function fetchWithTimeout(url, { signal, timeout = 8000, ...init } = {}) {
    // si on deja un abort signal externe on le respecte
    const controller = new AbortController();
    const onAbort = () => controller.abort();

    // relier l'abort externe au notre
    if (signal) {
        if (signal.aborted) controller.abort();
        else signal.addEventListner('abort', onAbort, {once: true});
    }

    const tid = setTimeout(() => controller.abort(), timeout);

    //lancer le fetch avec signal qui sera annuler si timer
    return fetch(url, {...init, signal: controller.signal })
    .finally(() =>{
        clearTimeout(tid);
        signal?.removeEventListner('abort', onAbort);
    });
};

async function retry(fn, { retries = 2, backoffMa = 400} = {}) {
    let attempt = 0;
    for (;;) {
        try {
            const res = await fn();
            // si on gere ici le status HTTP:
            if ('ok' in res && res.ok === false) {
                // 4xx => pas de retry; 5xx => retry
                if (res.status >= 500) throw new Error('HTTP_' + res.status);
                return res; // 4xx: renvoyer deirectement (gere plus haut)
            }
            return res;
        } catch (err) {
            const isAbort = err?.name === 'AbortError';
            const isHttp5xx = /^HTTP_5/.test(err?.message);
            const isNetwork = !isAbort && isHttp5xx && (err instanceof TypeError);

            // condition de retry
            const canRetry = (isHttp5xx || isNetwork) && attempt < retries;
            if (!canRetry) throw err;

            //backoff exponentiel + jitter
            const delay = Math.round(backoffMs * Math.pow(2, attempt) * (0.7 + Math.random()*0.6));
            await new Promise(r => setTimeout(r, delay));
            attempt++;
        };
    };
};




// cb(err, result)
// - err: null ou Error
// - result: { ok: true, queryNorm } en cas de succès
function fakeCallbackPipeline(query, cb) {
  setTimeout(() => {
    // 1) normalisation
    const q = String(query || '').trim().toLowerCase();
    if (!q) return cb(new Error('EMPTY_QUERY'));

    setTimeout(() => {
      // 2) "validation" (règle bête de démo)
      const valid = /^[a-z0-9-]+$/.test(q);
      if (!valid) return cb(new Error('INVALID_QUERY'));

      setTimeout(() => {
        // 3) "résultat" (succès simulé)
        cb(null, { ok: true, queryNorm: q });
      }, 300);
    }, 300);
  }, 300);
}

// Exemple d’usage (pour une démo UI)
function onDemoCallbacks() {
  setStatus('Demo callbacks…');
  fakeCallbackPipeline(document.getElementById('q').value, (err, res) => {
    if (err) {
      if (err.message === 'EMPTY_QUERY') setStatus('Saisis un nom ou un ID.');
      else if (err.message === 'INVALID_QUERY') setStatus('Caractères invalides.');
      else setStatus('Erreur callback.');
      return;
    }
    setStatus(`OK (callbacks) : « ${res.queryNorm} »`);
  });
}




// ---- Cache
const dexCache = new Map(); // key: id (number), value: model
function cacheSet(model) {
  if (!model || !model.id) return;
  dexCache.set(model.id, model);
}
function cacheGetById(id) {
  return dexCache.get(Number(id)) || null;
}





// ---- Historique
const MAX_HISTORY = 10;
let historyList = []; // [{id, name}] du plus récent au plus ancien

function addToHistory(entry) {
  if (!entry || !entry.id || !entry.name) return;
  const id = Number(entry.id);
  // retirer si déjà présent
  historyList = historyList.filter(x => Number(x.id) !== id);
  // mettre en tête
  historyList.unshift({ id, name: entry.name });
  // tronquer
  if (historyList.length > MAX_HISTORY) historyList.length = MAX_HISTORY;

  // Option : persister
  try { localStorage.setItem('pokedx_history', JSON.stringify(historyList)); } catch {}
}

function loadHistory() {
  try {
    const raw = localStorage.getItem('pokedx_history');
    if (raw) historyList = JSON.parse(raw) || [];
  } catch {}
}

function renderHistory() {
  const ul = document.getElementById('historyList');
  if (!ul) return;
  ul.innerHTML = '';
  historyList.forEach(item => {
    const li = document.createElement('li');
    li.className = 'hist-item';
    li.innerHTML = `
      <div class="left"><span class="dot"></span><span>${item.name}</span></div>
      <span class="id">#${item.id}</span>`;
    li.addEventListener('click', () => {
      // Relance une recherche immédiate (avec AbortController si câblé)
      startSearch(String(item.id));
    });
    ul.appendChild(li);
  });
}




// Mapper la couleur d'espèce (texte) -> teinte CSS de ta carte (thème aurora)
const SPECIES_COLOR_MAP = {
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
function speciesColorToCss(name) {
  return SPECIES_COLOR_MAP[name] || 'rgb(114,176,255)';
}

// Appliquer la teinte d’espèce à la carte (CSS déjà prêt dans ton HTML)
function applySpeciesColor(colorName) {
  const card = document.getElementById('card');
  if (!card) return;
  card.style.setProperty('--species-color', speciesColorToCss(colorName));
}





cacheSet(model);
addToHistory({ id: model.id, name: model.name });
renderHistory();
applySpeciesColor(model.speciesColor);
*/


'use strict';

/**
 * Fetch 'Em — Script complet
 * Étapes couvertes : 2 (Promises), 3 (Promise.all), 4 (async/await),
 * 5 (AbortController), 6 (Timeout + Retry), 7 (Callbacks demo), 8 (Historique + Cache)
 *
 * Ce script suppose l'existence des éléments HTML (IDs) créés dans l'étape 1 :
 * #q, #searchBtn, #surpriseBtn, #cancelBtn, #status, #card, #sprite, #meta-id,
 * #types, #stats, #historyList, et <template id="stat-tpl"> optionnel.
 */

/***********************************
 * Sélecteurs & état global
 ***********************************/
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

/***********************************
 * Helpers UI
 ***********************************/
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

/***********************************
 * Historique & Cache
 ***********************************/
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

/***********************************
 * Robustesse : Timeout & Retry
 ***********************************/
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

/***********************************
 * Data: résolution ID + fetch parallèles
 ***********************************/
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

/***********************************
 * Handler principal (async/await)
 ***********************************/
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

/***********************************
 * Orchestration : démarrer/annuler une recherche
 ***********************************/
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

/***********************************
 * Démo callbacks (facultatif)
 ***********************************/
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

/***********************************
 * Boot
 ***********************************/
(function init() {
  loadHistory();
  renderHistory();
  setStatus('Prêt à chercher un Pokémon.');
  input?.focus();
})();

