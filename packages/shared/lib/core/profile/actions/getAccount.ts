import { get } from 'svelte/store'
import { IAccount, IPersistedAccountData } from '@core/account'
import { api } from '../../api/api'
import { IPersistedProfile } from '../interfaces'
import {activeProfile } from '../stores'

// TODO(2.0): Fix all usages of this method, before numeric index, now string
export async function getAccount(id: string): Promise<IAccount> {
    const profile: IPersistedProfile = get(activeProfile)
    const persistedWallet: IPersistedAccountData = profile?.accountPersistedData[id]
    const wallet = await api.getAccount(id, persistedWallet.walletOptions)
    return wallet
}
