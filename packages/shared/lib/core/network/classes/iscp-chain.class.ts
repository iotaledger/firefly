import Web3 from 'web3'

import { IBlock, IChain, IChainStatus, IIscpChainMetadata } from '../interfaces'
import { ChainMetadata, Web3Provider } from '../types'

export class IscpChain implements IChain {
    private readonly _provider: Web3Provider
    private readonly _metadata: IIscpChainMetadata

    constructor(payload: IIscpChainMetadata) {
        try {
            /**
             * NOTE: We can assume that the data inside this payload has already
             * been validated.
             */
            const { aliasAddress, iscpEndpoint } = payload
            const evmJsonRpcPath = this.buildEvmJsonRpcPath(aliasAddress)

            this._provider = new Web3(`${iscpEndpoint}/${evmJsonRpcPath}`)
            this._metadata = payload
        } catch (err) {
            console.error(err)
        }
    }

    private buildEvmJsonRpcPath(aliasAddress: string): string {
        /**
         * NOTE: This is according to the WASP node API specification,
         * which can be found here: https://editor.swagger.io/?url=https://raw.githubusercontent.com/iotaledger/wasp/develop/clients/apiclient/api/openapi.yaml.
         */
        return `v1/chains/${aliasAddress}/evm`
    }

    async getLatestBlock(): Promise<IBlock> {
        const number = await this._provider.eth.getBlockNumber()
        return this._provider.eth.getBlock(number)
    }

    getMetadata(): ChainMetadata {
        return this._metadata
    }

    getStatus(): IChainStatus {
        return undefined
    }
}
