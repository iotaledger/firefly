import type { Bridge, CommunicationIds } from './bridge'

export interface MigrationData {
    balance: number;
    inputs: {
        address: string;
        balance: number;
        spent: boolean;
        spentBundleHashes: string[]
    }
}

/**
 * Gets data related to seed
 * 
 * @method getMigrationData
 * 
 * @param {Bridge} bridge 
 * @param {CommunicationIds} __ids 
 * @param {string} seed 
 * @param {string} node 
 * @param {number} [securityLevel] 
 * @param {number} [initialAddressIndex]
 *  
 * @returns {Promise}
 */
export function getMigrationData(
    bridge: Bridge,
    __ids: CommunicationIds,
    seed: string,
    node: string,
    securityLevel?: number,
    initialAddressIndex?: number
) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetMigrationData',
        payload: {
            seed,
            node,
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
 * @param {string} address 
 * 
 * @returns {Promise}
 */
export function createMigrationBundle(
    bridge: Bridge,
    __ids: CommunicationIds,
    seed: string,
    address: string
) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'CreateMigrationBundle',
        payload: {
            seed,
            address,
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
 * @param {string} node 
 * @param {string} bundleHash
 * @param {number} mwm 
 * 
 * @returns {Promise}
 */
export function sendMigrationBundle(
    bridge: Bridge,
    __ids: CommunicationIds,
    node: string,
    bundleHash: string,
    mwm: number
) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SendMigrationBundle',
        payload: {
            node,
            bundleHash,
            mwm
        },
    })
}
