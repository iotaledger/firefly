import { getBalance } from '@core/account/api'

export async function getVotingPower(index?: number): Promise<string> {
    const balance = await getBalance(index)
    return balance.baseCoin.votingPower
}
