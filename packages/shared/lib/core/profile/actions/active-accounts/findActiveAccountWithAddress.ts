import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { activeAccounts } from '../../stores'

/**
 * Find an address in one of our accounts
 * @param address The address to find
 * @returns The wallet account matching the address or undefined if not found
 */
export function findActiveAccountWithAddress(address: string): IAccountState {
    if (!address) {
        return
    }
    const accounts = get(activeAccounts)
    return accounts.find((account) => account.depositAddress === address)
}
