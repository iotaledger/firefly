import { OutputData } from '@iota/sdk/out/types'
import { IBalance, getBicBalance } from '..'
import { IWallet } from '@core/profile'

export async function getTotalWalletBalance(wallet: IWallet, accountOutputs: OutputData[]): Promise<IBalance> {
    const balance = await wallet.getBalance()
    const blockIssuanceCredits = await getBicBalance(wallet, accountOutputs)
    const totalWalletBic = Object.values(blockIssuanceCredits).reduce((acc, bic) => acc + Number(bic), 0)
    return {
        ...balance,
        ...{ totalWalletBic, blockIssuanceCredits },
    }
}
