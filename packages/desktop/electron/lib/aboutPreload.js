import { contextBridge, ipcRenderer } from 'electron'
import { version, productName } from '../../package.json'

contextBridge.exposeInMainWorld('about', {
    getData: () =>
        ipcRenderer.invoke('menu-data').then((data) => {
            const aboutData = {
                appName: productName,
                version: data.strings.version.replace('{version}', version),
                iconPath: `./assets/logos/darkmode/${STAGE}_firefly_logo.svg`,
            }

            return aboutData
        }),
})
