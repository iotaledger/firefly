/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'

import { INetwork, INetworkStatus } from '../interfaces'
import { networkStatus } from '../stores'
import { NetworkMetadata } from '../types'

export class StardustNetwork implements INetwork {
    private readonly _metadata: NetworkMetadata

    constructor(metadata: NetworkMetadata) {
        this._metadata = metadata
    }

    getMetadata(): NetworkMetadata {
        return this._metadata
    }

    getStatus(): INetworkStatus {
        return get(networkStatus) ?? {}
    }
}
