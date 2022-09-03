import { IAccountState } from '@core/account'
import { activeAccounts } from '@core/profile'
import { get, writable } from 'svelte/store'

// TODO: move all this out of the file

export const isTransferring = writable<boolean>(false)
export const isSyncing = writable<boolean>(false)

/**
 * Find an address in one of our accounts
 * @param address The address to find
 * @returns The wallet account matching the address or undefined if not found
 */
export const findAccountWithAddress = (address: string): IAccountState | undefined => {
    if (!address) {
        return
    }
    const accounts = get(activeAccounts)
    return accounts.find((account) => account.depositAddress === address)
}
