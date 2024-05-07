import { IBalance, IWalletState, getBicBalance } from '..'
import { getTotalAvailableMana } from '../../network'

export async function getTotalWalletBalance(wallet: IWalletState, syncCongestion: boolean = false): Promise<IBalance> {
    const balance = await wallet.getBalance()
    const blockIssuanceCredits = await getBicBalance(wallet, syncCongestion ? wallet.accountOutputs : [])
    const totalWalletBic = Object.values(blockIssuanceCredits).reduce((acc, bic) => acc + Number(bic), 0)
    const availableManaToUse = getTotalAvailableMana(wallet)

    return {
        ...balance,
        availableManaToUse,
        ...{ totalWalletBic, blockIssuanceCredits },
    }
}
