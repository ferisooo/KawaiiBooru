const { app, BrowserWindow, ipcMain, shell, session, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Danbooru asks API users for a descriptive User-Agent.
const USER_AGENT = 'KawaiiBooru/1.0 (personal gallery viewer)';
const SAFE_BASE = 'https://safebooru.donmai.us'; // general-only, used when logged out
const FULL_BASE = 'https://danbooru.donmai.us';  // used when authenticated

// Hardcoded, non-removable: never surface sexualized-minor content.
const BLOCKED = ['loli', 'shota', 'lolicon', 'shotacon', 'toddlercon'];

function levelName(lvl) {
  return ({
    0: 'Anonymous', 10: 'Restricted', 20: 'Member', 30: 'Gold',
    31: 'Platinum', 32: 'Builder', 35: 'Contributor', 40: 'Moderator', 50: 'Admin'
  })[lvl] || ('Level ' + lvl);
}

let win;
let auth = null;          // active session: { login, api_key, name, level } or null
let remembered = null;    // saved creds for prefill: { login, api_key, name, level } or null
let persisted = false;    // whether creds are saved to disk (remember me)
let authFile = null;

function writeFile(obj) {
  try { fs.writeFileSync(authFile, JSON.stringify(obj), 'utf8'); } catch (e) { /* ignore */ }
}
function clearAuthFile() {
  try { if (authFile && fs.existsSync(authFile)) fs.unlinkSync(authFile); } catch (e) { /* ignore */ }
}
function loadAuth() {
  try {
    authFile = path.join(app.getPath('userData'), 'auth.json');
    if (fs.existsSync(authFile)) {
      const raw = JSON.parse(fs.readFileSync(authFile, 'utf8'));
      if (raw && raw.login && raw.api_key) {
        remembered = { login: raw.login, api_key: raw.api_key, name: raw.name, level: raw.level };
        persisted = true;
        // active === true means we were logged in last time → auto-restore
        if (raw.active) {
          auth = { login: raw.login, api_key: raw.api_key, name: raw.name, level: raw.level };
        }
      }
    }
  } catch (e) { /* ignore */ }
}

// Make the embedded Danbooru pages authenticate as the logged-in user by
// injecting API-key Basic auth into every request the web pane makes.
function setupWebviewAuth() {
  const ses = session.fromPartition('persist:danbooru');
  ses.webRequest.onBeforeSendHeaders((details, cb) => {
    try {
      const host = new URL(details.url).hostname;
      if (auth && /donmai\.us$/.test(host)) {
        details.requestHeaders['Authorization'] =
          'Basic ' + Buffer.from(auth.login + ':' + auth.api_key).toString('base64');
      }
    } catch (e) { /* ignore */ }
    cb({ requestHeaders: details.requestHeaders });
  });

  // Gate page navigations inside the pane.
  // Pages the pane may visit while NOT logged in: only account / signup / login.
  const ACCOUNT_OK = /^\/(users|session|profile|password_resets|maintenance|dmail|email_)/;
  ses.webRequest.onBeforeRequest({ urls: ['*://*.donmai.us/*'] }, (details, cb) => {
    if (details.resourceType !== 'mainFrame') return cb({}); // only gate top-level page loads
    let pathname = '/', query = '';
    try {
      const u = new URL(details.url);
      pathname = u.pathname;
      query = (u.search || '').toLowerCase();
    } catch (e) { return cb({}); }

    // Never allow direct routes to sexualized-minor tags, signed in or not.
    if (BLOCKED.some(b => query.includes(b))) {
      return cb({ redirectURL: FULL_BASE + '/users/new' });
    }

    // Logged out: the pane is for making/managing an account only — no content browsing.
    if (!auth && !ACCOUNT_OK.test(pathname)) {
      return cb({ redirectURL: FULL_BASE + '/users/new' });
    }
    return cb({});
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 880,
    minHeight: 600,
    frame: false,
    backgroundColor: '#0a0612',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    }
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ---- window control IPC ----
ipcMain.on('win:minimize', () => win && win.minimize());
ipcMain.on('win:maximize', () => {
  if (!win) return;
  win.isMaximized() ? win.unmaximize() : win.maximize();
});
ipcMain.on('win:close', () => win && win.close());
ipcMain.handle('open-external', (_e, url) => shell.openExternal(url));

// ---- auth ----
ipcMain.handle('auth-set', async (_e, creds) => {
  try {
    const u = new URL(FULL_BASE + '/profile.json');
    u.searchParams.set('login', creds.login);
    u.searchParams.set('api_key', creds.api_key);
    const res = await fetch(u, { headers: { 'User-Agent': USER_AGENT } });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: 'Wrong username or API key' };
    }
    if (!res.ok) return { ok: false, error: `Login failed (${res.status})` };
    const data = await res.json();
    if (!data || !data.name) return { ok: false, error: 'Login failed' };
    const level = data.level_string || levelName(data.level);
    auth = { login: creds.login, api_key: creds.api_key, name: data.name, level };
    if (creds.remember) {
      remembered = { ...auth };
      persisted = true;
      writeFile({ ...auth, active: true });
    } else {
      remembered = null;
      persisted = false;
      clearAuthFile();
    }
    return { ok: true, name: data.name, level };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error' };
  }
});
ipcMain.handle('auth-get', () => (auth ? { name: auth.name || auth.login, level: auth.level || '' } : null));
ipcMain.handle('auth-remembered', () =>
  remembered ? { login: remembered.login, api_key: remembered.api_key, name: remembered.name } : null);
ipcMain.handle('auth-clear', () => {
  auth = null;
  if (persisted && remembered) {
    // keep creds for prefill, but don't auto-login next launch
    writeFile({ ...remembered, active: false });
  } else {
    clearAuthFile();
  }
  return { ok: true };
});

// ---- posts ----
ipcMain.handle('fetch-posts', async (_e, { tags, page, limit, nsfw, mode }) => {
  const base = auth ? FULL_BASE : SAFE_BASE;
  const allowNsfw = !!auth && !!nsfw; // nsfw only possible while authenticated
  const lim = String(limit || 30);
  let url;

  if (mode === 'popular') {
    // Danbooru's dedicated "popular of the day" feed — fast, never times out.
    const p = new URLSearchParams();
    p.set('date', new Date().toISOString().slice(0, 10));
    p.set('scale', 'day');
    p.set('limit', lim);
    if (auth) { p.set('login', auth.login); p.set('api_key', auth.api_key); }
    url = `${base}/explore/posts/popular.json?${p.toString()}`;
  } else {
    const params = new URLSearchParams({
      tags: tags || '',
      page: String(page || 1),
      limit: lim
    });
    if (auth) {
      params.set('login', auth.login);
      params.set('api_key', auth.api_key);
    }
    url = `${base}/posts.json?${params.toString()}`;
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' }
    });
    if (!res.ok) {
      let msg = `Booru returned ${res.status}`;
      try {
        const e = await res.json();
        if (e && e.message) msg = e.message;          // Danbooru's own wording (e.g. tag limit)
      } catch { /* keep generic */ }
      return { ok: false, error: msg };
    }
    const data = await res.json();
    if (!Array.isArray(data)) return { ok: false, error: 'Unexpected response' };

    const imgExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];
    const posts = data
      .filter(p => p && (p.preview_file_url || p.large_file_url || p.file_url))
      .filter(p => {
        const ts = (p.tag_string || '').split(' ');
        for (const b of BLOCKED) if (ts.includes(b)) return false;       // always blocked
        const r = p.rating;
        if (allowNsfw) {
          // NSFW on: ONLY questionable + explicit
          if (r !== 'q' && r !== 'e') return false;
        } else {
          // NSFW off: ONLY general + sensitive
          if (r !== 'g' && r !== 's') return false;
        }
        return true;
      })
      .map(p => {
        const isImg = imgExt.includes((p.file_ext || '').toLowerCase());
        return {
          id: p.id,
          // HD grid: use the large "sample" instead of the tiny preview
          thumb: p.large_file_url || p.preview_file_url || p.file_url,
          // lightbox: original when it's a static image, else the sample
          full: (isImg ? p.file_url : null) || p.large_file_url || p.file_url || p.preview_file_url,
          width: p.image_width || 0,
          height: p.image_height || 0,
          ext: p.file_ext || '',
          rating: p.rating || 'g',
          score: p.score || 0,
          favs: p.fav_count || 0,
          artist: (p.tag_string_artist || '').trim(),
          characters: (p.tag_string_character || '').trim(),
          tags: (p.tag_string_general || p.tag_string || '').trim(),
          source: p.source || ''
        };
      });

    return { ok: true, posts };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error' };
  }
});

