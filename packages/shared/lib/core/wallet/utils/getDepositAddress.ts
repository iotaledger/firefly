import { AccountAddress, AccountOutput } from '@iota/sdk/out/types'
import { IWallet } from '../../profile/interfaces'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'
import { updateSelectedWalletMainAccountId } from '../stores'
import { getBlockIssuerAccounts } from './outputs'

export async function getDepositAddress(wallet: IWallet): Promise<string> {
    const accountOutputsWithBlockIssuerFeature = await getBlockIssuerAccounts(wallet)
    if (accountOutputsWithBlockIssuerFeature?.length > 0) {
        const accountId = (accountOutputsWithBlockIssuerFeature[0]?.output as AccountOutput).accountId
        const accountAddress = getBech32AddressFromAddressTypes(new AccountAddress(accountId))
        updateSelectedWalletMainAccountId(accountId)
        return accountAddress
    } else {
        return ''
    }
}
