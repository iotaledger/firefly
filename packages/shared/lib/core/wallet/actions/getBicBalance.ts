import { IWallet } from '../../profile'
import { getClient } from './getClient'
import { AccountOutput, OutputData } from '@iota/sdk/out/types'

export async function getBicBalance(wallet: IWallet, accountsOutputs: OutputData[]): Promise<Record<string, number>> {
    const client = await getClient(wallet.id)
    const result: Record<string, number> = {}
    if (accountsOutputs?.length && client) {
        for (const { output } of accountsOutputs) {
            const { accountId } = output as AccountOutput
            const bic = await client.getAccountCongestion(accountId)
            result[accountId] = bic ? Number(bic.blockIssuanceCredits) : 0
        }
    }
    return result
}
