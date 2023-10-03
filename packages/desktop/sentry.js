/** NOTE: SENTRY_MAIN_PROCESS, SENTRY_DSN, SENTRY_ENVIRONMENT, and PRELOAD_SCRIPT are replaced by Vite at compile-time. */

let alreadyInitialized = false
let Sentry = undefined

export const initializeSentry = async (initialize) => {
    if (alreadyInitialized == false) {
        Sentry = SENTRY_MAIN_PROCESS
            ? await import('@sentry/electron/dist/main')
            : await import('@sentry/electron/dist/renderer')

        /* eslint-disable-next-line no-undef */

        const debug = true
        /* eslint-disable no-undef */
        const dsn = SENTRY_DSN || ''
        const environment = SENTRY_ENVIRONMENT || ''
        /* eslint-enable no-undef */

        let machineId = ''

        /* eslint-disable-next-line no-undef */
        if (SENTRY_MAIN_PROCESS || PRELOAD_SCRIPT) {
            const { machineIdSync } = await import('node-machine-id')
            try {
                machineId = machineIdSync()
            } catch (err) {
                console.error(err)
            }
        } else {
            const { Electron } = await import('./lib/electron')
            Electron.getMachineId().then((id) => {
                machineId = id
            })
        }

        if (initialize) {
            Sentry.init({ appName: APP_NAME, debug, dsn, environment })
            Sentry.setUser({ id: machineId })
        }
    }

    return {
        captureException: Sentry?.captureException || function (..._) {},
    }
}
