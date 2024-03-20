import { get } from 'svelte/store'
import { selectedWalletId, updateSelectedWallet } from '../stores/'
import { getWalletById, updateActiveWallet } from '@core/profile/stores'
import { IBalance } from '../interfaces'
import { getTotalWalletBalance } from '..'
import { OutputData } from '@iota/sdk/out/types'

export async function syncBalance(walletId: string, syncCongestion: boolean): Promise<void> {
    let accountOutputs: OutputData[] = []
    if (syncCongestion) {
        const wallet = getWalletById(walletId)
        accountOutputs = wallet?.accountOutputs ?? []
    }
    const totalBalance: IBalance = await getTotalWalletBalance(walletId, accountOutputs)
    if (get(selectedWalletId) === walletId) {
        updateSelectedWallet({ balances: totalBalance })
    } else {
        updateActiveWallet(walletId, { balances: totalBalance })
    }
    return
}
