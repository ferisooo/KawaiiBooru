// Runs inside the embedded Danbooru page. Forwards cursor movement to the host
// so the kawaii sparkle trail can follow the mouse over the pane too.
const { ipcRenderer } = require('electron');

let last = 0;
window.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - last < 16) return; // ~60fps throttle
  last = now;
  ipcRenderer.sendToHost('kb-mouse', e.clientX, e.clientY);
}, true);
