import { IWalletState } from '../../wallet'
import { getImplicitAccountsMana } from './getImplicitAccountsMana'
import { getManaBalance } from './getManaBalance'

export function getTotalAvailableMana(
    _selectedWallet: IWalletState,
    includeAccountOutputId: string | undefined = undefined
): number {
    return (
        getManaBalance(_selectedWallet?.balances?.mana?.available) -
        getImplicitAccountsMana(
            _selectedWallet?.implicitAccountOutputs,
            includeAccountOutputId ? [includeAccountOutputId] : []
        )
    )
}
