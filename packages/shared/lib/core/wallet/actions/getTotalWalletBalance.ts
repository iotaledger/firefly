import { IBalance, IWalletState, getBicBalance } from '..'
import { getBalance } from './getBalance'
import { getTotalAvailableMana } from '../../network'

export async function getTotalWalletBalance(wallet: IWalletState, syncCongestion: boolean = false): Promise<IBalance> {
    const balances = await getBalance(wallet.id)
    const blockIssuanceCredits = await getBicBalance(wallet.id, syncCongestion ? wallet.accountOutputs : [])
    const totalWalletBic = Object.values(blockIssuanceCredits).reduce((acc, bic) => acc + Number(bic), 0)
    const availableManaToUse = getTotalAvailableMana(wallet)

    return {
        ...balances,
        availableManaToUse,
        ...{ totalWalletBic, blockIssuanceCredits },
    }
}
