import { get } from 'svelte/store'

import Web3 from 'web3'

import { ContractType } from '@core/layer-2/enums'
import { getAbiForContractType } from '@core/layer-2/utils'
import { Contract } from '@core/layer-2/types'

import { NetworkHealth } from '../enums'
import { IBlock, IChain, IChainStatus, IIscpChainConfiguration, IIscpChainMetadata } from '../interfaces'
import { chainStatuses } from '../stores'
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

    getStatus(): IChainStatus {
        return get(chainStatuses)?.[this._configuration.chainId] ?? { health: NetworkHealth.Disconnected }
    }

    getContract(type: ContractType, address: string): Contract {
        const abi = getAbiForContractType(type)
        return new this._provider.eth.Contract(abi, address)
    }

    getMetadata(): Promise<ChainMetadata> {
        if (this._metadata) {
            return Promise.resolve(this._metadata)
        } else {
            this._metadata = <IIscpChainMetadata>{} // await this.fetchChainMetadata()
            return Promise.resolve(this._metadata)
        }
    }

    getProvider(): Web3Provider {
        return this._provider
    }

    /**
     * CAUTION: The API endpoint used by this method is not available
     * with the public ShimmerEVM node URL (b/c it's actually just
     * the EVM JSON-RPC endpoint rather than the underlying WASP
     * node URL). See here for more: https://github.com/iotaledger/wasp/issues/2385
     */
    private async fetchChainMetadata(): Promise<IIscpChainMetadata> {
        const { aliasAddress, iscpEndpoint } = this._configuration
        const chainMetadataUrl = `${iscpEndpoint}/v1/chains/${aliasAddress}`
        const response = await fetch(chainMetadataUrl)
        return (await response.json()) as IIscpChainMetadata
    }

    async getLatestBlock(): Promise<IBlock> {
        const number = await this._provider.eth.getBlockNumber()
        return this._provider.eth.getBlock(number)
    }
}
