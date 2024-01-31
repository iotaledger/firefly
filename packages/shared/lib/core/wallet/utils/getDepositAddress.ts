import { AccountAddress, AccountOutput } from '@iota/sdk/out/types'
import { IWallet } from '../../profile/interfaces'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'
import { get } from 'svelte/store'
import { selectedWalletMainAccountId, updateSelectedWalletMainAccountId } from '../stores'
import { getBlockIssuerAccounts } from './outputs'

export async function getDepositAddress(wallet: IWallet): Promise<string> {
    const accountOutputsWithBlockIssuerFeature = await getBlockIssuerAccounts(wallet)
    const _selectedWalletMainAccountId = get(selectedWalletMainAccountId)
    if (_selectedWalletMainAccountId) {
        const accountAddress = getBech32AddressFromAddressTypes(new AccountAddress(_selectedWalletMainAccountId))
        return accountAddress
    } else if (accountOutputsWithBlockIssuerFeature?.length > 0) {
        const accountId = (accountOutputsWithBlockIssuerFeature[0]?.output as AccountOutput).accountId
        const accountAddress = getBech32AddressFromAddressTypes(new AccountAddress(accountId))
        updateSelectedWalletMainAccountId(accountId)
        return accountAddress
    } else {
        return ''
    }
}
