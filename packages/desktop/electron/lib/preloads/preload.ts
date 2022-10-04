import { ipcRenderer, contextBridge } from 'electron'
import { ElectronApi, ElectronWalletApi } from '../apis'
import WalletApi from '@iota/wallet'
import fs from 'fs'
import sentry from '../../../sentry'

const SEND_CRASH_REPORTS: boolean = window.process.argv.includes('--send-crash-reports=true')
// eslint-disable-next-line
let captureException = (..._) => {}
if (SEND_CRASH_REPORTS) {
    captureException = sentry(true).captureException
}

// Hook the error handlers as early as possible
window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
        void ipcRenderer.invoke('handle-error', '[Preload Context] Error', {
            message: event.error.message,
            stack: event.error.stack,
        })
        if (SEND_CRASH_REPORTS) {
            captureException(event.error)
        }
    } else {
        void ipcRenderer.invoke('handle-error', '[Preload Context] Error', event.error || event)
        if (SEND_CRASH_REPORTS) {
            captureException(event)
        }
    }
    event.preventDefault()
    console.error(event.error || event)
})

window.addEventListener('unhandledrejection', (event) => {
    void ipcRenderer.invoke('handle-error', '[Preload Context] Unhandled Rejection', event.reason)
    event.preventDefault()
    console.error(event.reason)
})

try {
    if (process.env.NODE_ENV === 'development') {
        const logDir = './log'
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir)
        }
        const today = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '-')
        const loggerOptions: WalletApi.LoggerConfig = {
            colorEnabled: true,
            name: `./log/wallet-${today}.log`,
            levelFilter: 'debug',
            targetExclusions: ['h2', 'hyper', 'rustls', 'message_handler'],
        }
        WalletApi.initLogger(loggerOptions)
    }
} catch (error) {
    console.error('[Preload Context] Error:', error)
}

try {
    contextBridge.exposeInMainWorld('__WALLET__API__', ElectronWalletApi)
    contextBridge.exposeInMainWorld('__ELECTRON__', ElectronApi)
} catch (error) {
    void ipcRenderer.invoke('handle-error', '[Preload Context] Error', error)
}
