/* eslint-disable */
const PRODUCT_NAME = 'Firefly'
const NETWORK = 'iota'

const STAGE = process.env.STAGE || 'alpha'
const APP_ID = getAppId()
const APP_PROTOCOL = getAppProtocol()
const CHANNEL_NAME = getChannelName()
const APP_ARTIFACT = getAppArtifact()
const appNameBase =
    STAGE === 'prod' ? PRODUCT_NAME : `${PRODUCT_NAME} - ${STAGE.replace(/^\w/, (c) => c.toUpperCase())}`

function getAppArtifact() {
    return `firefly-${NETWORK}-desktop-\${version}.\${ext}`
}

/**
 * If stage = 'prod' & packaged -> 'Firefly'
 * If stage = 'alpha' & packaged -> 'Firefly Alpha'
 * If stage = 'alpha' & dev -> 'Firefly — Dev'
 */
function getKeychainServiceName(isPackaged) {
    if (isPackaged) {
        return appNameBase
    } else {
        return `Firefly — Dev`
    }
}

/**
 * If stage = 'prod' & packaged -> 'Firefly'
 * If stage = 'alpha' & packaged -> 'Firefly Alpha'
 * If stage = 'alpha' & dev -> 'Firefly'
 */
function getAppName(isPackaged = true) {
    if (isPackaged) {
        return appNameBase
    } else {
        return PRODUCT_NAME
    }
}

/**
 * If stage = 'prod' -> 'iota'
 * If stage = 'alpha' -> 'iota-alpha'
 * If network = 'iota' -> 'iota',
 * If network = 'shimmer' -> 'firefly'
 */
function getAppProtocol() {
    return STAGE === 'prod' ? 'iota' : `iota-${STAGE.toLowerCase()}`
}

/**
 * If stage = 'prod' -> 'org.iota.firefly'
 * If stage = 'alpha' -> 'org.iota.firefly.alpha'
 */
function getAppId() {
    const defaultAppId = 'org.iota.firefly'
    if (STAGE === 'prod') {
        return defaultAppId
    }
    return `${defaultAppId}.${STAGE}`
}

function getChannelName() {
    switch (STAGE) {
        case 'alpha':
            return 'latest-alpha'
        case 'beta':
            return 'latest-beta'
        default:
            return 'latest'
    }
}

module.exports = {
    STAGE,
    APP_ID,
    APP_PROTOCOL,
    CHANNEL_NAME,
    APP_ARTIFACT,
    PRODUCT_NAME,
    getAppName,
    getKeychainServiceName,
    NETWORK,
    appNameBase,
}
