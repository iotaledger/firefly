import { getWallet } from '../../profile'
import { getClient } from './getClient'
import { AccountOutput } from '@iota/sdk'

export async function getBicWalletBalance(walletId: string): Promise<number | null> {
    const accountOutputs = await (await getWallet(walletId))?.accounts()
    const client = await getClient()
    if (!accountOutputs || !client) return null
    const accountsCongestion = await Promise.all(
        accountOutputs.map((account) => client.getAccountCongestion((account.output as AccountOutput).accountId))
    )
    const totalBic = accountsCongestion.reduce((acc, bic) => acc + Number(bic.blockIssuanceCredits), 0)
    return totalBic
}
