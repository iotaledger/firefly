// SENTRY_MAIN is replaced by Webpack DefinePlugin
// eslint-disable-next-line no-undef
const Sentry = SENTRY_MAIN ? require('@sentry/electron/dist/main') : require('@sentry/electron/dist/renderer')

const SENTRY_DSN = process.env.SENTRY_DSN || ''
const SENTRY_ORG_NAME = 'iota-foundation-h4'
const SENTRY_APP_NAME = 'Firefly'

Sentry.init({
    dsn: SENTRY_DSN,
    debug: true,
    appName: SENTRY_APP_NAME,
    environment: process.env.NODE_ENV || 'production',
})

export const captureException = Sentry.captureException
