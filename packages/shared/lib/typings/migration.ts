import type { Bridge, CommunicationIds } from './bridge'

export interface Input {
    address: string;
    balance: number;
    spent: boolean;
    index: number;
    securityLevel: number;
    spentBundleHashes: string[]
}

export interface MigrationData {
    lastCheckedAddressIndex: number;
    balance: number;
    inputs: Input[]
}

export interface MigrationBundle {
    bundleHash: string;
    crackability: number;
}

export interface SendMigrationBundleResponse {
    address: string;
    value: number;
    tailTransactionHash: string;
}

export enum RiskLevel {
    VERYHIGH = 10 ** -13,
    HIGH = 10 ** -15,
    MEDIUM = 10 ** -17,
    LOW = 10 ** -19,
    VERYLOW = 0
}

/**
 * Gets data related to seed
 * 
 * @method getMigrationData
 * 
 * @param {Bridge} bridge 
 * @param {CommunicationIds} __ids 
 * @param {string} seed 
 * @param {string[]} nodes 
 * @param {number} [securityLevel] 
 * @param {number} [initialAddressIndex]
 * @param {string} [permanode]
 *  
 * @returns {Promise}
 */
export function getMigrationData(
    bridge: Bridge,
    __ids: CommunicationIds,
    seed: string,
    nodes: string[],
    securityLevel?: number,
    initialAddressIndex?: number,
    permanode?: string,
) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetMigrationData',
        payload: {
            seed,
            nodes,
            permanode,
            securityLevel,
            initialAddressIndex
        },
    })
}

/**
 * Creates migration bundle
 * 
 * @method createMigrationBundle
 * 
 * @param {Bridge} bridge 
 * @param {CommunicationIds} __ids 
 * @param {string} seed 
 * @param {number[]} inputAddressIndexes
 * @param {boolean} mine
 * @param {number} timeoutSeconds
 * @param {number} offset
 * @param {string} logFileName
 * 
 * @returns {Promise}
 */
export function createMigrationBundle(
    bridge: Bridge,
    __ids: CommunicationIds,
    seed: string,
    inputAddressIndexes: number[],
    mine: boolean,
    timeoutSeconds: number,
    offset: number,
    logFileName: string
) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'CreateMigrationBundle',
        payload: {
            seed,
            inputAddressIndexes,
            mine,
            timeoutSeconds,
            offset,
            logFileName
        },
    })
}

/**
 * Creates migration bundle
 * 
 * @method createMigrationBundle
 * 
 * @param {Bridge} bridge 
 * @param {CommunicationIds} __ids 
 * @param {string[]} node 
 * @param {string} bundleHash
 * @param {number} mwm 
 * 
 * @returns {Promise}
 */
export function sendMigrationBundle(
    bridge: Bridge,
    __ids: CommunicationIds,
    nodes: string[],
    bundleHash: string,
    mwm: number
) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SendMigrationBundle',
        payload: {
            nodes,
            bundleHash,
            mwm
        },
    })
}

/**
 * Gets migration address
 * 
 * @method getMigrationAddress
 * 
 * @param {Bridge} bridge 
 * @param {CommunicationIds} __ids 
 * 
 * @returns {Promise}
 */
 export function getMigrationAddress(
    bridge: Bridge,
    __ids: CommunicationIds,
) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetMigrationAddress'
    })
}

/**
 * Gets migration address
 * 
 * @method getMigrationAddress
 * 
 * @param {Bridge} bridge 
 * @param {CommunicationIds} __ids 
 * @param {string[]} bundle
 * @param {string[]} spentBundleHashes
 * @param {number} timeout
 * @param {number} offset
 * 
 * @returns {Promise}
 */
 export function mineBundle(
    bridge: Bridge,
    __ids: CommunicationIds,
    bundle: string[],
    spentBundleHashes: string[],
    securityLevel: number,
    timeout: number,
    offset: number
) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'MineBundle',
        payload: {
            bundle,
            spentBundleHashes,
            securityLevel,
            timeout,
            offset
        }
    })
}