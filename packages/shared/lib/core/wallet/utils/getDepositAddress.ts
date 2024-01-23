import { AccountAddress, AccountOutput } from '@iota/sdk/out/types'
import { IWallet } from '../../profile/interfaces'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'
import { updateMainAccountId } from '../stores'

// TODO(2.0): Update the implementation to handle multiple accounts and use the selected account's address.
export async function getDepositAddress(wallet: IWallet): Promise<string> {
    const accounts = await wallet?.accounts()
    if (accounts?.length) {
        const accountId = (accounts[0]?.output as AccountOutput).accountId
        updateMainAccountId(accountId)
        const accountAddress = getBech32AddressFromAddressTypes(new AccountAddress(accountId))
        return accountAddress ?? ''
    } else {
        return ''
    }
}
