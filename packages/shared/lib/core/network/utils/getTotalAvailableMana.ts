import { IWalletState } from '../../wallet'
import { getImplicitAccountsMana } from './getImplicitAccountsMana'
import { getManaBalance } from './getManaBalance'

export function getTotalAvailableMana(_selectedWallet: IWalletState, outputId: string): number {
    return (
        getManaBalance(_selectedWallet?.balances?.mana?.available) +
        (_selectedWallet?.balances.totalWalletBic ?? 0) -
        getImplicitAccountsMana(_selectedWallet?.implicitAccountOutputs, outputId ? [outputId] : [])
    )
}
