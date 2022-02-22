const baseConfig = () => ({
    productName: 'Firefly',
    artifactName: 'firefly-desktop-${version}.${ext}',
    copyright: 'IOTA Foundation',
    directories: { buildResources: './public', output: './out' },
    files: ['public/', 'package.json', '!node_modules/firefly-actor-system-nodejs-bindings/native/*'],
    appId: 'org.iota.firefly',
    afterSign: './scripts/notarize.macos.js',
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
const getAppName = (stage) => (stage === 'prod' ? 'Firefly' : `Firefly ${stage[0].toUpperCase()}${stage.slice(1)}`)

const getLinuxDesktopName = (stage) => ({
    linux: {
        desktop: {
            Name: getAppName(stage),
        },
    },
})

const prodConfig = () => {
    const publish = {
        provider: 'generic',
        url: 'https://dl.firefly.iota.org/',
        publishAutoUpdate: true,
        channel: 'latest',
    }
    return Object.assign({}, baseConfig(), { publish })
}

const alphaConfig = () => {
    const icons = getIconPaths('alpha')

    return Object.assign({}, baseConfig(), icons, { productName: getAppName('alpha') }, getLinuxDesktopName('alpha'))
}
