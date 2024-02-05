import { AccountAddress, AccountOutput } from '@iota/sdk/out/types'
import { IWallet } from '../../profile/interfaces'
import { getBech32AddressFromAddressTypes } from './getBech32AddressFromAddressTypes'
import { getBlockIssuerAccounts } from './outputs'

export async function getDepositAddress(wallet: IWallet, mainAccountId: string | undefined): Promise<string> {
    const accountOutputsWithBlockIssuerFeature = await getBlockIssuerAccounts(wallet)
    if (
        accountOutputsWithBlockIssuerFeature?.length > 0 &&
        mainAccountId &&
        accountOutputsWithBlockIssuerFeature?.some(
            (account) => (account?.output as AccountOutput)?.accountId === mainAccountId
        )
    ) {
        const accountAddress = getBech32AddressFromAddressTypes(new AccountAddress(mainAccountId))
        return accountAddress
    } else {
        return ''
    }
}
