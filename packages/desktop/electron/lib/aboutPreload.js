const { contextBridge, ipcRenderer } = require('electron')
const { version, productName } = require('../../package.json')

contextBridge.exposeInMainWorld('about', {
    getData: () =>
        ipcRenderer.invoke('menu-data').then((data) => {
            const stage = process.env.STAGE
            const aboutData = {
                appName: productName,
                version: data.strings.version.replace('{version}', version),
                iconPath: `./assets/logos/darkmode/${stage}_firefly_logo.svg`,
            }

            return aboutData
        }),
})
