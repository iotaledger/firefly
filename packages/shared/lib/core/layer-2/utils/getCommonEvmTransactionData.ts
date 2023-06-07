import Web3 from 'web3'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '@core/layer-2/constants'
import { EvmTransactionData } from '@core/layer-2'

export async function getCommonTransactionData(
    provider: Web3,
    originAddress: string,
    data: string
): Promise<EvmTransactionData> {
    const nonce = provider.utils.toHex(await provider.eth.getTransactionCount(originAddress))

    const _gasPrice = await provider.eth.getGasPrice()
    const gasPrice = '0x' + _gasPrice

    const estimatedGas = await provider.eth.estimateGas({ from: originAddress, to: ISC_MAGIC_CONTRACT_ADDRESS, data })
    const gasLimit = provider.utils.toHex(2 * estimatedGas) // Double to ensure we have enough gas

    const to = ISC_MAGIC_CONTRACT_ADDRESS
    const value = provider.utils.toHex(0)

    return { nonce, gasPrice, gasLimit, to, value }
}
