import { get } from 'svelte/store'
import { selectedWallet } from '../stores'
import { AccountOutput } from '@iota/sdk'

// TODO(2.0): Update the implementation to handle multiple accounts and use the selected account's address.
export async function getDepositAddress(): Promise<string> {
    const wallet = get(selectedWallet)
    const accounts = await wallet?.accounts()
    if (accounts?.length) {
        // TODO: when we have selectedAccount in the store,  we need to find the account with the blockIssuer feature
        const depositAddress = (accounts[0]?.output as AccountOutput).accountId ?? ''
        return depositAddress
    } else {
        return ''
    }
}
