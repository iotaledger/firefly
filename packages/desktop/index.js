import { Electron } from 'shared/lib/electron'
import App from './App.svelte'

window.addEventListener('error', event => {
    if (event.error && event.error.message) {
        Electron.unhandledException("Render Context Error", {
            message: event.error.message,
            stack: event.error.stack
        })    
    } else {
        Electron.unhandledException("Render Context Error", event.error || event)
    }
    event.preventDefault();
    console.error(event.error || event)
})

window.addEventListener('unhandledrejection', event => {
    //Electron.unhandledException("Render Context Unhandled Rejection", event.reason)
    event.preventDefault();
    console.error(event.reason)
});

const app = new App({
    target: document.body,
    props: {},
})

export default app
