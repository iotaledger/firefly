const { init } = require('@sentry/electron')

const SENTRY_DSN = process.env.SENTRY_DSN || ''
const SENTRY_ORG_NAME = 'iota-foundation-h4'
const SENTRY_APP_NAME = 'firefly'

init({
    dsn: SENTRY_DSN,
    debug: true,
    appName: SENTRY_APP_NAME,
    environment: process.env.NODE_ENV || 'production',
})
