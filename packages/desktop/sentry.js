/** NOTE: SENTRY_MAIN_PROCESS, SENTRY_DSN, SENTRY_ENVIRONMENT, and PRELOAD_SCRIPT are replaced by Webpack at compile-time. */
const { getAppName } = require('./product.js')

/* eslint-disable-next-line no-undef */
const Sentry = SENTRY_MAIN_PROCESS ? require('@sentry/electron/dist/main') : require('@sentry/electron/dist/renderer')

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
        Sentry.init({ appName: getAppName(), debug, dsn, environment })
        Sentry.setUser({ id: machineId })
    }

    return {
        captureException: Sentry.captureException,
    }
}
