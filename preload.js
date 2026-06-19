const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  fetchPosts: (tags, page, limit, nsfw, mode) =>
    ipcRenderer.invoke('fetch-posts', { tags, page, limit, nsfw, mode }),
  fetchImage: (url) => ipcRenderer.invoke('fetch-image', url),
  autocompleteTags: (query) => ipcRenderer.invoke('autocomplete-tags', query),
  favorite: (postId, on) => ipcRenderer.invoke('favorite', { postId, on }),
  download: (url, filename) => ipcRenderer.invoke('download', { url, filename }),
  authSet: (creds) => ipcRenderer.invoke('auth-set', creds),
  authGet: () => ipcRenderer.invoke('auth-get'),
  authRemembered: () => ipcRenderer.invoke('auth-remembered'),
  authClear: () => ipcRenderer.invoke('auth-clear'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  minimize: () => ipcRenderer.send('win:minimize'),
  maximize: () => ipcRenderer.send('win:maximize'),
  close: () => ipcRenderer.send('win:close')
});
