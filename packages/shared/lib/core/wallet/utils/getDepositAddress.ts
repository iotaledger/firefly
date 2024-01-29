import { AccountAddress, AccountOutput } from '@iota/sdk/out/types'
import { IWallet } from '../../profile/interfaces'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'
import { get } from 'svelte/store'
import { selectedWalletMainAccountId } from '../stores'

export async function getDepositAddress(wallet: IWallet): Promise<string> {
    const accounts = await wallet?.accounts()
    if (accounts?.length && get(selectedWalletMainAccountId)) {
        const accountId = (accounts[0]?.output as AccountOutput).accountId
        const accountAddress = getBech32AddressFromAddressTypes(new AccountAddress(accountId))
        return accountAddress ?? ''
    } else {
        return ''
    }
}
