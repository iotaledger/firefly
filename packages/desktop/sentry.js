/** NOTE: SENTRY_MAIN_PROCESS, SENTRY_DSN, and SENTRY_ENVIRONMENT are replaced by Webpack at compile-time. */

// eslint-disable-next-line no-undef
const Sentry = SENTRY_MAIN_PROCESS ? require('@sentry/electron/dist/main') : require('@sentry/electron/dist/renderer')

const appName = 'Firefly'
const debug = true
// eslint-disable-next-line no-undef
const dsn = SENTRY_DSN || ''
// eslint-disable-next-line no-undef
const environment = SENTRY_ENVIRONMENT || ''

if (dsn && dsn.length > 0) Sentry.init({ appName, debug, dsn, environment })

export const captureException = Sentry.captureException
