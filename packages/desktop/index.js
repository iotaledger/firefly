import { Electron } from 'shared/lib/electron'
import App from './App.svelte'

const captureException = require('./sentry')(false).captureException || function (..._) {}

window.addEventListener('error', (event) => {
    const errorType = 'Render Context (Error)'
    const hasErrorMessage = event.error && event.error.message
    const error = hasErrorMessage ? { message: event.error.message, stack: event.error.stack } : event.error || event

    captureException(error)
    Electron.unhandledException(errorType, error)

    event.preventDefault()
    console.error(event.error || event)
})

window.addEventListener('unhandledrejection', (event) => {
    const errorType = 'Render Context (Unhandled Rejection)'

    captureException(event.reason || event)
    Electron.unhandledException(errorType, event.reason || event)

    event.preventDefault()
    console.error(event.reason)
})

const app = new App({
    target: document.body,
    props: {},
})

export default app
