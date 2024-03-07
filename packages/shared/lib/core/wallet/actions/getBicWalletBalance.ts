import { getWalletById } from '../../profile'
import { getClient } from './getClient'
import { AccountOutput } from '@iota/sdk'

export async function getBicWalletBalance(walletId: string): Promise<Record<string, number>> {
    const wallet = getWalletById(walletId)
    const accountOutputs = await wallet.accounts()
    const client = await getClient()
    const result: Record<string, number> = {}
    if (accountOutputs && client) {
        for (const { output } of accountOutputs) {
            const { accountId } = output as AccountOutput
            const bic = await client.getAccountCongestion(accountId)
            result[accountId] = bic ? Number(bic.blockIssuanceCredits) : 0
        }
    }
    return result
}
