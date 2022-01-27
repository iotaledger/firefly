/** NOTE: SENTRY_MAIN_PROCESS, SENTRY_DSN, and SENTRY_ENVIRONMENT are replaced by Webpack at compile-time. */

/* eslint-disable no-undef */
const Sentry = SENTRY_MAIN_PROCESS ? require('@sentry/electron/dist/main') : require('@sentry/electron/dist/renderer')
const { machineIdSync } = require('node-machine-id')

const appName = 'Firefly'
const debug = true
/* eslint-disable no-undef */
const dsn = SENTRY_DSN || ''
/* eslint-disable no-undef */
const environment = SENTRY_ENVIRONMENT || ''

let machineId = ''

try {
    machineId = machineIdSync()
} catch (error) {
    console.error(error)
}

Sentry.init({ appName, debug, dsn, environment })
Sentry.setUser({ id: machineId })

export const captureException = Sentry.captureException
