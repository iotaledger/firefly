const { init } = require('@sentry/electron')

const SENTRY_DSN = process.env.SENTRY_DSN || '' // || 'https://10167e2d9c1b4a26b63a9b84317b8726@o1010134.ingest.sentry.io/5974639'
const SENTRY_ORG_NAME = 'iota-foundation-h4'
const SENTRY_APP_NAME = `firefly-${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}`

init({
    dsn: SENTRY_DSN,
    debug: true,
    appName: SENTRY_APP_NAME,
    environment: process.env.NODE_ENV || 'development',
})
