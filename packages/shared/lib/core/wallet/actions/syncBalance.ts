import { getBalance } from './getBalance'
import { get } from 'svelte/store'
import { selectedWalletId } from '../stores/selected-wallet-id.store'
import { updateSelectedWallet } from '../stores/selected-wallet.store'
import { updateActiveWallet } from '@core/profile/stores'
import { getBicWalletBalance } from './getBicWalletBalance'
import { IBalance } from '../interfaces'

export async function syncBalance(walletId: string, syncCongestion: boolean): Promise<void> {
    const balances = await getBalance(walletId)
    const blockIssuanceCredits = syncCongestion ? await getBicWalletBalance(walletId) : {}
    const totalWalletBic =
        syncCongestion && blockIssuanceCredits.length > 0
            ? Object.values(blockIssuanceCredits).reduce((acc, bic) => acc + Number(bic), 0)
            : 0

    const totalBalance: IBalance = {
        ...balances,
        ...(syncCongestion && !!blockIssuanceCredits && { blockIssuanceCredits }),
        ...(syncCongestion && !!totalWalletBic && { totalWalletBic }),
    }
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet({ balances: totalBalance })
    } else {
        updateActiveWallet(walletId, { balances: totalBalance })
    }
    return
}
