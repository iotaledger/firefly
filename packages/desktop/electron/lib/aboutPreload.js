const { contextBridge, ipcRenderer } = require('electron')
const {
    version,
    build: { productName },
} = require('../../package.json')

const sendDiagnosticsArg = '--send-diagnostics=true'
if (window.process.argv.includes(sendDiagnosticsArg)) {
    require('../../sentry')
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
