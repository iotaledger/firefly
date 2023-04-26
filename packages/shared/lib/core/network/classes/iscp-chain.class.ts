import Web3 from 'web3'

import { IBlock, IChain, IChainStatus, IIscpChainMetadata } from '../interfaces'
import { ChainMetadata } from '../types'

export class IscpChain implements IChain {
    private readonly _provider: Web3

    constructor(payload: IIscpChainMetadata) {
        try {
            // we can already assume that the data passed in has already been validated
            const { name, aliasAddress, iscpEndpoint } = payload
            console.log(`Adding '${name}' chain...`)
            const evmJsonRpcPath = this.buildWaspEvmJsonRpcPath(aliasAddress)
            this._provider = new Web3(`${iscpEndpoint}/${evmJsonRpcPath}`)
        } catch (err) {
            console.error(err)
        }
    }

    private buildWaspEvmJsonRpcPath(aliasAddress: string): string {
        return `v1/chains/${aliasAddress}/evm`
    }

    async getLatestBlock(): Promise<IBlock> {
        const number = await this._provider.eth.getBlockNumber()

        return { number }
    }

    getMetadata(): ChainMetadata {
        return undefined
    }

    getStatus(): IChainStatus {
        return undefined
    }
}
