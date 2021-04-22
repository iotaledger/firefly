const { contextBridge, ipcRenderer } = require('electron')
const { version, build: { productName } } = require('../../package.json')

contextBridge.exposeInMainWorld('about', {
    getData: (callback) => {
        ipcRenderer.invoke('menu-data').then(data => {
            const aboutData = {
                appName: productName,
                version: data.strings.version.replace('{version}', version),
                iconPath: './assets/logos/firefly_logo.svg'
            }
            
            callback(aboutData)
        })
    }
})