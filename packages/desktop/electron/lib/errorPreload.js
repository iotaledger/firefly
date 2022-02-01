const { contextBridge, ipcRenderer } = require('electron')
const { version } = require('../../package.json')

const sendCrashReportsArg = '--send-crash-reports=true'
if (window.process.argv.includes(sendCrashReportsArg)) {
    require('../../sentry')(true)
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
