const notarize = require('./scripts/notarize.macos.js')
const merge = require('lodash.merge')

const STAGE = process.env.STAGE || 'alpha'

const APP_NAME = getAppName()
const APP_ID = getAppId()
const APP_PROTOCOL = getAppProtocol()

/**
 * If stage = 'prod' -> 'Firefly'
 * If stage = 'alpha' -> 'Firefly Alpha'
 * @param {string} stage
 * @returns
 */
function getAppName() {
    return STAGE === 'prod' ? 'Firefly Stardust' : `Firefly Stardust - ${STAGE.replace(/^\w/, (c) => c.toUpperCase())}`
}

function getAppProtocol() {
    return STAGE === 'prod' ? 'firefly' : `firefly-${STAGE.toLowerCase()}`
}

function getAppId() {
    const defaultAppId = 'org.iota.firefly-stardust'
    if (STAGE === 'prod') {
        return defaultAppId
    }
    return `${defaultAppId}.${STAGE}`
}

const prodConfig = () => ({
    productName: APP_NAME,
    artifactName: 'firefly-desktop-${version}.${ext}',
    copyright: 'IOTA Foundation',
    directories: { buildResources: './public', output: './out' },
    files: ['public/', 'package.json'],
    appId: 'org.iota.firefly',
    afterSign: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            await notarize(APP_ID, APP_NAME)
        } catch (error) {
            // This catch is necessary or the promise rejection is swallowed
            throw error
        }
    },
    asar: true,
    protocols: [{ name: 'Firefly URL Scheme', schemes: [APP_PROTOCOL] }],
    dmg: {
        iconSize: 120,
        title: '${productName}',
        background: 'public/assets/background/mac/background.png',
        sign: false,
        contents: [
            { x: 500, y: 250, type: 'link', path: '/Applications' },
            { x: 170, y: 250, type: 'file' },
        ],
    },
    nsis: { oneClick: true, deleteAppDataOnUninstall: false },
    win: {
        icon: './public/assets/icons/prod/icon1024x1024.png',
        publisherName: 'IOTA Stiftung',
        target: 'nsis',
        timeStampServer: 'http://timestamp.sectigo.com',
        rfc3161TimeStampServer: 'http://timestamp.sectigo.com',
    },
    linux: {
        target: ['AppImage'],
        desktop: {
            Name: APP_NAME,
            Comment: 'Desktop wallet for IOTA',
            Categories: 'Office;Network;Finance',
            MimeType: `x-scheme-handler/${APP_PROTOCOL}`,
        },
        icon: './public/assets/icons/prod/icon1024x1024.png',
        mimeTypes: [`x-scheme-handler/${APP_PROTOCOL}`],
    },
    mac: {
        icon: './public/assets/icons/prod/icon1024x1024.png',
        category: 'public.app-category.finance',
        target: ['dmg', 'zip'],
        entitlements: './entitlements.mac.plist',
        entitlementsInherit: './entitlements.mac.plist',
        hardenedRuntime: true,
        gatekeeperAssess: false,
        asarUnpack: ['**/*.node'],
    },
    publish: {
        provider: 'generic',
        url: 'https://dl.firefly.iota.org/',
        publishAutoUpdate: true,
        channel: 'latest',
    },
})

function getIconPaths() {
    const PATH = './public/assets/icons'
    const NAME = 'icon1024x1024'
    const EXTENSION = 'png'

    return {
        linux: {
            icon: `${PATH}/${STAGE}/${NAME}.${EXTENSION}`,
        },
        mac: {
            icon: `${PATH}/${STAGE}/${NAME}.${EXTENSION}`,
        },
        win: {
            icon: `${PATH}/${STAGE}/${NAME}.${EXTENSION}`,
        },
    }
}

const prereleaseNsisOptions = {
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
    },
}

const testConfig = () => {
    const icons = getIconPaths()
    const publish = {
        publishAutoUpdate: false,
    }

    return merge({}, prodConfig(), icons, { appId: APP_ID }, prereleaseNsisOptions, { publish })
}

const build = () => {
    switch (STAGE) {
        case 'prod':
            return prodConfig()
        default:
            return testConfig()
    }
}

module.exports = build
