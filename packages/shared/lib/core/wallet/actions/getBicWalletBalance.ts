import { getWallet } from '../../profile'
import { getClient } from './getClient'
import { AccountOutput } from '@iota/sdk'

export async function getBicWalletBalance(walletId: string): Promise<{ [accountId: string]: number }> {
    const accountOutputs = await (await getWallet(walletId))?.accounts()
    const client = await getClient()
    const result: { [accountId: string]: number } = {}
    if (accountOutputs && client) {
        await Promise.all(
            accountOutputs.map(async (account) => {
                const bic = await client.getAccountCongestion((account.output as AccountOutput).accountId)
                result[(account.output as AccountOutput).accountId] = bic ? Number(bic.blockIssuanceCredits) : 0
            })
        )
    }
    return result
}
