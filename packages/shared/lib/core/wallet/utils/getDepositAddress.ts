import { AccountOutput } from '@iota/sdk'
import { IWallet } from '../../profile/interfaces'

// TODO(2.0): Update the implementation to handle multiple accounts and use the selected account's address.
export async function getDepositAddress(wallet: IWallet): Promise<string> {
    const accounts = await wallet?.accounts()
    if (accounts?.length) {
        return (accounts[0]?.output as AccountOutput).accountId ?? ''
    } else {
        return ''
    }
}
