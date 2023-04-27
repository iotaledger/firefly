import Web3 from 'web3'

import { IBlock, IChain, IChainStatus, IIscpChainConfiguration, IIscpChainMetadata } from '../interfaces'
import { ChainConfiguration, ChainMetadata, Web3Provider } from '../types'

export class IscpChain implements IChain {
    private readonly _provider: Web3Provider
    private readonly _configuration: IIscpChainConfiguration

    private _metadata: IIscpChainMetadata

    constructor(payload: IIscpChainConfiguration) {
        try {
            /**
             * NOTE: We can assume that the data inside this payload has already
             * been validated.
             */
            const { aliasAddress, iscpEndpoint } = payload
            const evmJsonRpcPath = this.buildEvmJsonRpcPath(aliasAddress)

            this._provider = new Web3(`${iscpEndpoint}/${evmJsonRpcPath}`)
            this._configuration = payload
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

    getConfiguration(): ChainConfiguration {
        return this._configuration
    }

    getMetadata(): Promise<ChainMetadata> {
        if (this._metadata) {
            return this._metadata
        } else {
            this._metadata = <IIscpChainMetadata>{} // await this.fetchChainMetadata()
            return this._metadata
        }
    }

    /**
     * CAUTION: The API endpoint used by this function is broken...
     */
    private async fetchChainMetadata(): Promise<IIscpChainMetadata> {
        const { aliasAddress, iscpEndpoint } = this._configuration
        const chainMetadataUrl = `${iscpEndpoint}/v1/chains/${aliasAddress}`
        const response = await fetch(chainMetadataUrl)
        console.log('RESPONSE: ', response)
        const metadata = (await response.json()) as IIscpChainMetadata
        console.log('METADATA: ', metadata)
        return metadata
    }

    getStatus(): Promise<IChainStatus> {
        return undefined
    }

    async getLatestBlock(): Promise<IBlock> {
        const number = await this._provider.eth.getBlockNumber()
        return this._provider.eth.getBlock(number)
    }
}
