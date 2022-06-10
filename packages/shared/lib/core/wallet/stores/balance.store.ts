import { Balance } from '@lib/typings/account'
import { derived, writable, Readable, get } from 'svelte/store'
import { IAccountState, selectedAccount } from '@core/account'
import { Balances } from '../interfaces'
import { activeAccounts } from '@core/profile'
import { AccountBalance } from '@iota/wallet'

export const balances = writable<Balances[]>([])

export const balanceOfSelectedAccount: Readable<AccountBalance> = derived(
    [selectedAccount, balances],
    ([$selectedAccount, $balances]) => $balances[$selectedAccount.id]
)

export async function setBalanceForAccount(account: IAccountState): Promise<void> {
    const balance = await account.getBalance()
    balances.update((state) => {
        state[account.id] = balance
        return state
    })
}

export async function setAllBalances(): Promise<void> {
    for (const account of get(activeAccounts)) {
        await setBalanceForAccount(account)
    }
}
