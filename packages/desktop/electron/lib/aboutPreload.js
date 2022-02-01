const { contextBridge, ipcRenderer } = require('electron')
const {
    version,
    build: { productName },
} = require('../../package.json')

const sendCrashReportsArg = '--send-crash-reports=true'
if (window.process.argv.includes(sendCrashReportsArg)) {
    require('../../sentry')(true)
}

contextBridge.exposeInMainWorld('about', {
    getData: () =>
        ipcRenderer.invoke('menu-data').then((data) => {
            const aboutData = {
                appName: productName,
                version: data.strings.version.replace('{version}', version),
                iconPath: './assets/logos/firefly_logo.svg',
            }

            return aboutData
        }),
})
