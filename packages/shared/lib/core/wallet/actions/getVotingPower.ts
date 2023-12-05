import { getBalance } from "./getBalance"

// TODO(2.0) Fix all usages
export async function getVotingPower(walletId: string): Promise<string> {
    const balance = await getBalance(walletId)
    return balance.baseCoin.votingPower
}
