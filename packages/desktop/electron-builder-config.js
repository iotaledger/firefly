const notarize = require('./scripts/notarize.macos.js')
const merge = require('lodash.merge')

const baseConfig = () => ({
    productName: 'Firefly',
    artifactName: 'firefly-desktop-${version}.${ext}',
    copyright: 'IOTA Foundation',
    directories: { buildResources: './public', output: './out' },
    files: ['public/', 'package.json', '!node_modules/firefly-actor-system-nodejs-bindings/native/*'],
    appId: 'org.iota.firefly',
    afterSign: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            await notarize(getAppId(process.env.STAGE || 'alpha'), getAppName(process.env.STAGE || 'alpha'))
        } catch (error) {
            // This catch is necessary or the promise rejection is swallowed
            throw error
        }
    },
    asar: true,
    protocols: [{ name: 'IOTA URL Scheme', schemes: ['iota'] }],
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
        icon: './public/assets/icons/win/prod/icon.ico',
        publisherName: 'IOTA Stiftung',
        target: 'nsis',
        timeStampServer: 'http://timestamp.digicert.com',
    },
    linux: {
        target: ['AppImage'],
        desktop: {
            Name: 'Firefly',
            Comment: 'Desktop wallet for IOTA',
            Categories: 'Office;Network;Finance',
        },
        icon: './public/assets/icons/linux/prod/icon.png',
    },
    mac: {
        icon: './public/assets/icons/mac/prod/icon.icns',
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

const getIconPaths = (stage) => {
    const PATH = './public/assets/icons'
    const LINUX_PATH = 'linux'
    const MAC_PATH = 'mac'
    const WINDOWS_PATH = 'win'
    const ICON_NAME = 'icon'
    const LINUX_ICON_EXTENSION = 'png'
    const MAC_ICON_EXTENSION = 'ico'
    const WINDOWS_ICON_EXTENSION = 'icns'

    return {
        linux: {
            icon: `${PATH}/${LINUX_PATH}/${stage}/${ICON_NAME}.${LINUX_ICON_EXTENSION}`,
        },
        mac: {
            icon: `${PATH}/${MAC_PATH}/${stage}/${ICON_NAME}.${MAC_ICON_EXTENSION}`,
        },
        win: {
            icon: `${PATH}/${WINDOWS_PATH}/${stage}/${ICON_NAME}.${WINDOWS_ICON_EXTENSION}`,
        },
    }
}

/**
 * If stage = 'prod' -> 'Firefly'
 * If stage = 'alpha' -> 'Firefly Alpha'
 * @param {string} stage
 * @returns
 */
const getAppName = (stage) => (stage === 'prod' ? 'Firefly' : `Firefly ${stage.replace(/^\w/, (c) => c.toUpperCase())}`)

const getAppId = (stage) => {
    const defaultAppId = 'org.iota.firefly'
    if (stage === 'prod') {
        return defaultAppId
    }
    return `${defaultAppId}.${stage}`
}

const getLinuxDesktopName = (stage) => ({
    linux: {
        desktop: {
            Name: getAppName(stage),
        },
    },
})

const prereleaseNsisOptions = {
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
    },
}

const prodConfig = () => baseConfig()

const alphaConfig = () => {
    const icons = getIconPaths('alpha')
    const publish = {
        publishAutoUpdate: false,
    }

    return merge(
        {},
        baseConfig(),
        icons,
        { productName: getAppName('alpha') },
        { appId: getAppId('alpha') },
        getLinuxDesktopName('alpha'),
        prereleaseNsisOptions,
        { publish }
    )
}

const betaConfig = () => {
    const icons = getIconPaths('beta')
    const publish = {
        publishAutoUpdate: false,
    }

    return merge(
        {},
        baseConfig(),
        icons,
        { productName: getAppName('beta') },
        { appId: getAppId('beta') },
        getLinuxDesktopName('beta'),
        prereleaseNsisOptions,
        { publish }
    )
}

const build = () => {
    switch (process.env.STAGE) {
        case 'alpha':
            return alphaConfig()
        case 'beta':
            return betaConfig()
        default:
            return prodConfig()
    }
}

module.exports = build
