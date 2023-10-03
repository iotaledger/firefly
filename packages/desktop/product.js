/* eslint-disable */
export const PRODUCT_NAME = 'Firefly Shimmer'
export const NETWORK = 'shimmer'

export const STAGE = process.env.STAGE || 'alpha'
export const APP_ID = getAppId()
export const APP_PROTOCOL = getAppProtocol()
export const CHANNEL_NAME = getChannelName()
export const APP_ARTIFACT = getAppArtifact()
export const appNameBase =
    STAGE === 'prod' ? PRODUCT_NAME : `${PRODUCT_NAME} - ${STAGE.replace(/^\w/, (c) => c.toUpperCase())}`
export const KEYCHAIN_SERVICE_NAME_PACKAGED = getKeychainServiceName(true)
export const KEYCHAIN_SERVICE_NAME_NOT_PACKAGED = getKeychainServiceName(true)

export function getAppArtifact() {
    return `firefly-${NETWORK}-desktop-\${version}.\${ext}`
}

/**
 * If stage = 'prod' & packaged -> 'Firefly'
 * If stage = 'alpha' & packaged -> 'Firefly Alpha'
 * If stage = 'alpha' & dev -> 'Firefly — Dev'
 */
export function getKeychainServiceName(isPackaged) {
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
export function getAppName(isPackaged = true) {
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
export function getAppProtocol() {
    return STAGE === 'prod' ? 'firefly' : `firefly-${STAGE.toLowerCase()}`
}

/**
 * If stage = 'prod' -> 'org.iota.firefly-shimmer'
 * If stage = 'alpha' -> 'org.iota.firefly-shimmer.alpha'
 */
export function getAppId() {
    const defaultAppId = 'org.iota.firefly-shimmer'
    if (STAGE === 'prod') {
        return defaultAppId
    }
    return `${defaultAppId}.${STAGE}`
}

export function getChannelName() {
    switch (STAGE) {
        case 'alpha':
            return 'shimmer-alpha'
        case 'beta':
            return 'shimmer-beta'
        default:
            return 'shimmer'
    }
}
