import { OutputData } from '@iota/sdk/out/types'
import { IBalance, getBicBalance } from '..'
import { getBalance } from './getBalance'
import { getManaBalance, getTotalAvailableMana } from '../../network'
import { getWalletById } from '../../profile'

export async function getTotalWalletBalance(walletId: string, accountOutputs: OutputData[]): Promise<IBalance> {
    const balances = await getBalance(walletId)
    const blockIssuanceCredits = await getBicBalance(walletId, accountOutputs)
    const totalWalletBic = Object.values(blockIssuanceCredits).reduce((acc, bic) => acc + Number(bic), 0)

    const _selectedWallet = getWalletById(walletId)
    let realAvailableMana = getManaBalance(balances?.mana?.available)
    if (_selectedWallet) {
        realAvailableMana = getTotalAvailableMana(_selectedWallet)
    }

    return {
        ...balances,
        realAvailableMana,
        ...{ totalWalletBic, blockIssuanceCredits },
    }
}
