import { OutputData } from '@iota/sdk/out/types'
import { IBalance, getBicBalance } from '..'
import { getBalance } from './getBalance'

export async function getTotalWalletBalance(walletId: string, accountOutputs: OutputData[]): Promise<IBalance> {
    const balances = getBalance(walletId)
    const blockIssuanceCredits = await getBicBalance(walletId, accountOutputs)
    const totalWalletBic = Object.values(blockIssuanceCredits).reduce((acc, bic) => acc + Number(bic), 0)
    return {
        ...balances,
        ...{ totalWalletBic, blockIssuanceCredits },
    }
}
