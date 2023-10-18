const notarize = require('./scripts/notarize.macos.js')
const merge = require('lodash.merge')
const { STAGE, getAppName, APP_ID, APP_PROTOCOL, CHANNEL_NAME, APP_ARTIFACT } = require('./product.js')

const prodConfig = () => ({
    productName: getAppName(),
    artifactName: APP_ARTIFACT,
    copyright: 'IOTA Foundation',
    directories: { buildResources: './public', output: './out' },
    files: ['public/', 'package.json', '!node_modules/@iota/sdk/target/*'],
    appId: APP_ID,
    afterSign: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            await notarize(APP_ID, getAppName())
        } catch (err) {
            // This catch is necessary or the promise rejection is swallowed
            throw err
        }
    },
    asar: true,
    protocols: [{ name: `${getAppName()} URL Scheme`, schemes: [APP_PROTOCOL] }],
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
    nsis: {
        oneClick: true,
        deleteAppDataOnUninstall: false,
        perMachine: true,
        include: 'public/installer.nsh',
    },
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
            Name: getAppName(),
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
        channel: CHANNEL_NAME,
    },
})

function getIconPaths() {
    const PATH = './public/assets/icons'
    const NAME = 'icon1024x1024'
    const EXTENSION = 'png'

    return {
        linux: {
            icon: `${PATH}/prod/${NAME}.${EXTENSION}`,
        },
        mac: {
            icon: `${PATH}/prod/${NAME}.${EXTENSION}`,
        },
        win: {
            icon: `${PATH}/prod/${NAME}.${EXTENSION}`,
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
    return merge({}, prodConfig(), icons, { appId: APP_ID }, prereleaseNsisOptions)
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
