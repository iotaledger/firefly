const { contextBridge, ipcRenderer } = require('electron')
const { version } = require('../../package.json')

const sendDiagnosticsArg = window.process.argv.slice(-1)[0]
if (sendDiagnosticsArg === '--send-diagnostics=true') {
    require('../../sentry')
}

contextBridge.exposeInMainWorld('error', {
    getData: () =>
        ipcRenderer.invoke('error-data').then((data) => ({
            iconPath: './assets/logos/firefly_logo.svg',
            version,
            diagnostics: data.diagnostics
                .map((d) => `${d.label.replace('popups.diagnostics.', '')}: ${d.value}`)
                .join('\r\n'),
            errorType: data.errorType,
            error: data.error,
        })),
    openUrl: (url) => {
        ipcRenderer.invoke('open-url', url)
    },
})
