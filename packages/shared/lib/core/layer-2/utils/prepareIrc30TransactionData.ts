import { get } from 'svelte/store'
import Web3 from 'web3'

import { network } from '@core/network'
import { TxData } from '@ethereumjs/tx'

import { ContractType } from '@core/layer-2/enums'
import { evmAddressToAgentID, getAgentBalanceParameters, getSmartContractHexName } from '@core/layer-2/utils'
import { IAsset } from '@core/wallet'
import { Ledger } from '@core/ledger'
import { buildBip32Path, selectedAccount } from '@core/account'
import { ISC_MAGIC_CONTRACT_ADDRESS } from '../constants'

export async function prepareIrc30EvmTransactionData(
    recipientAddress: string,
    asset: IAsset,
    amount: number
): Promise<void> {
    try {
        const chain = get(network)?.getChain(asset.chainId)
        const provider = chain?.getProvider()
        const evmAddress = get(selectedAccount)?.evmAddresses?.[60]

        if (chain && evmAddress && provider) {
            const accountsCoreContract = getSmartContractHexName('accounts')
            const transferAllowanceTo = getSmartContractHexName('transferAllowanceTo')
            const agentId = evmAddressToAgentID(recipientAddress)
            const parameters = getAgentBalanceParameters(agentId)

            const allowance = {
                baseTokens: amount,
                nativeTokens: [],
                nfts: [],
            }

            // TODO: Asset Support
            // if (true) {

            // } else {
            //     console.log('Native TOken')
            //     allowance = {
            //         baseTokens: 0,
            //         nativeTokens: [{
            //             ID: [asset.id],
            //             amount
            //         }],
            //         nfts: []
            //     }
            // }
            // const parameters = [{data: binaryAddress}, allowance]

            const contract = chain.getContract(ContractType.IscMagic, ISC_MAGIC_CONTRACT_ADDRESS)
            const data = await contract.methods
                .call(accountsCoreContract, transferAllowanceTo, parameters, allowance)
                .encodeABI()

            const transaction = await getCommonTransactionField(provider, evmAddress, data)
            transaction.data = data

            const bip32 = buildBip32Path(60, 0)
            Ledger.signEvmTransaction(transaction, bip32)
        } else {
            throw new Error('Unable to find web3 provider.')
        }
    } catch (err) {
        console.error(err)
    }
}

async function getCommonTransactionField(provider: Web3, originAddress: string, data: string): Promise<TxData> {
    const nonce = provider.utils.toHex(await provider.eth.getTransactionCount(originAddress))

    const _gasPrice = await provider.eth.getGasPrice()
    const gasPrice = '0x' + _gasPrice

    const estimatedGas = await provider.eth.estimateGas({ from: originAddress, to: ISC_MAGIC_CONTRACT_ADDRESS, data })
    const gasLimit = provider.utils.toHex(2 * estimatedGas) // Double to ensure we have enough gas

    const to = ISC_MAGIC_CONTRACT_ADDRESS
    const value = provider.utils.toHex(0)

    return { nonce, gasPrice, gasLimit, to, value }
}
