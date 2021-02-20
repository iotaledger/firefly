import {ipcRenderer, contextBridge} from "electron"

contextBridge.exposeInMainWorld("ipcRenderer", {
    receive: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(event, ...args))
    },
})