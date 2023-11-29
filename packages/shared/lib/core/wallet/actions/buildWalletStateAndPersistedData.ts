import { localize } from '@core/i18n'
import { getRandomWalletColor } from '@core/wallet/utils'
import { IWallet } from '@core/profile/interfaces';
import { IWalletState } from '../interfaces/wallet-state.interface';
import { IPersistedWalletData } from '../interfaces/persisted-wallet-data.interface';
import { buildWalletState } from './buildWalletState'

export async function buildWalletStateAndPersistedData(
    wallet: IWallet,
    name?: string,
    color?: string
): Promise<[IWalletState, IPersistedWalletData]> {

    const persistedWalletData: IPersistedWalletData = {
        name: name || `${localize('general.account')}`,
        color: color || getRandomWalletColor(),
        hidden: false,
        shouldRevote: false,
        walletOptions: {}
    }
    const accountState = await buildWalletState(wallet, persistedWalletData)
    return [accountState, persistedWalletData]
}
