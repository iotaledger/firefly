import { get } from 'svelte/store'

import { ChainId, network } from '@core/network'

import { ERC20_ABI } from '../abis'
import { GAS_MULTIPLIER } from '../constants'
import { IErc20EvmTransactionOptions, IEvmTransactionData } from '../interfaces'

export async function prepareErc20EvmTransactionData(
    options: IErc20EvmTransactionOptions
): Promise<IEvmTransactionData> {
    const { tokenAddress, originAddress, recipientAddress, transferAmount } = options

    const provider = get(network)?.getChain(ChainId.ShimmerEVM)?.getProvider()
    if (provider) {
        const erc20Contract = new provider.eth.Contract(ERC20_ABI, tokenAddress)

        const data = erc20Contract.methods.transfer(recipientAddress, provider.utils.toHex(transferAmount)).encodeABI()
        const nonce = provider.utils.toHex(await provider.eth.getTransactionCount(originAddress))

        const _gasPrice = await provider.eth.getGasPrice()
        const gasPrice = '0x' + _gasPrice

        const estimatedGas = await provider.eth.estimateGas({ from: originAddress, to: recipientAddress, data })
        const gasLimit = provider.utils.toHex(estimatedGas * GAS_MULTIPLIER)

        const to = tokenAddress
        const value = provider.utils.toHex(transferAmount)

        return { nonce, gasPrice, gasLimit, to, value, data }
    } else {
        throw new Error('Unable to find web3 provider.')
    }
}
