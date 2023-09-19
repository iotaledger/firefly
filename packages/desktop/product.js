const STAGE = process.env.STAGE || 'alpha'
const APP_NAME = getAppName()
const APP_ID = getAppId()
const APP_PROTOCOL = getAppProtocol()
const CHANNEL_NAME = getChannelName()
const APP_ARTIFACT = getAppArtifact()

function getAppArtifact() {
    return 'firefly-desktop-${version}.${ext}'
}

/**
 * If stage = 'prod' -> 'Firefly'
 * If stage = 'alpha' -> 'Firefly Alpha'
 */
function getAppName() {
    return STAGE === 'prod' ? 'Firefly' : `Firefly - ${STAGE.replace(/^\w/, (c) => c.toUpperCase())}`
}

/**
 * If stage = 'prod' -> 'iota'
 * If stage = 'alpha' -> 'iota-alpha'
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
            return 'iota-alpha'
        case 'beta':
            return 'iota-beta'
        default:
            return 'iota'
    }
}

module.exports = {
    STAGE,
    APP_NAME,
    APP_ID,
    APP_PROTOCOL,
    CHANNEL_NAME,
    APP_ARTIFACT,
}
