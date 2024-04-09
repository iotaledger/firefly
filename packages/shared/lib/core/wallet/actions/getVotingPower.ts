import { getBalance } from './getBalance'

export function getVotingPower(walletId: string): string {
    const balance = getBalance(walletId)
    return balance.baseCoin.votingPower
}
