import { getBalance } from './getBalance'

export async function getVotingPower(walletId: string): Promise<string> {
    const balance = await getBalance(walletId)
    return balance.baseCoin.votingPower.toString()
}
