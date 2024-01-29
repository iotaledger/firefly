import { IWallet } from '@core/profile/interfaces'
import { hasBlockIssuerFeature } from './hasBlockIssuerFeature'
import { AccountOutput, OutputData } from '@iota/sdk/out/types'

export async function getBlockIssuerAccounts(wallet: IWallet | undefined): Promise<OutputData[]> {
    const accounts = await wallet?.accounts()
    return accounts?.filter((account) => hasBlockIssuerFeature(account.output as AccountOutput)) ?? []
}