// ---- tag autocomplete ----
ipcMain.handle('autocomplete-tags', async (_e, query) => {
  const q = (query || '').trim();
  if (!q) return [];
  const base = auth ? FULL_BASE : SAFE_BASE;
  const p = new URLSearchParams();
  p.set('search[query]', q);
  p.set('search[type]', 'tag_query');
  p.set('limit', '10');
  if (auth) { p.set('login', auth.login); p.set('api_key', auth.api_key); }
  try {
    const res = await fetch(`${base}/autocomplete.json?${p.toString()}`, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter(d => d && d.value && !BLOCKED.includes(d.value))
      .map(d => ({
        value: d.value,
        label: d.label || d.value,
        category: typeof d.category === 'number' ? d.category : 0,
        count: d.post_count || 0
      }));
  } catch {
    return [];
  }
});

// ---- favorite / unfavorite ----
ipcMain.handle('favorite', async (_e, { postId, on }) => {
  if (!auth) return { ok: false, error: 'log in first' };
  try {
    const p = new URLSearchParams();
    p.set('login', auth.login);
    p.set('api_key', auth.api_key);
    let url, method;
    if (on) {
      p.set('post_id', String(postId));
      url = `${FULL_BASE}/favorites.json?${p.toString()}`;
      method = 'POST';
    } else {
      url = `${FULL_BASE}/favorites/${postId}.json?${p.toString()}`;
      method = 'DELETE';
    }
    const res = await fetch(url, { method, headers: { 'User-Agent': USER_AGENT } });
    if (res.ok) return { ok: true };
    if (on && res.status === 422) return { ok: true }; // already favorited
    return { ok: false, error: `Failed (${res.status})` };
  } catch (err) {
    return { ok: false, error: err.message || 'Network error' };
  }
});

// ---- download original to disk ----
ipcMain.handle('download', async (_e, { url, filename }) => {
  if (!url) return { ok: false, error: 'no image' };
  try {
    const headers = { 'User-Agent': USER_AGENT, 'Referer': (auth ? FULL_BASE : SAFE_BASE) + '/' };
    if (auth) headers['Authorization'] = 'Basic ' + Buffer.from(auth.login + ':' + auth.api_key).toString('base64');
    const res = await fetch(url, { headers });
    if (!res.ok) return { ok: false, error: `Download failed (${res.status})` };
    const buf = Buffer.from(await res.arrayBuffer());
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      defaultPath: path.join(app.getPath('downloads'), filename || 'image.jpg')
    });
    if (canceled || !filePath) return { ok: false, canceled: true };
    fs.writeFileSync(filePath, buf);
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, error: err.message || 'Save error' };
  }
});

// ---- image proxy (beats CDN hotlink/referer protection) ----
ipcMain.handle('fetch-image', async (_e, url) => {
  if (!url) return null;
  try {
    const headers = {
      'User-Agent': USER_AGENT,
      'Referer': (auth ? FULL_BASE : SAFE_BASE) + '/',
      Accept: 'image/avif,image/webp,image/*,*/*'
    };
    if (auth) {
      headers['Authorization'] =
        'Basic ' + Buffer.from(auth.login + ':' + auth.api_key).toString('base64');
    }
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get('content-type') || 'image/jpeg';
    return `data:${ct};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
});

app.whenReady().then(() => { loadAuth(); setupWebviewAuth(); createWindow(); });
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
