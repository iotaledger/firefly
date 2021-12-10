const { notarize } = require('electron-notarize')
const path = require('path')

exports.default = async () => {
    if (process.platform !== 'darwin' || process.env.MACOS_SKIP_NOTARIZATION) {
        return true
    }

    const APPLE_ID = process.env.FIREFLY_APPLE_ID
    const APPLE_ID_PASSWORD = process.env.FIREFLY_APPLE_ID_PASSWORD

    if (!APPLE_ID) {
        throw Error('Notarization failed: Environment variable "FIREFLY_APPLE_ID" is not defined')
    }

    if (!APPLE_ID_PASSWORD) {
        throw Error('Notarization failed: Environment variable "FIREFLY_APPLE_ID_PASSWORD" is not defined')
    }

    await notarize({
        appBundleId: 'org.iota.firefly',
        appPath: path.resolve(__dirname, '../out/mac/Firefly Beta.app'),
        appleId: APPLE_ID,
        appleIdPassword: APPLE_ID_PASSWORD,
        ascProvider: 'UG77RJKZHH',
    })
}
