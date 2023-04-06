/** NOTE: SENTRY_MAIN_PROCESS, SENTRY_DSN, SENTRY_ENVIRONMENT, and PRELOAD_SCRIPT are replaced by Webpack at compile-time. */

/* eslint-disable no-undef */
const Sentry = SENTRY_MAIN_PROCESS
    ? require('@sentry/electron/main')
    : PRELOAD_SCRIPT
    ? require('@sentry/electron/preload')
    : require('@sentry/electron/renderer')

const appName = 'Firefly'
const debug = true
/* eslint-disable no-undef */
const dsn = SENTRY_DSN || ''
const environment = SENTRY_ENVIRONMENT || ''
/* eslint-enable no-undef */

let machineId = ''

/* eslint-disable-next-line no-undef */
if (SENTRY_MAIN_PROCESS || PRELOAD_SCRIPT) {
    const { machineIdSync } = require('node-machine-id')
    try {
        machineId = machineIdSync()
    } catch (err) {
        console.error(err)
    }
} else {
    const { Electron } = require('./lib/electron')
    Electron.getMachineId().then((id) => {
        machineId = id
    })
}

module.exports = function (initialize) {
    if (initialize) {
        /* eslint-disable no-console */
        console.log({ appName, debug, dsn, environment })
        Sentry.init({ appName, debug, dsn, environment })
        Sentry.setUser({ id: machineId })
    }

    console.log('SENTRY: ', Sentry)

    return {
        captureException: Sentry.captureException,
    }
}
