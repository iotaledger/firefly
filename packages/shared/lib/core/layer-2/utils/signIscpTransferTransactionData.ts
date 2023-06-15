import { ETH_COIN_TYPE, getNetwork } from '@core/network'
import { IAsset } from '@core/wallet'
import { Ledger } from '@core/ledger'
import { buildBip32Path, getSelectedAccount } from '@core/account'

import { getCommonTransactionData, getIscpTransferMethod } from '.'

export async function signIscpTransferTransactionData(
    recipientAddress: string,
    asset: IAsset,
    amount: string
): Promise<void> {
    try {
        const chain = getNetwork()?.getChain(asset.chainId)
        const provider = chain?.getProvider()
        const evmAddress = getSelectedAccount()?.evmAddresses?.[ETH_COIN_TYPE]

        if (chain && evmAddress && provider) {
            const data = getIscpTransferMethod(recipientAddress, asset, amount)?.encodeABI() ?? ''

            const transaction = await getCommonTransactionData(provider, evmAddress, data)
            // Sets smart contract call data for transferAllowanceTos
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
