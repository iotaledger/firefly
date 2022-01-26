import { Electron } from 'shared/lib/electron'
import App from './App.svelte'
import { captureException } from './sentry'

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

    captureException(event.reason)
    Electron.unhandledException(errorType, event.reason || event)

    event.preventDefault()
    console.error(event.reason)
})

const app = new App({
    target: document.body,
    props: {},
})

export default app
