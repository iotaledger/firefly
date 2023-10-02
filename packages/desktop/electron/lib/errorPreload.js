import { contextBridge, ipcRenderer } from 'electron'
import { version } from '../../package.json'

contextBridge.exposeInMainWorld('error', {
    getData: () =>
        ipcRenderer.invoke('error-data').then((data) => {
            const errorData = {
                iconPath: `./assets/logos/darkmode/${STAGE}_firefly_logo.svg`,
                version,
                diagnostics: data.diagnostics
                    .map((d) => `${d.label.replace('popups.diagnostics.', '')}: ${d.value}`)
                    .join('\r\n'),
                errorType: data.errorType,
                error: data.error,
            }
            return errorData
        }),
    openUrl: (url) => {
        ipcRenderer.invoke('open-url', url)
    },
})
