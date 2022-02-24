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
            await notarize(getAppId(process.env.STAGE || 'prod'), getAppName(process.env.STAGE || 'prod'))
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
        icon: './public/assets/icons/win/icon.ico',
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
        icon: './public/assets/icons/linux/icon256x256.png',
    },
    mac: {
        icon: './public/assets/icons/mac/icon.icns',
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
    const prefix = './public/assets/icons'
    const stagePrefix = stage === 'prod' ? '' : `${stage}-`
    const winIconName = 'icon.ico'
    const linuxIconName = 'icon256x256.png'
    const macIconName = 'icon.icns'

    return {
        win: {
            icon: `${prefix}/win/${stagePrefix}${winIconName}`,
        },
        linux: {
            icon: `${prefix}/linux/${stagePrefix}${linuxIconName}`,
        },
        mac: {
            icon: `${prefix}/mac/${stagePrefix}${macIconName}`,
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
