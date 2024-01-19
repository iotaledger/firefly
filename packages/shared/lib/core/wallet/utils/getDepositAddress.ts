import { get } from 'svelte/store'
import { selectedWallet } from '../stores'
import { AccountOutput } from '@iota/sdk'

// TODO(2.0): Update the implementation to handle multiple accounts and use the selected account's address.
export async function getDepositAddress(): Promise<string> {
    const wallet = get(selectedWallet)
    const accounts = await wallet?.accounts()
    if (accounts?.length) {
        return (accounts[0]?.output as AccountOutput).accountId ?? ''
    } else {
        return ''
    }
}
