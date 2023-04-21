/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'

import Web3 from 'web3'

import { activeProfile } from '@core/profile'

import { IChain, INetwork, INetworkStatus } from '../interfaces'
import { networkStatus } from '../stores'
import { ChainMetadata, NetworkMetadata } from '../types'

export class StardustNetwork implements INetwork {
    getMetadata(): NetworkMetadata {
        return get(activeProfile)?.network
    }

    getStatus(): INetworkStatus {
        return get(networkStatus) ?? {}
    }

    getChain(chainId: number): IChain {
        return undefined
    }

    getChains(): IChain[] {
        return []
    }

    async addChain(payload: ChainMetadata): Promise<IChain> {
        console.log('ADDING CHAIN: ', payload)

        try {
            const jsonRpcEndpoint = 'https://json-rpc.evm.testnet.shimmer.network'
            const aliasAddress = 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7'
            const iscpEndpoint = `https://json-rpc.evm.testnet.shimmer.network/v1/chains/${aliasAddress}/evm`

            const web3 = new Web3(iscpEndpoint)

            const latestBlockNumber = await web3.eth.getBlockNumber()
            const block = await web3.eth.getBlock(latestBlockNumber)
            console.log('LATEST BLOCK: ', block)
        } catch (err) {
            console.error(err)
        }

        return undefined
    }

    editChain(chainId: number, payload: Partial<ChainMetadata>): Promise<void> {
        return Promise.resolve()
    }

    removeChain(chainId: number): void {}
}
