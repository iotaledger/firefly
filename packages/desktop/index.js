import { Platform } from 'shared/lib/platform'
import App from './App.svelte'

window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
        Platform.unhandledException('Render Context Error', {
            message: event.error.message,
            stack: event.error.stack,
        })
    } else {
        Platform.unhandledException('Render Context Error', event.error || event)
    }
    event.preventDefault()
    console.error(event.error || event)
})

window.addEventListener('unhandledrejection', (event) => {
    // Platform.unhandledException("Render Context Unhandled Rejection", event.reason)
    event.preventDefault()
    console.error(event.reason)
})

const app = new App({
    target: document.body,
    props: {},
})

export default app
